import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import CoachHomePage from './CoachHomePage';
import AthleteHomePage from './AthleteHomePage';
import AdminHomePage from './AdminHomePage';
import HealthcareProviderHomePage from './HealthcareProviderHomePage';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const pageStyle = { 
    background: 'linear-gradient(to bottom, #3529cb, #800080)'
  };

  switch (user.role) {
    case 'coach':
      return <div style={pageStyle}><CoachHomePage /></div>;
    case 'athlete':
      return <div style={pageStyle}><AthleteHomePage /></div>;
    case 'admin':
      return <div style={pageStyle}><AdminHomePage /></div>;
    case 'healthcare_provider':
      return <div style={pageStyle}><HealthcareProviderHomePage /></div>;
    default:
      return <div style={pageStyle}><AthleteHomePage /></div>;
  }
};

export default HomePage;