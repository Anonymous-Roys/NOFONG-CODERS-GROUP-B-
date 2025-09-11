import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlants } from '../../hooks/usePlants';
import { Button } from '../../components/ui/Button';

const PlantDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getPlantBySlug, waterPlant } = usePlants();
  const [activeTab, setActiveTab] = useState<'overview' | 'care' | 'explore'>('overview');
  const [showFullDescription, setShowFullDescription] = useState(false);

  const plant = slug ? getPlantBySlug(slug) : undefined;

  if (!plant) {
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

  const handleWaterPlant = () => {
    waterPlant(plant.id);
  };

  const getCareIcon = (type: string) => {
    switch (type) {
      case 'water':
        return '💧';
      case 'fertilize':
        return '🌱';
      case 'humidity':
        return '☁️';
      case 'pruning':
        return '✂️';
      case 'sunNeeds':
        return '☀️';
      case 'repotting':
        return '🪴';
      default:
        return '🌿';
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
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto bg-white">
        {/* Plant Image */}
        <div className="relative">
          {plant.imageUrl ? (
            <img
              src={plant.imageUrl}
              alt={plant.name}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-green-100 flex items-center justify-center">
              <span className="text-8xl">🍅</span>
            </div>
          )}
        </div>

        {/* Plant Info */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-green-600 mb-2">{plant.name}</h2>
          <p className="text-gray-600 mb-4">Outdoor plant</p>
          
          <p className="text-gray-700 mb-4">
            {showFullDescription ? plant.description : `${plant.description.substring(0, 100)}...`}
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
              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Features</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plant Type:</span>
                    <span className="font-medium">{plant.plantType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Leaf Type:</span>
                    <span className="font-medium">{plant.leafType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fruit Color:</span>
                    <span className="font-medium">{plant.fruitColor.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Life Span:</span>
                    <span className="font-medium">{plant.lifeSpan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Planting Time:</span>
                    <span className="font-medium">{plant.plantingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Harvest Time:</span>
                    <span className="font-medium">{plant.harvestTime}</span>
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
                  {/* Water */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{getCareIcon('water')}</span>
                      <h4 className="font-semibold">Water</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <span className="mr-2">☀️</span>
                        <span>{plant.care.water.drySeason}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">🌧️</span>
                        <span>{plant.care.water.rainySeason}</span>
                      </div>
                    </div>
                    <button className="text-green-600 text-sm mt-2 underline">
                      Click to learn how to water
                    </button>
                  </div>

                  {/* Fertilize */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{getCareIcon('fertilize')}</span>
                      <h4 className="font-semibold">Fertilize</h4>
                    </div>
                    <p className="text-sm mb-2">{plant.care.fertilize}</p>
                    <button className="text-green-600 text-sm underline">
                      Click to learn how to fertilize
                    </button>
                  </div>

                  {/* Humidity */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{getCareIcon('humidity')}</span>
                      <h4 className="font-semibold">Humidity</h4>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">💧</span>
                      <span className="text-sm">{plant.care.humidity}</span>
                    </div>
                  </div>

                  {/* Pruning */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{getCareIcon('pruning')}</span>
                      <h4 className="font-semibold">Pruning</h4>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="mr-2">🌿</span>
                      <span className="text-sm">{plant.care.pruning}</span>
                    </div>
                    <button className="text-green-600 text-sm underline">
                      Click to learn how to prune
                    </button>
                  </div>

                  {/* Sun Needs */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{getCareIcon('sunNeeds')}</span>
                      <h4 className="font-semibold">Sun needs</h4>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">☀️</span>
                      <span className="text-sm">{plant.care.sunNeeds}</span>
                    </div>
                  </div>

                  {/* Repotting */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{getCareIcon('repotting')}</span>
                      <h4 className="font-semibold">Repotting</h4>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📦</span>
                      <span className="text-sm">{plant.care.repotting}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explore More */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Explore More</h3>
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="relative">
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-4xl">🍅</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-3">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">How to repot tomatoes</p>
                </div>
              </div>

              {/* Most Common Diseases */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Common Diseases</h3>
                <div className="space-y-4">
                  {plant.diseases.map((disease, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🍅</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-800">{disease.name}</h4>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              {disease.tag}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Symptoms:</strong> {disease.symptoms}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Fix:</strong> {disease.fix}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'explore' && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Explore More</h3>
                <p className="text-gray-600">Discover more about {plant.name} and related plants</p>
              </div>
            </div>
          )}
        </div>

        {/* Add Plant Button */}
        <div className="p-6 bg-white border-t border-gray-100">
          <Button
            onClick={handleWaterPlant}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Add Plant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlantDetailPage;
