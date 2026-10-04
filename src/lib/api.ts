import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Обязательно для передачи cookies между Vercel и Render
    headers: {
        'Content-Type': 'application/json',
    },
});

// Функция для чтения cookies на клиенте
function getCookie(name: string): string | undefined {
    if (typeof window === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Берем accessToken из cookies
        if (typeof window !== 'undefined') {
            const token = getCookie('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const errorMessage = error.response.data?.message || error.response.statusText || 'Unknown error';
            console.error('API Error:', errorMessage);
        } else if (error.request) {
            console.error('Network Error:', error.message);
        } else {
            console.error('Request Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;