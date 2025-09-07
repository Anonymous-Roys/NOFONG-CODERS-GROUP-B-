// src/pages/ProfilePage/ProfilePage.tsx
import React from 'react';
import { User, Settings, Bell, HelpCircle, LogOut, Award, Calendar, Sprout } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const ProfilePage: React.FC = () => {
  const stats = [
    { label: 'Plants Owned', value: '12', icon: Sprout },
    { label: 'Days Active', value: '45', icon: Calendar },
    { label: 'Tasks Completed', value: '89', icon: Award }
  ];

  const menuItems = [
    { icon: Settings, label: 'Settings', description: 'App preferences and notifications' },
    { icon: Bell, label: 'Notifications', description: 'Manage your notification preferences' },
    { icon: HelpCircle, label: 'Help & Support', description: 'Get help and contact support' },
    { icon: LogOut, label: 'Sign Out', description: 'Sign out of your account' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-gray-100">
        <h1 className="text-xl font-semibold text-primary-800">Profile</h1>
      </div>

      {/* Main Content */}
      <div className="p-5">
        {/* Profile Header */}
        <div className="card mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Plant Lover</h2>
              <p className="text-gray-600">plant.lover@example.com</p>
              <p className="text-sm text-gray-500">Member since January 2024</p>
            </div>
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className="card w-full text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-1">{item.label}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* App Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">Plant Care App</p>
          <p className="text-xs text-gray-400">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
