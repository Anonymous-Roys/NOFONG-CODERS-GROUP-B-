import React, { useState, useEffect } from 'react';
import { Search, Heart, Menu, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';

interface Plant {
  id: string;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  careFrequency: 'Often' | 'Rarely' | 'Weekly';
  category: 'Indoor' | 'Outdoor';
  image: string;
  isFavorite: boolean;
}

const PlantsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Outdoor' | 'Indoor'>('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const data = await apiFetch('/api/plant-library');
      setPlants(data.map((plant: any) => ({
        id: plant._id,
        name: plant.name,
        description: plant.description,
        difficulty: plant.difficulty,
        careFrequency: plant.careFrequency,
        category: plant.category,
        image: plant.image || plant.imageUrl || '/1.png',
        isFavorite: false
      })));
    } catch (err) {
      console.error('Failed to fetch plants:', err);
    } finally {
      setLoading(false);
    }
  };



  const toggleFavorite = (plantId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(plantId)) {
        newFavorites.delete(plantId);
      } else {
        newFavorites.add(plantId);
      }
      return newFavorites;
    });
  };

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || plant.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-4 border-green-200 rounded-full border-t-green-600 animate-spin"></div>
          <p className="text-gray-600">Loading plants...</p>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCareIcon = (frequency: string) => {
    switch (frequency) {
      case 'Often': return '💧';
      case 'Rarely': return '🌵';
      case 'Weekly': return '📅';
      default: return '🌿';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-md px-4 py-4 mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Menu className="w-6 h-6 text-gray-600" />
            <h1 className="text-xl font-bold text-gray-800">Plant Library</h1>
            <Bell className="w-6 h-6 text-gray-600" />
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search plants"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pl-10 pr-12 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2">
            {['All', 'Outdoor', 'Indoor'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Plants List */}
      <div className="max-w-md px-4 py-4 mx-auto">
        <div className="space-y-3">
          {filteredPlants.map((plant) => (
            <div
              key={plant.id}
              onClick={() => {
                setLoadingDetail(true);
                setTimeout(() => {
                  navigate(`/plants/${plant.id}`);
                }, 300);
              }}
              className="duration-200 bg-white border-green-500 shadow-sm cursor-pointer transition-noneion-all border-p-4 rounded-2xl hover:shadow-md"
            >
              <div className="flex items-center space-x-4">
                {/* Plant Image */}
                <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-2xl">
                  <img 
                    src={plant.image} 
                    alt={plant.name}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Plant Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{plant.name}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(plant.id);
                      }}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Heart 
                        className={`w-5 h-5 transition-colors ${
                          favorites.has(plant.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-400 hover:text-red-400'
                        }`} 
                      />
                    </button>
                  </div>

                  <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                    {plant.description}
                  </p>

                  {/* Tags */}
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plant.difficulty)}`}>
                      {plant.difficulty}
                    </span>
                    <div className="flex items-center px-2 py-1 space-x-1 rounded-full bg-gray-50">
                      <span className="text-sm">{getCareIcon(plant.careFrequency)}</span>
                      <span className="text-xs font-medium text-gray-600">{plant.careFrequency}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPlants.length === 0 && (
          <div className="py-16 text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">No plants found</h3>
            <p className="mb-6 text-gray-600">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('All');
              }}
              className="px-6 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-full hover:bg-green-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loadingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 text-center bg-white rounded-2xl">
            <div className="w-8 h-8 mx-auto mb-4 border-4 border-green-200 rounded-full border-t-green-600 animate-spin"></div>
            <p className="text-gray-600">Loading plant details...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantsPage;