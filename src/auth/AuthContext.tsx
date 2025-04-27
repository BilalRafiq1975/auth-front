import { createContext, useState, useEffect, useContext } from 'react';
import api from '../config/axios';

// Define user type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Create context with proper types
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  logout: async () => {},
  register: async () => false,
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
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (!token || !savedUser) {
          setLoading(false);
          return;
        }

        // Verify authentication with the server
        const response = await api.get('/auth/me');
        
        if (response.status === 200 && response.data.user) {
          const backendUser = response.data.user;
          const userData = {
            id: backendUser._id,
            name: backendUser.name,
            email: backendUser.email,
            role: backendUser.role || 'user'
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    validateAuth();
  }, []);

  // Login function to authenticate the user
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });

      if (response.status === 200) {
        const backendUser = response.data.user;
        
        if (!backendUser || !backendUser._id || !backendUser.email) {
          throw new Error('Invalid user data received');
        }

        const userData = {
          id: backendUser._id,
          name: backendUser.name,
          email: backendUser.email,
          role: backendUser.role || 'user'
        };

        localStorage.setItem('user', JSON.stringify(userData));
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          document.cookie = `token=${response.data.token}; path=/; secure; samesite=none`;
        }
        
        setUser(userData);
        return true;
      }
      return false;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function to clear the session
  const logout = async () => {
    try {
      setLoading(true);
      await api.post('/auth/logout');
    } catch (error: any) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      setUser(null);
      setLoading(false);
    }
  };

  // Register function to create a new user
  const register = async (name: string, email: string, password: string, role: string = 'user'): Promise<boolean> => {
    try {
      console.log('Starting registration process...');
      const response = await api.post('/auth/register', { name, email, password, role });
      console.log('Registration response:', response.data);

      if (response.status === 201) {
        const backendUser = response.data.user;
        
        if (!backendUser || !backendUser._id || !backendUser.email) {
          console.error('Invalid user data received:', backendUser);
          return false;
        }

        const userData = {
          id: backendUser._id,
          name: backendUser.name,
          email: backendUser.email,
          role: backendUser.role || 'user'
        };

        // Store user data and token
        localStorage.setItem('user', JSON.stringify(userData));
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          document.cookie = `token=${response.data.token}; path=/; secure; samesite=none`;
        }
        
        setUser(userData);
        
        console.log('Registration successful, user set:', userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
