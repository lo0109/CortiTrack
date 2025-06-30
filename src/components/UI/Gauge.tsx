import React from 'react';
import { getGaugeSettings } from '../../utils/database';

interface GaugeProps {
  value: number;
  min: number;
  max: number;
  label: string;
  unit?: string;
  onClick?: () => void;
  metricType?: 'stress_level' | 'heart_rate' | 'blood_oxygen_lv' | 'sleep_quality';
}

const Gauge: React.FC<GaugeProps> = ({ 
  value, 
  min, 
  max, 
  label, 
  unit = '', 
  onClick,
  metricType = 'stress_level'
}) => {
  const percentage = Math.min(Math.max((value - min) / (max - min) * 100, 0), 100);
  const gaugeSettings = getGaugeSettings();
  
  const getColor = (percentage: number) => {
    const colors = gaugeSettings[metricType]?.colors || {
      low: '#10b981',
      medium: '#f59e0b', 
      high: '#ef4444'
    };

    if (percentage <= 33) return colors.low;
    if (percentage <= 66) return colors.medium;
    return colors.high;
  };

  const strokeColor = getColor(percentage);

  return (
    <div 
      className={`relative w-32 h-32 ${onClick ? 'cursor-pointer' : ''} transform transition-transform hover:scale-105`}
      onClick={onClick}
    >
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${percentage * 2.83} 283`}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          className="text-2xl font-bold transition-colors duration-500"
          style={{ color: strokeColor }}
        >
          {Math.round(value)}
        </span>
        <span className="text-xs text-gray-500">{unit}</span>
      </div>
      <div className="absolute -bottom-6 left-0 right-0 w-32">
        <span className="block text-sm font-medium text-gray-700 text-center w-full">{label}</span>
      </div>
    </div>
  );
};

export default Gauge;