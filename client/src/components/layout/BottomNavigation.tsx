// src/components/layout/BottomNavigation.tsx
import React, { useState } from 'react';
import { Home, Book, PenTool, User, Sprout } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BottomNavigation.css';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { path: '/garden', icon: Sprout, label: 'My Garden' },
    { path: '/plants', icon: Book, label: 'Plant library' },
    { path: '/', icon: Home, label: 'Home' },
    { path: '/journal', icon: PenTool, label: 'Journal' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const [clickedItem, setClickedItem] = useState<string | null>(null);

  // Enhanced haptic feedback function
  const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(50);
          break;
        case 'heavy':
          navigator.vibrate([50, 30, 50]);
          break;
      }
    }
  };

  const handleNavigation = (path: string) => {
    setClickedItem(path);
    triggerHapticFeedback(path === '/' ? 'medium' : 'light');
    
    // Reset clicked state after animation
    setTimeout(() => {
      setClickedItem(null);
    }, 300);
    
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
      <nav className="fixed bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100/50 px-2 py-1">
      <div className="flex items-end justify-around relative pb-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const isHome = item.path === '/';
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`relative flex flex-col items-center gap-1 transition-all duration-300 ease-out transform ripple-effect ${
                isHome 
                  ? 'z-10 home-button -mt-10' 
                  : 'min-w-[60px] nav-item'
              } ${clickedItem === item.path ? 'scale-95' : ''}`}
              aria-label={item.label}
            >
              {isHome ? (
                // Special elevated Home button
                <div className={`relative transition-all duration-300 ease-out ${
                  active ? 'scale-110' : 'scale-100'
                }`}>
                  <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 home-button-elevated ${
                    active 
                      ? 'bg-green-600 border-green-600 shadow-lg shadow-green-200 active' 
                      : 'bg-white border-green-600 shadow-md'
                  }`}>
                    <Icon className={`w-6 h-6 transition-colors duration-300 ${
                      active ? 'text-white' : 'text-green-600'
                    }`} />
                  </div>
                  {/* Elevated background effect */}
                  <div className={`absolute -inset-1 rounded-full transition-all duration-300 ${
                    active 
                      ? 'bg-green-100 scale-110' 
                      : 'bg-transparent scale-100'
                  }`} />
                </div>
              ) : (
                // Regular navigation items
                <div className={`p-2 rounded-xl transition-all duration-300 active-glow ${
                  active 
                    ? 'scale-105 active' 
                    : 'hover:bg-gray-50 scale-100'
                }`}>
                  <Icon className={`w-6 h-6 transition-colors duration-300 ${
                    active 
                      ? 'text-green-600' 
                      : 'text-gray-500'
                  }`} />
                </div>
              )}
              
              <span className={`text-xs font-medium transition-colors duration-300 ${
                active 
                  ? 'text-green-600' 
                  : 'text-gray-500'
              }`}>
                {item.label}
              </span>
              
              {/* Ripple effect */}
              <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                active 
                  ? 'bg-green-100 scale-150 opacity-0' 
                  : 'bg-transparent scale-100 opacity-0'
              }`} />
            </button>
          );
        })}
      </div>
      </nav>
    </>
  );
};

export default BottomNavigation;