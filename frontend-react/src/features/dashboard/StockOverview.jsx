/**
 * StockOverview
 * Displays ticker, company name, current price, and change.
 */
export default function StockOverview({ data }) {
  const { symbol, company_name, current_price, prediction_summary, metadata } = data;
  const change    = prediction_summary.change;
  const changePct = prediction_summary.change_percent;
  const isPos = changePct >= 0;

  return (
    <div className="stock-overview card">
      <div className="stock-overview__left">
        <div className="stock-overview__ticker">{symbol}</div>
        <div className="stock-overview__name">{company_name}</div>
      </div>
      <div className="stock-overview__right">
        <div className="stock-overview__price">
          ${current_price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className={`badge ${isPos ? 'badge-positive' : 'badge-negative'}`}>
          {isPos ? '▲' : '▼'} {Math.abs(changePct).toFixed(2)}%
        </div>
        <div className="stock-overview__timestamp">
          Updated {new Date(metadata.generated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
