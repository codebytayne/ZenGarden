
export type Language = 'en' | 'pt' | 'es';

export type PlantStage = 'Seed' | 'Sprout' | 'Sapling' | 'Mature' | 'Ancient';

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  lore: string;
  stage: PlantStage;
  rarity: 'Common' | 'Rare' | 'Legendary' | 'Mythic';
  focusMinutes: number;
  imageUrl: string;
  discoveredAt: number;
}

export interface UserStats {
  totalFocusTime: number; // in minutes
  sunlight: number;
  currentStreak: number;
  bestStreak: number;
  plantsGrown: number;
}

export interface FocusSession {
  duration: number; // minutes
  type: 'Focus' | 'Short Break' | 'Long Break';
  completed: boolean;
  startTime: number;
}
