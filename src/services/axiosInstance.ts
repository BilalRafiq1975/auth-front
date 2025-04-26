import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://auth-back-production.up.railway.app/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Ensure credentials are included
    config.withCredentials = true;
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log('Request:', config);
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('Response:', response);
    }
    return response;
  },
  async (error) => {
    // Log error in development
    if (import.meta.env.DEV) {
      console.error('Response Error:', error);
    }

    // Handle different error scenarios
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Clear user data and redirect to login
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Access forbidden');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('An error occurred');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Error in request configuration
      console.error('Request configuration error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
