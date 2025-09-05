// src/pages/GardenPage/GardenPage.tsx
import React from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const GardenPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <h1 className="text-xl font-semibold text-primary-800">My Garden</h1>
        <Button variant="primary" size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Plant
        </Button>
      </div>

      {/* Main Content */}
      <div className="p-5">
        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <Input
            placeholder="Search your plants..."
            className="pl-12"
          />
        </div>

        {/* Empty State */}
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Your garden is empty</h2>
          <p className="text-gray-600 mb-6">Start building your plant collection by adding your first plant!</p>
          <Button variant="primary" className="flex items-center gap-2 mx-auto">
            <Plus className="w-5 h-5" />
            Add Your First Plant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GardenPage;
