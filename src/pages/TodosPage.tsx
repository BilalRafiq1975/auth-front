import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';
import api from '../config/axios';
import { AxiosError } from 'axios';

export default function TodosPage() {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [loadingStatus, setLoadingStatus] = useState<string>('');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSummarize = async () => {
    try {
      setIsLoading(true);
      setError('');
      setLoadingStatus('Initializing AI model...');
      
      // Set a timeout for the request
      const timeout = setTimeout(() => {
        setLoadingStatus('This is taking longer than expected. Please wait...');
      }, 10000);

      const response = await api.get('/todos/summarize');
      clearTimeout(timeout);
      
      setSummary(response.data.summary);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching summary:', axiosError);
      
      if (axiosError.code === 'ERR_NETWORK') {
        setError('Unable to connect to the server. Please make sure the backend server is running.');
      } else if (axiosError.response) {
        console.error('Error data:', axiosError.response.data);
        console.error('Error status:', axiosError.response.status);
        setError('Failed to generate summary. Please try again later.');
      } else if (axiosError.request) {
        setError('No response from server. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
      setSummary('');
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

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
            <div className="mb-6">
              <button
                onClick={handleSummarize}
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Generating Summary...' : 'Generate AI Summary'}
              </button>
              {isLoading && (
                <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                  <p className="text-indigo-400">{loadingStatus}</p>
                  <div className="mt-2 w-full bg-indigo-500/20 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400">{error}</p>
                </div>
              )}
              {summary && (
                <div className="mt-4 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold text-indigo-400 mb-4">AI Summary</h3>
                  <div className="space-y-4">
                    {summary.split('\n').map((line, index) => {
                      if (line.includes('Pending Tasks:')) {
                        return <h4 key={index} className="text-lg font-semibold text-pink-400">{line}</h4>;
                      } else if (line.includes('Completed Tasks:')) {
                        return <h4 key={index} className="text-lg font-semibold text-green-400">{line}</h4>;
                      } else if (line.includes('Key Focus Areas:')) {
                        return <h4 key={index} className="text-lg font-semibold text-blue-400">{line}</h4>;
                      } else if (line.includes('Total Tasks:')) {
                        return <p key={index} className="text-sm text-gray-400 mt-4 pt-4 border-t border-white/10">{line}</p>;
                      } else if (line.trim() === '') {
                        return <br key={index} />;
                      } else if (line.startsWith('•')) {
                        return <p key={index} className="ml-4 text-gray-300">{line}</p>;
                      } else if (line.includes('----------------------------------------')) {
                        return <hr key={index} className="my-4 border-white/10" />;
                      } else {
                        return <p key={index} className="text-gray-300">{line}</p>;
                      }
                    })}
                  </div>
                </div>
              )}
            </div>
            <TodoList key={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}