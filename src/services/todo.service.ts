import api from '../config/axios';

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const todoService = {
  async getAllTodos(): Promise<Todo[]> {
    try {
      const response = await api.get('/todos');
      return response.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  async createTodo(data: { title: string; description?: string }): Promise<Todo> {
    try {
      const response = await api.post('/todos', data);
      return response.data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  async updateTodo(id: string, data: Partial<Todo>): Promise<Todo> {
    try {
      const response = await api.patch(`/todos/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  async deleteTodo(id: string): Promise<void> {
    try {
      await api.delete(`/todos/${id}`);
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }
};
