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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">My Todos</h1>
              <Link
                to="/"
                className="text-indigo-600 hover:text-indigo-800"
              >
                Back to Home
              </Link>
            </div>
            <TodoForm onTodoCreated={() => setRefreshKey(prev => prev + 1)} />
            <div className="mt-8">
              <TodoList key={refreshKey} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 