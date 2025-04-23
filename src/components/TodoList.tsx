import { useState, useEffect } from 'react';
import { Todo, todoService } from '../services/todo.service';
import { useAuth } from '../context/AuthContext';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await todoService.getTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const updatedTodo = await todoService.updateTodo(todo._id, {
        completed: !todo.completed
      });
      setTodos(todos.map(t => t._id === todo._id ? updatedTodo : t));
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Todos</h2>
      <div className="space-y-4">
        {todos.map(todo => (
          <div
            key={todo._id}
            className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
          >
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo)}
                className="h-5 w-5"
              />
              <div>
                <h3 className={`text-lg font-semibold ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                  {todo.title}
                </h3>
                <p className="text-gray-600">{todo.description}</p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(todo._id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 