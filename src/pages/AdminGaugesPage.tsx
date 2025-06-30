import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGaugeSettings, updateGaugeSettings } from '../utils/database';
import PageHeader from '../components/Layout/PageHeader';
import { ArrowLeft, Settings, Save, Palette } from 'lucide-react';

const AdminGaugesPage: React.FC = () => {
  const navigate = useNavigate();
  const [gaugeSettings, setGaugeSettings] = useState(getGaugeSettings());
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const handleUpdateSettings = async () => {
    setSaving(true);
    
    try {
      // Add a small delay to show the saving state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateGaugeSettings(gaugeSettings);
      setSuccess('Gauge settings updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating gauge settings:', error);
      setSuccess('Error updating settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (metric: string, type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    setGaugeSettings(prev => ({
      ...prev,
      [metric]: {
        ...prev[metric as keyof typeof prev],
        [type]: numValue
      }
    }));
  };

  const handleColorChange = (metric: string, range: 'low' | 'medium' | 'high', color: string) => {
    setGaugeSettings(prev => ({
      ...prev,
      [metric]: {
        ...prev[metric as keyof typeof prev],
        colors: {
          ...prev[metric as keyof typeof prev].colors,
          [range]: color
        }
      }
    }));
  };

  const gaugeLabels = {
    stress_level: { name: 'Stress Level', unit: '%' },
    heart_rate: { name: 'Heart Rate', unit: 'bpm' },
    blood_oxygen_lv: { name: 'Blood Oxygen Level', unit: '%' },
    sleep_quality: { name: 'Sleep Quality', unit: '%' }
  };

  const colorRangeLabels = {
    low: '0-33%',
    medium: '34-66%',
    high: '67-100%'
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
          <h1 className="text-2xl font-bold text-white ml-4">Configure Gauges</h1>
        </div>

        {/* Success Message */}
        {success && (
          <div className={`mb-6 p-4 rounded-lg ${
            success.includes('Error') 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {success}
          </div>
        )}

        {/* Gauge Settings */}
        <div className="space-y-6">
          {Object.entries(gaugeLabels).map(([key, label]) => (
            <div key={key} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center mb-6">
                <Settings className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">{label.name}</h3>
              </div>
              
              {/* Range Settings */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Value ({label.unit})
                  </label>
                  <input
                    type="number"
                    value={gaugeSettings[key as keyof typeof gaugeSettings].min}
                    onChange={(e) => handleInputChange(key, 'min', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Value ({label.unit})
                  </label>
                  <input
                    type="number"
                    value={gaugeSettings[key as keyof typeof gaugeSettings].max}
                    onChange={(e) => handleInputChange(key, 'max', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>
              </div>

              {/* Color Settings */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center mb-4">
                  <Palette className="w-5 h-5 text-purple-600 mr-2" />
                  <h4 className="text-lg font-medium text-gray-900">Color Settings</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(colorRangeLabels).map(([range, rangeLabel]) => (
                    <div key={range} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {rangeLabel} Range
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={gaugeSettings[key as keyof typeof gaugeSettings].colors[range as 'low' | 'medium' | 'high']}
                          onChange={(e) => handleColorChange(key, range as 'low' | 'medium' | 'high', e.target.value)}
                          className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={gaugeSettings[key as keyof typeof gaugeSettings].colors[range as 'low' | 'medium' | 'high']}
                          onChange={(e) => handleColorChange(key, range as 'low' | 'medium' | 'high', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
                          placeholder="#000000"
                        />
                      </div>
                      <div 
                        className="w-full h-6 rounded border border-gray-300"
                        style={{ 
                          backgroundColor: gaugeSettings[key as keyof typeof gaugeSettings].colors[range as 'low' | 'medium' | 'high']
                        }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Current range: {gaugeSettings[key as keyof typeof gaugeSettings].min} - {gaugeSettings[key as keyof typeof gaugeSettings].max} {label.unit}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: gaugeSettings[key as keyof typeof gaugeSettings].colors.low }}
                    ></div>
                    <span className="text-xs text-gray-600">0-33%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: gaugeSettings[key as keyof typeof gaugeSettings].colors.medium }}
                    ></div>
                    <span className="text-xs text-gray-600">34-66%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: gaugeSettings[key as keyof typeof gaugeSettings].colors.high }}
                    ></div>
                    <span className="text-xs text-gray-600">67-100%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <button
            onClick={handleUpdateSettings}
            disabled={saving}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving Settings...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Gauge Configuration</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Range settings define the scale for all gauge displays throughout the app</p>
            <p>• Color settings customize the visual appearance of different value ranges</p>
            <p>• Low range (0-33%): Typically represents good/safe values</p>
            <p>• Medium range (34-66%): Represents moderate/warning values</p>
            <p>• High range (67-100%): Represents concerning/alert values</p>
            <p>• Changes will affect how data is visualized for all users immediately</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGaugesPage;