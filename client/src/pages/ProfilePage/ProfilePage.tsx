// src/pages/ProfilePage/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { User, Bell, HelpCircle, Settings, ChevronRight, CheckSquare, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../utils/api';
import LoadingScreen from '../../components/LoadingScreen';
import AppHeader from '../../components/AppHeader';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await apiFetch('/profile');
        setUserDetails(data);
      } catch (err) {
        console.error('Failed to fetch user details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);
  
  const menuItems = [
    { icon: User, label: 'My Account', path: '/coming-soon' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: Bell, label: 'Notifications', path: '/coming-soon' },
    { icon: HelpCircle, label: 'Help Center', path: '/coming-soon' },
    { icon: Settings, label: 'Settings', path: '/coming-soon' }
  ];

  return (
    <div className="min-h-screen bg-green-50">
      <AppHeader title="Profile" />

      {/* Main Content */}
      <div className="p-6">
        {/* Profile Section */}
        <div className="mb-8 text-center">
          {/* Avatar */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="flex items-center justify-center w-full h-full rounded-full shadow-lg bg-gradient-to-br from-green-400 to-green-600">
              <span className="text-3xl">👩🏽</span>
            </div>
            <div className="absolute flex items-center justify-center w-6 h-6 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1">
              <span className="text-xs text-white">✓</span>
            </div>
          </div>
          
          {/* User Info */}
          {loading ? (
            <LoadingScreen />
          ) : (
            <>
              <h2 className="mb-1 text-2xl font-bold text-gray-800">{userDetails?.username || 'Guest'}</h2>
              <p className="text-gray-600">{userDetails?.phone}</p>
              {/* {userDetails?.dateOfBirth && (
                <p className="text-gray-600">Born: {new Date(userDetails.dateOfBirth).toLocaleDateString()}</p>
              )}
              {userDetails?.location && (
                <p className="text-gray-600">📍 {userDetails.location}</p>
              )}
              {userDetails?.gender && (
                <p className="text-gray-600">Gender: {userDetails.gender}</p>
              )} */}
            </>
          )}
          <button onClick={()=>{ logout(); navigate('/login'); }} className="px-5 py-2 mt-4 text-red-600 border border-red-300 rounded-full hover:bg-red-50">Log out</button>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className="flex items-center justify-between w-full p-4 transition-all duration-200 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-800">{item.label}</span>
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
