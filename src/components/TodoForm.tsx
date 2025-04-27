import { useState } from 'react';
import { todoService } from '../services/todo.service';

export default function TodoForm({ onTodoCreated }: { onTodoCreated: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await todoService.createTodo({ title, description });
      setTitle('');
      setDescription('');
      setError(null);
      onTodoCreated();
    } catch (err) {
      setError('Failed to create todo');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 backdrop-blur-md p-8 rounded-xl border border-white/10 shadow-lg">
        {error && (
          <div className="text-red-300 font-medium bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 text-white bg-white/5 border border-white/10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder-gray-400"
            placeholder="Enter todo title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-3 text-white bg-white/5 border border-white/10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder-gray-400"
            placeholder="Enter todo description"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition"
        >
          Add Todo
        </button>
      </form>
    </div>
  );
}
