import React, { useState, useEffect } from 'react';
import { Report } from '../../types';
import { X, Save, AlertCircle, CheckCircle } from 'lucide-react';

interface EditReadingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report;
  onSave: (updatedData: Partial<Report>) => void;
}

const EditReadingsModal: React.FC<EditReadingsModalProps> = ({
  isOpen,
  onClose,
  report,
  onSave
}) => {
  const [formData, setFormData] = useState({
    stress_level: report.stress_level,
    heart_rate: report.heart_rate,
    blood_oxygen_lv: report.blood_oxygen_lv,
    sleep_quality: report.sleep_quality
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Reset form when report changes
  useEffect(() => {
    setFormData({
      stress_level: report.stress_level,
      heart_rate: report.heart_rate,
      blood_oxygen_lv: report.blood_oxygen_lv,
      sleep_quality: report.sleep_quality
    });
    setErrors({});
    setSaveSuccess(false);
  }, [report]);

  const validateField = (name: string, value: number): string => {
    switch (name) {
      case 'stress_level':
        if (value < 0 || value > 100) return 'Stress level must be between 0-100%';
        break;
      case 'heart_rate':
        if (value < 30 || value > 220) return 'Heart rate must be between 30-220 bpm';
        break;
      case 'blood_oxygen_lv':
        if (value < 70 || value > 100) return 'Blood oxygen must be between 70-100%';
        break;
      case 'sleep_quality':
        if (value < 0 || value > 100) return 'Sleep quality must be between 0-100%';
        break;
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear success message when user makes changes
    if (saveSuccess) {
      setSaveSuccess(false);
    }
  };

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};
    
    // Validate all fields
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        newErrors[key] = error;
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setSaving(true);
    
    try {
      // Call the save function
      await onSave(formData);
      
      // Show success message
      setSaveSuccess(true);
      
      // Auto-close after 1.5 seconds
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error saving readings:', error);
      setErrors({ general: 'Failed to save readings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Check if this is today's report
  const today = new Date().toISOString().split('T')[0];
  const reportDate = new Date(report.timestamp).toISOString().split('T')[0];
  const isToday = reportDate === today;
  const isNewEntry = report.id === 'temp'; // Temporary ID for new entries

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {isNewEntry ? "Add Today's Readings" : `Edit ${isToday ? "Today's" : "Latest"} Readings`}
          </h3>
          <button
            onClick={handleClose}
            disabled={saving}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>
              {isNewEntry ? "Today's readings saved successfully!" : "Readings updated successfully!"} Closing...
            </span>
          </div>
        )}

        {/* General Error */}
        {errors.general && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{errors.general}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stress Level (%)
            </label>
            <input
              type="number"
              name="stress_level"
              value={formData.stress_level}
              onChange={handleChange}
              min="0"
              max="100"
              disabled={saving}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.stress_level ? 'border-red-300' : 'border-gray-300'
              } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            {errors.stress_level && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.stress_level}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heart Rate (bpm)
            </label>
            <input
              type="number"
              name="heart_rate"
              value={formData.heart_rate}
              onChange={handleChange}
              min="30"
              max="220"
              disabled={saving}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.heart_rate ? 'border-red-300' : 'border-gray-300'
              } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            {errors.heart_rate && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.heart_rate}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Oxygen Level (%)
            </label>
            <input
              type="number"
              name="blood_oxygen_lv"
              value={formData.blood_oxygen_lv}
              onChange={handleChange}
              min="70"
              max="100"
              disabled={saving}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.blood_oxygen_lv ? 'border-red-300' : 'border-gray-300'
              } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            {errors.blood_oxygen_lv && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.blood_oxygen_lv}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sleep Quality (%)
            </label>
            <input
              type="number"
              name="sleep_quality"
              value={formData.sleep_quality}
              onChange={handleChange}
              min="0"
              max="100"
              disabled={saving}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.sleep_quality ? 'border-red-300' : 'border-gray-300'
              } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            {errors.sleep_quality && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.sleep_quality}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> {isNewEntry 
              ? "This will create a new reading entry for today with the current timestamp."
              : `You are editing ${isToday ? "today's" : "your most recent"} reading. Changes will be saved with the current timestamp.`
            } All gauges and charts will be updated immediately.
          </p>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleClose}
            disabled={saving}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || saveSuccess}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isNewEntry ? "Save Readings" : "Save Changes"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditReadingsModal;