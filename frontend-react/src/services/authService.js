import api from './api';
import { getErrorMessage } from './errorHandler';

/**
 * Auth service — all auth-related API calls.
 * Uses _suppressGlobalToast so auth forms can manage their own toast lifecycle
 * (loading → success/error) without the global interceptor firing a duplicate.
 */

export async function login(username, password) {
  const { data } = await api.post(
    'token/',
    { username, password },
    { _suppressGlobalToast: true },   // form manages its own toast
  );
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  return data;
}

export async function register(username, email, password) {
  const { data } = await api.post(
    'register/',
    { username, email, password },
    { _suppressGlobalToast: true },   // form manages its own toast
  );
  return data;
}

export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

// Re-export for convenience so components only need one import
export { getErrorMessage };
