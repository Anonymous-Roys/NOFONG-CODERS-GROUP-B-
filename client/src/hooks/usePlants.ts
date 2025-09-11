import { useState, useEffect } from 'react';
import type { Plant } from '../types';


// Mock data for development
const mockPlants: Plant[] = [
  {
    id: '1',

    slug: 'snake-plant',
    name: 'Snake Plant',
    species: 'Sansevieria trifasciata',
    careLevel: 'easy',
    waterFrequency: 3,
    lastWatered: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    nextWatering: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    description: 'Snake plants are one of the most popular and low-maintenance houseplants. They\'re perfect for beginners and can thrive in low light conditions with minimal care.',
    plantType: 'Succulent',
    leafType: 'Evergreen',
    fruitColor: ['Green'],
    lifeSpan: 'Perennial',
    plantingTime: 'Spring',
    harvestTime: 'N/A',
    care: {
      water: {
        drySeason: 'Water every 2-3 weeks',
        rainySeason: 'Water once a month'
      },
      fertilize: 'Every 2-3 months with diluted fertilizer',
      humidity: 'Low humidity (30-50%)',
      pruning: 'Remove dead or yellow leaves',
      sunNeeds: 'Low to bright indirect light',
      repotting: 'Every 2-3 years when roots fill container'
    },
    diseases: [
      {
        name: 'Root Rot',
        tag: 'Overwatering',
        symptoms: 'Yellowing leaves, mushy roots',
        fix: 'Reduce watering frequency, improve drainage'
      },
      {
        name: 'Mealybugs',
        tag: 'Pest Infestation',
        symptoms: 'White cottony masses on leaves',
        fix: 'Wipe with alcohol-soaked cotton swabs'
      }
    ]
  },
  {
    id: '2',

    slug: 'tomato-de-tropic',
    name: 'Tomato de tropic',
    species: 'Solanum lycopersicum',
    careLevel: 'medium',
    waterFrequency: 3,
    lastWatered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    nextWatering: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    description: 'Tomatoes are one of the most popular and rewarding plants to grow at home. They\'re perfect for salads, sauces, and snacking fresh off the vine.',
    plantType: 'Annual crop',
    leafType: 'Deciduous',
    fruitColor: ['Red', 'Green', 'Orange'],
    lifeSpan: 'One growing season',
    plantingTime: 'All year round',
    harvestTime: 'After 60 - 80 days',
    care: {
      water: {
        drySeason: 'Water 3 times a week',
        rainySeason: 'Water 1 time during the rainy season'
      },
      fertilize: 'Every 2-3 weeks after flowering with balanced fertilizer',
      humidity: 'Prefers moderate humidity (50 - 70%)',
      pruning: 'Remove yellow/dry leaves to improve airflow',
      sunNeeds: 'Full sun, 6 - 8 hrs daily',
      repotting: 'If grown in pots, repot when roots outgrow container'
    },
    diseases: [
      {
        name: 'Early Blight',
        tag: 'Brown Leaf Spots',
        symptoms: 'Brown spots with yellow edges on lower leaves',
        fix: 'Remove infected leaves, avoid overhead watering'
      },
      {
        name: 'Late Blight',
        tag: 'Dark Leaf & Fruit Rot',
        symptoms: 'Large dark patches on leaves and fruit',
        fix: 'Improve airflow, use disease-free seeds, apply fungicide if needed'
      },
      {
        name: 'Fusarium Wilt',
        tag: 'One-Sided Yellowing',
        symptoms: 'Yellowing starting from one side of the plant',
        fix: 'Rotate crops, use resistant tomato varieties'
      },
      {
        name: 'Septoria Leaf Spot',
        tag: 'Tiny Brown Speckles',
        symptoms: 'Tiny brown spots with yellow halos on older leaves',
        fix: 'Prune lower leaves, water at the base'
      }
    ]
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

  const getPlantBySlug = (slug: string): Plant | undefined => {
    return plants.find(plant => plant.slug === slug);
  };

  return {
    plants,
    loading,
    error,
    waterPlant,
    getPlantBySlug,
  };
};