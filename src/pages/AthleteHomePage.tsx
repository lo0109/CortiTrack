import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getTodaysReport, getGaugeSettings, saveTodaysReadings, getUsers } from '../utils/database';
import Gauge from '../components/UI/Gauge';
import EditReadingsModal from '../components/UI/EditReadingsModal';
import PageHeader from '../components/Layout/PageHeader';
import { Calendar, TrendingUp, Edit3, RefreshCw, Users } from 'lucide-react';

const AthleteHomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [todaysReport, setTodaysReport] = useState(user ? getTodaysReport(user.id) : null);
  const [refreshing, setRefreshing] = useState(false);

  const gaugeSettings = getGaugeSettings();

  // Team comparison data
  const teamMembers = getUsers().filter(u => u.role === 'athlete' && u.team === user?.team);
  const teamAverage = teamMembers.reduce((acc, member) => {
    const memberReport = getTodaysReport(member.id);
    return acc + (memberReport?.stress_level || 0);
  }, 0) / teamMembers.length;

  const currentStress = todaysReport?.stress_level || 0;
  const stressDifference = currentStress - teamAverage;
  const stressPercentage = Math.abs(stressDifference) / teamAverage * 100;

  // Refresh data when component mounts or user changes
  useEffect(() => {
    if (user) {
      const report = getTodaysReport(user.id);
      setTodaysReport(report);
    }
  }, [user]);

  const calculateAge = (dob: string): number => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = user ? calculateAge(user.dob) : 0;

  const handleSaveReadings = async (updatedData: any) => {
    if (user) {
      setRefreshing(true);
      
      try {
        // Use the new saveTodaysReadings function
        const updatedReport = saveTodaysReadings(user.id, {
          stress_level: updatedData.stress_level,
          heart_rate: updatedData.heart_rate,
          blood_oxygen_lv: updatedData.blood_oxygen_lv,
          sleep_quality: updatedData.sleep_quality,
          medical_context: updatedData.medical_context
        });
        
        // Update local state immediately
        setTodaysReport(updatedReport);
        
        // Small delay to show the update visually
        setTimeout(() => {
          setRefreshing(false);
        }, 500);
        
        console.log('Successfully saved today\'s readings:', updatedReport);
      } catch (error) {
        console.error('Error saving readings:', error);
        setRefreshing(false);
      }
    }
  };

  const handleRefresh = () => {
    if (user) {
      setRefreshing(true);
      // Simulate a brief refresh
      setTimeout(() => {
        const report = getTodaysReport(user.id);
        setTodaysReport(report);
        setRefreshing(false);
      }, 500);
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

        {/* User Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <img
                src={user?.picture || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
                alt={user?.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-sm sm:text-base text-gray-600">{age} years old</p>
                <p className="text-xs sm:text-sm text-blue-600 font-medium">{user?.team}</p>
              </div>
            </div>
            
            {/* Action Buttons - Stacked vertically */}
            <div className="flex flex-col space-y-3 w-full lg:w-auto">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 w-full lg:w-auto"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm sm:text-base">Refresh</span>
              </button>
              
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full lg:w-auto"
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm sm:text-base">
                  {todaysReport ? "Edit Today's Readings" : "Add Today's Readings"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Team Comparison */}
        {teamMembers.length > 1 && todaysReport && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-8">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Team Comparison</h2>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Your stress level vs. team average ({Math.round(teamAverage)}%)
              </p>
              <div className="relative h-8 bg-gray-200 rounded-lg overflow-hidden">
                <div className="absolute left-1/2 w-1 h-full bg-gray-400 transform -translate-x-1/2"></div>
                <div 
                  className={`absolute top-0 h-full rounded ${
                    stressDifference >= 0 
                      ? 'right-1/2 bg-red-500' 
                      : 'left-1/2 bg-green-500'
                  }`}
                  style={{ 
                    width: `${Math.min(stressPercentage, 50)}%` 
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {stressDifference >= 0 ? '+' : ''}{Math.round(stressDifference)}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Worse than average</span>
                <span>Better than average</span>
              </div>
            </div>
          </div>
        )}

        {/* Gauges */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 flex flex-col items-center transition-all duration-300 ${refreshing ? 'opacity-50' : ''}`}>
            <Gauge
              value={todaysReport?.stress_level || 0}
              min={gaugeSettings.stress_level.min}
              max={gaugeSettings.stress_level.max}
              label="Stress"
              unit="%"
              onClick={() => navigate('/report')}
              metricType="stress_level"
            />
          </div>

          <div className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 flex flex-col items-center transition-all duration-300 ${refreshing ? 'opacity-50' : ''}`}>
            <Gauge
              value={todaysReport?.heart_rate || 0}
              min={gaugeSettings.heart_rate.min}
              max={gaugeSettings.heart_rate.max}
              label="Heart Rate"
              unit="bpm"
              onClick={() => navigate('/report')}
              metricType="heart_rate"
            />
          </div>

          <div className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 flex flex-col items-center transition-all duration-300 ${refreshing ? 'opacity-50' : ''}`}>
            <Gauge
              value={todaysReport?.blood_oxygen_lv || 0}
              min={gaugeSettings.blood_oxygen_lv.min}
              max={gaugeSettings.blood_oxygen_lv.max}
              label="Blood Oxygen"
              unit="%"
              onClick={() => navigate('/report')}
              metricType="blood_oxygen_lv"
            />
          </div>

          <div className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 flex flex-col items-center transition-all duration-300 ${refreshing ? 'opacity-50' : ''}`}>
            <Gauge
              value={todaysReport?.sleep_quality || 0}
              min={gaugeSettings.sleep_quality.min}
              max={gaugeSettings.sleep_quality.max}
              label="Sleep Quality"
              unit="%"
              onClick={() => navigate('/report')}
              metricType="sleep_quality"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/report')}
            className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-medium text-gray-900">View Full Report</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button
            onClick={() => navigate('/training')}
            className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-green-600" />
              <span className="text-lg font-medium text-gray-900">Training Agenda</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        </div>

        {/* Last Updated Info */}
        {todaysReport && (
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
            <p className="text-sm text-gray-600 text-center">
              Today's readings last updated: {new Date(todaysReport.timestamp).toLocaleTimeString()}
            </p>
          </div>
        )}

        {/* No Data Message */}
        {!todaysReport && (
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20 text-center">
            <p className="text-gray-600 mb-4">No health data available for today yet.</p>
            <p className="text-sm text-gray-500">Click "Add Today's Readings" to record your first reading of the day.</p>
          </div>
        )}

        {/* Edit Readings Modal */}
        <EditReadingsModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          report={todaysReport || {
            id: 'temp',
            user_id: user?.id || '',
            stress_level: 50,
            heart_rate: 70,
            blood_oxygen_lv: 98,
            sleep_quality: 80,
            timestamp: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0]
          }}
          onSave={handleSaveReadings}
        />
      </div>
    </div>
  );
};

export default AthleteHomePage;