export interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const todoService = {
  async getTodos(): Promise<Todo[]> {
    const res = await fetch(`${API_BASE_URL}/todos`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch todos');
    return res.json();
  },

  async createTodo(data: { title: string; description: string }) {
    const res = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create todo');
    return res.json();
  },

  async deleteTodo(id: string) {
    const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to delete todo');
  },

  async updateTodo(id: string, updates: Partial<Todo>) {
    const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update todo');
    return res.json();
  }
};
