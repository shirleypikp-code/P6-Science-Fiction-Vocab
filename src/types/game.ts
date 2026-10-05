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
  soundEnabled: boolean;
  gamesPlayed: number;
  correctAnswers: number;
}

export type GameMode =
  | 'menu'
  | 'decoder'
  | 'transmission'
  | 'story-cloze'
  | 'asteroid-quiz'
  | 'holo-codex'
  | 'holo-forge'
  | 'hangar';

export interface RankInfo {
  rank: number;
  title: string;
  minXp: number;
  badge: string;
  color: string;
}
