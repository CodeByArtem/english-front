import axios, { type InternalAxiosRequestConfig } from 'axios';

// API_URL используется только в next.config.ts (rewrites destination).
// Axios всегда ходит через Next.js-прокси (/api/*), а не напрямую на бэкенд.
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _gen?: number;
    _retry?: boolean;
}

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

let refreshPromise: Promise<void> | null = null;
let refreshGeneration = 0;

// Флаг «идёт выход»: пока он включён, редиректы на /login подавляются
let isLoggingOut = false;
export const setLoggingOut = (value: boolean) => {
    isLoggingOut = value;
};

// Эти запросы никогда не должны запускать refresh
const AUTH_URLS = ['/auth/refresh', '/auth/login', '/auth/register', '/auth/logout'];

// Страницы, доступные без авторизации
const PUBLIC_PATHS = ['/', '/login', '/register'];

const redirectToLogin = () => {
    if (isLoggingOut) return;
    if (typeof window !== 'undefined' && !PUBLIC_PATHS.includes(window.location.pathname)) {
        window.location.href = '/login';
    }
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const customConfig = config as CustomAxiosRequestConfig;
    customConfig._gen = refreshGeneration;
    return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
      const originalRequest = error.config as CustomAxiosRequestConfig | undefined;
      if (!originalRequest) {
          return Promise.reject(error);
      }

      const isAuthRequest = AUTH_URLS.some((url) => originalRequest.url?.includes(url));

      // Провалился сам refresh: сразу на логин (если страница не публичная), без очереди
      if (error.response?.status === 401 && originalRequest.url?.includes('/auth/refresh')) {
          if (typeof window !== 'undefined') {
              localStorage.removeItem('user');
              localStorage.removeItem('role');
          }
          redirectToLogin();
          return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
          originalRequest._retry = true;

          if (originalRequest._gen !== undefined && originalRequest._gen < refreshGeneration) {
              return api(originalRequest);
          }

          if (!refreshPromise) {
              refreshPromise = api
                  .post('/auth/refresh')
                  .then(() => {
                      refreshGeneration++;
                  })
                  .catch((refreshError) => {
                      if (typeof window !== 'undefined') {
                          localStorage.removeItem('user');
                          localStorage.removeItem('role');
                      }
                      redirectToLogin();
                      return Promise.reject(refreshError);
                  })
                  .finally(() => {
                      refreshPromise = null;
                  });
          }

          try {
              await refreshPromise;
              return api(originalRequest);
          } catch (refreshError) {
              return Promise.reject(refreshError);
          }
      }

      if (error.response) {
          // Логируем только критические ошибки сервера (5xx), клиентские 4xx обрабатываются на страницах
          if (error.response.status >= 500) {
              console.error('API Error:', error.response.data?.message || error.response.statusText || 'Server error');
          }
      } else if (error.request) {
          console.error('Network Error:', error.message);
      } else {
          console.error('Request Error:', error.message);
      }
      return Promise.reject(error);
  }
);

export default api;