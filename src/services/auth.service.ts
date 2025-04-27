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

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface ErrorResponse {
  message: string;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response?.status === 401) {
      const errorMessage = axiosError.response?.data?.message;
      if (errorMessage?.includes('deactivated')) {
        throw new Error('Account has been deactivated. Please contact admin.');
      }
      throw new Error('Invalid credentials');
    }
    throw error;
  }
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if ((error as AxiosError)?.response?.status === 409) {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

export const logout = (): void => {
  // The cookie will be automatically removed by the browser when it expires
  // or when the user logs out on the server side
};

export const getCurrentUser = async (): Promise<AuthResponse['user'] | null> => {
  try {
    const response = await axiosInstance.get<AuthResponse['user']>('/auth/me', {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return null;
  }
}; 