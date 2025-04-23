import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://auth-back-production.up.railway.app/api', // Use the production backend URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Add a request interceptor to include the token if available
axiosInstance.interceptors.request.use((config) => {
  // We don't need to manually set the token in the Authorization header
  // because the cookie will be sent automatically with withCredentials: true
  return config;
});

// Add a response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on 401
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
