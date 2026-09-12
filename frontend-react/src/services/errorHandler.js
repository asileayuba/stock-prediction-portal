/**
 * errorHandler.js
 * ================
 * Single source of truth for converting any API/network error
 * into a human-readable message.
 *
 * Used by the axios interceptor (global) and can also be called
 * directly in components that need custom messaging.
 */
import toast from 'react-hot-toast';

// ── HTTP status → friendly message ────────────────────────────────
const STATUS_MESSAGES = {
  400: 'The request was invalid. Please check your input and try again.',
  401: 'You need to be signed in to do that.',
  403: 'You don\'t have permission to perform this action.',
  404: 'We couldn\'t find what you were looking for.',
  405: 'This action isn\'t supported.',
  408: 'The request timed out. Please check your connection and try again.',
  409: 'There was a conflict — this resource may already exist.',
  429: 'Too many requests. Please wait a moment before trying again.',
  500: 'Something went wrong on our end. Please try again in a few moments.',
  502: 'The server is temporarily unreachable. Please try again shortly.',
  503: 'The service is currently unavailable. Please try again later.',
  504: 'The server took too long to respond. Please try again.',
};

// ── DRF field-level error → friendly string ────────────────────────
export function parseDRFError(data) {
  if (!data || typeof data !== 'object') return null;

  // Our structured error format: { error: { code, message } }
  if (data.error?.message) return data.error.message;

  // JWT detail: { detail: "No active account..." }
  if (data.detail) return humaniseDetail(data.detail);

  // Field-level errors: { username: ['already exists'], password: ['too short'] }
  const lines = [];
  Object.entries(data).forEach(([key, val]) => {
    const text = Array.isArray(val) ? val.join(' ') : String(val);
    if (key === 'non_field_errors') {
      lines.push(humaniseDetail(text));
    } else {
      const label = key === 'username'  ? 'Username'
                  : key === 'email'     ? 'Email'
                  : key === 'password'  ? 'Password'
                  : key === 'ticker'    ? 'Stock symbol'
                  : key.charAt(0).toUpperCase() + key.slice(1);
      lines.push(`${label}: ${text}`);
    }
  });

  return lines.join('\n') || null;
}

// ── Make Django/DRF detail strings more human-friendly ─────────────
function humaniseDetail(detail) {
  if (!detail) return null;
  const s = String(detail).toLowerCase();

  if (s.includes('no active account')) {
    return 'Incorrect username or password. Please try again.';
  }
  if (s.includes('token') && s.includes('expired')) {
    return 'Your session has expired. Please sign in again.';
  }
  if (s.includes('token') && (s.includes('invalid') || s.includes('not valid'))) {
    return 'Your session is no longer valid. Please sign in again.';
  }
  if (s.includes('authentication credentials were not provided')) {
    return 'Please sign in to continue.';
  }
  if (s.includes('already exists')) {
    return 'An account with that username already exists.';
  }
  if (s.includes('this field may not be blank')) {
    return 'Please fill in all required fields.';
  }

  // Fall through — return as-is but capitalised
  return detail.charAt(0).toUpperCase() + detail.slice(1);
}

// ── Network / client-side error → friendly string ──────────────────
function networkMessage(error) {
  if (!error.response) {
    // No response received at all
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return 'The request timed out. Please check your internet connection.';
    }
    if (error.message?.includes('Network Error') || error.message?.includes('ERR_NETWORK')) {
      return 'Unable to reach the server. Please check your internet connection.';
    }
    return 'A network error occurred. Please try again.';
  }
  return null;
}

/**
 * getErrorMessage(error) → string
 * Extracts the best human-readable message from any axios error.
 */
export function getErrorMessage(error) {
  // Network / timeout (no response)
  const netMsg = networkMessage(error);
  if (netMsg) return netMsg;

  const { status, data } = error.response;

  // Try to parse a structured message from the response body first
  const bodyMsg = parseDRFError(data);
  if (bodyMsg) return bodyMsg;

  // Fall back to status-based message
  return STATUS_MESSAGES[status]
    || `Unexpected error (${status}). Please try again.`;
}

/**
 * showErrorToast(error)
 * Convenience: parse + display toast in one call.
 * Used by the global axios interceptor.
 *
 * Returns the message string so callers can use it too.
 */
export function showErrorToast(error, options = {}) {
  const msg = getErrorMessage(error);
  toast.error(msg, {
    duration: 5000,
    ...options,
  });
  return msg;
}
