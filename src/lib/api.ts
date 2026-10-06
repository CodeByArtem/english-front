import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let failedQueue: { resolve: (v?: unknown) => void; reject: (e: unknown) => void }[] = [];

// Флаг «идёт выход»: пока он включён, редиректы на /login подавляются
let isLoggingOut = false;
export const setLoggingOut = (value: boolean) => {
    isLoggingOut = value;
};

const processQueue = (error: unknown) => {
    failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve()));
    failedQueue = [];
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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
      const originalRequest = error.config;

      const isAuthRequest = AUTH_URLS.some((url) => originalRequest?.url?.includes(url));

      // Провалился сам refresh: сразу на логин (если страница не публичная), без очереди
      if (error.response?.status === 401 && originalRequest?.url?.includes('/auth/refresh')) {
          redirectToLogin();
          return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
          originalRequest._retry = true;

          if (isRefreshing) {
              return new Promise((resolve, reject) => {
                  failedQueue.push({ resolve, reject });
              }).then(() => api(originalRequest));
          }

          isRefreshing = true;

          try {
              await api.post('/auth/refresh');
              processQueue(null);
              return api(originalRequest);
          } catch (refreshError) {
              processQueue(refreshError);
              redirectToLogin();
              return Promise.reject(refreshError);
          } finally {
              isRefreshing = false;
          }
      }

      if (error.response) {
          console.error('API Error:', error.response.data?.message || error.response.statusText || 'Unknown error');
      } else if (error.request) {
          console.error('Network Error:', error.message);
      } else {
          console.error('Request Error:', error.message);
      }
      return Promise.reject(error);
  }
);

export default api;