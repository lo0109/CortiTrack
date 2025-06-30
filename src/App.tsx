import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import BottomNavigation from './components/Layout/BottomNavigation';
import SplashScreen from './components/SplashScreen';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ReportPage from './pages/ReportPage';
import TrainingPage from './pages/TrainingPage';
import TeamEditPage from './pages/TeamEditPage';
import AthleteDetailPage from './pages/AthleteDetailPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminGaugesPage from './pages/AdminGaugesPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Show splash screen on first load
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    } else {
      sessionStorage.setItem('hasSeenSplash', 'true');
    }
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/home" />} />
          <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/home" />} />
          <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
          
          <Route path="/home" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />

          <Route path="/report" element={
            <ProtectedRoute>
              <ReportPage />
            </ProtectedRoute>
          } />

          <Route path="/training" element={
            <ProtectedRoute>
              <TrainingPage />
            </ProtectedRoute>
          } />

          <Route path="/team/edit" element={
            <ProtectedRoute>
              <TeamEditPage />
            </ProtectedRoute>
          } />

          <Route path="/athlete/:id" element={
            <ProtectedRoute>
              <AthleteDetailPage />
            </ProtectedRoute>
          } />

          <Route path="/admin/users" element={
            <ProtectedRoute>
              <AdminUsersPage />
            </ProtectedRoute>
          } />

          <Route path="/admin/gauges" element={
            <ProtectedRoute>
              <AdminGaugesPage />
            </ProtectedRoute>
          } />
        </Routes>
        
        {user && <BottomNavigation />}
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;