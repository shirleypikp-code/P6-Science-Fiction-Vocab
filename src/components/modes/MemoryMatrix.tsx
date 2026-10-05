import { useState, useEffect, useCallback } from 'react';
import { PlayerProfile, VocabWord } from '../../types/game';
import { VOCABULARY_LIST, ALL_CURRICULUM_IDS } from '../../data/vocabulary';
import { getCreditMultiplier } from '../../data/upgrades';
import { playSuccessSound, playErrorSound, playWarpSound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Layers, RotateCcw, CheckCircle2, Sparkles, Brain, Clock } from 'lucide-react';

interface MemoryMatrixProps {
  profile: PlayerProfile;
  onUpdateProfile: (updater: (prev: PlayerProfile) => PlayerProfile) => void;
  onCheckBadges: (currentProfile: PlayerProfile) => void;
}

interface MemoryCard {
  uid: string;
  wordId: string;
  type: 'word' | 'definition';
  label: string;
  sublabel?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryMatrix({
  profile,
  onUpdateProfile,
  onCheckBadges
}: MemoryMatrixProps) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [turns, setTurns] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [matchedCount, setMatchedCount] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);

  const creditMultiplier = getCreditMultiplier(profile.upgrades);

  // Initialize a round of 6 matching pairs (12 cards total)
  const initGame = useCallback(() => {
    const pool = VOCABULARY_LIST.filter(w => ALL_CURRICULUM_IDS.includes(w.id));
    const chosenWords = [...pool].sort(() => Math.random() - 0.5).slice(0, 6);

    const cardDeck: MemoryCard[] = [];

    chosenWords.forEach((word, idx) => {
      // Card 1: Word Name
      cardDeck.push({
        uid: `${word.id}-word-${idx}`,
        wordId: word.id,
        type: 'word',
        label: word.word,
        sublabel: word.category,
        isFlipped: false,
        isMatched: false
      });

      // Card 2: Definition
      cardDeck.push({
        uid: `${word.id}-def-${idx}`,
        wordId: word.id,
        type: 'definition',
        label: word.definition,
        sublabel: word.partOfSpeech,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle cards
    setCards(cardDeck.sort(() => Math.random() - 0.5));
    setSelectedCards([]);
    setTurns(0);
    setIsLocked(false);
    setMatchedCount(0);
    setIsGameWon(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCardClick = (index: number) => {
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    // Flip this card
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);

    const nextSelected = [...selectedCards, index];
    setSelectedCards(nextSelected);

    if (nextSelected.length === 2) {
      setTurns((t) => t + 1);
      setIsLocked(true);

      const [firstIdx, secondIdx] = nextSelected;
      const firstCard = updatedCards[firstIdx];
      const secondCard = updatedCards[secondIdx];

      if (firstCard.wordId === secondCard.wordId && firstCard.type !== secondCard.type) {
        // Match!
        playSuccessSound(profile.soundEnabled);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
            )
          );
          setSelectedCards([]);
          setIsLocked(false);
          setMatchedCount((m) => {
            const nextM = m + 1;
            if (nextM === 6) {
              // Game Won!
              setIsGameWon(true);
              try {
                confetti({
                  particleCount: 90,
                  spread: 80,
                  origin: { y: 0.6 }
                });
              } catch (e) {
                console.warn(e);
              }
            }
            return nextM;
          });

          // Award Points
          const baseCredits = 50;
          const awardedCredits = Math.round(baseCredits * creditMultiplier);
          onUpdateProfile((prev) => {
            const nextStreak = prev.streak + 1;
            const updated = {
              ...prev,
              xp: prev.xp + 60,
              credits: prev.credits + awardedCredits,
              streak: nextStreak,
              highestStreak: Math.max(prev.highestStreak, nextStreak),
              correctAnswers: prev.correctAnswers + 1,
              wordsMastered: prev.wordsMastered.includes(firstCard.wordId)
                ? prev.wordsMastered
                : [...prev.wordsMastered, firstCard.wordId]
            };
            setTimeout(() => onCheckBadges(updated), 100);
            return updated;
          });
        }, 500);
      } else {
        // Mismatch - flip back
        playErrorSound(profile.soundEnabled);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setSelectedCards([]);
          setIsLocked(false);
        }, 900);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono uppercase tracking-wider mb-1">
            <span>Arcade Mini Game</span>
            <span aria-hidden="true">·</span>
            <span>Quantum Memory Matrix</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Neural Hologram Pairing
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Flip face-down holographic quantum cubes to pair each sci-fi vocabulary word with its matching definition.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl p-3 sm:self-start">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Brain className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-xs font-semibold">{matchedCount} / 6 Pairs</span>
          </div>
          <div className="border-l border-slate-800 pl-4 text-slate-300">
            <span className="text-[11px] font-mono uppercase text-slate-500">Turns:</span>{' '}
            <strong className="text-sm font-mono text-white tabular-nums">{turns}</strong>
          </div>
        </div>
      </div>

      {/* Memory Grid 4x3 */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4">
        {cards.map((card, idx) => {
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.uid}
              disabled={card.isMatched || isLocked}
              onClick={() => handleCardClick(idx)}
              className={`min-h-[130px] sm:min-h-[145px] p-4 rounded-2xl border text-left transition-all duration-300 transform cursor-pointer flex flex-col justify-between relative ${
                card.isMatched
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10 cursor-default opacity-85'
                  : isRevealed
                  ? 'bg-slate-900 border-cyan-400 shadow-xl shadow-cyan-500/20 scale-[1.02]'
                  : 'bg-slate-950/90 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {isRevealed ? (
                <>
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400">
                    <span className="text-cyan-400 font-semibold">{card.type}</span>
                    {card.isMatched && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>

                  <div className="my-auto">
                    {card.type === 'word' ? (
                      <h4 className="font-mono text-base sm:text-lg font-bold text-white tracking-wide">
                        {card.label}
                      </h4>
                    ) : (
                      <p className="text-xs text-slate-200 leading-snug line-clamp-4">
                        "{card.label}"
                      </p>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-500 italic">
                    {card.sublabel}
                  </div>
                </>
              ) : (
                /* Card Back */
                <div className="w-full h-full flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 mb-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                    Quantum Cube
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Victory Modal / Banner */}
      {isGameWon && (
        <div className="mt-8 bg-emerald-950/30 border border-emerald-500/50 rounded-3xl p-6 text-center shadow-2xl animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white font-display">
            Neural Matrix Synchronized!
          </h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto mt-1 mb-5">
            You matched all 6 science fiction terminology pairs in only <strong>{turns} turns</strong>!
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={initGame}
              className="px-6 py-2.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-lg shadow-cyan-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play Next Memory Matrix</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
