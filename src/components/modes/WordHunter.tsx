import { useState, useEffect, useCallback } from 'react';
import { PlayerProfile, VocabWord } from '../../types/game';
import { VOCABULARY_LIST, ALL_CURRICULUM_IDS } from '../../data/vocabulary';
import { getCreditMultiplier, getScannerLevel } from '../../data/upgrades';
import { playSuccessSound, playErrorSound, playWarpSound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Search, Sparkles, CheckCircle2, RotateCcw, ArrowRight, Zap, Lightbulb } from 'lucide-react';

interface WordHunterProps {
  profile: PlayerProfile;
  onUpdateProfile: (updater: (prev: PlayerProfile) => PlayerProfile) => void;
  onCheckBadges: (currentProfile: PlayerProfile) => void;
}

interface PlacedWord {
  word: VocabWord;
  cells: { r: number; c: number }[];
  found: boolean;
}

const GRID_SIZE = 10;

export default function WordHunter({
  profile,
  onUpdateProfile,
  onCheckBadges
}: WordHunterProps) {
  const [grid, setGrid] = useState<string[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [selectedCells, setSelectedCells] = useState<{ r: number; c: number }[]>([]);
  const [isRoundWon, setIsRoundWon] = useState(false);
  const [activeClueWord, setActiveClueWord] = useState<VocabWord | null>(null);

  const scannerLevel = getScannerLevel(profile.upgrades);
  const creditMultiplier = getCreditMultiplier(profile.upgrades);

  // Initialize Word Search Grid with 4-5 core curriculum words
  const initBoard = useCallback(() => {
    // Pick 4-5 words from curriculum (short enough to fit in 10x10)
    const curriculumWords = VOCABULARY_LIST.filter(
      w => ALL_CURRICULUM_IDS.includes(w.id) && w.word.replace(/[\s-]+/g, '').length <= GRID_SIZE
    );
    const shuffled = [...curriculumWords].sort(() => Math.random() - 0.5).slice(0, 5);

    // Empty grid
    const newGrid: string[][] = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => '')
    );

    const placed: PlacedWord[] = [];

    shuffled.forEach((w) => {
      const cleanWord = w.word.replace(/[\s-]+/g, '');
      let placedSuccessfully = false;
      let attempts = 0;

      while (!placedSuccessfully && attempts < 100) {
        attempts++;
        const isHorizontal = Math.random() > 0.5;
        const maxR = isHorizontal ? GRID_SIZE - 1 : GRID_SIZE - cleanWord.length;
        const maxC = isHorizontal ? GRID_SIZE - cleanWord.length : GRID_SIZE - 1;

        if (maxR < 0 || maxC < 0) continue;

        const startR = Math.floor(Math.random() * (maxR + 1));
        const startC = Math.floor(Math.random() * (maxC + 1));

        // Check collision
        let canPlace = true;
        const cells: { r: number; c: number }[] = [];

        for (let i = 0; i < cleanWord.length; i++) {
          const r = isHorizontal ? startR : startR + i;
          const c = isHorizontal ? startC + i : startC;
          if (newGrid[r][c] !== '' && newGrid[r][c] !== cleanWord[i]) {
            canPlace = false;
            break;
          }
          cells.push({ r, c });
        }

        if (canPlace) {
          cells.forEach((pos, idx) => {
            newGrid[pos.r][pos.c] = cleanWord[idx];
          });
          placed.push({ word: w, cells, found: false });
          placedSuccessfully = true;
        }
      }
    });

    // Fill empty cells with random letters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (newGrid[r][c] === '') {
          newGrid[r][c] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }

    setGrid(newGrid);
    setPlacedWords(placed);
    setSelectedCells([]);
    setIsRoundWon(false);
    setActiveClueWord(placed[0]?.word || null);
  }, []);

  useEffect(() => {
    initBoard();
  }, [initBoard]);

  const handleCellClick = (r: number, c: number) => {
    if (isRoundWon) return;

    // Check if clicking currently selected
    const isAlreadySelected = selectedCells.some(cell => cell.r === r && cell.c === c);

    let nextCells: { r: number; c: number }[];
    if (isAlreadySelected) {
      nextCells = selectedCells.filter(cell => !(cell.r === r && cell.c === c));
    } else {
      nextCells = [...selectedCells, { r, c }];
    }
    setSelectedCells(nextCells);

    // Check if the selection forms any unfound target word
    const formedLetters = nextCells.map(cell => grid[cell.r]?.[cell.c]).join('');
    const formedReverse = [...formedLetters].reverse().join('');

    const matchedIndex = placedWords.findIndex(
      pw =>
        !pw.found &&
        (pw.word.word.replace(/[\s-]+/g, '') === formedLetters ||
          pw.word.word.replace(/[\s-]+/g, '') === formedReverse)
    );

    if (matchedIndex !== -1) {
      // Found word!
      playSuccessSound(profile.soundEnabled);
      const matched = placedWords[matchedIndex];
      const updatedPlaced = [...placedWords];
      updatedPlaced[matchedIndex].found = true;
      setPlacedWords(updatedPlaced);
      setSelectedCells([]);
      setActiveClueWord(matched.word);

      const baseCredits = 60;
      const awardedCredits = Math.round(baseCredits * creditMultiplier);
      const awardedXp = 70;

      onUpdateProfile(prev => {
        const nextStreak = prev.streak + 1;
        const updated = {
          ...prev,
          xp: prev.xp + awardedXp,
          credits: prev.credits + awardedCredits,
          streak: nextStreak,
          highestStreak: Math.max(prev.highestStreak, nextStreak),
          correctAnswers: prev.correctAnswers + 1,
          wordsMastered: prev.wordsMastered.includes(matched.word.id)
            ? prev.wordsMastered
            : [...prev.wordsMastered, matched.word.id]
        };
        setTimeout(() => onCheckBadges(updated), 100);
        return updated;
      });

      // Check if all words found
      if (updatedPlaced.every(pw => pw.found)) {
        setIsRoundWon(true);
        try {
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {
          console.warn(e);
        }
      }
    }
  };

  const handleClearSelection = () => {
    setSelectedCells([]);
  };

  // Helper to test if a cell is part of an already found word
  const isCellFound = (r: number, c: number) => {
    return placedWords.some(pw => pw.found && pw.cells.some(cell => cell.r === r && cell.c === c));
  };

  // Tech scanner hint: show starting letter of first unfound word
  const firstUnfound = placedWords.find(pw => !pw.found);
  const hintStartCell = scannerLevel >= 2 && firstUnfound ? firstUnfound.cells[0] : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono uppercase tracking-wider mb-1">
            <span>Arcade Mini Game</span>
            <span aria-hidden="true">·</span>
            <span>Cyber-Grid Word Hunter</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Galactic Lexicon Matrix
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Locate and highlight the hidden science fiction words inside the quantum frequency grid.
          </p>
        </div>

        {/* Multipliers & Tech info */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3 sm:self-start">
          <div className="text-xs">
            <span className="text-slate-500 font-mono uppercase">Credit Booster:</span>{' '}
            <strong className="text-cyan-400 font-mono font-bold">{creditMultiplier}x</strong>
          </div>
          {scannerLevel >= 2 && (
            <div className="text-xs text-amber-400 border-l border-slate-800 pl-3 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Scanner Ping Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Game Interface */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: 10x10 Word Search Grid */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-2xl flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-4 text-xs font-mono text-slate-400">
            <span>Click letters in sequence to assemble word:</span>
            <button
              onClick={handleClearSelection}
              disabled={selectedCells.length === 0}
              className="px-2.5 py-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-850 cursor-pointer"
            >
              Clear ({selectedCells.length})
            </button>
          </div>

          {/* Grid Table */}
          <div className="grid grid-cols-10 gap-1.5 sm:gap-2 p-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl select-none">
            {grid.map((row, r) =>
              row.map((letter, c) => {
                const isSelected = selectedCells.some(cell => cell.r === r && cell.c === c);
                const isFound = isCellFound(r, c);
                const isHintCell = hintStartCell && hintStartCell.r === r && hintStartCell.c === c;

                let cellStyle = 'bg-slate-900/90 text-slate-200 border-slate-800 hover:bg-slate-800 hover:border-cyan-500/50';

                if (isFound) {
                  cellStyle = 'bg-emerald-950/50 border-emerald-500/80 text-emerald-300 font-extrabold shadow-sm';
                } else if (isSelected) {
                  cellStyle = 'bg-cyan-500/40 border-cyan-400 text-white font-extrabold ring-2 ring-cyan-400/50 scale-105';
                } else if (isHintCell) {
                  cellStyle = 'bg-amber-950/40 border-amber-400 text-amber-300 animate-pulse font-bold';
                }

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border font-mono text-sm sm:text-base font-bold flex items-center justify-center transition-all cursor-pointer ${cellStyle}`}
                  >
                    {letter}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Target Word Checklist & Intel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3 text-xs font-mono uppercase text-slate-400">
              <span className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span>Target Words ({placedWords.filter(p => p.found).length} / {placedWords.length}):</span>
              </span>
              <span className="text-amber-400 font-bold">+{Math.round(60 * creditMultiplier)} Credits / Word</span>
            </div>

            <div className="space-y-2">
              {placedWords.map((pw) => (
                <div
                  key={pw.word.id}
                  onClick={() => setActiveClueWord(pw.word)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    pw.found
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                      : activeClueWord?.id === pw.word.id
                      ? 'bg-cyan-950/40 border-cyan-500/60 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {pw.found ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
                    )}
                    <span className="font-mono text-sm font-bold tracking-wider">
                      {pw.word.word}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {pw.word.word.replace(/[\s-]+/g, '').length} Letters
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Word Clue Card */}
          {activeClueWord && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
                Selected Word Intel ({activeClueWord.category}):
              </div>
              <h4 className="text-lg font-bold font-mono text-white mb-2">
                {activeClueWord.word}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                "{activeClueWord.definition}"
              </p>
              <div className="p-3 bg-slate-950 rounded-xl text-xs text-slate-400 italic border border-slate-850">
                "{activeClueWord.sentence}"
              </div>
            </div>
          )}

          {/* Victory Card */}
          {isRoundWon && (
            <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-2xl p-5 text-center shadow-xl animate-fade-in">
              <h4 className="text-lg font-bold text-white font-display mb-1">
                Grid Fully Deciphered!
              </h4>
              <p className="text-xs text-emerald-300 mb-4">
                All hidden science fiction words were discovered! High command has logged your speed bonus.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={initBoard}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-lg shadow-cyan-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Generate New Matrix</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
