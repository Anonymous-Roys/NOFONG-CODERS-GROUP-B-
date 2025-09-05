// src/pages/PlantsPage/PlantsPage.tsx
import React, { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface Plant {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

const PlantsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const plants: Plant[] = [
    {
      id: '1',
      name: 'Aloe Vera',
      description: 'Easy to care for, great for beginners',
      imageUrl: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=100&h=100&fit=crop&crop=center',
      difficulty: 'Easy',
      category: 'Succulent'
    },
    {
      id: '2',
      name: 'Snake Plant',
      description: 'Thrives in low light conditions',
      imageUrl: 'https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?w=100&h=100&fit=crop&crop=center',
      difficulty: 'Easy',
      category: 'Indoor'
    },
    {
      id: '3',
      name: 'Pothos',
      description: 'Fast-growing trailing plant',
      imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=100&h=100&fit=crop&crop=center',
      difficulty: 'Easy',
      category: 'Trailing'
    },
    {
      id: '4',
      name: 'ZZ Plant',
      description: 'Drought tolerant and low maintenance',
      imageUrl: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=100&h=100&fit=crop&crop=center',
      difficulty: 'Easy',
      category: 'Indoor'
    },
    {
      id: '5',
      name: 'Fiddle Leaf Fig',
      description: 'Popular statement plant for modern homes',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop&crop=center',
      difficulty: 'Medium',
      category: 'Tree'
    },
    {
      id: '6',
      name: 'Monstera Deliciosa',
      description: 'Large tropical plant with split leaves',
      imageUrl: 'https://images.unsplash.com/photo-1509423350716-97f2360af5e0?w=100&h=100&fit=crop&crop=center',
      difficulty: 'Medium',
      category: 'Tropical'
    }
  ];

  const filteredPlants = plants.filter(plant =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plant.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <h1 className="text-xl font-semibold text-primary-800">Plant Library</h1>
        <Button variant="primary" size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Plant
        </Button>
      </div>

      {/* Main Content */}
      <div className="p-5">
        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <Input
              placeholder="Search plants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {/* Plants Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredPlants.map((plant) => (
            <div key={plant.id} className="card">
              <div className="flex items-center gap-4">
                <img 
                  src={plant.imageUrl} 
                  alt={plant.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 mb-1">{plant.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{plant.description}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plant.difficulty)}`}>
                      {plant.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">{plant.category}</span>
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  size="sm"
                  className="flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredPlants.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-800 mb-2">No plants found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantsPage;
