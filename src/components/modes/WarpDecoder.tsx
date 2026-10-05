import { useState, useEffect, useCallback } from 'react';
import { VocabWord, PlayerProfile } from '../../types/game';
import { VOCABULARY_LIST } from '../../data/vocabulary';
import { getCreditMultiplier, getScannerLevel } from '../../data/upgrades';
import { playSuccessSound, playErrorSound, playWarpSound, speakWord } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Volume2, HelpCircle, ArrowRight, RotateCcw, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

interface WarpDecoderProps {
  profile: PlayerProfile;
  onUpdateProfile: (updater: (prev: PlayerProfile) => PlayerProfile) => void;
  onCheckBadges: (currentProfile: PlayerProfile) => void;
}

export default function WarpDecoder({
  profile,
  onUpdateProfile,
  onCheckBadges
}: WarpDecoderProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<{ char: string; originalIdx: number }[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shaking, setShaking] = useState(false);

  // Filter or randomize words
  const currentWord: VocabWord = VOCABULARY_LIST[currentWordIndex % VOCABULARY_LIST.length];
  const targetNoSpaces = currentWord.word.replace(/[\s-]+/g, '');
  const hasHyphen = currentWord.word.includes('-');
  const wordTokens = hasHyphen ? currentWord.word.split('-') : currentWord.word.split(' ');

  // Helper to scramble a word reliably (only letters, ignoring spaces and hyphens)
  const initWord = useCallback((wordObj: VocabWord) => {
    const lettersOnly = wordObj.word.split('').filter(char => char !== ' ' && char !== '-');
    const rawLetters = lettersOnly.map((char, originalIdx) => ({ char, originalIdx }));
    // Shuffle ensuring not identical
    let shuffled = [...rawLetters].sort(() => Math.random() - 0.5);
    const targetString = lettersOnly.join('');
    if (shuffled.map(s => s.char).join('') === targetString && targetString.length > 2) {
      shuffled = shuffled.reverse();
    }
    setScrambledLetters(shuffled);
    setSelectedIndices([]);
    setIsSolved(false);
    setShowHint(false);
    setErrorMessage('');
  }, []);

  useEffect(() => {
    initWord(currentWord);
  }, [currentWord, initWord]);

  // Handle letter click
  const handleLetterClick = (scrambledIdx: number) => {
    if (isSolved) return;
    if (selectedIndices.includes(scrambledIdx)) {
      // Deselect
      setSelectedIndices(selectedIndices.filter(i => i !== scrambledIdx));
    } else {
      // Append
      const nextSelected = [...selectedIndices, scrambledIdx];
      setSelectedIndices(nextSelected);

      // Check if word is complete
      const constructedWord = nextSelected.map(i => scrambledLetters[i].char).join('');
      if (constructedWord.length === targetNoSpaces.length) {
        checkSubmission(constructedWord);
      }
    }
  };

  const checkSubmission = (guess: string) => {
    if (guess === targetNoSpaces) {
      // Victory!
      setIsSolved(true);
      playSuccessSound(profile.soundEnabled);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn(e);
      }

      const streakBonus = Math.min(50, profile.streak * 10);
      const earnedXp = 60 + streakBonus;
      const creditMultiplier = getCreditMultiplier(profile.upgrades);
      const earnedCredits = Math.round((50 + Math.floor(streakBonus / 2)) * creditMultiplier);

      onUpdateProfile((prev) => {
        const nextStreak = prev.streak + 1;
        const updated = {
          ...prev,
          xp: prev.xp + earnedXp,
          credits: prev.credits + earnedCredits,
          streak: nextStreak,
          highestStreak: Math.max(prev.highestStreak, nextStreak),
          correctAnswers: prev.correctAnswers + 1,
          wordsMastered: prev.wordsMastered.includes(currentWord.id)
            ? prev.wordsMastered
            : [...prev.wordsMastered, currentWord.id]
        };
        setTimeout(() => onCheckBadges(updated), 100);
        return updated;
      });
    } else {
      // Wrong guess
      playErrorSound(profile.soundEnabled);
      setErrorMessage('Frequency mismatch! Clear and try again.');
      setShaking(true);
      setTimeout(() => setShaking(false), 500);

      onUpdateProfile(prev => ({
        ...prev,
        streak: 0
      }));
    }
  };

  // Clear current selections
  const handleClear = () => {
    setSelectedIndices([]);
    setErrorMessage('');
  };

  // Backspace one letter
  const handleBackspace = () => {
    if (selectedIndices.length > 0) {
      setSelectedIndices(selectedIndices.slice(0, -1));
      setErrorMessage('');
    }
  };

  // Hint: Reveal next letter
  const handleRevealNext = () => {
    if (isSolved) return;
    const currentConstructed = selectedIndices.map(i => scrambledLetters[i].char).join('');
    const nextTargetLetter = targetNoSpaces[currentConstructed.length];
    if (!nextTargetLetter) return;

    // Find an unused scrambled index with that letter
    const matchIdx = scrambledLetters.findIndex(
      (item, idx) => !selectedIndices.includes(idx) && item.char === nextTargetLetter
    );

    if (matchIdx !== -1) {
      const nextSelected = [...selectedIndices, matchIdx];
      setSelectedIndices(nextSelected);

      const newWord = nextSelected.map(i => scrambledLetters[i].char).join('');
      if (newWord.length === targetNoSpaces.length) {
        checkSubmission(newWord);
      }
    }
  };

  // Next word
  const handleNextWord = () => {
    playWarpSound(profile.soundEnabled);
    setCurrentWordIndex(prev => prev + 1);
  };

  const streakMultiplier = profile.streak >= 6 ? '3.0x Quantum' : profile.streak >= 3 ? '2.0x Warp' : '1.0x Base';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono uppercase tracking-wider mb-1">
            <span>Mission 01</span>
            <span aria-hidden="true">·</span>
            <span>Cosmic Decoder</span>
            <span aria-hidden="true">·</span>
            <span>Word { (currentWordIndex % VOCABULARY_LIST.length) + 1 } of { VOCABULARY_LIST.length }</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Decipher The Alien Frequency
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Click scrambled quantum letter tiles in the correct sequence to unlock the classified sci-fi term.
          </p>
        </div>

        {/* Streak and Multiplier status */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:self-start">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Zap className="w-5 h-5 fill-amber-400" />
            <span className="font-mono font-bold text-lg tabular-nums">{profile.streak}</span>
          </div>
          <div className="text-left border-l border-slate-700/80 pl-3">
            <div className="text-[11px] uppercase tracking-wider text-slate-400">Streak Combo</div>
            <div className="text-xs font-semibold text-cyan-300 font-mono">{streakMultiplier}</div>
          </div>
        </div>
      </div>

      {/* Main Holographic Puzzle Terminal */}
      <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
        {/* Subtle scanline effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent pointer-events-none" />

        {/* Category & Audio Pronunciation Row */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-slate-500 uppercase tracking-wider">Classification:</span>
            <span className="text-cyan-300 font-semibold">{currentWord.category}</span>
            <span aria-hidden="true">·</span>
            <span className="italic">{currentWord.partOfSpeech}</span>
          </div>

          <button
            onClick={() => speakWord(currentWord.word)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/60 rounded-lg transition-colors cursor-pointer"
            title="Listen to pronunciation guide"
          >
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>Hear Pronunciation ({currentWord.phonetic})</span>
          </button>
        </div>

        {/* Holographic Clue / Definition Box */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 mb-8">
          <div className="text-xs text-slate-500 uppercase font-mono tracking-wider mb-2">
            Holographic Definition Log:
          </div>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-medium">
            "{currentWord.definition}"
          </p>

          {showHint && (
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-sm text-amber-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Mission Intel:</strong> {currentWord.hint}</span>
            </div>
          )}
        </div>

        {/* Selected Answer Slot Row */}
        <div className="mb-8">
          <div className="text-xs text-slate-400 uppercase font-mono mb-2 flex justify-between items-center">
            <span>Decoded Buffer ({selectedIndices.length} / {targetNoSpaces.length}):</span>
            {errorMessage && (
              <span className="text-rose-400 font-semibold animate-pulse">{errorMessage}</span>
            )}
          </div>

          <div
            className={`min-h-[64px] flex flex-wrap items-center justify-center gap-4 sm:gap-6 p-4 bg-slate-950/80 border rounded-xl transition-all ${
              shaking ? 'border-rose-500 bg-rose-950/20' : isSolved ? 'border-emerald-500/80 bg-emerald-950/20' : 'border-slate-800'
            }`}
          >
            {(() => {
              let cumulativeSlot = 0;
              return wordTokens.map((token, tokenIdx) => {
                const tokenSlots = Array.from({ length: token.length }).map((_) => {
                  const currentSlotIdx = cumulativeSlot++;
                  const selectedScrambleIdx = selectedIndices[currentSlotIdx];
                  const letter = selectedScrambleIdx !== undefined ? scrambledLetters[selectedScrambleIdx]?.char : '';
                  return (
                    <div
                      key={currentSlotIdx}
                      className={`w-10 h-12 sm:w-12 sm:h-14 rounded-lg flex items-center justify-center font-mono text-xl sm:text-2xl font-bold transition-all ${
                        letter
                          ? isSolved
                            ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20'
                            : 'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-200 shadow-sm'
                          : 'border border-dashed border-slate-700 bg-slate-900/50 text-slate-600'
                      }`}
                    >
                      {letter || '_'}
                    </div>
                  );
                });

                return (
                  <div key={tokenIdx} className="flex items-center gap-2 sm:gap-2.5">
                    {tokenSlots}
                    {hasHyphen && tokenIdx < wordTokens.length - 1 && (
                      <span className="font-mono text-xl sm:text-2xl font-bold text-cyan-400 select-none px-1">
                        -
                      </span>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Scrambled Interactive Letter Tiles */}
        {!isSolved && (
          <div className="mb-6">
            <div className="text-xs text-slate-400 uppercase font-mono mb-3">
              Available Quantum Letter Tiles (Click to Assemble):
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              {scrambledLetters.map((item, idx) => {
                const isUsed = selectedIndices.includes(idx);
                return (
                  <button
                    key={idx}
                    disabled={isUsed}
                    onClick={() => handleLetterClick(idx)}
                    className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl font-mono text-2xl font-bold flex items-center justify-center transition-all cursor-pointer select-none ${
                      isUsed
                        ? 'opacity-25 bg-slate-800/40 text-slate-500 border border-slate-800 cursor-not-allowed transform scale-95'
                        : 'bg-slate-800 hover:bg-cyan-900/60 border border-slate-700 hover:border-cyan-400 text-white hover:text-cyan-200 active:scale-95 shadow-md shadow-black/40'
                    }`}
                  >
                    {item.char}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Controls Toolbar */}
        {!isSolved ? (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={handleBackspace}
                disabled={selectedIndices.length === 0}
                className="px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer"
              >
                Backspace
              </button>
              <button
                onClick={handleClear}
                disabled={selectedIndices.length === 0}
                className="px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHint(true)}
                disabled={showHint}
                className="px-3.5 py-2 text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Context Clue</span>
              </button>
              <button
                onClick={handleRevealNext}
                className="px-3.5 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reveal 1 Letter</span>
              </button>
            </div>
          </div>
        ) : (
          /* Victory Reveal Box */
          <div className="pt-4 border-t border-slate-800/80">
            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-5 mb-5">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-lg">Transmission Successfully Decoded!</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                <strong>In Context:</strong> {currentWord.sentence}
              </p>
              <div className="text-xs text-emerald-300/90 bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-3">
                <strong>Cosmic Lore:</strong> {currentWord.origin}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNextWord}
                className="px-6 py-3 font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <span>Next Transmission</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
