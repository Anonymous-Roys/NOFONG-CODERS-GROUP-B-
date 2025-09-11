import { useState, useEffect } from 'react';
import type { Plant } from '../types';


// Mock data for development
const mockPlants: Plant[] = [
  {
    id: '1',
    name: 'Maize',
    species: 'Zea mays',
    careLevel: 'easy',
    waterFrequency: 3,
    lastWatered: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    nextWatering: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
  {
    id: '2',
    name: 'Tomato',
    species: 'Solanum lycopersicum',
    careLevel: 'medium',
    waterFrequency: 2,
    lastWatered: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    nextWatering: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  },
  {
    id: '3',
    name: 'Tomato',
    species: 'Solanum lycopersicum',
    careLevel: 'medium',
    waterFrequency: 2,
    lastWatered: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    nextWatering: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    name: 'Tomato',
    species: 'Solanum lycopersicum',
    careLevel: 'medium',
    waterFrequency: 2,
    lastWatered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    nextWatering: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '5',
    name: 'Tomato',
    species: 'Solanum lycopersicum',
    careLevel: 'medium',
    waterFrequency: 2,
    lastWatered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    nextWatering: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '6',
    name: 'Tomato',
    species: 'Solanum lycopersicum',
    careLevel: 'medium',
    waterFrequency: 2,
    lastWatered: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    nextWatering: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
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