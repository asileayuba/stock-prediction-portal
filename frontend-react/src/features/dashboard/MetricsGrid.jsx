/**
 * MetricsGrid
 * Displays model evaluation metrics with explanations.
 */
function MetricItem({ label, value, tooltip }) {
  return (
    <div className="metric-tile">
      <div className="metric-tile__label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {label}
        {tooltip && (
          <div className="tooltip-wrapper">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="tooltip-text">{tooltip}</span>
          </div>
        )}
      </div>
      <div className="metric-tile__value" style={{ fontSize: 'var(--text-xl)' }}>{value}</div>
    </div>
  );
}

export default function MetricsGrid({ model_metrics, metadata }) {
  const { mse, rmse, r2 } = model_metrics;

  return (
    <div className="metrics-section">
      <div className="metrics-section__header">
        <h2 className="metrics-section__title">Model Evaluation</h2>
        <span className="badge badge-neutral">Backtest on held-out test data</span>
      </div>

      <div className="metrics-grid">
        <MetricItem
          label="R² Score"
          value={`${(r2 * 100).toFixed(2)}%`}
          tooltip="R² measures how well the model explains price variance. 100% = perfect fit. Values above 90% are generally strong."
        />
        <MetricItem
          label="RMSE"
          value={`$${rmse.toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
          tooltip="Root Mean Squared Error — the average deviation between predicted and actual prices on the test set."
        />
        <MetricItem
          label="MSE"
          value={mse.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          tooltip="Mean Squared Error — squares large prediction errors to penalise outliers more heavily."
        />
        <MetricItem
          label="Data Source"
          value={metadata.data_source}
          tooltip="Historical market data provider."
        />
      </div>

      <p className="metrics-section__note">
        These metrics are calculated on a held-out test portion of the historical data.
        They reflect how well the model captured past price movements — not a guarantee of future accuracy.
      </p>
    </div>
  );
}
