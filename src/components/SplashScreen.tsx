import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'linear-gradient(to bottom, #3529cb, #800080)'
      }}
    >
      <div className="text-center">
        {/* App Icon */}
        <div className="mb-8 animate-pulse">
          <img
            src="/ChatGPT Image Jun 29, 2025, 12_08_33 PM.png"
            alt="Corti Track"
            className="w-32 h-32 mx-auto rounded-3xl shadow-2xl"
          />
        </div>

        {/* App Name */}
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-white mb-2">CortiTrack</h1>
          <p className="text-xl text-white/90 font-medium">
            Strength. Performance. Improvement.
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center items-center mt-8">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Built with Bolt.new Badge */}
        <div className="mt-12">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/80 text-sm">
            <span className="mr-2">⚡</span>
            Built with Bolt.new
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;