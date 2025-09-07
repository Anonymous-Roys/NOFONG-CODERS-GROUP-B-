// src/pages/PlantsPage/PlantsPage.tsx
import React, { useState } from 'react';
import { Search, Filter, Heart, ArrowRight, Menu, Bell } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface Plant {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'All' | 'Outdoor' | 'Indoor';
  isFavorite?: boolean;
}

const PlantsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Outdoor' | 'Indoor'>('All');

  const plants: Plant[] = [
    {
      id: '1',
      name: 'Aloe Vera',
      description: 'Easy to care for, great for beginners',
      imageUrl: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=200&h=200&fit=crop&crop=center',
      difficulty: 'Easy',
      category: 'Indoor',
      isFavorite: false
    },
    {
      id: '2',
      name: 'Snake Plant',
      description: 'Thrives in low light conditions',
      imageUrl: 'https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?w=200&h=200&fit=crop&crop=center',
      difficulty: 'Easy',
      category: 'Indoor',
      isFavorite: true
    },
    {
      id: '3',
      name: 'Pothos',
      description: 'Fast-growing trailing plant',
      imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=200&h=200&fit=crop&crop=center',
      difficulty: 'Easy',
      category: 'Indoor',
      isFavorite: false
    },
    {
      id: '4',
      name: 'ZZ Plant',
      description: 'Drought tolerant and low maintenance',
      imageUrl: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=200&h=200&fit=crop&crop=center',
      difficulty: 'Easy',
      category: 'Indoor',
      isFavorite: false
    },
    {
      id: '5',
      name: 'Tomato Plant',
      description: 'Popular outdoor vegetable plant',
      imageUrl: 'https://images.unsplash.com/photo-1592841200221-21e1c0d36fb7?w=200&h=200&fit=crop&crop=center',
      difficulty: 'Medium',
      category: 'Outdoor',
      isFavorite: true
    },
    {
      id: '6',
      name: 'Rose Bush',
      description: 'Beautiful flowering outdoor plant',
      imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=200&h=200&fit=crop&crop=center',
      difficulty: 'Medium',
      category: 'Outdoor',
      isFavorite: false
    },
    {
      id: '7',
      name: 'Fiddle Leaf Fig',
      description: 'Popular statement plant for modern homes',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&crop=center',
      difficulty: 'Medium',
      category: 'Indoor',
      isFavorite: false
    },
    {
      id: '8',
      name: 'Monstera Deliciosa',
      description: 'Large tropical plant with split leaves',
      imageUrl: 'https://images.unsplash.com/photo-1509423350716-97f2360af5e0?w=200&h=200&fit=crop&crop=center',
      difficulty: 'Medium',
      category: 'Indoor',
      isFavorite: true
    }
  ];

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || plant.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleToggleFavorite = (plantId: string) => {
    // In a real app, this would update the plant's favorite status
    console.log('Toggle favorite for plant:', plantId);
  };

  const handleViewDetails = (plant: Plant) => {
    // In a real app, this would navigate to plant details
    console.log('View details for plant:', plant.name);
  };

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
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold text-green-600">Plant Library</h1>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
          <Bell className="w-6 h-6 text-gray-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>

      {/* Main Content */}
      <div className="p-5">
        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <Input
                placeholder="Search plants"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" className="px-3">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Category Filters */}
          <div className="flex gap-2">
            {(['All', 'Outdoor', 'Indoor'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Plants Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredPlants.map((plant) => (
            <div key={plant.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="relative mb-3">
                <img 
                  src={plant.imageUrl} 
                  alt={plant.name}
                  className="w-full h-32 rounded-lg object-cover"
                />
                <button
                  onClick={() => handleToggleFavorite(plant.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50"
                >
                  <Heart 
                    className={`w-4 h-4 ${
                      plant.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`} 
                  />
                </button>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 text-sm">{plant.name}</h3>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plant.difficulty)}`}>
                    {plant.difficulty}
                  </span>
                  <button
                    onClick={() => handleViewDetails(plant)}
                    className="p-1.5 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 text-green-600" />
                  </button>
                </div>
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
