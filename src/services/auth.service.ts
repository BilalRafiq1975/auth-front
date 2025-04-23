import axiosInstance from './axiosInstance';
import { AxiosError } from 'axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface BackendUser {
  _id: string;
  name: string;
  email: string;
}

interface TransformedUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: BackendUser;
  token: string;
}

const transformUser = (user: BackendUser): TransformedUser => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/login', { email, password });
  const { user, token } = response.data;
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
  return response.data;
};

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/register', userData);
  const { user, token } = response.data;
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = (): TransformedUser | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  return JSON.parse(userStr);
}; 