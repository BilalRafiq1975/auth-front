import { useState, useEffect } from 'react';
import { Todo, todoService } from '../services/todo.service';
import { useAuth } from '../auth/AuthContext';
import TodoEditForm from './TodoEditForm';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useAuth();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await todoService.getAllTodos();
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
        title: todo.title,
        description: todo.description,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-white text-xl font-semibold animate-pulse">
          Loading todos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-red-500 text-xl font-bold animate-pulse">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-tr from-slate-900 to-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500 mb-8">
          Your Todos
        </h2>
        <div className="space-y-4">
          {todos.map((todo) => (
            <div key={todo._id} className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 hover:bg-white/10 transition duration-300 shadow-lg">
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
                      className="mt-1 h-5 w-5 text-indigo-400 border-gray-600 rounded focus:ring-indigo-500 bg-white/5"
                    />
                    <div>
                      <h3 className={`text-lg font-semibold ${todo.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                        {todo.title}
                      </h3>
                      <p className={`text-sm mt-1 ${todo.completed ? 'text-gray-400' : 'text-gray-300'}`}>
                        {todo.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3 self-end sm:self-auto">
                    <button
                      onClick={() => handleEdit(todo)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold transition duration-300 bg-indigo-500/30 text-indigo-300 hover:bg-indigo-500/50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(todo._id)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold transition duration-300 bg-red-500/30 text-red-300 hover:bg-red-500/50"
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
    </div>
  );
}
