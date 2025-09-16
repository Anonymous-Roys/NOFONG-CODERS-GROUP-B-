import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, showBack = true, rightElement }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="w-10">
          {showBack && (
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
          )}
        </div>
        <h1 className="text-xl font-semibold text-green-600">{title}</h1>
        <div className="w-10 flex justify-end">
          {rightElement}
        </div>
      </div>
    </div>
  );
};

export default AppHeader;