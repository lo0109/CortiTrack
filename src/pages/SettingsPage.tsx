import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserSettings, updateUserSettings } from '../utils/database';
import PageHeader from '../components/Layout/PageHeader';
import { Settings, Bell, Volume2, FileText, Shield } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notification: true,
    sound: true
  });

  useEffect(() => {
    if (user) {
      const userSettings = getUserSettings(user.id);
      if (userSettings) {
        setSettings({
          notification: userSettings.notification,
          sound: userSettings.sound
        });
      }
    }
  }, [user]);

  const handleToggle = (setting: 'notification' | 'sound') => {
    const newSettings = {
      ...settings,
      [setting]: !settings[setting]
    };
    setSettings(newSettings);
    
    if (user) {
      updateUserSettings(user.id, newSettings);
    }
  };

  const openUserAgreement = () => {
    alert('User Agreement\n\nBy using Corti Track, you agree to:\n- Provide accurate health data\n- Use the app responsibly for health monitoring\n- Follow coach guidance and recommendations\n\nLast updated: January 2025');
  };

  const openPrivacyPolicy = () => {
    alert('Privacy Policy\n\nWe protect your privacy by:\n- Storing data locally on your device\n- Not sharing personal information with third parties\n- Using data only for health monitoring and coaching\n\nLast updated: January 2025');
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
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-white/80 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Customize your app experience
          </p>
        </div>

        {/* Notification Settings */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Notifications</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-600">Receive alerts for important updates</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('notification')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notification ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notification ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Volume2 className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Sound Effects</p>
                  <p className="text-sm text-gray-600">Play sounds for app interactions</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('sound')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.sound ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.sound ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Legal & Privacy */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Legal & Privacy</h2>
          
          <div className="space-y-4">
            <button
              onClick={openUserAgreement}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <span className="font-medium text-gray-900">User Agreement</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>

            <button
              onClick={openPrivacyPolicy}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-green-600" />
                <span className="font-medium text-gray-900">Privacy Policy</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">App Information</h2>
          <div className="text-center">
            <p className="text-gray-600 mb-2">Corti Track</p>
            <p className="text-sm text-gray-500">Version 1.0.0</p>
            <p className="text-sm text-gray-500 mt-2">© 2025 Corti Track. All rights reserved.</p>
          </div>
        </div>

        {/* Built with Bolt.new */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Development</h2>
          <div className="text-center">
            <a
              href="https://bolt.new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              <span className="mr-2">⚡</span>
              Built with Bolt.new
            </a>
            <p className="text-sm text-gray-500 mt-3">
              Powered by AI-driven development
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;