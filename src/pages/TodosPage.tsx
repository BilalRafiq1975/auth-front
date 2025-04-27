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
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 to-gray-950 text-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
              My Todos
            </h1>
            <Link
              to="/"
              className="text-indigo-400 hover:text-indigo-300 transition-colors duration-300 text-sm font-medium"
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