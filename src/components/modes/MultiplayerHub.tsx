import { useState, useEffect } from 'react';
import { PlayerProfile, SquadPlayer, VocabWord } from '../../types/game';
import { VOCABULARY_LIST, ALL_CURRICULUM_IDS } from '../../data/vocabulary';
import { getCreditMultiplier } from '../../data/upgrades';
import { playSuccessSound, playErrorSound, playWarpSound, playLevelUpSound, speakWord } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  Users,
  Trophy,
  Crown,
  Handshake,
  RotateCcw,
  Sparkles,
  Zap,
  Volume2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Shield,
  Play
} from 'lucide-react';

interface MultiplayerHubProps {
  profile: PlayerProfile;
  onUpdateProfile: (updater: (prev: PlayerProfile) => PlayerProfile) => void;
  onCheckBadges: (currentProfile: PlayerProfile) => void;
}

type MultiplayerTab = 'setup' | 'competitive' | 'coop' | 'results';

interface QuestionRound {
  targetWord: VocabWord;
  prompt: string;
  options: string[];
}

export default function MultiplayerHub({
  profile,
  onUpdateProfile,
  onCheckBadges
}: MultiplayerHubProps) {
  const creditMultiplier = getCreditMultiplier(profile.upgrades);

  // Setup state
  const [subMode, setSubMode] = useState<'competitive' | 'coop'>('competitive');
  const [activeTab, setActiveTab] = useState<MultiplayerTab>('setup');
  const [playerCount, setPlayerCount] = useState<number>(2);

  // Player roster
  const [players, setPlayers] = useState<SquadPlayer[]>([
    {
      id: 'p1',
      name: profile.name || 'Cadet Nova',
      avatar: '🚀',
      shipId: 'ship-scout',
      role: 'Commander',
      score: 0,
      streak: 0,
      correctAnswers: 0
    },
    {
      id: 'p2',
      name: 'Cadet Orion',
      avatar: '🛸',
      shipId: 'ship-falcon',
      role: 'Science Officer',
      score: 0,
      streak: 0,
      correctAnswers: 0
    },
    {
      id: 'p3',
      name: 'Cadet Vega',
      avatar: '⚡',
      shipId: 'ship-nebula',
      role: 'Chief Engineer',
      score: 0,
      streak: 0,
      correctAnswers: 0
    },
    {
      id: 'p4',
      name: 'Cadet Lyra',
      avatar: '🌟',
      shipId: 'ship-dreadnought',
      role: 'Navigator',
      score: 0,
      streak: 0,
      correctAnswers: 0
    }
  ]);

  // Competitive game state
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState(0);
  const [totalRounds, setTotalRounds] = useState(5);
  const [roundQuestions, setRoundQuestions] = useState<QuestionRound[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  // Co-Op game state
  const [coopSectorIndex, setCoopSectorIndex] = useState(0);
  const [coopTargetWord, setCoopTargetWord] = useState<VocabWord | null>(null);
  const [coopScrambledLetters, setCoopScrambledLetters] = useState<{ char: string; originalIdx: number }[]>([]);
  const [coopSelectedIndices, setCoopSelectedIndices] = useState<number[]>([]);
  const [coopEnergy, setCoopEnergy] = useState<number>(75);
  const [coopActiveClue, setCoopActiveClue] = useState<string | null>(null);
  const [coopTeamScore, setCoopTeamScore] = useState<number>(0);
  const [coopPlayerTurnIdx, setCoopPlayerTurnIdx] = useState<number>(0);
  const [coopSectorCompleted, setCoopSectorCompleted] = useState<boolean>(false);

  // Prepare questions pool focused on the 17 curriculum words
  const generateQuestions = (count: number): QuestionRound[] => {
    const curriculumPool = VOCABULARY_LIST.filter(w => ALL_CURRICULUM_IDS.includes(w.id));
    const shuffledPool = [...curriculumPool].sort(() => Math.random() - 0.5);

    return Array.from({ length: count }).map((_, i) => {
      const target = shuffledPool[i % shuffledPool.length];
      const distractors = VOCABULARY_LIST
        .filter(w => w.id !== target.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.word);

      const options = [...distractors, target.word].sort(() => Math.random() - 0.5);
      return {
        targetWord: target,
        prompt: `Which sci-fi term means: "${target.definition}"?`,
        options
      };
    });
  };

  // Start Competitive Match
  const startCompetitiveMatch = () => {
    const questions = generateQuestions(totalRounds);
    setRoundQuestions(questions);
    setCurrentRoundIndex(0);
    setCurrentPlayerTurn(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);

    // Reset scores
    setPlayers(prev =>
      prev.map(p => ({
        ...p,
        score: 0,
        streak: 0,
        correctAnswers: 0
      }))
    );

    setActiveTab('competitive');
    playWarpSound(profile.soundEnabled);
  };

  // Start Co-Op Squad Mission
  const startCoopMission = () => {
    setCoopSectorIndex(0);
    setCoopEnergy(100);
    setCoopTeamScore(0);
    setCoopPlayerTurnIdx(0);
    setCoopSectorCompleted(false);

    // Load first word
    loadCoopSector(0);

    setActiveTab('coop');
    playWarpSound(profile.soundEnabled);
  };

  const loadCoopSector = (sectorIdx: number) => {
    const curriculumPool = VOCABULARY_LIST.filter(w => ALL_CURRICULUM_IDS.includes(w.id));
    const target = curriculumPool[sectorIdx % curriculumPool.length];
    setCoopTargetWord(target);

    // Scramble letters (ignore spaces/hyphens for tiles)
    const lettersOnly = target.word.split('').filter(c => c !== ' ' && c !== '-');
    const rawLetters = lettersOnly.map((char, originalIdx) => ({ char, originalIdx }));
    let shuffled = [...rawLetters].sort(() => Math.random() - 0.5);
    if (shuffled.map(s => s.char).join('') === lettersOnly.join('') && lettersOnly.length > 2) {
      shuffled = shuffled.reverse();
    }

    setCoopScrambledLetters(shuffled);
    setCoopSelectedIndices([]);
    setCoopActiveClue(null);
    setCoopSectorCompleted(false);
  };

  // Handle Competitive Answer Selection
  const handleSelectCompetitiveAnswer = (option: string) => {
    if (isAnswerRevealed || !roundQuestions[currentRoundIndex]) return;

    setSelectedOption(option);
    setIsAnswerRevealed(true);

    const question = roundQuestions[currentRoundIndex];
    const isCorrect = option === question.targetWord.word;
    const activePlayer = players[currentPlayerTurn];

    if (isCorrect) {
      playSuccessSound(profile.soundEnabled);
      const points = 100 + activePlayer.streak * 20;

      setPlayers(prev =>
        prev.map((p, idx) =>
          idx === currentPlayerTurn
            ? {
                ...p,
                score: p.score + points,
                streak: p.streak + 1,
                correctAnswers: p.correctAnswers + 1
              }
            : p
        )
      );

      // Award profile stats if player 1
      if (currentPlayerTurn === 0) {
        onUpdateProfile(prev => ({
          ...prev,
          xp: prev.xp + points,
          credits: prev.credits + Math.round(points * 0.5 * creditMultiplier),
          wordsMastered: prev.wordsMastered.includes(question.targetWord.id)
            ? prev.wordsMastered
            : [...prev.wordsMastered, question.targetWord.id]
        }));
      }
    } else {
      playErrorSound(profile.soundEnabled);
      setPlayers(prev =>
        prev.map((p, idx) =>
          idx === currentPlayerTurn ? { ...p, streak: 0 } : p
        )
      );
    }
  };

  // Next Turn or Next Round in Competitive
  const handleNextCompetitiveTurn = () => {
    setSelectedOption(null);
    setIsAnswerRevealed(false);

    const nextPlayer = (currentPlayerTurn + 1) % playerCount;
    setCurrentPlayerTurn(nextPlayer);

    // If wrapped back to player 0, advance the round
    if (nextPlayer === 0) {
      const nextRound = currentRoundIndex + 1;
      if (nextRound >= totalRounds) {
        // Match Finished!
        playLevelUpSound(profile.soundEnabled);
        setActiveTab('results');
        try {
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.5 }
          });
        } catch (e) {
          console.warn(e);
        }
      } else {
        setCurrentRoundIndex(nextRound);
      }
    }
  };

  // Handle Co-Op Letter Tile Selection (Cooperative turn-taking)
  const handleCoopTileClick = (scrambledIdx: number) => {
    if (coopSectorCompleted || !coopTargetWord) return;

    if (coopSelectedIndices.includes(scrambledIdx)) {
      setCoopSelectedIndices(prev => prev.filter(i => i !== scrambledIdx));
    } else {
      const nextSelected = [...coopSelectedIndices, scrambledIdx];
      setCoopSelectedIndices(nextSelected);

      // Check if complete
      const cleanTarget = coopTargetWord.word.replace(/[\s-]+/g, '');
      const currentBuilt = nextSelected.map(i => coopScrambledLetters[i].char).join('');

      if (currentBuilt.length === cleanTarget.length) {
        if (currentBuilt === cleanTarget) {
          // Success! Sector decoded cooperatively
          playSuccessSound(profile.soundEnabled);
          setCoopSectorCompleted(true);
          const pointsEarned = 150;
          setCoopTeamScore(prev => prev + pointsEarned);
          setCoopEnergy(prev => Math.min(100, prev + 20));

          onUpdateProfile(prev => ({
            ...prev,
            xp: prev.xp + 100,
            credits: prev.credits + Math.round(80 * creditMultiplier),
            wordsMastered: prev.wordsMastered.includes(coopTargetWord.id)
              ? prev.wordsMastered
              : [...prev.wordsMastered, coopTargetWord.id]
          }));

          try {
            confetti({
              particleCount: 70,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            console.warn(e);
          }
        } else {
          // Mistake!
          playErrorSound(profile.soundEnabled);
          setCoopEnergy(prev => Math.max(0, prev - 25));
          setTimeout(() => setCoopSelectedIndices([]), 400);
        }
      } else {
        // Pass collaborative turn to next student in squad
        setCoopPlayerTurnIdx((prev) => (prev + 1) % playerCount);
      }
    }
  };

  // Co-Op Next Sector
  const handleNextCoopSector = () => {
    const nextSector = coopSectorIndex + 1;
    if (nextSector >= 5) {
      // Co-Op mission finished!
      playLevelUpSound(profile.soundEnabled);
      setActiveTab('results');
      try {
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.5 }
        });
      } catch (e) {
        console.warn(e);
      }
    } else {
      setCoopSectorIndex(nextSector);
      loadCoopSector(nextSector);
    }
  };

  // Co-Op Role Abilities
  const handleDeployEngineerHint = () => {
    if (!coopTargetWord || coopSectorCompleted) return;
    const cleanTarget = coopTargetWord.word.replace(/[\s-]+/g, '');
    const currentBuilt = coopSelectedIndices.map(i => coopScrambledLetters[i].char).join('');
    const nextChar = cleanTarget[currentBuilt.length];
    if (!nextChar) return;

    const matchIdx = coopScrambledLetters.findIndex(
      (item, idx) => !coopSelectedIndices.includes(idx) && item.char === nextChar
    );

    if (matchIdx !== -1) {
      setCoopEnergy(prev => Math.max(10, prev - 15));
      handleCoopTileClick(matchIdx);
    }
  };

  // Sort players for Leaderboard (Highest Score on Top!)
  const sortedPlayers = [...players.slice(0, playerCount)].sort((a, b) => b.score - a.score);
  const highestScorer = sortedPlayers[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono uppercase tracking-wider mb-1">
            <span>Starfleet Multiplayer Network</span>
            <span aria-hidden="true">·</span>
            <span>Classroom Pod & Team Link</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Multiplayer Galactic Command
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Compete head-to-head on the leaderboard for the highest score, or team up as a Starship Bridge Crew to decode together!
          </p>
        </div>

        {/* Mode Quick Switcher */}
        {activeTab !== 'setup' && (
          <button
            onClick={() => setActiveTab('setup')}
            className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer self-start sm:self-center flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Match Lobby</span>
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: SETUP LOBBY                                        */}
      {/* ========================================================= */}
      {activeTab === 'setup' && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Game Mode Picker */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 backdrop-blur-md shadow-2xl">
              <h3 className="text-lg font-bold text-white font-display mb-3">
                1. Select Multiplayer Protocol
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Competitive Option */}
                <button
                  onClick={() => setSubMode('competitive')}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    subMode === 'competitive'
                      ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl mb-3">
                      🏆
                    </div>
                    <h4 className="font-bold text-white text-base">
                      Competitive Showdown
                    </h4>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Battle for the highest score! Alternating turns, real-time leaderboard, and podium crowning.
                    </p>
                  </div>
                  <div className="mt-4 text-[11px] font-mono font-semibold text-cyan-400">
                    Leaderboard & Trophy
                  </div>
                </button>

                {/* Co-Op Team Up Option */}
                <button
                  onClick={() => setSubMode('coop')}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    subMode === 'coop'
                      ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl mb-3">
                      🤝
                    </div>
                    <h4 className="font-bold text-white text-base">
                      Bridge Crew Co-Op
                    </h4>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Team up as Commander, Engineer & Science Officer! Share a warp core to decode answers together.
                    </p>
                  </div>
                  <div className="mt-4 text-[11px] font-mono font-semibold text-emerald-400">
                    Cooperative Decoding
                  </div>
                </button>
              </div>

              {/* Player Count Picker */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3 text-xs font-mono uppercase text-slate-400">
                  <span>Number of Players in Room:</span>
                  <span className="text-cyan-400 font-bold">{playerCount} Cadets</span>
                </div>

                <div className="flex items-center gap-3">
                  {[2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setPlayerCount(num)}
                      className={`flex-1 py-2.5 rounded-xl border font-mono text-sm font-bold transition-all cursor-pointer ${
                        playerCount === num
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {num} Players
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={subMode === 'competitive' ? startCompetitiveMatch : startCoopMission}
                  className="w-full py-3.5 px-6 font-bold text-white bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400 rounded-xl shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 text-base"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>
                    {subMode === 'competitive' ? 'Launch Highest Score Showdown' : 'Deploy Co-Op Bridge Crew'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Cadet Roster & Role Assignments */}
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 backdrop-blur-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Active Cadet Roster ({playerCount} Registered)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Click name to edit
              </span>
            </div>

            <div className="space-y-3">
              {players.slice(0, playerCount).map((p, idx) => (
                <div
                  key={p.id}
                  className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl">
                      {p.avatar}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) => {
                            const newName = e.target.value;
                            setPlayers(prev =>
                              prev.map((pl, i) => (i === idx ? { ...pl, name: newName } : pl))
                            );
                          }}
                          className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-500 text-white font-bold text-sm focus:outline-none px-1"
                        />
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 pl-1 mt-0.5">
                        {subMode === 'coop' ? (
                          <span className="text-cyan-400 font-semibold">{p.role}</span>
                        ) : (
                          <span>Cadet Slot 0{idx + 1}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-500 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
                    Ready
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-2xl text-xs text-slate-300 leading-relaxed">
              <strong>Classroom Tip:</strong> Students can share a single screen or smartboard, passing the turn or calling out answers together!
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: COMPETITIVE SHOWDOWN                               */}
      {/* ========================================================= */}
      {activeTab === 'competitive' && roundQuestions[currentRoundIndex] && (
        <div className="mt-8 space-y-6">
          {/* Live Leaderboard Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {players.slice(0, playerCount).map((p, idx) => {
              const isCurrentTurn = idx === currentPlayerTurn;
              const isLeading = p.id === highestScorer.id && p.score > 0;

              return (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-2xl border transition-all relative ${
                    isCurrentTurn
                      ? 'bg-cyan-950/70 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-400/50'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  {isLeading && (
                    <div className="absolute -top-2.5 right-3 bg-amber-400 text-slate-950 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                      <Crown className="w-3 h-3 fill-slate-950" />
                      <span>1ST</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{p.avatar}</span>
                    <span className="font-bold text-white text-xs truncate">{p.name}</span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-slate-800/80">
                    <span className="text-[11px] font-mono text-slate-400">Score</span>
                    <span className="font-mono text-base font-bold text-amber-400 tabular-nums">
                      {p.score} PTS
                    </span>
                  </div>

                  {isCurrentTurn && (
                    <div className="mt-1 text-[10px] font-mono text-cyan-300 font-bold uppercase animate-pulse">
                      Active Turn
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Current Turn Question Terminal */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400">
                <span className="text-cyan-400 font-bold">Round {currentRoundIndex + 1} of {totalRounds}</span>
                <span aria-hidden="true">·</span>
                <span>Current Turn: <strong className="text-white">{players[currentPlayerTurn].name}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => speakWord(roundQuestions[currentRoundIndex].targetWord.word)}
                  className="flex items-center gap-1 px-3 py-1 text-xs text-cyan-300 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-lg cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Pronounce Word</span>
                </button>
              </div>
            </div>

            {/* Prompt Box */}
            <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl text-base sm:text-xl text-white font-medium mb-6 leading-relaxed">
              {roundQuestions[currentRoundIndex].prompt}
            </div>

            {/* Answer Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
              {roundQuestions[currentRoundIndex].options.map((opt) => {
                const isSelected = selectedOption === opt;
                const isTarget = opt === roundQuestions[currentRoundIndex].targetWord.word;

                let style = 'bg-slate-950/60 border-slate-800 text-slate-200 hover:bg-slate-850 hover:border-slate-700';

                if (isAnswerRevealed) {
                  if (isTarget) {
                    style = 'bg-emerald-950/50 border-emerald-400 text-emerald-300 font-bold shadow-md';
                  } else if (isSelected && !isTarget) {
                    style = 'bg-rose-950/50 border-rose-500 text-rose-300';
                  } else {
                    style = 'opacity-40 bg-slate-950 border-slate-850 text-slate-500';
                  }
                }

                return (
                  <button
                    key={opt}
                    disabled={isAnswerRevealed}
                    onClick={() => handleSelectCompetitiveAnswer(opt)}
                    className={`p-4 rounded-xl border font-mono text-base font-bold transition-all text-left flex items-center justify-between cursor-pointer ${style}`}
                  >
                    <span>{opt}</span>
                    {isAnswerRevealed && isTarget && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Next Turn Control */}
            {isAnswerRevealed && (
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-400 italic">
                  {roundQuestions[currentRoundIndex].targetWord.sentence}
                </div>

                <button
                  onClick={handleNextCompetitiveTurn}
                  className="px-6 py-2.5 font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all cursor-pointer ml-auto"
                >
                  <span>
                    {currentPlayerTurn === playerCount - 1 && currentRoundIndex === totalRounds - 1
                      ? 'Show Final Leaderboard'
                      : 'Next Turn'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: CO-OP BRIDGE CREW (TEAM UP TO DECODE)              */}
      {/* ========================================================= */}
      {activeTab === 'coop' && coopTargetWord && (
        <div className="mt-8 space-y-6">
          {/* Bridge Crew Status Panel */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl">
                  🤝
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-emerald-400 tracking-wider">
                    Sector {coopSectorIndex + 1} of 5 · Starfleet Bridge Crew
                  </div>
                  <h3 className="text-xl font-bold text-white font-display">
                    Cooperative Distress Decryption
                  </h3>
                </div>
              </div>

              {/* Shared Warp Core Energy */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 sm:w-60">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Team Warp Core</span>
                  <span className="text-cyan-400 font-bold">{coopEnergy}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      coopEnergy > 50 ? 'bg-emerald-400' : coopEnergy > 25 ? 'bg-amber-400' : 'bg-rose-500'
                    }`}
                    style={{ width: `${coopEnergy}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Crew Member Role Turns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              {players.slice(0, playerCount).map((p, idx) => {
                const isTurn = idx === coopPlayerTurnIdx;

                return (
                  <div
                    key={p.id}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isTurn
                        ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-lg">{p.avatar}</div>
                    <div className="text-xs font-bold text-white truncate mt-0.5">{p.name}</div>
                    <div className="text-[10px] font-mono text-cyan-400">{p.role}</div>
                    {isTurn && (
                      <div className="text-[9px] font-mono text-emerald-300 font-bold uppercase mt-1 animate-pulse">
                        Turn to Input
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Collaborative Hologram Puzzle Deck */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
            {/* Clue Prompt */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl mb-6">
              <div className="text-xs font-mono text-slate-400 uppercase mb-1">
                Incoming Sector Scenario ({coopTargetWord.category}):
              </div>
              <p className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed">
                "{coopTargetWord.definition}"
              </p>
              {coopActiveClue && (
                <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span><strong>Officer Clue:</strong> {coopActiveClue}</span>
                </div>
              )}
            </div>

            {/* Assembled Word Slots */}
            <div className="mb-6">
              <div className="text-xs font-mono uppercase text-slate-400 mb-2">
                Team Decryption Buffer:
              </div>
              <div className="min-h-[60px] p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-center gap-2 sm:gap-3">
                {coopTargetWord.word
                  .split('')
                  .filter(c => c !== ' ' && c !== '-')
                  .map((_, slotIdx) => {
                    const selectedScrambleIdx = coopSelectedIndices[slotIdx];
                    const letter = selectedScrambleIdx !== undefined ? coopScrambledLetters[selectedScrambleIdx]?.char : '';

                    return (
                      <div
                        key={slotIdx}
                        className={`w-10 h-12 sm:w-12 sm:h-14 rounded-xl flex items-center justify-center font-mono text-xl sm:text-2xl font-bold transition-all ${
                          letter
                            ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300'
                            : 'border border-dashed border-slate-700 bg-slate-900/40 text-slate-600'
                        }`}
                      >
                        {letter || '_'}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Letter Tiles to click */}
            {!coopSectorCompleted ? (
              <div className="mb-6">
                <div className="text-xs font-mono uppercase text-slate-400 mb-3">
                  Quantum Frequency Tiles (Current Turn: <strong className="text-white">{players[coopPlayerTurnIdx].name}</strong>):
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                  {coopScrambledLetters.map((item, idx) => {
                    const isUsed = coopSelectedIndices.includes(idx);
                    return (
                      <button
                        key={idx}
                        disabled={isUsed}
                        onClick={() => handleCoopTileClick(idx)}
                        className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl font-mono text-2xl font-bold flex items-center justify-center transition-all cursor-pointer select-none ${
                          isUsed
                            ? 'opacity-20 bg-slate-800 text-slate-500 border border-slate-800'
                            : 'bg-slate-800 hover:bg-emerald-900/50 border border-slate-700 hover:border-emerald-400 text-white hover:text-emerald-200 active:scale-95 shadow-lg'
                        }`}
                      >
                        {item.char}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-2xl mb-6 text-center animate-fade-in">
                <div className="text-lg font-bold text-white mb-1">
                  ✓ Sector Transmission Solved Together!
                </div>
                <p className="text-xs text-slate-300 italic mb-3">
                  "{coopTargetWord.sentence}"
                </p>
                <button
                  onClick={handleNextCoopSector}
                  className="px-6 py-2.5 font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/30 inline-flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Proceed to Sector {coopSectorIndex + 2}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Team Roles Action Bar */}
            {!coopSectorCompleted && (
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCoopActiveClue(coopTargetWord.hint)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Science Clue</span>
                  </button>
                  <button
                    onClick={handleDeployEngineerHint}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Engineer Reveal Letter (-15 Energy)</span>
                  </button>
                </div>

                <div className="font-mono text-slate-400">
                  Team Score: <strong className="text-white">{coopTeamScore} PTS</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: FINAL RESULTS & LEADERBOARD                        */}
      {/* ========================================================= */}
      {activeTab === 'results' && (
        <div className="mt-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-8 animate-fade-in">
          {/* Winner Crown Banner */}
          {subMode === 'competitive' ? (
            <div className="text-center py-4">
              <div className="inline-flex p-3 rounded-full bg-amber-500/20 text-amber-400 mb-3 animate-bounce">
                <Crown className="w-10 h-10 fill-amber-400" />
              </div>
              <div className="text-xs font-mono uppercase text-amber-400 tracking-wider">
                Highest Score Grand Champion
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-display mt-1">
                {highestScorer.name}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Secured 1st Place with <strong>{highestScorer.score} Points</strong> and {highestScorer.correctAnswers} correct solutions!
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 mb-3 animate-bounce">
                <Handshake className="w-10 h-10" />
              </div>
              <div className="text-xs font-mono uppercase text-emerald-400 tracking-wider">
                Starfleet Bridge Squad
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-display mt-1">
                Mission Accomplished!
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                All 5 sectors successfully calibrated with a combined Team Score of <strong>{coopTeamScore} Points</strong>!
              </p>
            </div>
          )}

          {/* Full Ranked Leaderboard Table */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs font-mono uppercase text-slate-400">
              <span>Final Standings</span>
              <span>Primary 6 Sci-Fi Division</span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {sortedPlayers.map((player, rankIdx) => (
                <div
                  key={player.id}
                  className={`p-4 flex items-center justify-between ${
                    rankIdx === 0 ? 'bg-amber-500/10' : 'bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                        rankIdx === 0
                          ? 'bg-amber-400 text-slate-950'
                          : rankIdx === 1
                          ? 'bg-slate-400 text-slate-950'
                          : rankIdx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      #{rankIdx + 1}
                    </span>

                    <span className="text-xl">{player.avatar}</span>

                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span>{player.name}</span>
                        {rankIdx === 0 && <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {player.correctAnswers} Correct · {player.role}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-mono font-bold text-amber-400 tabular-nums">
                      {player.score} PTS
                    </div>
                    <div className="text-[11px] text-slate-500">
                      +{Math.round(player.score * 0.4 * creditMultiplier)} Credits
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rematch Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('setup')}
              className="px-6 py-3 font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Back to Lobby
            </button>
            <button
              onClick={subMode === 'competitive' ? startCompetitiveMatch : startCoopMission}
              className="px-6 py-3 font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Rematch</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
