// Common types
export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
  }
  
  // Plant-related types
  export interface Plant {
    id: string;
    slug: string;
    name: string;
    species: string;
    careLevel: 'easy' | 'medium' | 'difficult';
    waterFrequency: number;
    lastWatered: Date;
    nextWatering: Date;
    imageUrl?: string;
    image?: string; // base64 image string
    notes?: string;
    addedAt?: Date;
    gardenId?: string;
    description: string;
    plantType: string;
    leafType: string;
    fruitColor: string[];
    lifeSpan: string;
    plantingTime: string;
    harvestTime: string;
    care: {
      water: {
        drySeason: string;
        rainySeason: string;
      };
      fertilize: string;
      humidity: string;
      pruning: string;
      sunNeeds: string;
      repotting: string;
    };
    diseases: {
      name: string;
      tag: string;
      symptoms: string;
      fix: string;
      imageUrl?: string;
    }[];
  }
  
  export interface CareTask {
    id: string;
    plantId: string;
    type: 'water' | 'fertilize' | 'prune' | 'repot';
    dueDate: Date;
    completed: boolean;
    isLate?: boolean;
    daysLate?: number;
  }

  export interface TaskType {
    id: 'water' | 'fertilize' | 'prune' | 'repot';
    label: string;
    icon: string;
  }
  
  // User types
  export interface User {
    id: string;
    name: string;
    email: string;
    preferences: UserPreferences;
  }
  
  export interface UserPreferences {
    fontSize: 'normal' | 'large' | 'x-large';
    contrast: 'normal' | 'high';
    reducedMotion: boolean;
    notifications: boolean;
  }