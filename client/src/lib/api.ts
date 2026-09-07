/**
 * Base API client with credentials: 'include'
 * 
 * Crucial for httpOnly cookies: Ensures the browser sends and receives
 * the 7-day 'access_token' cookie on every request without storing
 * tokens in localStorage (immune to XSS theft).
 */

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
    credentials: 'include', // Automatically attaches and receives httpOnly cookies
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data: unknown = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    if (typeof data === 'object' && data !== null) {
      const record = data as Record<string, unknown>;
      if (typeof record.detail === 'string') errorMessage = record.detail;
      else if (typeof record.message === 'string') errorMessage = record.message;
      else if (Array.isArray(record.non_field_errors) && record.non_field_errors.length > 0) {
        errorMessage = String(record.non_field_errors[0]);
      } else {
        // Extract first validation error
        const firstKey = Object.keys(record)[0];
        if (firstKey) {
          const val = record[firstKey];
          errorMessage = Array.isArray(val) ? `${firstKey}: ${val[0]}` : `${firstKey}: ${String(val)}`;
        }
      }
    }
    throw new ApiError(response.status, errorMessage, data);
  }

  return data as T;
}
