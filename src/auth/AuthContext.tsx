import React, { createContext, useContext, useEffect, useState } from 'react';
import { login, register, logout, getCurrentUser } from '../services/auth.service';

interface User {
  _id: string;
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
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const userData = await getCurrentUser();
          if (userData) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const response = await login({ email, password });
    setToken(response.access_token);
    setUser(response.user);
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    const response = await register({ name, email, password });
    setToken(response.access_token);
    setUser(response.user);
  };

  const handleLogout = () => {
    logout();
    setToken(null);
    setUser(null);
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
