export type Category =
  | 'Literary & Genres'
  | 'Story & Science'
  | 'Space & Stars'
  | 'Cybernetics & AI'
  | 'Cosmic Physics'
  | 'Future Worlds';

export interface VocabWord {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective';
  category: Category;
  definition: string;
  sentence: string;
  origin: string;
  synonyms: string[];
  hint: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'progress' | 'mastery' | 'skill';
}

export interface ShipCustomization {
  id: string;
  name: string;
  type: 'hull' | 'pet' | 'shield';
  price: number;
  description: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  colorHex: string;
}

export interface TechUpgradeLevel {
  level: number;
  title: string;
  cost: number;
  effectDescription: string;
  multiplier?: number;
  bonusValue?: number;
}

export interface TechUpgrade {
  id: string;
  name: string;
  category: 'efficiency' | 'defense' | 'rewards' | 'chronos';
  icon: string;
  description: string;
  maxLevel: number;
  levels: TechUpgradeLevel[];
}

export interface PlayerProfile {
  name: string;
  xp: number;
  credits: number;
  streak: number;
  highestStreak: number;
  wordsMastered: string[];
  unlockedShips: string[];
  currentShip: string;
  unlockedPets: string[];
  currentPet: string;
  unlockedShields: string[];
  currentShield: string;
  unlockedBadges: string[];
  upgrades: Record<string, number>; // upgradeId -> level (1-based)
  soundEnabled: boolean;
  gamesPlayed: number;
  correctAnswers: number;
}

export interface SquadPlayer {
  id: string;
  name: string;
  avatar: string;
  shipId: string;
  role: 'Commander' | 'Science Officer' | 'Chief Engineer' | 'Navigator';
  score: number;
  streak: number;
  correctAnswers: number;
}

export type GameMode =
  | 'menu'
  | 'decoder'
  | 'transmission'
  | 'story-cloze'
  | 'asteroid-quiz'
  | 'word-hunter'
  | 'falling-words'
  | 'memory-matrix'
  | 'multiplayer'
  | 'holo-codex'
  | 'hangar'
  | 'upgrades';

export interface RankInfo {
  rank: number;
  title: string;
  minXp: number;
  badge: string;
  color: string;
}
