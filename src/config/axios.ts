import axios from 'axios';

const baseURL = import.meta.env.DEV 
  ? 'http://localhost:4000' 
  : 'https://auth-back-production.up.railway.app';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set Authorization header
      config.headers.Authorization = `Bearer ${token}`;
      // Also set cookie for fallback
      document.cookie = `token=${token}; path=/; secure; samesite=none`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    return Promise.reject(error);
  }
);

export default api; 