import React from "react";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  const { user, logout, loading } = useAuth();

  // Show loading indicator while fetching user data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-white text-xl font-semibold animate-pulse">
          Loading user data...
        </div>
      </div>
    );
  }

  // Show error if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-red-500 text-xl font-bold animate-pulse">
          No user data found. Please login again.
        </div>
      </div>
    );
  }

  // Safely access user properties with optional chaining
  const userName = user?.name || "User";
  const userEmail = user?.email || "No email available";

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 to-gray-950 text-white">
      {/* Navigation */}
      <nav className="bg-white/5 backdrop-blur-md shadow-lg sticky top-0 z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
                Auth<span className="text-indigo-400">Portal</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10">
                <span className="text-sm font-medium text-gray-300">{userEmail}</span>
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                  user.role === 'admin' 
                    ? 'bg-purple-500/20 text-purple-400' 
                    : 'bg-green-500/20 text-green-400'
                }`}>
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition duration-300 bg-red-500/30 text-red-300 hover:bg-red-500/50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500 mb-8">
            Welcome, {userName}!
          </h1>
          <p className="text-xl text-gray-400 mb-12">
            What would you like to do today?
          </p>
          <div className="flex justify-center space-x-6">
            {user.role === 'admin' ? (
              <Link
                to="/users"
                className="px-6 py-3 rounded-lg text-white text-base font-semibold transition duration-300 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 hover:opacity-90 shadow-lg hover:shadow-indigo-500/20"
              >
                Manage Users
              </Link>
            ) : (
              <Link
                to="/todos"
                className="px-6 py-3 rounded-lg text-white text-base font-semibold transition duration-300 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 hover:opacity-90 shadow-lg hover:shadow-indigo-500/20"
              >
                View My Todos
              </Link>
            )}
            
            <Link
              to="/profile"
              className="px-6 py-3 rounded-lg text-base font-semibold transition duration-300 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
            >
              My Profile
            </Link>
          </div>
        </div>
        
        {/* Dashboard Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-6 hover:bg-white/10 transition duration-300">
            <h3 className="text-xl font-semibold mb-4 text-indigo-400">Quick Stats</h3>
            <p className="text-gray-400">View your account activity and statistics</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-6 hover:bg-white/10 transition duration-300">
            <h3 className="text-xl font-semibold mb-4 text-indigo-400">Recent Activity</h3>
            <p className="text-gray-400">Check your latest actions and updates</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-6 hover:bg-white/10 transition duration-300">
            <h3 className="text-xl font-semibold mb-4 text-indigo-400">Account Settings</h3>
            <p className="text-gray-400">Manage your preferences and security</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;