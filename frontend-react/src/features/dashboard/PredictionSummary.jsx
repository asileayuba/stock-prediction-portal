/**
 * PredictionSummary
 * Three metric tiles: Predicted Price, Potential Change, Horizon.
 */
function fmt(n) {
  return n?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function PredictionSummary({ prediction_summary, model_metrics }) {
  const { predicted_price, change, change_percent, horizon_label } = prediction_summary;
  const isPos = change_percent >= 0;

  return (
    <div className="prediction-summary">
      <div className="metric-tile">
        <div className="metric-tile__label">Predicted Price</div>
        <div className="metric-tile__value">${fmt(predicted_price)}</div>
        <div className="metric-tile__sub">End of forecast horizon</div>
      </div>

      <div className="metric-tile">
        <div className="metric-tile__label">Potential Change</div>
        <div className={`metric-tile__value ${isPos ? 'color-positive' : 'color-negative'}`}>
          {isPos ? '+' : ''}{fmt(change)} ({isPos ? '+' : ''}{change_percent?.toFixed(2)}%)
        </div>
        <div className="metric-tile__sub">vs. current price</div>
      </div>

      <div className="metric-tile">
        <div className="metric-tile__label">Forecast Horizon</div>
        <div className="metric-tile__value" style={{ fontSize: 'var(--text-xl)' }}>{horizon_label}</div>
        <div className="metric-tile__sub">LSTM auto-regressive</div>
      </div>

      <div className="metric-tile">
        <div className="metric-tile__label">Model R² Score</div>
        <div className="metric-tile__value" style={{ fontSize: 'var(--text-xl)' }}>
          {(model_metrics.r2 * 100).toFixed(1)}%
        </div>
        <div className="metric-tile__sub">Backtest accuracy</div>
      </div>
    </div>
  );
}
