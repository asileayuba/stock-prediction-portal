import api from './api';
import { getErrorMessage } from './errorHandler';

/**
 * Stock service — all prediction/stock API calls.
 * Uses _suppressGlobalToast so Dashboard can manage its own loading → result toast.
 */
export async function fetchPrediction(ticker) {
  const { data } = await api.post(
    'predict/',
    { ticker: ticker.trim().toUpperCase() },
    { _suppressGlobalToast: true },   // Dashboard manages its own toast
  );
  return data;
}

export async function fetchHistorySnapshot(historyId) {
  const { data } = await api.get(
    `history/${historyId}/`,
    { _suppressGlobalToast: true }
  );
  return data;
}

/**
 * Fetch system config (popular tickers, featured stock, etc.)
 */
export async function fetchSystemConfig() {
  const { data } = await api.get('config/');
  return data;
}

export { getErrorMessage };
