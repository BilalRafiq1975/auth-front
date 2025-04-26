import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', // Base URL for API requests
  withCredentials: true, // Send cookies with every request
  headers: {
    'Content-Type': 'application/json', // Set default Content-Type
    'Accept': 'application/json', // Set default Accept header
  },
});

// Add request interceptor to handle CORS
axiosInstance.interceptors.request.use((config) => {
  // Ensure credentials are included
  config.withCredentials = true;

  // Log the outgoing request for debugging (remove in production)
  console.log('Request:', config);

  // Add CORS headers for preflight requests
  if (config.method === 'options') {
    config.headers['Access-Control-Request-Method'] = config.method;
    config.headers['Access-Control-Request-Headers'] = 'Content-Type, Authorization';
  }

  return config;
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    // Log the successful response for debugging (remove in production)
    console.log('Response:', response);
    return response;
  },
  async (error) => {
    // Log the error for debugging (remove in production)
    console.error('Error Response:', error.response);

    // Handle token expiration (401 Unauthorized)
    if (error.response?.status === 401) {
      // Attempt to refresh the token if the user is not logged in
      try {
        const refreshedToken = await refreshToken();
        if (refreshedToken) {
          // Retry the original request with the new token
          error.config.headers['Authorization'] = `Bearer ${refreshedToken}`;
          return axiosInstance(error.config); // Retry the request
        } else {
          // Redirect user to login page if token refresh fails
          window.location.href = '/login';
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        window.location.href = '/login'; // Redirect to login if refresh fails
      }
    }

    // Handle other HTTP error codes
    if (error.response?.status === 500) {
      alert('Server error, please try again later.');
    } else if (error.response?.status === 403) {
      alert('Access forbidden. You don’t have permission to access this resource.');
    }

    // Reject the promise with the error
    return Promise.reject(error);
  }
);

// Function to refresh token (Example logic, adapt to your backend)
const refreshToken = async () => {
  try {
    const response = await axiosInstance.post('/auth/refresh-token', {}, {
      withCredentials: true,
    });
    return response.data.token; // Assume the refreshed token is returned here
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

export default axiosInstance;
