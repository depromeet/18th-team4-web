import { httpBase } from './httpBase';

interface ApiRequestInit extends RequestInit {
  responseType?: 'blob' | 'json';
}

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const publicHttp = {
  get: async <T>(url: string, options: ApiRequestInit = {}) =>
    httpBase<T>(`${API_URL}${url}`, {
      method: 'GET',
      ...options,
    }),

  post: <req, res>(url: string, body?: req, options: ResponseInit = {}) =>
    httpBase<res>(`${API_URL}${url}`, {
      method: 'POST',
      cache: 'no-store',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }),

  patch: <req, res>(url: string, body?: req, options: ResponseInit = {}) =>
    httpBase<res>(`${API_URL}${url}`, {
      method: 'PATCH',
      cache: 'no-store',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }),

  put: <T>(url: string, body?: Request) =>
    httpBase<T>(`${API_URL}${url}`, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    }),

  delete: <T>(url: string) =>
    httpBase<T>(`${API_URL}${url}`, { method: 'DELETE', cache: 'no-store' }),
};
