import React from 'react';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  showLogo = true 
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      {/* Logo */}
      {showLogo && (
        <div className="flex items-center justify-center">
          <img
            src="/ChatGPT Image Jun 29, 2025, 12_08_33 PM copy.png"
            alt="CortiTrack Logo"
            className="object-contain"
            style={{ height: '10vh' }}
          />
        </div>
      )}
      
      {/* Title and Subtitle */}
      {(title || subtitle) && (
        <div className="flex-1 ml-4">
          {title && (
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
          )}
          {subtitle && (
            <p className="text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PageHeader;