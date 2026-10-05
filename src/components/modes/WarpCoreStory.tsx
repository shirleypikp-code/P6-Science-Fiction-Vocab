import { useState } from 'react';
import { PlayerProfile } from '../../types/game';
import { STORY_CHAPTERS, VOCABULARY_LIST } from '../../data/vocabulary';
import { playSuccessSound, playErrorSound, playLevelUpSound, speakWord } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { BookOpen, CheckCircle, ArrowRight, Volume2, ShieldAlert, Sparkles, Award } from 'lucide-react';

interface WarpCoreStoryProps {
  profile: PlayerProfile;
  onUpdateProfile: (updater: (prev: PlayerProfile) => PlayerProfile) => void;
  onCheckBadges: (currentProfile: PlayerProfile) => void;
}

export default function WarpCoreStory({
  profile,
  onUpdateProfile,
  onCheckBadges
}: WarpCoreStoryProps) {
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);

  const chapter = STORY_CHAPTERS[currentChapterIdx];
  const targetWord = VOCABULARY_LIST.find(w => w.id === chapter.missingWordId);

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    const correct = option.toUpperCase() === targetWord?.word.toUpperCase();
    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      playSuccessSound(profile.soundEnabled);
      if (!completedChapters.includes(chapter.id)) {
        setCompletedChapters(prev => [...prev, chapter.id]);
      }

      onUpdateProfile(prev => {
        const nextStreak = prev.streak + 1;
        const updated = {
          ...prev,
          xp: prev.xp + 80,
          credits: prev.credits + 60,
          streak: nextStreak,
          highestStreak: Math.max(prev.highestStreak, nextStreak),
          correctAnswers: prev.correctAnswers + 1,
          wordsMastered: prev.wordsMastered.includes(chapter.missingWordId)
            ? prev.wordsMastered
            : [...prev.wordsMastered, chapter.missingWordId]
        };
        setTimeout(() => onCheckBadges(updated), 100);
        return updated;
      });

      // If final chapter completed, huge victory!
      if (chapter.id === STORY_CHAPTERS.length) {
        playLevelUpSound(profile.soundEnabled);
        try {
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.5 }
          });
        } catch (e) {
          console.warn(e);
        }
      }
    } else {
      playErrorSound(profile.soundEnabled);
      onUpdateProfile(prev => ({
        ...prev,
        streak: 0
      }));
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIdx < STORY_CHAPTERS.length - 1) {
      setCurrentChapterIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    }
  };

  const handleJumpChapter = (idx: number) => {
    setCurrentChapterIdx(idx);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  const allCompleted = completedChapters.length === STORY_CHAPTERS.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono uppercase tracking-wider mb-1">
          <span>Mission 03</span>
          <span aria-hidden="true">·</span>
          <span>Warp Core Adventure</span>
          <span aria-hidden="true">·</span>
          <span>The Odyssey of Sector 7</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
          Narrative Starship Cloze Expedition
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Read each tactical mission log and restore the missing science fiction terminology to keep the crew safe.
        </p>
      </div>

      {/* Chapter Stepper */}
      <div className="mt-6 flex items-center justify-between gap-2 overflow-x-auto pb-2">
        {STORY_CHAPTERS.map((ch, idx) => {
          const isDone = completedChapters.includes(ch.id);
          const isCurrent = idx === currentChapterIdx;

          return (
            <button
              key={ch.id}
              onClick={() => handleJumpChapter(idx)}
              className={`flex-1 min-w-[120px] p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-md shadow-cyan-500/10'
                  : isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                <span>Part 0{ch.id}</span>
                {isDone && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <div className="text-xs font-semibold truncate">
                {ch.title.split(':')[1]?.trim() || ch.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Story Stage Panel */}
      <div className="mt-8 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Mission Scenario Briefing:</span>
          </div>

          {targetWord && (
            <button
              onClick={() => speakWord(`${chapter.scenario}. ${chapter.prompt}`)}
              className="flex items-center gap-1.5 px-3 py-1 text-xs text-cyan-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Read Aloud</span>
            </button>
          )}
        </div>

        {/* Narrative Box */}
        <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-5 mb-6 leading-relaxed">
          <p className="text-slate-300 text-base mb-3 italic">
            {chapter.scenario}
          </p>
          <div className="text-lg text-white font-medium p-4 bg-slate-900/90 border-l-4 border-cyan-400 rounded-r-lg">
            {chapter.prompt}
          </div>
        </div>

        {/* Missing Cloze Word Slot Options */}
        <div className="space-y-3 mb-6">
          <div className="text-xs font-mono uppercase text-slate-400">
            Select the Correct Vocabulary Term to Repair the System:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {chapter.options.map((opt) => {
              const isSelected = selectedOption === opt;
              const isTarget = targetWord?.word === opt;

              let style = 'bg-slate-950/60 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700';

              if (isAnswered) {
                if (isTarget) {
                  style = 'bg-emerald-950/40 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20';
                } else if (isSelected && !isTarget) {
                  style = 'bg-rose-950/40 border-rose-500 text-rose-300';
                } else {
                  style = 'opacity-40 bg-slate-950/40 border-slate-800 text-slate-500';
                }
              }

              return (
                <button
                  key={opt}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-xl border font-mono text-base font-bold transition-all text-left flex items-center justify-between cursor-pointer ${style}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isTarget && (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  )}
                  {isAnswered && isSelected && !isTarget && (
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation and Next Control */}
        {isAnswered && (
          <div className="pt-4 border-t border-slate-800">
            <div className={`p-4 rounded-xl mb-4 text-sm ${
              isCorrect
                ? 'bg-emerald-950/30 border border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/30 border border-rose-500/40 text-rose-200'
            }`}>
              <div className="font-semibold mb-1">
                {isCorrect ? '✓ Diagnostic Confirmed!' : '✗ System Calibration Error:'}
              </div>
              <p>{chapter.explanation}</p>
              {targetWord && (
                <p className="mt-2 text-xs text-slate-400">
                  <strong>Lore note:</strong> {targetWord.origin}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              {currentChapterIdx < STORY_CHAPTERS.length - 1 ? (
                <button
                  onClick={handleNextChapter}
                  className="px-6 py-2.5 font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Proceed to Chapter {currentChapterIdx + 2}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="text-center w-full py-4">
                  <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-lg mb-2">
                    <Award className="w-6 h-6 text-amber-400" />
                    <span>Sector 7 Expedition Completed!</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    You have restored the ship's warp core and guided the colonists to safety!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {allCompleted && (
        <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <div className="text-sm font-bold text-amber-300">Warp Core Savior Trophy Unlocked!</div>
              <div className="text-xs text-slate-400">All 5 chapters of Sector 7 have been successfully decoded and logged in Starfleet archives.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
