import React, { createContext, useContext, useEffect, useState } from 'react';
import { login, register, logout, getCurrentUser } from '../services/auth.service';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw && raw !== 'undefined') {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Failed to parse user from localStorage:', err);
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    const rawToken = localStorage.getItem('token');
    return rawToken && rawToken !== 'undefined' ? rawToken : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken && storedToken !== 'undefined') {
        setToken(storedToken);
        try {
          const userData = await getCurrentUser();
          if (userData) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            clearAuthData();
          }
        } catch (error) {
          console.error("Error fetching current user:", error);
          clearAuthData();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const handleLogin = async (email: string, password: string) => {
    const response = await login({ email, password });
    setToken(response.access_token);
    setUser(response.user);
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    const response = await register({ name, email, password });
    setToken(response.access_token);
    setUser(response.user);
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
  };

  const handleLogout = () => {
    logout();
    clearAuthData();
  };

  const value = {
    user,
    token,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
