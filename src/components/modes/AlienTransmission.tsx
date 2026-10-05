import { useState, useEffect, useCallback } from 'react';
import { VocabWord, PlayerProfile } from '../../types/game';
import { VOCABULARY_LIST } from '../../data/vocabulary';
import { playSuccessSound, playErrorSound, playWarpSound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Radio, CheckCircle, RotateCcw, ArrowRight, Zap, Sparkles } from 'lucide-react';

interface AlienTransmissionProps {
  profile: PlayerProfile;
  onUpdateProfile: (updater: (prev: PlayerProfile) => PlayerProfile) => void;
  onCheckBadges: (currentProfile: PlayerProfile) => void;
}

export default function AlienTransmission({
  profile,
  onUpdateProfile,
  onCheckBadges
}: AlienTransmissionProps) {
  const [round, setRound] = useState(1);
  const [roundWords, setRoundWords] = useState<VocabWord[]>([]);
  const [shuffledTerms, setShuffledTerms] = useState<VocabWord[]>([]);
  const [selectedDefinitionId, setSelectedDefinitionId] = useState<string | null>(null);
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [errorPair, setErrorPair] = useState<{ defId: string; termId: string } | null>(null);
  const [roundScore, setRoundScore] = useState(0);

  // Setup round with 4 random non-overlapping words
  const initRound = useCallback(() => {
    const shuffledList = [...VOCABULARY_LIST].sort(() => Math.random() - 0.5);
    const selected = shuffledList.slice(0, 4);
    setRoundWords(selected);
    setShuffledTerms([...selected].sort(() => Math.random() - 0.5));
    setSelectedDefinitionId(null);
    setSelectedTermId(null);
    setMatchedPairs([]);
    setErrorPair(null);
  }, []);

  useEffect(() => {
    initRound();
  }, [initRound, round]);

  const handleSelectDefinition = (id: string) => {
    if (matchedPairs.includes(id)) return;
    setSelectedDefinitionId(id);
    if (selectedTermId) {
      checkMatch(id, selectedTermId);
    }
  };

  const handleSelectTerm = (id: string) => {
    if (matchedPairs.includes(id)) return;
    setSelectedTermId(id);
    if (selectedDefinitionId) {
      checkMatch(selectedDefinitionId, id);
    }
  };

  const checkMatch = (defId: string, termId: string) => {
    if (defId === termId) {
      // Correct match!
      playSuccessSound(profile.soundEnabled);
      const nextMatched = [...matchedPairs, defId];
      setMatchedPairs(nextMatched);
      setSelectedDefinitionId(null);
      setSelectedTermId(null);
      setRoundScore(prev => prev + 40);

      onUpdateProfile(prev => {
        const nextStreak = prev.streak + 1;
        const updated = {
          ...prev,
          xp: prev.xp + 45,
          credits: prev.credits + 35,
          streak: nextStreak,
          highestStreak: Math.max(prev.highestStreak, nextStreak),
          correctAnswers: prev.correctAnswers + 1,
          wordsMastered: prev.wordsMastered.includes(defId)
            ? prev.wordsMastered
            : [...prev.wordsMastered, defId]
        };
        setTimeout(() => onCheckBadges(updated), 100);
        return updated;
      });

      // Check if all 4 matched
      if (nextMatched.length === 4) {
        try {
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          console.warn(e);
        }
      }
    } else {
      // Mismatch
      playErrorSound(profile.soundEnabled);
      setErrorPair({ defId, termId });
      setTimeout(() => {
        setErrorPair(null);
        setSelectedDefinitionId(null);
        setSelectedTermId(null);
      }, 600);

      onUpdateProfile(prev => ({
        ...prev,
        streak: 0
      }));
    }
  };

  const handleNextPacket = () => {
    playWarpSound(profile.soundEnabled);
    setRound(prev => prev + 1);
  };

  const isRoundComplete = matchedPairs.length === 4 && roundWords.length === 4;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono uppercase tracking-wider mb-1">
            <span>Mission 02</span>
            <span aria-hidden="true">·</span>
            <span>Alien Transmissions</span>
            <span aria-hidden="true">·</span>
            <span>Packet {round}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Signal Intercept Matcher
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Link 4 intercepted holographic signals to their corresponding Starfleet sci-fi scientific terminology.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:self-start">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-mono text-xs font-semibold">{matchedPairs.length} / 4 Linked</span>
          </div>
          <div className="text-left border-l border-slate-700/80 pl-4 flex items-center gap-1.5 text-amber-400">
            <Zap className="w-4 h-4 fill-amber-400" />
            <span className="font-mono font-bold text-sm tabular-nums">Streak: {profile.streak}</span>
          </div>
        </div>
      </div>

      {/* Matching Playing Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Column: Intercepted Signal Definitions */}
        <div className="space-y-3.5">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Intercepted Transmission Clues:</span>
          </div>

          {roundWords.map((word) => {
            const isMatched = matchedPairs.includes(word.id);
            const isSelected = selectedDefinitionId === word.id;
            const isError = errorPair?.defId === word.id;

            return (
              <button
                key={word.id}
                disabled={isMatched}
                onClick={() => handleSelectDefinition(word.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer relative ${
                  isMatched
                    ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-200 cursor-default shadow-sm'
                    : isError
                    ? 'bg-rose-950/40 border-rose-500 text-rose-200 animate-shake'
                    : isSelected
                    ? 'bg-cyan-950/50 border-cyan-400 text-white shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                    : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono uppercase text-slate-500">
                      {word.category} · {word.partOfSpeech}
                    </span>
                    <p className="text-sm font-medium leading-relaxed">
                      "{word.definition}"
                    </p>
                  </div>
                  {isMatched && (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Vocabulary Terms */}
        <div className="space-y-3.5">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target Terminology Database:</span>
          </div>

          {shuffledTerms.map((word) => {
            const isMatched = matchedPairs.includes(word.id);
            const isSelected = selectedTermId === word.id;
            const isError = errorPair?.termId === word.id;

            return (
              <button
                key={word.id}
                disabled={isMatched}
                onClick={() => handleSelectTerm(word.id)}
                className={`w-full p-4 rounded-xl border font-mono text-base font-bold transition-all cursor-pointer flex items-center justify-between ${
                  isMatched
                    ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-300 cursor-default'
                    : isError
                    ? 'bg-rose-950/40 border-rose-500 text-rose-200 animate-shake'
                    : isSelected
                    ? 'bg-cyan-950/50 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                    : 'bg-slate-900/70 border-slate-800 text-slate-200 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <span>{word.word}</span>
                <span className="text-xs font-normal text-slate-500 font-sans">
                  {word.phonetic}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Completion Banner */}
      {isRoundComplete && (
        <div className="mt-8 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-6 text-center shadow-xl animate-fade-in">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mb-3">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-display">
            Signal Packet Decoded!
          </h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto mt-1 mb-5">
            All 4 incoming transmissions were accurately cataloged with Starfleet science protocols. +{roundScore} XP earned!
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={initRound}
              className="px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Packet</span>
            </button>
            <button
              onClick={handleNextPacket}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <span>Next Frequency Packet</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
