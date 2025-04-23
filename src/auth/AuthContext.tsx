import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create an axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api', // Replace with your backend API base URL
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
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  logout: () => {},
});

// Custom hook for accessing auth context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap your app
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On initial load, check if user is stored in localStorage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get user data from localStorage first
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            console.log('User loaded from localStorage:', parsedUser);
          } catch (error) {
            console.error('Error parsing stored user:', error);
            localStorage.removeItem('user');
          }
        } else {
          console.log('No user data found in localStorage.');
        }
        
        // Verify authentication with the server
        try {
          const response = await axiosInstance.get('/auth/me');
          if (response.status === 200 && response.data.user) {
            // Update user data from server
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            console.log('User authenticated with server:', response.data.user);
          }
        } catch (error) {
          console.error('Error verifying authentication:', error);
          // If server verification fails, clear local data
          localStorage.removeItem('user');
          setUser(null);
          // Don't redirect here, let the RequireAuth component handle it
        }
      } catch (error) {
        console.error('Error during authentication check:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function to authenticate the user
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Starting login process...');
      const response = await axiosInstance.post('/auth/login', { email, password });
      console.log('Login response:', response.data);

      if (response.status === 200) {
        // The backend sends { message: string, user: { user: { id: string, name: string, email: string } } }
        const userData = response.data.user.user;
        
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
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
    console.log('User logged out');
  };

  // Pass down context values
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
