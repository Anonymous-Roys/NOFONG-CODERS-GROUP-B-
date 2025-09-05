// Common types
export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
  }
  
  // Plant-related types
  export interface Plant {
    id: string;
    name: string;
    species: string;
    careLevel: 'easy' | 'medium' | 'difficult';
    waterFrequency: number;
    lastWatered: Date;
    nextWatering: Date;
    imageUrl?: string;
  }
  
  export interface CareTask {
    id: string;
    plantId: string;
    type: 'water' | 'fertilize' | 'prune' | 'repot';
    dueDate: Date;
    completed: boolean;
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