import React from 'react';
import { Button } from '../../ui/Button';
import type { Plant } from '../../../types';

export interface PlantCardProps {
  plant: Plant;
  onWater: (plantId: string) => void;
  onViewDetails: (plantId: string) => void;
}

export const PlantCard: React.FC<PlantCardProps> = ({
  plant,
  onWater,
  onViewDetails
}) => {
  const needsWatering = new Date() > plant.nextWatering;
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-gray-100">
      <div className="relative">
        {plant.imageUrl ? (
          <img 
            src={plant.imageUrl} 
            alt={plant.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-green-100 flex items-center justify-center">
            <span className="text-5xl">🌿</span>
          </div>
        )}
        
        {needsWatering && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Needs Water
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{plant.name}</h3>
        <p className="text-lg text-gray-600 mb-4">{plant.species}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            plant.careLevel === 'easy' ? 'bg-green-100 text-green-800' :
            plant.careLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {plant.careLevel.charAt(0).toUpperCase() + plant.careLevel.slice(1)}
          </span>
          
          <span className="text-lg">
            Water every {plant.waterFrequency} days
          </span>
        </div>
        
        <div className="flex space-x-4">
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => onWater(plant.id)}
            className="flex-1"
          >
            Water Now
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => onViewDetails(plant.id)}
            className="flex-1"
          >
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};