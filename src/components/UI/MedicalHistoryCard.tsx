import React, { useState } from 'react';
import { MedicalHistory } from '../../types';
import { FileText, Calendar, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface MedicalHistoryCardProps {
  medicalHistory: MedicalHistory[];
  canView: boolean;
}

const MedicalHistoryCard: React.FC<MedicalHistoryCardProps> = ({ medicalHistory, canView }) => {
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);

  if (!canView) {
    return null;
  }

  const getSeverityColor = (condition: string): string => {
    const highRiskConditions = ['concussion', 'heart', 'cardiac', 'seizure', 'diabetes'];
    const moderateRiskConditions = ['asthma', 'allergy', 'sprain', 'strain'];
    
    const conditionLower = condition.toLowerCase();
    
    if (highRiskConditions.some(risk => conditionLower.includes(risk))) {
      return 'border-red-200 bg-red-50';
    }
    if (moderateRiskConditions.some(risk => conditionLower.includes(risk))) {
      return 'border-orange-200 bg-orange-50';
    }
    return 'border-blue-200 bg-blue-50';
  };

  const getConditionIcon = (condition: string): React.ReactNode => {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('concussion') || conditionLower.includes('head')) {
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
    if (conditionLower.includes('asthma') || conditionLower.includes('respiratory')) {
      return <AlertCircle className="w-5 h-5 text-orange-600" />;
    }
    return <FileText className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Medical History</h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {medicalHistory.length} Records
          </span>
        </div>
        <button
          onClick={() => setShowMedicalHistory(!showMedicalHistory)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showMedicalHistory ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showMedicalHistory ? 'Hide' : 'View'} History</span>
        </button>
      </div>

      {showMedicalHistory && (
        <div className="space-y-4">
          {medicalHistory.length > 0 ? (
            medicalHistory.map((record) => (
              <div
                key={record.id}
                className={`p-4 rounded-lg border-2 ${getSeverityColor(record.condition)}`}
              >
                <div className="flex items-start space-x-3">
                  {getConditionIcon(record.condition)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{record.condition}</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(record.diagnosis_date).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{record.notes}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Recorded: {new Date(record.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No medical history records found.</p>
            </div>
          )}
        </div>
      )}

      {!showMedicalHistory && medicalHistory.length > 0 && (
        <div className="text-center py-4">
          <p className="text-gray-600">
            Click "View History" to access {medicalHistory.length} medical record{medicalHistory.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicalHistoryCard;