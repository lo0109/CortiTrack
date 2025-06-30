import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface StatusIndicatorProps {
  status: 'good' | 'warning' | 'alert';
  size?: 'sm' | 'md' | 'lg';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const statusConfig = {
    good: { icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-100' },
    warning: { icon: AlertTriangle, color: 'text-orange-500', bgColor: 'bg-orange-100' },
    alert: { icon: AlertCircle, color: 'text-red-500', bgColor: 'bg-red-100' }
  };

  const { icon: Icon, color, bgColor } = statusConfig[status];

  return (
    <div className={`inline-flex items-center justify-center rounded-full p-1 ${bgColor}`}>
      <Icon className={`${sizeClasses[size]} ${color}`} />
    </div>
  );
};

export default StatusIndicator;