// src/components/layout/AppLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-20"> {/* Padding for bottom navigation */}
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default AppLayout;