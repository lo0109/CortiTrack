import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUser, getReportsByUser, getMedicalHistoryByUser, getUsers, getLatestReport } from '../utils/database';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import PageHeader from '../components/Layout/PageHeader';
import { ArrowLeft, TrendingUp, Calendar, Users } from 'lucide-react';
import Gauge from '../components/UI/Gauge';
import MedicalHistoryCard from '../components/UI/MedicalHistoryCard';

const AthleteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const athlete = id ? getUser(id) : null;
  const reports = id ? getReportsByUser(id) : [];
  const latestReport = reports.length > 0 ? reports[reports.length - 1] : null;
  
  // Get medical history with proper access control
  const medicalHistory = id && user ? getMedicalHistoryByUser(id, user.id) : [];
  const canViewMedicalHistory = user?.role === 'admin' || user?.role === 'healthcare_provider';

  // Team comparison data
  const teamMembers = athlete ? getUsers().filter(u => u.role === 'athlete' && u.team === athlete.team) : [];
  const teamAverage = teamMembers.reduce((acc, member) => {
    const memberLatestReport = getLatestReport(member.id);
    return acc + (memberLatestReport?.stress_level || 0);
  }, 0) / teamMembers.length;

  const currentStress = latestReport?.stress_level || 0;
  const stressDifference = currentStress - teamAverage;
  const stressPercentage = Math.abs(stressDifference) / teamAverage * 100;

  // Prepare chart data from recent reports
  const chartData = reports.slice(-10).map((report) => ({
    date: new Date(report.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    stress: report.stress_level,
    fullDate: new Date(report.timestamp).toLocaleDateString()
  }));

  if (!athlete) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ 
          background: 'linear-gradient(to bottom, #3529cb, #800080)'
        }}
      >
        <p className="text-white">Athlete not found</p>
      </div>
    );
  }

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

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{payload[0].payload.fullDate}</p>
          <p className="text-blue-600">
            Stress Level: <span className="font-semibold">{payload[0].value}%</span>
          </p>
        </div>
      );
    }
    return null;
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
          <h1 className="text-2xl font-bold text-white ml-4">Athlete Details</h1>
        </div>

        {/* Athlete Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-8">
          <div className="flex items-center space-x-4">
            <img
              src={athlete.picture || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
              alt={athlete.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{athlete.name}</h2>
              <p className="text-gray-600">{calculateAge(athlete.dob)} years old</p>
              <p className="text-blue-600 font-medium">{athlete.team}</p>
              <p className="text-sm text-gray-500">{athlete.email}</p>
            </div>
          </div>
        </div>

        {/* Team Comparison */}
        {teamMembers.length > 1 && latestReport && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-8">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Team Comparison</h3>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Stress level vs. team average ({Math.round(teamAverage)}%)
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
                <span>Better than average</span>
                <span>Worse than average</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900">{currentStress}%</p>
                <p className="text-sm text-gray-600">Current Stress</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900">{Math.round(teamAverage)}%</p>
                <p className="text-sm text-gray-600">Team Average</p>
              </div>
            </div>
          </div>
        )}

        {/* Medical History - Only for Healthcare Providers and Admins */}
        {canViewMedicalHistory && (
          <div className="mb-8">
            <MedicalHistoryCard 
              medicalHistory={medicalHistory} 
              canView={canViewMedicalHistory}
            />
          </div>
        )}

        {/* Current Readings */}
        {latestReport && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Current Readings</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                <Gauge
                  value={latestReport.stress_level}
                  min={0}
                  max={100}
                  label="Stress"
                  unit="%"
                  metricType="stress_level"
                />
              </div>
              <div className="flex flex-col items-center">
                <Gauge
                  value={latestReport.heart_rate}
                  min={40}
                  max={180}
                  label="Heart Rate"
                  unit="bpm"
                  metricType="heart_rate"
                />
              </div>
              <div className="flex flex-col items-center">
                <Gauge
                  value={latestReport.blood_oxygen_lv}
                  min={90}
                  max={100}
                  label="Blood Oxygen"
                  unit="%"
                  metricType="blood_oxygen_lv"
                />
              </div>
              <div className="flex flex-col items-center">
                <Gauge
                  value={latestReport.sleep_quality}
                  min={0}
                  max={100}
                  label="Sleep Quality"
                  unit="%"
                  metricType="sleep_quality"
                />
              </div>
            </div>

            {/* Medical Context - Only for Healthcare Providers */}
            {user?.role === 'healthcare_provider' && latestReport.medical_context && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-900 mb-2">Clinical Context</h4>
                <p className="text-blue-800">{latestReport.medical_context}</p>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions - Hide View Detailed Report for coaches and healthcare providers */}
        <div className="space-y-4">
          {/* Only show View Detailed Report for athletes and admins */}
          {user?.role === 'athlete' && (
            <button
              onClick={() => navigate('/report')}
              className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <span className="text-lg font-medium text-gray-900">View Detailed Report</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
          )}

          <button
            onClick={() => navigate('/training')}
            className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-green-600" />
              <span className="text-lg font-medium text-gray-900">Training Schedule</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        </div>

        {/* Stress Level Trend - Line Graph */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Stress Level Trend</h3>
          </div>
          
          {chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="stress" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#ffffff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No stress level data available</p>
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-600">
            <p>Showing stress levels for the last {chartData.length} recorded sessions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AthleteDetailPage;