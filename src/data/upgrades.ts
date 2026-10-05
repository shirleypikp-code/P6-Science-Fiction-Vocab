import { TechUpgrade } from '../types/game';

export const TECH_UPGRADES: TechUpgrade[] = [
  {
    id: 'ion-cannons',
    name: 'Plasma Credit Booster',
    category: 'rewards',
    icon: '⚡',
    description: 'Calibrates particle collectors to extract bonus Cosmic Credits from solved vocabulary transmissions.',
    maxLevel: 3,
    levels: [
      {
        level: 1,
        title: 'Mk-I Ion Collector',
        cost: 0,
        effectDescription: 'Standard issue credit extraction rate (1.0x baseline).',
        multiplier: 1.0
      },
      {
        level: 2,
        title: 'Overcharged Ion Coils',
        cost: 250,
        effectDescription: '+25% bonus Cosmic Credits awarded across all mini games and missions.',
        multiplier: 1.25
      },
      {
        level: 3,
        title: 'Dual Tachyon Synthesizer',
        cost: 600,
        effectDescription: '+50% bonus Cosmic Credits awarded across all mini games and missions!',
        multiplier: 1.5
      }
    ]
  },
  {
    id: 'deflector-hull',
    name: 'Reinforced Kinetic Shields',
    category: 'defense',
    icon: '🛡️',
    description: 'Strengthens starship deflector mesh with extra protective charges in survival quizzes and falling word arcade.',
    maxLevel: 3,
    levels: [
      {
        level: 1,
        title: 'Dual-Layer Hull',
        cost: 0,
        effectDescription: 'Standard 3 Shield Charges during asteroid defense and arcade missions.',
        bonusValue: 3
      },
      {
        level: 2,
        title: 'Reinforced Titanium Mesh',
        cost: 300,
        effectDescription: 'Expands shield capacity to 4 Shield Charges (1 extra mistake buffer).',
        bonusValue: 4
      },
      {
        level: 3,
        title: 'Graviton Phase Barrier',
        cost: 750,
        effectDescription: 'Maximizes shield capacity to 5 Shield Charges for supreme survival!',
        bonusValue: 5
      }
    ]
  },
  {
    id: 'tachyon-scanner',
    name: 'Holographic Word Scanner',
    category: 'efficiency',
    icon: '🔍',
    description: 'Upgrades tactical radar to reveal letter clues automatically and highlight hints in word puzzles.',
    maxLevel: 3,
    levels: [
      {
        level: 1,
        title: 'Optical Sensor Array',
        cost: 0,
        effectDescription: 'Standard holographic scanner with manual hints.',
        bonusValue: 0
      },
      {
        level: 2,
        title: 'Sub-Space Word Analyzer',
        cost: 220,
        effectDescription: 'Automatically reveals the first letter of words in word searches & decoder.',
        bonusValue: 1
      },
      {
        level: 3,
        title: 'Quantum AI Holo-Core',
        cost: 500,
        effectDescription: 'Free automatic letter reveal + glowing clue pings in all puzzle mini games!',
        bonusValue: 2
      }
    ]
  },
  {
    id: 'chrono-warp',
    name: 'Temporal Chrono-Stabilizer',
    category: 'chronos',
    icon: '⏳',
    description: 'Diverts dark matter into a time-dilation field, slowing down falling arcade words and extending mission timers.',
    maxLevel: 3,
    levels: [
      {
        level: 1,
        title: 'Linear Chronometer',
        cost: 0,
        effectDescription: 'Standard mission clock and normal orbital falling speed.',
        bonusValue: 0
      },
      {
        level: 2,
        title: 'Warp Dilation Field',
        cost: 260,
        effectDescription: '+15 seconds bonus time in timed modes and 20% slower falling words.',
        bonusValue: 15
      },
      {
        level: 3,
        title: 'Chrono-Stasis Field',
        cost: 650,
        effectDescription: '+30 seconds bonus time and emergency temporal slowdown in arcade challenges!',
        bonusValue: 30
      }
    ]
  },
  {
    id: 'quantum-core',
    name: 'Hyperdrive Overcharger',
    category: 'rewards',
    icon: '🔥',
    description: 'Amplifies combo streaks, triggering Warp Speed multipliers earlier and yielding massive bonus XP.',
    maxLevel: 3,
    levels: [
      {
        level: 1,
        title: 'Standard Warp Drive',
        cost: 0,
        effectDescription: 'Warp multiplier activates after 3 consecutive correct answers.',
        bonusValue: 3
      },
      {
        level: 2,
        title: 'Tachyon Overdrive',
        cost: 350,
        effectDescription: 'Warp multiplier activates early at 2 streak + yields +35% bonus combo XP!',
        bonusValue: 2
      },
      {
        level: 3,
        title: 'Singularity Overcharge',
        cost: 850,
        effectDescription: 'Instant hyperdrive at 2 streak + double combo XP (+100%) on every streak!',
        bonusValue: 1
      }
    ]
  }
];

export function getCreditMultiplier(upgrades: Record<string, number>): number {
  const level = upgrades['ion-cannons'] || 1;
  const upgrade = TECH_UPGRADES.find(u => u.id === 'ion-cannons');
  return upgrade?.levels[level - 1]?.multiplier || 1.0;
}

export function getMaxShields(upgrades: Record<string, number>): number {
  const level = upgrades['deflector-hull'] || 1;
  const upgrade = TECH_UPGRADES.find(u => u.id === 'deflector-hull');
  return upgrade?.levels[level - 1]?.bonusValue || 3;
}

export function getChronoBonus(upgrades: Record<string, number>): number {
  const level = upgrades['chrono-warp'] || 1;
  const upgrade = TECH_UPGRADES.find(u => u.id === 'chrono-warp');
  return upgrade?.levels[level - 1]?.bonusValue || 0;
}

export function getScannerLevel(upgrades: Record<string, number>): number {
  return upgrades['tachyon-scanner'] || 1;
}

export function getHyperdriveLevel(upgrades: Record<string, number>): number {
  return upgrades['quantum-core'] || 1;
}
