import axios from 'axios';
import { API_URL } from '../config';

export interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoDto {
  title: string;
  description: string;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  completed?: boolean;
}

class TodoService {
  private readonly baseUrl = `${API_URL}/todos`;

  async createTodo(data: CreateTodoDto): Promise<Todo> {
    const response = await axios.post(this.baseUrl, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  }

  async getTodos(): Promise<Todo[]> {
    const response = await axios.get(this.baseUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  }

  async updateTodo(id: string, data: UpdateTodoDto): Promise<Todo> {
    const response = await axios.patch(`${this.baseUrl}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  }

  async deleteTodo(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  }
}

export const todoService = new TodoService(); 