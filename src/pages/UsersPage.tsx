import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';
import api from '../config/axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isActive: boolean;
}

const UsersPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        const usersData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.users)
          ? response.data.users
          : [];
        setUsers(usersData);
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const handleToggleStatus = async (userId: string) => {
    try {
      if (userId === user?.id) {
        setError('You cannot deactivate your own admin account');
        setShowConfirmModal(false);
        setSelectedUser(null);
        return;
      }

      await api.patch(`/users/${userId}/toggle-status`);
      setUsers(users.map(u =>
        u._id === userId ? { ...u, isActive: !u.isActive } : u
      ));
      setShowConfirmModal(false);
      setSelectedUser(null);
    } catch (err: any) {
      console.error('Error toggling user status:', err);
      setError(err.response?.data?.message || 'Failed to toggle user status');
    }
  };

  const openConfirmModal = (user: User) => {
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-red-500 text-xl font-bold animate-pulse">
          Access Denied - Admins Only
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-white text-xl font-semibold animate-pulse">
          Loading Users...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 to-gray-950 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex justify-between items-center">
        <h3 className="text-4xl leading-tight font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500 mb-8">
  User Management
</h3>


          <Link
            to="/"
            className="text-indigo-400 hover:text-indigo-600 transition duration-300 text-sm font-semibold"
          >
            ← Back Home
          </Link>
        </div>

        {error && (
          <div className="bg-red-600/20 text-red-400 px-6 py-4 rounded-lg shadow-md">
            {error}
          </div>
        )}

        <div className="overflow-x-auto bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10">
          <table className="min-w-full table-auto text-left text-gray-300">
            <thead className="bg-white/10">
              <tr>
                {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map((heading) => (
                  <th key={heading} className="px-6 py-4 text-xs uppercase tracking-wider">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="hover:bg-white/10 transition-all duration-300"
                >
                  <td className="px-6 py-4 font-medium">{u.name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      u.role === 'admin'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      u.isActive
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openConfirmModal(u)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-300 ${
                        u.isActive
                          ? 'bg-red-500/30 text-red-300 hover:bg-red-500/50'
                          : 'bg-green-500/30 text-green-300 hover:bg-green-500/50'
                      }`}
                    >
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800 to-gray-900 p-8 rounded-2xl shadow-2xl max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Confirm {selectedUser.isActive ? 'Deactivation' : 'Activation'}
            </h2>
            <p className="text-gray-400 mb-8">
              Are you sure you want to {selectedUser.isActive ? 'deactivate' : 'activate'}{' '}
              <span className="font-semibold">{selectedUser.name}</span>'s account?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 rounded-lg bg-gray-600/50 hover:bg-gray-700/70 text-white text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleToggleStatus(selectedUser._id)}
                className={`px-4 py-2 rounded-lg text-white text-sm ${
                  selectedUser.isActive
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {selectedUser.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
