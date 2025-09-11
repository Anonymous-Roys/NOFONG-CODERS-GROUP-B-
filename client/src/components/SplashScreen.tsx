import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Total animation duration: 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for fade out animation to complete before calling onComplete
      setTimeout(onComplete, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="splash-screen">
      <div className="splash-logo-container">
        <img 
          src={logo} 
          alt="Nofong Logo" 
          className="splash-logo"
        />
      </div>
    </div>
  );
};

export default SplashScreen;

