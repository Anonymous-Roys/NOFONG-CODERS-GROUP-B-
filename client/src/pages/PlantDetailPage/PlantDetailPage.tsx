import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlants } from '../../hooks/usePlants';
import { Button } from '../../components/ui/Button';
import AddPlantModal from '../../components/ui/AddPlantModal';
import { apiFetch } from '../../utils/api';

const PlantDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getPlantBySlug } = usePlants();
  const [activeTab, setActiveTab] = useState<'overview' | 'care' | 'explore'>('overview');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Try to get plant from library first, then from user plants
  let plant = slug ? getPlantBySlug(slug) : undefined;
  
  // If not found in user plants, try to fetch from plant library
  const [libraryPlant, setLibraryPlant] = useState(null);
  
  useEffect(() => {
    if (!plant && slug) {
      // Try to fetch from plant library API
      const fetchLibraryPlant = async () => {
        try {
          const data = await apiFetch(`/api/plant-library/${slug}`);
          setLibraryPlant(data);
        } catch (err) {
          console.error('Plant not found in library:', err);
        }
      };
      fetchLibraryPlant();
    }
  }, [slug, plant]);
  
  // Use library plant if user plant not found
  const displayPlant = plant || libraryPlant;

  if (!displayPlant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Plant not found</h1>
          <Button onClick={() => navigate('/plants')} variant="primary">
            Back to Plants
          </Button>
        </div>
      </div>
    );
  }

  const handleAddPlant = () => {
    setShowAddModal(true);
  };

  const handleAddSuccess = () => {
    console.log('Plant added successfully!');
  };

  const getCareIcon = (type: string) => {
    switch (type) {
      case 'water': return '💧';
      case 'fertilize': return '🌱';
      case 'humidity': return '☁️';
      case 'pruning': return '✂️';
      case 'sunNeeds': return '☀️';
      case 'repotting': return '🪴';
      default: return '🌿';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-800">Plant Description</h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto bg-white">
        {/* Plant Image */}
        <div className="relative">
          {displayPlant.imageUrl || displayPlant.image ? (
            <img
              src={displayPlant.imageUrl || displayPlant.image}
              alt={displayPlant.name}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-green-100 flex items-center justify-center">
              <span className="text-8xl">🌿</span>
            </div>
          )}
        </div>

        {/* Plant Info */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-green-600 mb-2">{displayPlant.name}</h2>
          <p className="text-gray-600 mb-4">{displayPlant.category || 'Plant'}</p>
          
          <p className="text-gray-700 mb-4">
            {showFullDescription ? displayPlant.description : `${displayPlant.description.substring(0, 100)}...`}
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-green-600 ml-1 underline"
            >
              {showFullDescription ? 'view less' : 'view more'}
            </button>
          </p>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'care', label: 'Care' },
              { key: 'explore', label: 'Explore' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Features</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plant Type:</span>
                    <span className="font-medium">{displayPlant.plantType || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Leaf Type:</span>
                    <span className="font-medium">{displayPlant.leafType || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fruit Color:</span>
                    <span className="font-medium">{displayPlant.fruitColor?.join(', ') || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Life Span:</span>
                    <span className="font-medium">{displayPlant.lifeSpan || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Planting Time:</span>
                    <span className="font-medium">{displayPlant.plantingTime || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Harvest Time:</span>
                    <span className="font-medium">{displayPlant.harvestTime || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Care</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{getCareIcon('water')}</span>
                      <h4 className="font-semibold">Water</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <span className="mr-2">☀️</span>
                        <span>{displayPlant.care?.water?.drySeason || 'Water when soil is dry'}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">🌧️</span>
                        <span>{displayPlant.care?.water?.rainySeason || 'Reduce watering'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'explore' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Explore More</h3>
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="relative">
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-4xl">🍅</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">How to repot tomatoes</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Plant Button */}
        <div className="p-6 bg-white border-t border-gray-100">
          <Button
            onClick={handleAddPlant}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Add Plant
          </Button>
        </div>
      </div>

      {/* Add Plant Modal */}
      <AddPlantModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
        plantName={displayPlant.name}
        plantSpecies={displayPlant.species || displayPlant.name}
      />
    </div>
  );
};

export default PlantDetailPage;