import { useState } from 'react';

/**
 * StockSearch
 * Controlled search input with loading/error state.
 * Props:
 *   onSearch(ticker: string) => void
 *   loading: boolean
 *   error: string|null
 */
export default function StockSearch({ onSearch, loading, error, popularTickers }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const ticker = value.trim().toUpperCase();
    if (!ticker) return;
    onSearch(ticker);
  };

  const handleClear = () => setValue('');

  // Fallback to defaults if config isn't loaded yet
  const suggestions = popularTickers?.length > 0 
    ? popularTickers 
    : ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'NVDA'];

  return (
    <form className="stock-search" onSubmit={handleSubmit} role="search">
      <label htmlFor="stock-ticker" className="sr-only">Stock ticker symbol</label>
      <div className="stock-search__input-wrap">
        {/* Search icon */}
        <svg className="stock-search__icon" width="18" height="18" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>

        <input
          id="stock-ticker"
          type="text"
          className="input stock-search__input"
          placeholder={`Search ticker — e.g. ${suggestions.slice(0, 3).join(', ')}`}
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          disabled={loading}
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck="false"
          aria-describedby={error ? 'search-error' : undefined}
        />

        {/* Clear button */}
        {value && !loading && (
          <button
            type="button"
            className="stock-search__clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading || !value.trim()}
        aria-busy={loading}
      >
        {loading ? <><span className="spinner" aria-hidden="true"/>Analysing…</> : 'Analyse'}
      </button>

      {/* Inline error */}
      {error && (
        <p id="search-error" className="stock-search__error" role="alert">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </p>
      )}

      {/* Popular tickers */}
      <div className="stock-search__suggestions">
        <span className="stock-search__suggestions-label">Popular:</span>
        {suggestions.map((t) => (
          <button
            key={t}
            type="button"
            className="stock-search__chip"
            onClick={() => { setValue(t); onSearch(t); }}
            disabled={loading}
          >
            {t}
          </button>
        ))}
      </div>
    </form>
  );
}
