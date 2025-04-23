import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';

export default function TodosPage() {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              My <span className="text-indigo-600">Todos</span>
            </h1>
            <Link
              to="/"
              className="inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
            >
              ← Back to Home
            </Link>
          </div>

          <TodoForm onTodoCreated={() => setRefreshKey(prev => prev + 1)} />

          <div className="mt-10">
            <TodoList key={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}
