import { PlayerProfile, RankInfo } from '../types/game';
import { RANKS } from '../data/vocabulary';

const STORAGE_KEY = 'cosmic_lexicon_player_profile_v1';

export const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Cadet Nova',
  xp: 150,
  credits: 200,
  streak: 0,
  highestStreak: 0,
  wordsMastered: [],
  unlockedShips: ['ship-scout'],
  currentShip: 'ship-scout',
  unlockedPets: ['pet-none'],
  currentPet: 'pet-none',
  unlockedShields: ['shield-cyan'],
  currentShield: 'shield-cyan',
  unlockedBadges: [],
  upgrades: {
    'ion-cannons': 1,
    'deflector-hull': 1,
    'tachyon-scanner': 1,
    'chrono-warp': 1,
    'quantum-core': 1
  },
  soundEnabled: true,
  gamesPlayed: 0,
  correctAnswers: 0
};

export function loadPlayerProfile(): PlayerProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      upgrades: {
        ...DEFAULT_PROFILE.upgrades,
        ...(parsed.upgrades || {})
      }
    };
  } catch (e) {
    console.warn('Failed to load profile', e);
    return DEFAULT_PROFILE;
  }
}

export function savePlayerProfile(profile: PlayerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Failed to save profile', e);
  }
}

export function getPlayerRank(xp: number): RankInfo {
  let currentRank = RANKS[0];
  for (const rank of RANKS) {
    if (xp >= rank.minXp) {
      currentRank = rank;
    }
  }
  return currentRank;
}

export function getNextRank(xp: number): { nextRank: RankInfo | null; xpNeeded: number; progressPercent: number } {
  const current = getPlayerRank(xp);
  const next = RANKS.find(r => r.rank === current.rank + 1) || null;
  if (!next) {
    return { nextRank: null, xpNeeded: 0, progressPercent: 100 };
  }
  const currentTierBase = current.minXp;
  const nextTierTarget = next.minXp;
  const progressInTier = Math.max(0, xp - currentTierBase);
  const tierSpan = nextTierTarget - currentTierBase;
  const progressPercent = Math.min(100, Math.round((progressInTier / tierSpan) * 100));
  const xpNeeded = Math.max(0, nextTierTarget - xp);
  return { nextRank: next, xpNeeded, progressPercent };
}
