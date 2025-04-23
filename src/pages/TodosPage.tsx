import { useState } from 'react';
import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';
import { useAuth } from '../auth/AuthContext';
import { Navigate } from 'react-router-dom';

export default function TodosPage() {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Todo App</h1>
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