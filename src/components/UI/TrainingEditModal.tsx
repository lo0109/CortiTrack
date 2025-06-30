import React, { useState } from 'react';
import { X, Save, Clock, Type, FileText, Tag } from 'lucide-react';

interface TrainingItem {
  id: string;
  title: string;
  time: string;
  duration: string;
  description: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'rest';
}

interface TrainingEditModalProps {
  isOpen: boolean;
  trainingItem: TrainingItem;
  onSave: (updatedItem: TrainingItem) => void;
  onCancel: () => void;
}

const TrainingEditModal: React.FC<TrainingEditModalProps> = ({
  isOpen,
  trainingItem,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<TrainingItem>({
    ...trainingItem
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.time.trim()) {
      newErrors.time = 'Time is required';
    }

    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cardio': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'strength': return 'bg-red-100 text-red-800 border-red-200';
      case 'flexibility': return 'bg-green-100 text-green-800 border-green-200';
      case 'rest': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Edit Training Session</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Type className="w-4 h-4 mr-2" />
              Session Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter session title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Time and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2" />
                Start Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time.includes('AM') || formData.time.includes('PM') 
                  ? new Date(`1970-01-01 ${formData.time}`).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
                  : formData.time
                }
                onChange={(e) => {
                  const time24 = e.target.value;
                  const [hours, minutes] = time24.split(':');
                  const hour12 = new Date(`1970-01-01 ${time24}`).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit', 
                    hour12: true 
                  });
                  setFormData(prev => ({ ...prev, time: hour12 }));
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.time ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">{errors.time}</p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2" />
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.duration ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., 30 min, 1 hour"
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
              )}
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 mr-2" />
              Session Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="cardio">Cardio</option>
              <option value="strength">Strength</option>
              <option value="flexibility">Flexibility</option>
              <option value="rest">Rest</option>
            </select>
            <div className="mt-2">
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(formData.type)}`}>
                {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 mr-2" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Detailed description of the training session..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Preview:</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-blue-600 font-medium">{formData.time}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(formData.type).replace('border-', '').replace(' border', '')}`}>
                  {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
                </span>
              </div>
              <h5 className="font-semibold text-gray-900">{formData.title || 'Session Title'}</h5>
              <p className="text-sm text-gray-600">{formData.duration || 'Duration'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingEditModal;