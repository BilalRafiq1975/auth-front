import { useState, useEffect } from 'react';
import { Todo, todoService } from '../services/todo.service';
import { useAuth } from '../auth/AuthContext';
import TodoEditForm from './TodoEditForm';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

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

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  if (loading) return <div className="text-center text-gray-600 text-lg mt-6">Loading...</div>;
  if (error) return <div className="text-red-600 text-center font-medium mt-6">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Todos</h2>
      <div className="space-y-4">
        {todos.map((todo) => (
          <div key={todo._id} className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow transition">
            {editingTodo?._id === todo._id ? (
              <TodoEditForm
                todo={todo}
                onCancel={handleCancelEdit}
                onUpdate={() => {
                  handleCancelEdit();
                  loadTodos();
                }}
              />
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo)}
                    className="mt-1 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <div>
                    <h3 className={`text-lg font-semibold ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {todo.title}
                    </h3>
                    <p className={`text-sm mt-1 ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                      {todo.description}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3 self-end sm:self-auto">
                  <button
                    onClick={() => handleEdit(todo)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="text-sm font-medium text-red-600 hover:text-red-800 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
