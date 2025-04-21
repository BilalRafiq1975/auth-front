import React from "react";
import { useAuth } from "../auth/AuthContext";

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-semibold text-gray-900">
                Auth<span className="text-indigo-600">Portal</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100">
                <span className="text-sm font-medium text-gray-600">
                  {user?.email}
                </span>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-gray-100">
          <div className="px-6 py-8 sm:p-8">
            <div className="flex items-center space-x-4 mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back,{" "}
                <span className="text-indigo-600">{user?.name}</span>!
              </h1>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              You're now securely authenticated and viewing protected content.
              Here's your account information for reference.
            </p>

            <div className="space-y-6">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  
                  Account Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Email
                    </p>
                    <p className="text-gray-800 font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      User ID
                    </p>
                    <p className="text-gray-800 font-medium">{user?._id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
