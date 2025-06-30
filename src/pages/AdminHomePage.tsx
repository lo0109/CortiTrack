import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../utils/database';
import PageHeader from '../components/Layout/PageHeader';
import { Users, Settings, Shield } from 'lucide-react';

const AdminHomePage: React.FC = () => {
  const navigate = useNavigate();
  const users = getUsers();
  
  const stats = {
    totalUsers: users.length,
    athletes: users.filter(u => u.role === 'athlete').length,
    coaches: users.filter(u => u.role === 'coach').length,
    teams: [...new Set(users.map(u => u.team))].length
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

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/80 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            System Overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
              <p className="text-gray-600">Total Users</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.athletes}</p>
              <p className="text-gray-600">Athletes</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{stats.coaches}</p>
              <p className="text-gray-600">Coaches</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">{stats.teams}</p>
              <p className="text-gray-600">Teams</p>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-medium text-gray-900">Manage Users</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button
            onClick={() => navigate('/admin/gauges')}
            className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-green-600" />
              <span className="text-lg font-medium text-gray-900">Configure Gauges</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;