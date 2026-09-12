import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchPrediction, fetchSystemConfig, fetchHistorySnapshot } from '../../services/stockService';
import { getErrorMessage } from '../../services/errorHandler';

import StockSearch       from './StockSearch';
import StockOverview     from './StockOverview';
import PredictionSummary from './PredictionSummary';
import PriceChart        from './PriceChart';
import MetricsGrid       from './MetricsGrid';
import DashboardSkeleton from './DashboardSkeleton';

function EmptyState({ popularTickers }) {
  const hintText = popularTickers?.length > 0 
    ? `Try: ${popularTickers.slice(0, 4).join(', ')}` 
    : 'Try: AAPL, TSLA, MSFT, GOOGL';

  return (
    <div className="dashboard-empty">
      <div className="dashboard-empty__icon" aria-hidden="true">
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      </div>
      <h2 className="dashboard-empty__title">No stock selected</h2>
      <p className="dashboard-empty__desc">
        Search for a ticker symbol above to explore historical performance
        and the model's 30-day price forecast.
      </p>
      <p className="dashboard-empty__hint">{hintText}</p>
    </div>
  );
}

function ErrorState({ error, onRetry }) {
  const isInvalidSymbol = error?.code === 'INVALID_SYMBOL';
  return (
    <div className="dashboard-error card">
      <div className="dashboard-error__icon" aria-hidden="true">
        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <h3 className="dashboard-error__title">
        {isInvalidSymbol ? 'Stock not found' : 'Prediction unavailable'}
      </h3>
      <p className="dashboard-error__desc">{error?.message}</p>
      {!isInvalidSymbol && (
        <button className="btn btn-ghost btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tickerParam = searchParams.get('ticker');
  const historyIdParam = searchParams.get('history_id');

  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState(null);
  const [lastTicker, setLastTicker]         = useState('');
  const [config, setConfig]                 = useState(null);
  
  // Persist market selection in localStorage
  const [market, setMarket]                 = useState(() => {
    return localStorage.getItem('selectedMarket') || 'US';
  });

  useEffect(() => {
    fetchSystemConfig()
      .then((data) => setConfig(data))
      .catch((err) => console.error('Failed to load system config:', err));
  }, []);

  useEffect(() => {
    const validTicker = tickerParam && tickerParam !== 'null' && tickerParam !== 'undefined';
    const validHistoryId = historyIdParam && historyIdParam !== 'null' && historyIdParam !== 'undefined';

    if (validTicker && tickerParam !== lastTicker) {
      handleSearch(tickerParam);
    } else if (validHistoryId) {
      loadHistorySnapshot(historyIdParam);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickerParam, historyIdParam]);

  const handleMarketChange = (newMarket) => {
    setMarket(newMarket);
    localStorage.setItem('selectedMarket', newMarket);
  };

  const loadHistorySnapshot = async (historyId) => {
    setLoading(true);
    setError(null);
    const toastId = toast.loading('Loading historical prediction...');
    
    try {
      const data = await fetchHistorySnapshot(historyId);
      setPredictionData(data);
      setLastTicker(data.symbol);
      toast.success(
        `Loaded snapshot for ${data.company_name || data.symbol}`,
        { id: toastId }
      );
    } catch (err) {
      const msg = getErrorMessage(err);
      setError({ code: 'PREDICTION_FAILED', message: msg });
      setPredictionData(null);
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (ticker) => {
    setLoading(true);
    setError(null);
    setLastTicker(ticker);

    const toastId = toast.loading(`Analysing ${ticker}…`);

    try {
      const data = await fetchPrediction(ticker);
      setPredictionData(data);
      toast.success(
        `Prediction ready for ${data.company_name || ticker}`,
        { id: toastId }
      );
    } catch (err) {
      const msg = getErrorMessage(err);
      setError({ code: 'PREDICTION_FAILED', message: msg });
      setPredictionData(null);
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => handleSearch(lastTicker);

  // The split date is the first date in predictions
  const splitDate = predictionData?.predictions?.[0]?.date;

  return (
    <main className="dashboard">
      <div className="container">
        <div className="dashboard__header">
          <div className="dashboard__header-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div>
              <h1 className="dashboard__title">Stock Analysis</h1>
              <p className="dashboard__subtitle">
                Enter a ticker symbol to explore historical price data and the model's 30-day forecast.
              </p>
            </div>
            
            <div className="market-selector">
              <label htmlFor="market-select" className="market-selector__label">Market</label>
              <div className="market-selector__select-wrapper">
                <select 
                  id="market-select" 
                  className="market-selector__select" 
                  value={market} 
                  onChange={(e) => handleMarketChange(e.target.value)}
                >
                  <option value="US">🇺🇸 US Market</option>
                  <option value="NG">🇳🇬 Nigerian Market</option>
                </select>
                <svg className="market-selector__icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {market === 'US' ? (
          <>
            {/* Search */}
            <StockSearch
              onSearch={handleSearch}
              loading={loading}
              error={null}
              popularTickers={config?.popular_tickers}
            />

            {/* Content area */}
            <div className="dashboard__content">
              {loading && <DashboardSkeleton />}

              {!loading && error && (
                <ErrorState error={error} onRetry={handleRetry} />
              )}

              {!loading && !error && !predictionData && <EmptyState popularTickers={config?.popular_tickers} />}

              {!loading && !error && predictionData && (
                <div className="dashboard__results">
                  <StockOverview data={predictionData} />
                  <PredictionSummary
                    prediction_summary={predictionData.prediction_summary}
                    model_metrics={predictionData.model_metrics}
                  />
                  <PriceChart
                    historical={predictionData.historical}
                    predictions={predictionData.predictions}
                    splitDate={splitDate}
                  />
                  <MetricsGrid
                    model_metrics={predictionData.model_metrics}
                    metadata={predictionData.metadata}
                  />

                  {/* Disclaimer */}
                  <div className="disclaimer">
                    <strong>Important:</strong> The predicted price is generated by an LSTM neural network
                    and represents one possible outcome based on historical patterns.
                    It is <strong>not financial advice</strong> and should not be used as the sole basis
                    for any investment decision. Predictions carry significant uncertainty.
                    Model: {predictionData.metadata.model} · Generated: {new Date(predictionData.metadata.generated_at).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="dashboard-coming-soon">
            <div className="dashboard-coming-soon__icon">
              <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3v18" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-2.5 0-4.5 4-4.5 9s2 9 4.5 9 4.5-4 4.5-9-2-9-4.5-9z" />
              </svg>
            </div>
            <h2 className="dashboard-coming-soon__title">Nigerian Market Coming Soon</h2>
            <p className="dashboard-coming-soon__desc">
              We are currently training our deep learning models on the Nigerian Stock Exchange (NGX) data. 
              Stay tuned for highly accurate price predictions for local stocks!
            </p>
            <button className="btn btn-primary" onClick={() => setMarket('US')}>
              Back to US Market
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
