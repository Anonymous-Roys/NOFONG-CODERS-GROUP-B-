import React from 'react';
import { Home, Book, CheckSquare, User, Sprout } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BottomNavigation.css';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    { path: '/garden', icon: Sprout, label: 'Garden' },
    { path: '/plants', icon: Book, label: 'Plants' },
    { path: '/', icon: Home, label: 'Home' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const handleClick = (path: string) => {
    if (location.pathname !== path) {
      if ('vibrate' in navigator) navigator.vibrate(25);
      navigate(path);
    }
  };

  const isActive = (path: string) => 
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-20 pointer-events-none bg-gradient-to-t from-white/80 to-transparent" />
      <nav className="fixed px-3 py-2 border shadow-xl bottom-4 left-4 right-4 bg-white/95 backdrop-blur-lg rounded-2xl border-gray-200/50">
        <div className="relative flex items-end justify-around">
          {items.map(({ path, icon: Icon, label }) => {
            const active = isActive(path);
            const isHome = path === '/';
            
            return (
              <button
                key={path}
                onClick={() => handleClick(path)}
                className={`relative flex flex-col items-center gap-1 transition-all duration-200 ${
                  isHome ? 'z-10 -mt-8' : 'min-w-[60px] hover:scale-105'
                }`}
                aria-label={`Navigate to ${label}`}
              >
                {isHome ? (
                  <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    active 
                      ? 'bg-green-600 border-green-600 shadow-lg' 
                      : 'bg-white border-green-500 shadow-md'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      active ? 'text-white' : 'text-green-600'
                    }`} />
                  </div>
                ) : (
                  <div className={`p-3 rounded-xl transition-all duration-200 ${
                    active ? 'bg-green-50' : 'hover:bg-gray-50'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      active ? 'text-green-600' : 'text-gray-500'
                    }`} />
                  </div>
                )}
                
                <span className={`text-xs font-medium ${
                  active ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {label}
                </span>
                
                {active && !isHome && (
                  <div className="absolute w-1 h-1 bg-green-600 rounded-full -bottom-1" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNavigation;