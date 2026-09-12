import { useState, useMemo } from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

// ── Custom Tooltip ─────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__date">{label}</p>
      {payload.map((entry) => (
        entry.value !== null && entry.value !== undefined && (
          <div key={entry.dataKey} className="chart-tooltip__row">
            <span className="chart-tooltip__dot" style={{ background: entry.color }} />
            <span className="chart-tooltip__label">{entry.name}</span>
            <span className="chart-tooltip__value">
              ${Number(entry.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        )
      ))}
    </div>
  );
};

// ── Price axis formatter ───────────────────────────────────────────
const fmtPrice = (v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0)}`;

// ── Date axis formatter (show every Nth label) ─────────────────────
const fmtDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
};

/**
 * PriceChart
 * Interactive Recharts-based line chart.
 * Merges historical + prediction data into a single series.
 * Toggles: Historical price | 100 DMA | 200 DMA | Prediction
 */
export default function PriceChart({ historical, predictions, splitDate }) {
  const [show, setShow] = useState({
    price:      true,
    dma100:     true,
    dma200:     true,
    prediction: true,
  });

  const toggle = (key) => setShow((s) => ({ ...s, [key]: !s[key] }));

  // Merge datasets: historical rows + prediction rows (price=null for predictions)
  const chartData = useMemo(() => {
    const hist = historical.map((d) => ({
      date:       d.date,
      price:      d.price,
      dma100:     d.dma_100,
      dma200:     d.dma_200,
      prediction: null,
    }));

    const preds = predictions.map((d) => ({
      date:       d.date,
      price:      null,
      dma100:     null,
      dma200:     null,
      prediction: d.price,
    }));

    return [...hist, ...preds];
  }, [historical, predictions]);

  // Thin the data for performance — show at most 400 points
  const data = useMemo(() => {
    if (chartData.length <= 400) return chartData;
    const step = Math.ceil(chartData.length / 400);
    return chartData.filter((_, i) => i % step === 0 || i === chartData.length - 1);
  }, [chartData]);

  return (
    <div className="price-chart card">
      {/* Chart toggle controls */}
      <div className="price-chart__controls">
        <span className="price-chart__controls-label">Show:</span>
        <div className="toggle-group">
          {[
            { key: 'price',      label: 'Price',      cls: 'toggle-btn--price', tooltip: 'Historical Price: The actual historical closing prices of the stock.' },
            { key: 'dma100',     label: '100 DMA',    cls: 'toggle-btn--dma100', tooltip: '100-Day Moving Average: Shows the average closing price over the last 100 days. Helps identify medium-term momentum.' },
            { key: 'dma200',     label: '200 DMA',    cls: 'toggle-btn--dma200', tooltip: '200-Day Moving Average: Shows the average closing price over the last 200 days. A major indicator for long-term trends.' },
            { key: 'prediction', label: 'Prediction', cls: 'toggle-btn--prediction', tooltip: 'AI Forecast: The model\'s predicted price trajectory for the next 30 days based on learned patterns.' },
          ].map(({ key, label, cls, tooltip }) => {
            const btn = (
              <button
                key={key}
                className={`toggle-btn ${cls} ${show[key] ? 'active' : ''}`}
                onClick={() => toggle(key)}
                aria-pressed={show[key]}
                type="button"
                style={tooltip ? { display: 'flex', alignItems: 'center', gap: '4px' } : undefined}
              >
                {label}
                {tooltip && (
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.6 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
            );

            if (tooltip) {
              return (
                <div key={key} className="tooltip-wrapper">
                  {btn}
                  <span className="tooltip-text" style={{ bottom: '110%' }}>{tooltip}</span>
                </div>
              );
            }
            return btn;
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="price-chart__canvas" role="img" aria-label={`Price chart with historical and predicted data`}>
        <ResponsiveContainer width="100%" height={360}>
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={fmtDate}
              tick={{ fontSize: 11, fill: 'var(--color-text-2)' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis
              tickFormatter={fmtPrice}
              tick={{ fontSize: 11, fill: 'var(--color-text-2)' }}
              tickLine={false}
              axisLine={false}
              width={58}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Vertical split line between historical and predicted */}
            {splitDate && (
              <ReferenceLine
                x={splitDate}
                stroke="rgba(255,255,255,0.15)"
                strokeDasharray="5 4"
                label={{ value: 'Forecast start', fill: 'var(--color-text-2)', fontSize: 10, position: 'insideTopRight' }}
              />
            )}

            {show.price && (
              <Line
                type="monotone"
                dataKey="price"
                name="Price"
                stroke="var(--chart-price)"
                strokeWidth={1.8}
                dot={false}
                activeDot={{ r: 4, fill: 'var(--chart-price)' }}
                connectNulls={false}
              />
            )}
            {show.dma100 && (
              <Line
                type="monotone"
                dataKey="dma100"
                name="100 DMA"
                stroke="var(--chart-dma100)"
                strokeWidth={1.5}
                dot={false}
                activeDot={false}
                connectNulls
              />
            )}
            {show.dma200 && (
              <Line
                type="monotone"
                dataKey="dma200"
                name="200 DMA"
                stroke="var(--chart-dma200)"
                strokeWidth={1.5}
                dot={false}
                activeDot={false}
                connectNulls
              />
            )}
            {show.prediction && (
              <Line
                type="monotone"
                dataKey="prediction"
                name="Prediction"
                stroke="var(--chart-prediction)"
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={false}
                activeDot={{ r: 4, fill: 'var(--chart-prediction)' }}
                connectNulls={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className="price-chart__note">
        Dashed green line represents the LSTM model's 30-day price forecast. Not financial advice.
      </p>
    </div>
  );
}
