// src/pages/ProfilePage/ProfilePage.tsx
import React from 'react';
import { User, Leaf, Bell, FileText, HelpCircle, Settings, ChevronRight, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const menuItems = [
    { icon: User, label: 'My Account', path: '/profile/account' },
    { icon: Leaf, label: 'My Garden', path: '/garden' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: Bell, label: 'Notifications', path: '/profile/notifications' },
    { icon: FileText, label: 'Privacy Policy', path: '/profile/privacy' },
    { icon: HelpCircle, label: 'Help Center', path: '/profile/help' },
    { icon: Settings, label: 'Settings', path: '/profile/settings' }
  ];

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-green-600">Profile</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Profile Section */}
        <div className="text-center mb-8">
          {/* Avatar */}
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
              <span className="text-3xl">👩🏽</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-xs text-white">✓</span>
            </div>
          </div>
          
          {/* User Info */}
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{user?.name || 'Guest'}</h2>
          {user?.email && <p className="text-gray-600">{user.email}</p>}
          {!user?.email && <p className="text-gray-600">{user?.id ? 'Logged in' : 'Not logged in'}</p>}
          <button onClick={()=>{ logout(); navigate('/login'); }} className="mt-4 px-5 py-2 rounded-full border text-red-600 border-red-300 hover:bg-red-50">Log out</button>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between hover:shadow-md hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-gray-800 font-medium">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
