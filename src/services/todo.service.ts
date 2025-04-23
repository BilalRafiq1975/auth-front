import api from '../api';

export interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const todoService = {
  async getTodos(): Promise<Todo[]> {
    const response = await api.get<Todo[]>('/todos');
    return response.data;
  },

  async createTodo(data: { title: string; description: string }) {
    const response = await api.post<Todo>('/todos', data);
    return response.data;
  },

  async deleteTodo(id: string) {
    await api.delete(`/todos/${id}`);
  },

  async updateTodo(id: string, updates: Partial<Todo>) {
    const response = await api.patch<Todo>(`/todos/${id}`, updates);
    return response.data;
  }
};
