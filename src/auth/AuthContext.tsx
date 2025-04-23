import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create an axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: 'https://auth-back-production.up.railway.app/api', // Use the production backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

export default axiosInstance;

// Define user type
interface User {
  id: string;
  name: string;
  email: string;
}

// Create context with proper types
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  logout: async () => {},
});

// Custom hook for accessing auth context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap your app
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On initial load, validate token with the server
  useEffect(() => {
    const validateAuth = async () => {
      try {
        // Verify authentication with the server
        const response = await axiosInstance.get('/auth/me');
        if (response.status === 200 && response.data.user) {
          const userData = response.data.user;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          console.log('User authenticated with server:', userData);
        }
      } catch (error) {
        console.error('Error verifying authentication:', error);
        // If server verification fails, clear local data
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateAuth();
  }, []);

  // Login function to authenticate the user
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Starting login process...');
      const response = await axiosInstance.post('/auth/login', { email, password });
      console.log('Login response:', response.data);

      if (response.status === 200) {
        const userData = response.data.user;
        
        if (!userData || !userData.id || !userData.email) {
          console.error('Invalid user data received:', userData);
          return false;
        }

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Set user state
        setUser(userData);
        
        console.log('Login successful, user set:', userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  // Logout function to clear the session
  const logout = async () => {
    try {
      // Call backend logout endpoint to clear the cookie
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear local storage and state regardless of backend response
      localStorage.removeItem('user');
      setUser(null);
      // Use window.location for navigation to avoid Router context issues
      window.location.href = '/login';
      console.log('User logged out');
    }
  };

  // Pass down context values
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
