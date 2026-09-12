"""
Prediction Service
==================
Responsible for:
  - Loading the Keras LSTM model once at application startup
  - Fetching and caching yfinance stock data
  - Running the full inference pipeline
  - Returning structured JSON results to the API view

The model and scaler are loaded lazily on the first prediction request
and then held in module-level singletons for the process lifetime.
This avoids the per-request cost of disk I/O.

Docker / scaling note:
  In a multi-process deployment (gunicorn workers), each worker will
  hold its own model copy. This is acceptable for now. A Redis-backed
  model store or ONNX inference server can be introduced later if needed.
"""

from __future__ import annotations

import os
import threading
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional

import numpy as np
import pandas as pd
import yfinance as yf
from django.conf import settings
from django.core.cache import cache
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import MinMaxScaler

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Module-level singletons — loaded once per process
# ---------------------------------------------------------------------------
_model = None
_model_lock = threading.Lock()

LOOKBACK_WINDOW = 100          # sequence length the LSTM was trained on
PREDICTION_DAYS = 30           # how many future days to forecast
MIN_HISTORY_DAYS = 250         # enough for 200 DMA + LOOKBACK_WINDOW
DATA_CACHE_SECONDS = 1800      # cache yfinance data for 30 minutes


# ---------------------------------------------------------------------------
# Model loading
# ---------------------------------------------------------------------------

def _get_model():
    """Return the globally cached Keras model, loading it if necessary."""
    global _model
    if _model is None:
        with _model_lock:
            if _model is None:
                model_path = os.path.join(settings.BASE_DIR, "stock_prediction_model.keras")
                if not os.path.exists(model_path):
                    raise FileNotFoundError(f"LSTM model not found at {model_path}")
                from keras.models import load_model as keras_load_model  # noqa: E402
                logger.info("Loading Keras LSTM model from %s", model_path)
                _model = keras_load_model(model_path)
                logger.info("LSTM model loaded successfully.")
    return _model


# ---------------------------------------------------------------------------
# Stock data helpers
# ---------------------------------------------------------------------------

def _fetch_stock_data(ticker: str) -> pd.DataFrame:
    """
    Fetch historical daily close prices from yfinance.

    We fetch enough data for:
      - 200-day moving average (200 days)
      - LOOKBACK_WINDOW for the LSTM (100 days)
      - 5 years of chart history for the frontend

    Results are cached in the Django cache backend for DATA_CACHE_SECONDS
    to avoid hammering yfinance on every request.
    """
    cache_key = f"stock_data_{ticker.upper()}"
    cached = cache.get(cache_key)
    if cached is not None:
        logger.debug("Cache hit for %s", ticker)
        return cached

    end = datetime.now(timezone.utc)
    start = end - timedelta(days=365 * 5 + 200)   # 5 years + 200 DMA buffer

    logger.info("Fetching yfinance data for %s (%s → %s)", ticker, start.date(), end.date())
    df = yf.download(ticker, start=start, end=end, progress=False, auto_adjust=True)

    if df.empty:
        raise ValueError(f"No market data found for ticker '{ticker}'.")

    df = df.reset_index()

    # Flatten multi-level columns that yfinance sometimes returns
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = [col[0] if col[1] == "" else col[0] for col in df.columns]

    # Ensure we have a 'Close' column
    if "Close" not in df.columns:
        # yfinance may use 'Adj Close' under auto_adjust=True
        if "Adj Close" in df.columns:
            df = df.rename(columns={"Adj Close": "Close"})
        else:
            raise ValueError(f"Close price column not found for ticker '{ticker}'.")

    df = df[["Date", "Close"]].dropna()
    df["Date"] = pd.to_datetime(df["Date"]).dt.strftime("%Y-%m-%d")

    cache.set(cache_key, df, DATA_CACHE_SECONDS)
    return df


def _get_company_name(ticker: str) -> str:
    """Try to get the company display name from yfinance. Fails gracefully."""
    try:
        info = yf.Ticker(ticker).info
        return info.get("shortName") or info.get("longName") or ticker.upper()
    except Exception:
        return ticker.upper()


def _get_current_price(ticker: str) -> Optional[float]:
    """Try to get the latest market price. Fails gracefully."""
    try:
        info = yf.Ticker(ticker).fast_info
        price = info.get("last_price") or info.get("lastPrice")
        if price:
            return round(float(price), 2)
    except Exception:
        pass
    return None


# ---------------------------------------------------------------------------
# Preprocessing (inference-safe)
# ---------------------------------------------------------------------------

def _build_inference_sequence(close_prices: np.ndarray) -> tuple[np.ndarray, MinMaxScaler]:
    """
    Scale the close price series and build LSTM input sequences.

    SCALER NOTE:
    The original training scaler was never persisted to disk, so we
    cannot load it.  Instead, we fit the scaler on the entire available
    historical dataset (same 'close_prices' array that will be used).
    This is mathematically equivalent to what the training script did
    (it fit the scaler on the full 10-year dataset before splitting into
    train/test).  The important fix here is that we use 'transform()'
    on the test window, NOT 'fit_transform()' again on the test subset.

    Returns
    -------
    x_seq   : shape (N, LOOKBACK_WINDOW, 1)  — input sequences
    scaler  : fitted scaler (needed for inverse_transform)
    """
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled = scaler.fit_transform(close_prices.reshape(-1, 1))

    x_seq = []
    for i in range(LOOKBACK_WINDOW, len(scaled)):
        x_seq.append(scaled[i - LOOKBACK_WINDOW : i, 0])

    x_seq = np.array(x_seq).reshape(-1, LOOKBACK_WINDOW, 1)
    return x_seq, scaler


