/**
 * Central Axios instance.
 * - Attaches JWT on every request
 * - Auto-refreshes token on 401
 * - Shows human-readable toast for every unhandled error globally
 *
 * Components that need custom error copy can catch errors themselves
 * and call getErrorMessage() from errorHandler.js — the global toast
 * will NOT double-fire because the component replaces the loading toast.
 */
import axios from 'axios';
import toast from 'react-hot-toast';
import { showErrorToast } from './errorHandler';

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_API;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 180000,
});

// ── Request: attach JWT ────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response: auto-refresh on 401, global error toasts ─────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // ── 401: attempt token refresh ─────────────────────────────────
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}token/refresh/`, {
            refresh: refreshToken,
          });
          localStorage.setItem('access_token', data.access);
          original.headers['Authorization'] = `Bearer ${data.access}`;
          return api(original);
        } catch {
          // Refresh failed — clear tokens and redirect
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          toast.error('Your session has expired. Please sign in again.', { duration: 5000 });
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } else {
        // No refresh token — not logged in
        toast.error('Please sign in to continue.', { duration: 4000 });
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    // ── Global error toast for all other errors ────────────────────
    // Mark the error so components that handle it themselves can
    // set _suppressGlobalToast = true on the config to avoid double toasts.
    if (!original._suppressGlobalToast) {
      showErrorToast(error);
    }

    return Promise.reject(error);
  },
);

export default api;
