import { useState, useEffect } from 'react';

/**
 * DashboardSkeleton
 * Shown while prediction data is loading (which can take a while on cold start).
 * Features a high-tech "scanning" aesthetic.
 */

const LOADING_PHASES = [
  "Connecting to market data stream...",
  "Fetching 5-year historical pricing...",
  "Initializing LSTM Neural Network...",
  "Extracting volatility and volume features...",
  "Running deep learning inference...",
  "Finalizing 30-day price forecast..."
];

export default function DashboardSkeleton() {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    // Cycle through loading phases every 3.5 seconds
    const interval = setInterval(() => {
      setPhaseIndex((prev) => Math.min(prev + 1, LOADING_PHASES.length - 1));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-skeleton" aria-busy="true" aria-label="Loading prediction data">
      <div className="skeleton-analyzer">
        
        {/* Animated Sine/Stock Wave SVG */}
        <div className="skeleton-analyzer__wave-container">
          <svg className="skeleton-analyzer__wave" viewBox="0 0 800 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="var(--color-accent)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d="M 0 100 Q 100 20, 200 100 T 400 100 T 600 100 T 800 100"
              stroke="url(#wave-gradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* The scanning line */}
            <line x1="0" y1="0" x2="0" y2="200" className="skeleton-analyzer__scanner" stroke="var(--color-accent)" strokeWidth="2" />
          </svg>
        </div>

        {/* Dynamic Text */}
        <div className="skeleton-analyzer__content">
          <div className="skeleton-analyzer__spinner">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth="2.5">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" className="spinner-rays"/>
            </svg>
          </div>
          <h3 className="skeleton-analyzer__title">Analyzing Stock Data</h3>
          <p className="skeleton-analyzer__phase">{LOADING_PHASES[phaseIndex]}</p>
        </div>
      </div>
    </div>
  );
}
