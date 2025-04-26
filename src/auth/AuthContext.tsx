import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create an axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your backend API base URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

export default axiosInstance;

// Create context
const AuthContext = createContext({
  user: null,
  login: (email: string, password: string) => {},
  logout: () => {},
});

// Custom hook for accessing auth context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap your app
export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);

  // On initial load, check if user is stored in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser)); // Parse and set user data from localStorage
      console.log('User loaded from localStorage:', JSON.parse(storedUser));
    } else {
      console.log('No user data found in localStorage.');
    }
  }, []);

  // Login function to authenticate the user
  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/login', { email, password });
      console.log('Login response:', response.data);

      if (response.status === 200) {
        const { token, user } = response.data;
        
        // Store the token and user data in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user)); // Store user data as JSON string

        // Set user state to reflect logged-in user
        setUser(user);

        // Optionally: Redirect or show a success message
        console.log('Login successful, user set');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Logout function to clear the session
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login'; // Optionally, redirect to login page
    console.log('User logged out');
  };

  // Pass down context values
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
