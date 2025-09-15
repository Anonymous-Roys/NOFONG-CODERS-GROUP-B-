import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlants } from '../../hooks/usePlants';
import { Button } from '../../components/ui/Button';
import AddPlantModal from '../../components/ui/AddPlantModal';
import { apiFetch } from '../../utils/api';
import { Sprout, ArrowLeft, Clock } from 'lucide-react';

const PlantDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getPlantBySlug } = usePlants();
  const [activeTab, setActiveTab] = useState<'overview' | 'care' | 'explore'>('overview');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [libraryPlant, setLibraryPlant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Try to get plant from library first, then from user plants
  const plant = slug ? getPlantBySlug(slug) : undefined;
  
  // Use library plant if user plant not found
  const displayPlant = plant || libraryPlant;

  useEffect(() => {
   
    const fetchPlantData = async () => {
      if (!plant && slug) {
        try {
          setIsLoading(true);
          setError(null);
          const data = await apiFetch(`/api/plant-library/${slug}`);
          
            setLibraryPlant(data);
            setIsLoading(false);
          
        } catch (err) {
            console.error('Plant not found in library:', err);
            setIsLoading(false);
            setError('Plant not found. It may have been removed or does not exist.');
          
        }
      } else if (plant) {

          setIsLoading(false);
       
      } else if (!slug) {
        // No slug provided
       
          setIsLoading(false);
          setError('No plant specified.');
        
      }
    };

    fetchPlantData();
;
  }, [slug, plant]);

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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="mb-4 animate-pulse">
          <Sprout className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-gray-700">Loading plant information...</h2>
        <p className="mb-6 text-gray-500">This should just take a moment</p>
        <div className="w-64 h-2 overflow-hidden bg-gray-200 rounded-full">
          <div className="h-full bg-green-600 animate-progress"></div>
        </div>
        <div className="flex items-center mt-6 text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          <span className="text-sm">Waiting for plant data</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !displayPlant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="max-w-md text-center">
          <div className="inline-flex p-4 mb-6 bg-red-100 rounded-full">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-800">Unable to load plant</h1>
          <p className="mb-6 text-gray-600">{error || 'The plant you are looking for could not be found.'}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button 
              onClick={() => navigate('/plants')} 
              variant="primary"
              className="flex-1"
            >
              Browse Plants
            </Button>
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline"
              className="flex-1"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main content when plant is loaded
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-md px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="p-2 transition-colors rounded-full hover:bg-gray-100"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">Plant Details</h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-md pb-20 mx-auto bg-white">
        {/* Plant Image */}
        <div className="relative">
          {displayPlant.image ? (
            <img
              src={displayPlant.image}
              alt={displayPlant.name}
              className="object-cover w-full h-64"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/default-plant.jpg';
              }}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-64 bg-green-100">
              <span className="text-8xl">🌿</span>
            </div>
          )}
        </div>

        {/* Plant Info */}
        <div className="p-6">
          <h2 className="mb-2 text-2xl font-bold text-green-600">{displayPlant.name}</h2>
          <p className="mb-4 text-gray-600">{displayPlant.species || 'Plant'}</p>
          
          {displayPlant.description && (
            <p className="mb-4 text-gray-700">
              {showFullDescription ? displayPlant.description : `${displayPlant.description.substring(0, 100)}...`}
              {displayPlant.description.length > 100 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="ml-1 text-green-600 underline"
                >
                  {showFullDescription ? 'view less' : 'view more'}
                </button>
              )}
            </p>
          )}

          {/* Tabs */}
          <div className="flex p-1 mb-6 space-x-1 bg-gray-100 rounded-lg">
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
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Features</h3>
                <div className="space-y-3">
                  {displayPlant.plantType && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plant Type:</span>
                      <span className="font-medium">{displayPlant.plantType}</span>
                    </div>
                  )}
                  {displayPlant.leafType && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Leaf Type:</span>
                      <span className="font-medium">{displayPlant.leafType}</span>
                    </div>
                  )}
                  {displayPlant.fruitColor && displayPlant.fruitColor.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fruit Color:</span>
                      <span className="font-medium">{displayPlant.fruitColor.join(', ')}</span>
                    </div>
                  )}
                  {displayPlant.lifeSpan && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Life Span:</span>
                      <span className="font-medium">{displayPlant.lifeSpan}</span>
                    </div>
                  )}
                  {displayPlant.plantingTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Planting Time:</span>
                      <span className="font-medium">{displayPlant.plantingTime}</span>
                    </div>
                  )}
                  {displayPlant.harvestTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Harvest Time:</span>
                      <span className="font-medium">{displayPlant.harvestTime}</span>
                    </div>
                  )}
                  {(!displayPlant.plantType && !displayPlant.leafType && !displayPlant.fruitColor) && (
                    <p className="py-4 text-center text-gray-500">No overview information available.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Care Instructions</h3>
                {displayPlant.care ? (
                  <div className="space-y-4">
                    {displayPlant.care.water && (
                      <div className="p-4 rounded-lg bg-gray-50">
                        <div className="flex items-center mb-2">
                          <span className="mr-3 text-2xl">{getCareIcon('water')}</span>
                          <h4 className="font-semibold">Water</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          {displayPlant.care.water.drySeason && (
                            <div className="flex items-center">
                              <span className="mr-2">☀️</span>
                              <span>{displayPlant.care.water.drySeason}</span>
                            </div>
                          )}
                          {displayPlant.care.water.rainySeason && (
                            <div className="flex items-center">
                              <span className="mr-2">🌧️</span>
                              <span>{displayPlant.care.water.rainySeason}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {/* Add other care sections similarly */}
                  </div>
                ) : (
                  <p className="py-4 text-center text-gray-500">No care instructions available.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'explore' && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Explore More</h3>
                <div className="p-4 bg-gray-100 rounded-lg">
                  <div className="relative">
                    <div className="flex items-center justify-center w-full h-32 bg-gray-200 rounded-lg">
                      <span className="text-4xl"><img src={plant?.image} alt="" /></span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">How to repot tomatoes</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Plant Button - Only show if plant is from library, not user's collection */}
        {!plant && (
          <div className="sticky bottom-0 p-6 bg-white border-t border-gray-100">
            <Button
              onClick={handleAddPlant}
              variant="primary"
              size="lg"
              className="w-full shadow-lg"
            >
              Add to My Garden
            </Button>
          </div>
        )}
      </div>

      {/* Add Plant Modal */}
      <AddPlantModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
        plantName={displayPlant.name}
        plantSpecies={displayPlant.species || displayPlant.name}
        plantformerId={displayPlant.id || ''}
        plantImageUrl={displayPlant.image || ''}
        plantDescription={displayPlant.description || ''}
      />
    </div>
  );
};

export default PlantDetailPage;