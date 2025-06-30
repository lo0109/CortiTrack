import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getReportsByUser, getUsers, getGaugeSettings, updateReport, getLast7DaysData } from '../utils/database';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import PageHeader from '../components/Layout/PageHeader';
import { ArrowLeft, TrendingUp, AlertCircle, Edit3 } from 'lucide-react';
import EditReadingsModal from '../components/UI/EditReadingsModal';

const ReportPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [reports, setReports] = useState(user ? getReportsByUser(user.id) : []);
  const users = getUsers();
  const gaugeSettings = getGaugeSettings();

  // Get last 7 days of stress data
  const stressHistory = user ? getLast7DaysData(user.id) : [];

  const currentStress = reports.length > 0 ? reports[reports.length - 1].stress_level : 0;

  const getAdvice = (stressLevel: number): { text: string; color: string; icon: any } => {
    if (stressLevel < 60) {
      return { text: "All good! Keep up the great work.", color: "text-green-600", icon: "✓" };
    } else if (stressLevel < 75) {
      return { text: "Need to take a break. Consider some relaxation.", color: "text-orange-600", icon: "⚠" };
    } else if (stressLevel < 85) {
      return { text: "Need consultation. Please speak with your coach.", color: "text-red-600", icon: "!" };
    } else {
      return { text: "Need counselling. Immediate attention required.", color: "text-red-800", icon: "!!" };
    }
  };

  const advice = getAdvice(currentStress);
  const latestReport = reports.length > 0 ? reports[reports.length - 1] : null;

  const handleSaveReadings = (updatedData: any) => {
    if (latestReport && user) {
      const updatedReport = updateReport(latestReport.id, updatedData, user.id);
      if (updatedReport) {
        // Refresh reports
        const updatedReports = getReportsByUser(user.id);
        setReports(updatedReports);
      }
    }
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white ml-4">Detailed Report</h1>
          </div>
          
          {/* Edit Latest Readings Button - Only for athletes */}
          {user?.role === 'athlete' && latestReport && (
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Latest</span>
            </button>
          )}
        </div>

        {/* Stress Level History */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Stress Level (Cortisol Level) History</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stressHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="dayLabel" 
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
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: '#3B82F6', strokeWidth: 2, fill: '#ffffff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Showing stress levels for the last 7 days. Data points represent daily averages.</p>
          </div>
        </div>

        {/* Advice Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Health Advice</h2>
          </div>
          <div className={`p-4 rounded-lg ${advice.color.includes('green') ? 'bg-green-50' : 
            advice.color.includes('orange') ? 'bg-orange-50' : 'bg-red-50'}`}>
            <p className={`font-medium ${advice.color}`}>
              <span className="mr-2">{advice.icon}</span>
              {advice.text}
            </p>
          </div>
        </div>

        {/* Full Data Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Latest Readings</h2>
          {latestReport ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-sm font-medium text-gray-600">Metric</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Value</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Range</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="space-y-3">
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-medium">Stress Level</td>
                    <td className="py-3">{latestReport.stress_level}%</td>
                    <td className="py-3">{gaugeSettings.stress_level.min}-{gaugeSettings.stress_level.max}%</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        latestReport.stress_level < 60 ? 'bg-green-100 text-green-800' :
                        latestReport.stress_level < 75 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {latestReport.stress_level < 60 ? 'Good' :
                         latestReport.stress_level < 75 ? 'Warning' : 'Alert'}
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-medium">Heart Rate</td>
                    <td className="py-3">{latestReport.heart_rate} bpm</td>
                    <td className="py-3">{gaugeSettings.heart_rate.min}-{gaugeSettings.heart_rate.max} bpm</td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Normal</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-medium">Blood Oxygen</td>
                    <td className="py-3">{latestReport.blood_oxygen_lv}%</td>
                    <td className="py-3">{gaugeSettings.blood_oxygen_lv.min}-{gaugeSettings.blood_oxygen_lv.max}%</td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Normal</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">Sleep Quality</td>
                    <td className="py-3">{latestReport.sleep_quality}%</td>
                    <td className="py-3">{gaugeSettings.sleep_quality.min}-{gaugeSettings.sleep_quality.max}%</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        latestReport.sleep_quality > 70 ? 'bg-green-100 text-green-800' :
                        latestReport.sleep_quality > 50 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {latestReport.sleep_quality > 70 ? 'Good' :
                         latestReport.sleep_quality > 50 ? 'Fair' : 'Poor'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div className="mt-4 text-xs text-gray-500">
                Last updated: {new Date(latestReport.timestamp).toLocaleString()}
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No data available yet.</p>
          )}
        </div>

        {/* Edit Readings Modal */}
        {latestReport && user?.role === 'athlete' && (
          <EditReadingsModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            report={latestReport}
            onSave={handleSaveReadings}
          />
        )}
      </div>
    </div>
  );
};

export default ReportPage;