# ---------------------------------------------------------------------------
# Future prediction
# ---------------------------------------------------------------------------

def _predict_future(model, last_window: np.ndarray, scaler: MinMaxScaler) -> np.ndarray:
    """
    Auto-regressively generate PREDICTION_DAYS future price estimates.

    Parameters
    ----------
    model       : loaded Keras LSTM model
    last_window : the last LOOKBACK_WINDOW scaled close prices (shape: (100,))
    scaler      : fitted MinMaxScaler

    Returns
    -------
    future_prices : array of shape (PREDICTION_DAYS,) in original price units
    """
    window = last_window.copy().reshape(1, LOOKBACK_WINDOW, 1)
    predictions = []

    for _ in range(PREDICTION_DAYS):
        pred_scaled = model.predict(window, verbose=0)          # (1, 1)
        predictions.append(pred_scaled[0, 0])
        # Roll window forward: drop oldest, append new prediction
        window = np.append(window[:, 1:, :], pred_scaled.reshape(1, 1, 1), axis=1)

    future_prices = scaler.inverse_transform(
        np.array(predictions).reshape(-1, 1)
    ).flatten()
    return future_prices


# ---------------------------------------------------------------------------
# Public interface
# ---------------------------------------------------------------------------

def run_prediction(ticker: str) -> dict:
    """
    Full end-to-end inference pipeline.

    Returns a structured dict ready to be serialised as JSON:
    {
      "symbol": str,
      "company_name": str,
      "current_price": float | None,
      "historical": [{"date": str, "price": float, "dma_100": float|None, "dma_200": float|None}],
      "predictions": [{"date": str, "price": float}],
      "prediction_summary": {
          "predicted_price": float,
          "change": float,
          "change_percent": float,
          "horizon_days": int,
          "horizon_label": str,
      },
      "model_metrics": {"mse": float, "rmse": float, "r2": float},
      "metadata": {"generated_at": str, "model": str, "data_source": str},
    }
    """
    ticker = ticker.strip().upper()

    # 1. Fetch data
    df = _fetch_stock_data(ticker)

    if len(df) < LOOKBACK_WINDOW + 10:
        raise ValueError(
            f"Insufficient historical data for '{ticker}' "
            f"(need at least {LOOKBACK_WINDOW + 10} trading days)."
        )

    close_prices = df["Close"].values.astype(np.float64)

    # 2. Compute moving averages
    df["dma_100"] = pd.Series(close_prices).rolling(100).mean().values
    df["dma_200"] = pd.Series(close_prices).rolling(200).mean().values

    # 3. Build LSTM input sequences (backtest portion for metrics)
    model = _get_model()
    x_seq, scaler = _build_inference_sequence(close_prices)

    # Backtest predictions (for model evaluation metrics only)
    y_pred_scaled = model.predict(x_seq, verbose=0)
    y_pred_bt = scaler.inverse_transform(y_pred_scaled).flatten()
    y_true_bt = close_prices[LOOKBACK_WINDOW:]

    mse  = float(mean_squared_error(y_true_bt, y_pred_bt))
    rmse = float(np.sqrt(mse))
    r2   = float(r2_score(y_true_bt, y_pred_bt))

    # 4. Generate future predictions
    scaled_all = scaler.transform(close_prices.reshape(-1, 1))
    last_window = scaled_all[-LOOKBACK_WINDOW:, 0]
    future_prices = _predict_future(model, last_window, scaler)

    # 5. Build future date range (skip weekends for realism)
    last_date = pd.Timestamp(df["Date"].iloc[-1])
    future_dates = []
    day = last_date
    while len(future_dates) < PREDICTION_DAYS:
        day += timedelta(days=1)
        if day.weekday() < 5:   # Mon–Fri
            future_dates.append(day.strftime("%Y-%m-%d"))

    predictions_json = [
        {"date": d, "price": round(float(p), 2)}
        for d, p in zip(future_dates, future_prices)
    ]

    # 6. Prediction summary
    current_price  = float(close_prices[-1])
    predicted_price = round(float(future_prices[-1]), 2)
    change         = round(predicted_price - current_price, 2)
    change_pct     = round((change / current_price) * 100, 2) if current_price else 0.0

    # 7. Historical JSON (limit to last 2 years for chart performance)
    chart_df = df.tail(504).copy()   # ~2 trading years
    historical_json = []
    for _, row in chart_df.iterrows():
        historical_json.append({
            "date":    row["Date"],
            "price":   round(float(row["Close"]), 2),
            "dma_100": round(float(row["dma_100"]), 2) if pd.notna(row["dma_100"]) else None,
            "dma_200": round(float(row["dma_200"]), 2) if pd.notna(row["dma_200"]) else None,
        })

    # 8. Try to get live current price (may differ from last close)
    live_price = _get_current_price(ticker) or round(current_price, 2)

    return {
        "symbol":       ticker,
        "company_name": _get_company_name(ticker),
        "current_price": live_price,
        "historical":   historical_json,
        "predictions":  predictions_json,
        "prediction_summary": {
            "predicted_price":  predicted_price,
            "change":           change,
            "change_percent":   change_pct,
            "horizon_days":     PREDICTION_DAYS,
            "horizon_label":    f"{PREDICTION_DAYS} trading days",
        },
        "model_metrics": {
            "mse":  round(mse,  4),
            "rmse": round(rmse, 4),
            "r2":   round(r2,   4),
        },
        "metadata": {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "model":        "LSTM (Keras)",
            "data_source":  "Yahoo Finance",
        },
    }
