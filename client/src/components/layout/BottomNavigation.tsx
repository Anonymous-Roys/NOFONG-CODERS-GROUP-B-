// src/components/layout/BottomNavigation.tsx
import React from 'react';
import { Home, Leaf, User, BookOpen, PenTool } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { path: '/garden', icon: Leaf, label: 'My Garden' },
    { path: '/plants', icon: BookOpen, label: 'Plant library' },
    { path: '/', icon: Home, label: 'Home' },
    { path: '/journal', icon: PenTool, label: 'Journal' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg">
        {/* Purple accent line */}
        <div className="h-1 bg-purple-500 w-full"></div>
        
        <div className="flex items-center justify-around px-2 py-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 p-2 transition-all duration-200 min-w-[60px] ${
                  active ? 'text-green-600' : 'text-black hover:text-gray-600'
                }`}
                aria-label={item.label}
              >
                <div className={`w-8 h-8 flex items-center justify-center transition-all duration-200 ${
                  active 
                    ? 'bg-green-600 rounded-full shadow-lg' 
                    : ''
                }`}>
                  <Icon className={`w-5 h-5 ${
                    active ? 'text-white' : 'text-black'
                  }`} />
                </div>
                <span className={`text-xs font-medium ${
                  active ? 'text-green-600' : 'text-black'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
          
        </div>
      </nav>
    </>
  );
};

export default BottomNavigation;