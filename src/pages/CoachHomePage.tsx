import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUsers, getLatestReport } from '../utils/database';
import StatusIndicator from '../components/UI/StatusIndicator';
import PageHeader from '../components/Layout/PageHeader';
import { Edit3, Users, RefreshCw } from 'lucide-react';

const CoachHomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [athletes, setAthletes] = useState<any[]>([]);

  // Load athletes and their latest reports
  const loadAthletes = () => {
    const allUsers = getUsers();
    const teamAthletes = allUsers.filter(u => u.role === 'athlete' && u.team === user?.team);
    
    // Get latest report for each athlete and calculate team average
    const athletesWithReports = teamAthletes.map(athlete => {
      const latestReport = getLatestReport(athlete.id);
      return {
        ...athlete,
        latestReport
      };
    });

    // Calculate team average stress level
    const teamAverage = athletesWithReports.reduce((acc, athlete) => {
      return acc + (athlete.latestReport?.stress_level || 0);
    }, 0) / athletesWithReports.length;

    // Add team comparison data to each athlete
    const athletesWithComparison = athletesWithReports.map(athlete => {
      const currentStress = athlete.latestReport?.stress_level || 0;
      const stressDifference = currentStress - teamAverage;
      return {
        ...athlete,
        teamAverage,
        stressDifference
      };
    });
    
    setAthletes(athletesWithComparison);
  };

  useEffect(() => {
    loadAthletes();
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadAthletes();
      setRefreshing(false);
    }, 500);
  };

  const getStressStatus = (stressLevel: number): 'good' | 'warning' | 'alert' => {
    if (stressLevel < 60) return 'good';
    if (stressLevel < 75) return 'warning';
    return 'alert';
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Team Dashboard</h1>
              <p className="text-white/80 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {user?.team} - {athletes.length} Athletes
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 text-center">
            <p className="text-2xl font-bold text-green-600">
              {athletes.filter(a => a.latestReport && a.latestReport.stress_level < 60).length}
            </p>
            <p className="text-gray-600 text-sm">Low Stress</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {athletes.filter(a => a.latestReport && a.latestReport.stress_level >= 60 && a.latestReport.stress_level < 75).length}
            </p>
            <p className="text-gray-600 text-sm">Moderate</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 text-center">
            <p className="text-2xl font-bold text-red-600">
              {athletes.filter(a => a.latestReport && a.latestReport.stress_level >= 75).length}
            </p>
            <p className="text-gray-600 text-sm">High Stress</p>
          </div>
        </div>

        <div className={`space-y-4 transition-opacity duration-300 ${refreshing ? 'opacity-50' : ''}`}>
          {athletes.map(athlete => {
            const stressLevel = athlete.latestReport?.stress_level || 0;
            const heartRate = athlete.latestReport?.heart_rate || 0;
            const status = getStressStatus(stressLevel);
            const stressDifference = athlete.stressDifference || 0;
            const stressPercentage = Math.abs(stressDifference) / (athlete.teamAverage || 1) * 100;

            return (
              <div
                key={athlete.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 cursor-pointer"
                onClick={() => navigate(`/athlete/${athlete.id}`)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={athlete.picture || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
                      alt={athlete.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{athlete.name}</h3>
                      <div className="flex items-center space-x-4">
                        <p className="text-gray-600">
                          Stress: <span className={`font-semibold ${
                            stressLevel < 60 ? 'text-green-600' :
                            stressLevel < 75 ? 'text-orange-600' :
                            'text-red-600'
                          }`}>{stressLevel}%</span>
                        </p>
                        {heartRate > 0 && (
                          <p className="text-gray-600">
                            HR: <span className="font-semibold">{heartRate} bpm</span>
                          </p>
                        )}
                      </div>
                      {athlete.latestReport && (
                        <p className="text-xs text-gray-500 mt-1">
                          Last updated: {new Date(athlete.latestReport.timestamp).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <StatusIndicator status={status} size="lg" />
                  </div>
                </div>

                {/* Team Comparison for Coach View */}
                {athlete.latestReport && athlete.teamAverage && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">vs Team Average</span>
                      <span className="text-sm text-gray-600">({Math.round(athlete.teamAverage)}%)</span>
                    </div>
                    <div className="relative h-6 bg-gray-200 rounded-lg overflow-hidden">
                      <div className="absolute left-1/2 w-0.5 h-full bg-gray-400 transform -translate-x-1/2"></div>
                      <div 
                        className={`absolute top-0 h-full rounded ${
                          stressDifference >= 0 
                            ? 'right-1/2 bg-red-400' 
                            : 'left-1/2 bg-green-400'
                        }`}
                        style={{ 
                          width: `${Math.min(stressPercentage, 50)}%` 
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-700">
                          {stressDifference >= 0 ? '+' : ''}{Math.round(stressDifference)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {!athlete.latestReport && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">No recent data available</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {athletes.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-12 shadow-lg border border-white/20 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No athletes in your team yet.</p>
          </div>
        )}

        <button
          onClick={() => navigate('/team/edit')}
          className="fixed bottom-24 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <Edit3 className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default CoachHomePage;