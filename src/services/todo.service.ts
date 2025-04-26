import axios from 'axios';

const API_URL = 'https://auth-back-production.up.railway.app';

export interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const todoService = {
  getAllTodos: async () => {
    try {
      const response = await axiosInstance.get('/todos');
      return response.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  createTodo: async (todo: { title: string; description: string }) => {
    try {
      const response = await axiosInstance.post('/todos', todo);
      return response.data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  updateTodo: async (id: string, todo: { title: string; description: string; completed: boolean }) => {
    try {
      const response = await axiosInstance.patch(`/todos/${id}`, todo);
      return response.data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  deleteTodo: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },
};

export default todoService;
