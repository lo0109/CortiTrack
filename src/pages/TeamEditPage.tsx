import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUsers, deleteUser } from '../utils/database';
import PageHeader from '../components/Layout/PageHeader';
import { ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';

const TeamEditPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const athletes = getUsers().filter(u => u.role === 'athlete' && u.team === user?.team);

  const handleDeleteAthlete = (athleteId: string) => {
    deleteUser(athleteId);
    setShowDeleteConfirm(null);
    // Refresh the page by navigating back and forth
    navigate('/home');
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
          <h1 className="text-2xl font-bold text-white ml-4">Edit Team</h1>
        </div>

        {/* Team Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{user?.team}</h2>
          <p className="text-gray-600">{athletes.length} Athletes</p>
        </div>

        {/* Athletes List */}
        <div className="space-y-4">
          {athletes.map(athlete => (
            <div
              key={athlete.id}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={athlete.picture || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
                    alt={athlete.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{athlete.name}</h3>
                    <p className="text-gray-600">{athlete.email}</p>
                    <p className="text-sm text-gray-500">
                      Age: {new Date().getFullYear() - new Date(athlete.dob).getFullYear()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(athlete.id)}
                  className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {athletes.length === 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-12 shadow-lg border border-white/20 text-center">
              <p className="text-gray-600">No athletes in your team yet.</p>
            </div>
          )}
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
                Are you sure you want to remove this athlete from your team? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteAthlete(showDeleteConfirm)}
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

export default TeamEditPage;