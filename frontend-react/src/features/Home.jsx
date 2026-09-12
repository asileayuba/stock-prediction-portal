import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchSystemConfig } from '../services/stockService';

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'LSTM Neural Network',
    desc: 'Deep learning model trained on years of historical market data to identify temporal price patterns.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    title: 'Moving Averages',
    desc: '100-day and 200-day moving averages overlaid on interactive charts to contextualise price trends.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: '30-Day Forecast',
    desc: 'Auto-regressive future price projections for the next 30 trading days, generated per request.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Responsible Predictions',
    desc: 'Every prediction is presented with model quality metrics, limitations, and a clear disclaimer.',
  },
];

export default function Home() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetchSystemConfig()
      .then((data) => setConfig(data))
      .catch((err) => console.error('Failed to load system config:', err));
  }, []);

  const featured = config?.featured_stock || {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    price: 150.00,
    change_percent: '+2.31%',
  };

  return (
    <main className="home">
      {/* Hero */}
      <section className="home__hero container">
        <div className="home__hero-content">
          <div className="badge badge-accent" style={{ marginBottom: 'var(--space-5)' }}>
            Powered by LSTM Deep Learning
          </div>
          <h1 className="home__hero-title">
            Understand the market.<br />
            <span className="home__hero-accent">Explore what the data suggests.</span>
          </h1>
          <p className="home__hero-desc">
            Stock Prediction Portal uses a trained LSTM neural network to analyse
            historical price patterns and generate 30-day price forecasts across
            thousands of equities.
          </p>
          <div className="home__hero-actions">
            <Link to="/dashboard" className="btn btn-primary">
              Explore Predictions
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
            <Link to="/register" className="btn btn-ghost">
              Create Free Account
            </Link>
          </div>
        </div>

        {/* Decorative chart preview */}
        <div className="home__hero-visual" aria-hidden="true">
          <div className="home__chart-preview card">
            <div className="home__chart-header">
              <div>
                <span className="home__chart-ticker">{featured.ticker}</span>
                <span className="home__chart-name">{featured.name}</span>
              </div>
              <span className={`badge ${featured.change_percent.startsWith('+') ? 'badge-positive' : 'badge-negative'}`}>
                {featured.change_percent}
              </span>
            </div>
            <svg viewBox="0 0 300 100" className="home__chart-svg" preserveAspectRatio="none">
              {/* Historical */}
              <polyline
                points="0,80 30,72 60,78 90,60 120,55 150,48 180,42 210,38"
                fill="none" stroke="var(--chart-price)" strokeWidth="2" strokeLinecap="round"/>
              {/* Prediction (dashed) */}
              <polyline
                points="210,38 240,30 270,22 300,18"
                fill="none" stroke="var(--chart-prediction)" strokeWidth="2"
                strokeDasharray="5,4" strokeLinecap="round"/>
              {/* Gradient fill */}
              <defs>
                <linearGradient id="hfill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-price)" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="var(--chart-price)" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <polygon
                points="0,80 30,72 60,78 90,60 120,55 150,48 180,42 210,38 210,100 0,100"
                fill="url(#hfill)"/>
              {/* Split line */}
              <line x1="210" y1="0" x2="210" y2="100" stroke="var(--color-border)" strokeDasharray="3,3"/>
            </svg>
            <div className="home__chart-legend">
              <span className="home__chart-legend-item home__chart-legend-item--price">Historical</span>
              <span className="home__chart-legend-item home__chart-legend-item--pred">Predicted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="home__features container">
        <div className="home__features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="home__feature-card card card-sm">
              <div className="home__feature-icon" aria-hidden="true">{f.icon}</div>
              <h3 className="home__feature-title">{f.title}</h3>
              <p className="home__feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="container" style={{ paddingBottom: 'var(--space-16)' }}>
        <div className="disclaimer">
          <strong>Important:</strong> All predictions are generated by a machine learning model and are
          for <strong>informational and educational purposes only</strong>. They do not constitute
          financial advice. Past performance is not indicative of future results. Always consult a
          qualified financial advisor before making investment decisions.
        </div>
      </section>
    </main>
  );
}
