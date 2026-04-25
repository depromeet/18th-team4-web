import { useAuthStore } from '@/lib/stores';
import { httpBase } from './httpBase';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

function getClientToken() {
  return useAuthStore.getState().token;
}

export const clientAuthHttp = {
  get: <T>(url: string) => {
    const token = getClientToken();
    return httpBase<T>(`${API_URL}${url}`, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  post: <req, res>(url: string, body?: req, options: ResponseInit = {}) => {
    return httpBase<res>(`${API_URL}${url}`, {
      method: 'POST',
      cache: 'no-store',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  },

  put: <T>(url: string, body?: Request) => {
    const token = getClientToken();
    return httpBase<T>(`${API_URL}${url}`, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  patch: <req, res>(url: string, body?: req, options: ResponseInit = {}) => {
    return httpBase<res>(`${API_URL}${url}`, {
      method: 'PATCH',
      cache: 'no-store',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  },

  delete: <T>(url: string) => {
    const token = getClientToken();
    return httpBase<T>(`${API_URL}${url}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};
