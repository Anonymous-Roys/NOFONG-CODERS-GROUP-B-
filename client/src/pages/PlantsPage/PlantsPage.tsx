// src/pages/PlantsPage/PlantsPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Heart, ArrowRight, Menu, Bell } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { usePlants } from '../../hooks/usePlants';

const PlantsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Outdoor' | 'Indoor'>('All');
  const { plants, loading, error } = usePlants();

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // For now, we'll categorize based on plant type or care level
    const isOutdoor = plant.plantType.toLowerCase().includes('outdoor') || 
                     plant.plantType.toLowerCase().includes('crop') ||
                     plant.careLevel === 'medium';
    const isIndoor = plant.plantType.toLowerCase().includes('indoor') || 
                    plant.plantType.toLowerCase().includes('succulent') ||
                    plant.careLevel === 'easy';
    
    const matchesCategory = selectedCategory === 'All' || 
      (selectedCategory === 'Outdoor' && isOutdoor) ||
      (selectedCategory === 'Indoor' && isIndoor);
    
    return matchesSearch && matchesCategory;
  });

  const handleToggleFavorite = (plantId: string) => {
    // In a real app, this would update the plant's favorite status
    console.log('Toggle favorite for plant:', plantId);
  };

  const getDifficultyColor = (careLevel: string) => {
    switch (careLevel) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'difficult': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
                {plant.imageUrl ? (
                  <img 
                    src={plant.imageUrl} 
                    alt={plant.name}
                    className="w-full h-32 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">🌿</span>
                  </div>
                )}
                <button
                  onClick={() => handleToggleFavorite(plant.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50"
                >
                  <Heart className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 text-sm">{plant.name}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{plant.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plant.careLevel)}`}>
                    {plant.careLevel.charAt(0).toUpperCase() + plant.careLevel.slice(1)}
                  </span>
                  <button
                    onClick={() => navigate(`/plants/${plant.slug}`)}
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
