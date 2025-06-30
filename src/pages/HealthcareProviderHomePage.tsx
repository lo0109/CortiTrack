import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUsers, getLatestReport } from '../utils/database';
import StatusIndicator from '../components/UI/StatusIndicator';
import PageHeader from '../components/Layout/PageHeader';
import { Stethoscope, Users, FileText } from 'lucide-react';

const HealthcareProviderHomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const athletes = getUsers().filter(u => u.role === 'athlete' && u.team === user?.team);

  const getStressStatus = (stressLevel: number): 'good' | 'warning' | 'alert' => {
    if (stressLevel < 60) return 'good';
    if (stressLevel < 75) return 'warning';
    return 'alert';
  };

  const getMedicalRiskLevel = (stressLevel: number): string => {
    if (stressLevel < 60) return 'Low Risk';
    if (stressLevel < 75) return 'Moderate Risk';
    if (stressLevel < 85) return 'High Risk';
    return 'Critical Risk';
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
          <h1 className="text-3xl font-bold text-white mb-2">Medical Dashboard</h1>
          <p className="text-white/80 flex items-center">
            <Stethoscope className="w-5 h-5 mr-2" />
            {user?.team} - {athletes.length} Athletes Under Care
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 text-center">
            <p className="text-2xl font-bold text-green-600">
              {athletes.filter(a => {
                const report = getLatestReport(a.id);
                return report && report.stress_level < 60;
              }).length}
            </p>
            <p className="text-gray-600 text-sm">Low Risk</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {athletes.filter(a => {
                const report = getLatestReport(a.id);
                return report && report.stress_level >= 60 && report.stress_level < 85;
              }).length}
            </p>
            <p className="text-gray-600 text-sm">Moderate-High</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 text-center">
            <p className="text-2xl font-bold text-red-600">
              {athletes.filter(a => {
                const report = getLatestReport(a.id);
                return report && report.stress_level >= 85;
              }).length}
            </p>
            <p className="text-gray-600 text-sm">Critical</p>
          </div>
        </div>

        <div className="space-y-4">
          {athletes.map(athlete => {
            const latestReport = getLatestReport(athlete.id);
            const stressLevel = latestReport?.stress_level || 0;
            const status = getStressStatus(stressLevel);
            const riskLevel = getMedicalRiskLevel(stressLevel);

            return (
              <div
                key={athlete.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 cursor-pointer"
                onClick={() => navigate(`/athlete/${athlete.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={athlete.picture || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
                        alt={athlete.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full">
                        <FileText className="w-3 h-3" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{athlete.name}</h3>
                      <p className="text-gray-600">
                        Stress: {stressLevel}% | HR: {latestReport?.heart_rate || 0} bpm
                      </p>
                      <p className={`text-sm font-medium ${
                        riskLevel === 'Low Risk' ? 'text-green-600' :
                        riskLevel === 'Moderate Risk' ? 'text-orange-600' :
                        riskLevel === 'High Risk' ? 'text-red-600' :
                        'text-red-800'
                      }`}>
                        Medical Risk: {riskLevel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <StatusIndicator status={status} size="lg" />
                  </div>
                </div>
                
                {latestReport?.medical_context && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm text-blue-800">
                      <strong>Clinical Note:</strong> {latestReport.medical_context}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {athletes.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-12 shadow-lg border border-white/20 text-center">
            <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No athletes assigned to your care.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthcareProviderHomePage;