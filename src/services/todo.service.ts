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

const todoService = {
  getAllTodos: async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  createTodo: async (todo: { title: string; description: string }) => {
    try {
      const response = await axios.post(`${API_URL}/todos`, todo, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  updateTodo: async (id: string, todo: { title: string; description: string; completed: boolean }) => {
    try {
      const response = await axios.patch(`${API_URL}/todos/${id}`, todo, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  deleteTodo: async (id: string) => {
    try {
      const response = await axios.delete(`${API_URL}/todos/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },
};

export default todoService;
