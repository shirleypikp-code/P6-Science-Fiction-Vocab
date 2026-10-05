import { useState, useEffect, useCallback } from 'react';
import { PlayerProfile, VocabWord } from '../../types/game';
import { VOCABULARY_LIST } from '../../data/vocabulary';
import { getMaxShields, getCreditMultiplier } from '../../data/upgrades';
import { playLaserSound, playErrorSound, playSuccessSound, playLevelUpSound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Shield, Zap, RotateCcw, Target, Sparkles, Award } from 'lucide-react';
import StarshipVisualizer from '../StarshipVisualizer';

interface AsteroidQuizProps {
  profile: PlayerProfile;
  onUpdateProfile: (updater: (prev: PlayerProfile) => PlayerProfile) => void;
  onCheckBadges: (currentProfile: PlayerProfile) => void;
}

interface Question {
  prompt: string;
  type: 'definition' | 'fill-blank' | 'synonym';
  correctWord: VocabWord;
  options: string[];
}

export default function AsteroidQuiz({
  profile,
  onUpdateProfile,
  onCheckBadges
}: AsteroidQuizProps) {
  const maxShields = getMaxShields(profile.upgrades);
  const creditMultiplier = getCreditMultiplier(profile.upgrades);

  const [shields, setShields] = useState(maxShields);
  const [wave, setWave] = useState(1);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [laserFiring, setLaserFiring] = useState(false);
  const [asteroidExploding, setAsteroidExploding] = useState(false);
  const [shieldImpact, setShieldImpact] = useState(false);

  // Generate question
  const generateQuestion = useCallback(() => {
    const target = VOCABULARY_LIST[Math.floor(Math.random() * VOCABULARY_LIST.length)];
    const distractors = VOCABULARY_LIST
      .filter(w => w.id !== target.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.word);

    const questionTypes: ('definition' | 'fill-blank' | 'synonym')[] = ['definition', 'fill-blank', 'synonym'];
    const selectedType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    let prompt = '';
    if (selectedType === 'definition') {
      prompt = `Which sci-fi term means: "${target.definition}"?`;
    } else if (selectedType === 'fill-blank') {
      const sentenceWithBlank = target.sentence.replace(new RegExp(target.word, 'gi'), '__________');
      prompt = `Fill the blank: "${sentenceWithBlank}"`;
    } else {
      prompt = `Which sci-fi concept relates to: "${target.synonyms.join(', ')}"?`;
    }

    const options = [...distractors, target.word].sort(() => Math.random() - 0.5);

    setCurrentQuestion({
      prompt,
      type: selectedType,
      correctWord: target,
      options
    });
    setSelectedAnswer(null);
  }, []);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleSelectOption = (option: string) => {
    if (!currentQuestion || selectedAnswer || isGameOver) return;
    setSelectedAnswer(option);

    const isCorrect = option === currentQuestion.correctWord.word;

    if (isCorrect) {
      // Correct! Fire plasma cannon
      setLaserFiring(true);
      playLaserSound(profile.soundEnabled);

      setTimeout(() => {
        setAsteroidExploding(true);
        playSuccessSound(profile.soundEnabled);
      }, 200);

      const addedPoints = 50 + wave * 10;
      setScore(prev => prev + addedPoints);

      onUpdateProfile(prev => {
        const nextStreak = prev.streak + 1;
        const updated = {
          ...prev,
          xp: prev.xp + addedPoints,
          credits: prev.credits + Math.round(addedPoints * 0.8 * creditMultiplier),
          streak: nextStreak,
          highestStreak: Math.max(prev.highestStreak, nextStreak),
          correctAnswers: prev.correctAnswers + 1,
          wordsMastered: prev.wordsMastered.includes(currentQuestion.correctWord.id)
            ? prev.wordsMastered
            : [...prev.wordsMastered, currentQuestion.correctWord.id]
        };
        setTimeout(() => onCheckBadges(updated), 100);
        return updated;
      });

      setTimeout(() => {
        setLaserFiring(false);
        setAsteroidExploding(false);
        setWave(prev => prev + 1);
        generateQuestion();
      }, 1100);
    } else {
      // Asteroid strikes shield!
      playErrorSound(profile.soundEnabled);
      setShieldImpact(true);
      setTimeout(() => setShieldImpact(false), 500);

      const nextShields = shields - 1;
      setShields(nextShields);

      onUpdateProfile(prev => ({
        ...prev,
        streak: 0
      }));

      if (nextShields <= 0) {
        setIsGameOver(true);
      } else {
        setTimeout(() => {
          generateQuestion();
        }, 1200);
      }
    }
  };

  const restartMission = () => {
    setShields(maxShields);
    setWave(1);
    setScore(0);
    setIsGameOver(false);
    generateQuestion();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono uppercase tracking-wider mb-1">
            <span>Mission 04</span>
            <span aria-hidden="true">·</span>
            <span>Asteroid Defense</span>
            <span aria-hidden="true">·</span>
            <span>Wave {wave}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Plasma Shield Defense
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Incoming space debris detected! Answer vocabulary queries to vaporize asteroids before they breach your hull.
          </p>
        </div>

        {/* Live HUD: Shields & Score */}
        <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:self-start">
          {/* Shields */}
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-mono mb-1">
              Hull Shields ({shields}/{maxShields})
            </div>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: maxShields }).map((_, idx) => (
                <Shield
                  key={idx}
                  className={`w-5 h-5 transition-all ${
                    idx < shields
                      ? 'text-cyan-400 fill-cyan-400/30'
                      : 'text-slate-700 fill-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="border-l border-slate-800 pl-4">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-mono mb-1">
              Wave Score
            </div>
            <div className="text-base font-mono font-bold text-amber-400 tabular-nums">
              {score} PTS
            </div>
          </div>
        </div>
      </div>

      {/* Main Defense Arena */}
      {!isGameOver ? (
        <div className={`mt-8 bg-slate-900/60 border rounded-2xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden transition-all shadow-2xl ${
          shieldImpact ? 'border-rose-500 bg-rose-950/20' : 'border-slate-800'
        }`}>
          {/* Visual Battlefield Canvas */}
          <div className="relative h-48 sm:h-56 bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-between px-6 sm:px-12 mb-6">
            {/* Player Starship */}
            <div className="relative z-10">
              <StarshipVisualizer
                shipId={profile.currentShip}
                petId={profile.currentPet}
                shieldId={profile.currentShield}
                size="md"
              />
            </div>

            {/* Laser Beam Animation */}
            {laserFiring && (
              <div className="absolute left-28 sm:left-48 right-28 sm:right-48 h-1.5 bg-gradient-to-r from-cyan-400 via-sky-200 to-cyan-500 shadow-[0_0_12px_#38bdf8] animate-pulse z-20" />
            )}

            {/* Approaching Asteroid / Target */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 transition-all flex items-center justify-center font-bold text-2xl select-none ${
                  asteroidExploding
                    ? 'scale-150 opacity-0 bg-amber-500 border-amber-300 text-white duration-500'
                    : 'bg-stone-800 border-stone-600 text-stone-300 shadow-inner'
                }`}
              >
                {asteroidExploding ? '💥' : '☄️'}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-2">
                Asteroid #{wave}
              </div>
            </div>
          </div>

          {/* Question Prompt */}
          {currentQuestion && (
            <div className="mb-6">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span>Targeting Computer Query:</span>
              </div>
              <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl text-base sm:text-lg text-white font-medium leading-relaxed">
                {currentQuestion.prompt}
              </div>
            </div>
          )}

          {/* Answer Options Grid */}
          {currentQuestion && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQuestion.correctWord.word;

                let btnStyle = 'bg-slate-950/70 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700';

                if (selectedAnswer) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950/40 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-950/40 border-rose-500 text-rose-300';
                  } else {
                    btnStyle = 'opacity-40 bg-slate-950/40 border-slate-800 text-slate-500';
                  }
                }

                return (
                  <button
                    key={option}
                    disabled={selectedAnswer !== null}
                    onClick={() => handleSelectOption(option)}
                    className={`p-4 rounded-xl border font-mono text-base font-bold transition-all text-left flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{option}</span>
                    <span className="text-xs font-normal text-slate-500 font-sans">
                      Fire
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Game Over / Mission Debrief */
        <div className="mt-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-rose-400" />
          </div>
          <h3 className="text-2xl font-bold text-white font-display">
            Hull Shields Depleted!
          </h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-2 mb-6">
            Your starship survived through <strong>Wave {wave - 1}</strong> with a total defensive score of <strong>{score} points</strong>.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={restartMission}
              className="px-6 py-3 font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Relaunch Defense Shields</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
