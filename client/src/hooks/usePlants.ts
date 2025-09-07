import { useState, useEffect } from 'react';
import type { Plant } from '../types';


// Mock data for development
const mockPlants: Plant[] = [
  {
    id: '1',
    name: 'Snake Plant',
    species: 'Sansevieria trifasciata',
    careLevel: 'easy',
    waterFrequency: 14,
    lastWatered: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    nextWatering: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
  {
    id: '2',
    name: 'Peace Lily',
    species: 'Spathiphyllum',
    careLevel: 'medium',
    waterFrequency: 7,
    lastWatered: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    nextWatering: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  },
];

export const usePlants = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchPlants = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPlants(mockPlants);
      } catch (err) {
        setError('Failed to load plants');
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  const waterPlant = (plantId: string) => {
    setPlants(prevPlants => 
      prevPlants.map(plant => 
        plant.id === plantId 
          ? { 
              ...plant, 
              lastWatered: new Date(),
              nextWatering: new Date(Date.now() + plant.waterFrequency * 24 * 60 * 60 * 1000)
            } 
          : plant
      )
    );
  };

  return {
    plants,
    loading,
    error,
    waterPlant,
  };
};