import api from '../api';
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

interface AuthResponse {
  access_token: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const { access_token, user } = response.data;
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      throw new Error('Invalid email or password');
    }
    throw new Error('Login failed. Please try again.');
  }
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', data);
    const { access_token, user } = response.data;
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 409) {
      throw new Error('Email already exists');
    }
    throw new Error('Registration failed. Please try again.');
  }
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = async (): Promise<AuthResponse['user'] | null> => {
  try {
    const response = await api.get<AuthResponse['user']>('/auth/profile');
    return response.data;
  } catch (error) {
    return null;
  }
}; 