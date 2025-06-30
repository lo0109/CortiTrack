import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../utils/database';
import PageHeader from '../components/Layout/PageHeader';
import { ArrowLeft, Trash2, AlertTriangle, Users } from 'lucide-react';

const AdminUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [users, setUsers] = useState(getUsers());

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
    setUsers(getUsers());
    setShowDeleteConfirm(null);
  };

  const usersByRole = {
    admin: users.filter(u => u.role === 'admin'),
    coach: users.filter(u => u.role === 'coach'),
    athlete: users.filter(u => u.role === 'athlete'),
    healthcare_provider: users.filter(u => u.role === 'healthcare_provider')
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'coach': return 'bg-blue-100 text-blue-800';
      case 'athlete': return 'bg-green-100 text-green-800';
      case 'healthcare_provider': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'healthcare_provider': return 'Healthcare Provider';
      default: return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  return (
    <div 
      className="min-h-screen pb-24"
      style={{ 
        background: 'linear-gradient(to bottom, #3529cb, #800080)'
      }}
    >
      <div className="p-6">
        {/* Page Header with Logo */}
        <PageHeader />

        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white ml-4">Manage Users</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 text-center">
            <p className="text-2xl font-bold text-purple-600">{usersByRole.admin.length}</p>
            <p className="text-gray-600">Admins</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 text-center">
            <p className="text-2xl font-bold text-blue-600">{usersByRole.coach.length}</p>
            <p className="text-gray-600">Coaches</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 text-center">
            <p className="text-2xl font-bold text-green-600">{usersByRole.athlete.length}</p>
            <p className="text-gray-600">Athletes</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 text-center">
            <p className="text-2xl font-bold text-teal-600">{usersByRole.healthcare_provider.length}</p>
            <p className="text-gray-600">Healthcare</p>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-6">
          {Object.entries(usersByRole).map(([role, roleUsers]) => (
            <div key={role} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-gray-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">{getRoleDisplayName(role)}s</h2>
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  {roleUsers.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {roleUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <img
                        src={user.picture || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {getRoleDisplayName(user.role)}
                          </span>
                          <span className="text-xs text-gray-500">{user.team}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setShowDeleteConfirm(user.id)}
                      disabled={user.role === 'admin'}
                      className={`p-2 rounded-lg transition-colors ${
                        user.role === 'admin' 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                
                {roleUsers.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No {getRoleDisplayName(role).toLowerCase()}s found</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;