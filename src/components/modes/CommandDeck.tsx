import { useState } from 'react';
import { GameMode, PlayerProfile } from '../../types/game';
import { BADGES, VOCABULARY_LIST, CORE_SEVEN_IDS, ALL_CURRICULUM_IDS } from '../../data/vocabulary';
import { getPlayerRank, getNextRank } from '../../utils/storage';
import StarshipVisualizer from '../StarshipVisualizer';
import { Play, Sparkles, Zap, Award, BookOpen, Layers, Edit3, Check } from 'lucide-react';

interface CommandDeckProps {
  profile: PlayerProfile;
  onSelectMode: (mode: GameMode) => void;
  onUpdateProfile: (updater: (prev: PlayerProfile) => PlayerProfile) => void;
  onOpenCertificate: () => void;
}

export default function CommandDeck({
  profile,
  onSelectMode,
  onUpdateProfile,
  onOpenCertificate
}: CommandDeckProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile.name);

  const rank = getPlayerRank(profile.xp);
  const { nextRank, xpNeeded, progressPercent } = getNextRank(profile.xp);

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateProfile((prev) => ({ ...prev, name: tempName.trim() }));
    }
    setIsEditingName(false);
  };

  const missions: {
    id: GameMode;
    number: string;
    title: string;
    desc: string;
    reward: string;
    actionLabel: string;
    icon: string;
  }[] = [
    {
      id: 'decoder',
      number: '01',
      title: 'Cosmic Decoder',
      desc: 'Reassemble scrambled quantum letter tiles with audio guides and sci-fi holographic clues.',
      reward: '+60 XP / Word',
      actionLabel: 'Decipher Frequencies',
      icon: '🧩'
    },
    {
      id: 'transmission',
      number: '02',
      title: 'Alien Transmissions',
      desc: 'Intercept classified alien transmissions and match 4 scientific definitions in real-time.',
      reward: '+45 XP / Match',
      actionLabel: 'Link Signals',
      icon: '📡'
    },
    {
      id: 'story-cloze',
      number: '03',
      title: 'Warp Core Expedition',
      desc: 'A 5-chapter space opera story! Solve crucial cloze vocabulary dilemmas to save the Sector 7 crew.',
      reward: '+80 XP / Chapter',
      actionLabel: 'Launch Story Mission',
      icon: '📖'
    },
    {
      id: 'asteroid-quiz',
      number: '04',
      title: 'Asteroid Defense Quiz',
      desc: 'Rapid survival mode! Answer sci-fi vocabulary questions to fire the plasma cannon before shields fail.',
      reward: '+50 XP / Wave',
      actionLabel: 'Engage Plasma Shields',
      icon: '☄️'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Hero Command Banner */}
      <div className="bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          {/* Cadet Identity & Rank */}
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
              <span>Starfleet Academy Registry</span>
              <span aria-hidden="true">·</span>
              <span>Primary 6 Sci-Fi Division</span>
            </div>

            <div className="flex items-center gap-3">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="px-3 py-1.5 bg-slate-950 border border-cyan-500 rounded-lg text-white font-bold text-xl sm:text-2xl focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg cursor-pointer"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
                    {profile.name}
                  </h1>
                  <button
                    onClick={() => {
                      setTempName(profile.name);
                      setIsEditingName(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
                    title="Change Cadet Name"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <span className="text-2xl">{rank.badge}</span>
              <div>
                <div className="text-base font-bold text-white">{rank.title}</div>
                <div className="text-xs text-slate-400">
                  {profile.xp} Total XP · {profile.credits} Cosmic Credits
                </div>
              </div>
            </div>

            {/* Rank XP Progress Bar */}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
                <span>Current Tier Progress</span>
                <span>{nextRank ? `${xpNeeded} XP to ${nextRank.title}` : 'Max Rank Achieved'}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full transition-all duration-500 shadow-[0_0_8px_#38bdf8]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Equipped Starship Inspection Bay */}
          <div className="flex flex-col items-center p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
            <div className="text-xs font-mono text-slate-400 uppercase mb-2">
              Equipped Flagship
            </div>
            <StarshipVisualizer
              shipId={profile.currentShip}
              petId={profile.currentPet}
              shieldId={profile.currentShield}
              size="md"
            />
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => onSelectMode('hangar')}
                className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 underline cursor-pointer"
              >
                Customize in Hangar →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metrics & Achievements Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-lg">
            📜
          </div>
          <div>
            <div className="text-xs text-slate-400">Words Mastered</div>
            <div className="text-lg font-bold font-mono text-white tabular-nums">
              {profile.wordsMastered.length} / {VOCABULARY_LIST.length}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg">
            ⚡
          </div>
          <div>
            <div className="text-xs text-slate-400">Highest Streak</div>
            <div className="text-lg font-bold font-mono text-white tabular-nums">
              {profile.highestStreak} Combo
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg">
            🎯
          </div>
          <div>
            <div className="text-xs text-slate-400">Correct Solves</div>
            <div className="text-lg font-bold font-mono text-white tabular-nums">
              {profile.correctAnswers}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center font-bold text-lg">
            🏆
          </div>
          <div>
            <div className="text-xs text-slate-400">Badges Unlocked</div>
            <div className="text-lg font-bold font-mono text-white tabular-nums">
              {profile.unlockedBadges.length} / {BADGES.length}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Core Curriculum Sci-Fi & Literary Unit Section */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-slate-900/60 border-2 border-cyan-500/40 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-400 tracking-wider">
              <span>Required Curriculum Unit</span>
              <span aria-hidden="true">·</span>
              <span>Primary 6 Sci-Fi & Literary Lexicon (17 Words)</span>
            </div>
            <h3 className="text-xl font-bold text-white font-display mt-0.5">
              Target Vocabulary Unit
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Sci-fi concepts, story elements & genres: robot, mechanical, blueprint, future, alien, space, black hole, science fiction, fiction, non-fiction, fantasy, fairytale, adventure, novel, altered, occupants, features.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-300">
              <strong className="text-cyan-400 font-bold">
                {profile.wordsMastered.filter(id => ALL_CURRICULUM_IDS.includes(id)).length} / {ALL_CURRICULUM_IDS.length}
              </strong>{' '}
              Mastered
            </span>
            <button
              onClick={() => onSelectMode('story-cloze')}
              className="px-4 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-md shadow-cyan-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Play 10-Chapter Story</span>
            </button>
          </div>
        </div>

        {/* 17 Words Badges/Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-2 border-t border-slate-800/80">
          {ALL_CURRICULUM_IDS.map((wordId) => {
            const wordObj = VOCABULARY_LIST.find(w => w.id === wordId);
            const isMastered = profile.wordsMastered.includes(wordId);
            if (!wordObj) return null;

            return (
              <div
                key={wordId}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isMastered
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300'
                }`}
              >
                <div className="text-[10px] font-mono text-slate-500 uppercase truncate">
                  {wordObj.category.replace('&', '+').trim()}
                </div>
                <div className="font-mono text-xs font-bold text-white mt-0.5 truncate" title={wordObj.word}>
                  {wordObj.word}
                </div>
                <div className="text-[10px] mt-1 font-semibold flex items-center justify-center gap-1">
                  {isMastered ? (
                    <span className="text-emerald-400">✓ Mastered</span>
                  ) : (
                    <span className="text-slate-500">In Training</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Mission Launch Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              Cadet Training Missions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Select an interactive sci-fi vocabulary challenge to earn Cosmic Credits and unlock starship parts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className="bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-slate-500 uppercase">
                    Mission {mission.number}
                  </span>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-800/60 px-2.5 py-0.5 rounded-full">
                    {mission.reward}
                  </span>
                </div>

                <div className="flex items-start gap-3.5 mb-2">
                  <span className="text-2xl p-2 bg-slate-950 rounded-xl border border-slate-800">
                    {mission.icon}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {mission.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-1">
                      {mission.desc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">
                  Primary 6 Curriculum
                </span>
                <button
                  onClick={() => onSelectMode(mission.id)}
                  className="px-4 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-md shadow-cyan-600/20 flex items-center gap-1.5 transition-all cursor-pointer group-hover:scale-105 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{mission.actionLabel}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auxiliary Learning Tools & Diploma Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          onClick={() => onSelectMode('holo-codex')}
          className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 cursor-pointer transition-all hover:bg-slate-850"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xl mb-3">
            📚
          </div>
          <h4 className="font-bold text-white text-base">Holo-Codex Encyclopedia</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Browse all 24 science fiction vocabulary words with audio pronunciations, etymologies, and flashcards.
          </p>
        </div>

        <div
          onClick={() => onSelectMode('hangar')}
          className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 cursor-pointer transition-all hover:bg-slate-850"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl mb-3">
            🛸
          </div>
          <h4 className="font-bold text-white text-base">Starship Fleet Hangar</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Unlock new starship hulls, ion deflector shields, and alien pet co-pilots with your Cosmic Credits.
          </p>
        </div>

        <div
          onClick={onOpenCertificate}
          className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 cursor-pointer transition-all hover:bg-slate-850"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl mb-3">
            📜
          </div>
          <h4 className="font-bold text-white text-base">Starfleet Cadet Diploma</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            View and print an official Certificate of Sci-Fi Vocabulary Mastery signed by Starfleet Command.
          </p>
        </div>
      </div>

      {/* Badges Showcase Grid */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-base font-bold text-white font-display">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Galactic Achievement Badges</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {profile.unlockedBadges.length} / {BADGES.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {BADGES.map((badge) => {
            const isUnlocked = profile.unlockedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-xl border text-center transition-all ${
                  isUnlocked
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-60'
                }`}
              >
                <div className="text-2xl mb-1.5">{badge.icon}</div>
                <div className="text-xs font-bold text-white truncate">
                  {badge.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {badge.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
