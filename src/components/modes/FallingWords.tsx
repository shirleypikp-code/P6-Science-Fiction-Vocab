import { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerProfile, VocabWord } from '../../types/game';
import { VOCABULARY_LIST, ALL_CURRICULUM_IDS } from '../../data/vocabulary';
import { getCreditMultiplier, getMaxShields, getChronoBonus } from '../../data/upgrades';
import { playLaserSound, playSuccessSound, playErrorSound } from '../../utils/audio';
import StarshipVisualizer from '../StarshipVisualizer';
import { Shield, Zap, RotateCcw, Target, Sparkles, Rocket } from 'lucide-react';

interface FallingWordsProps {
  profile: PlayerProfile;
  onUpdateProfile: (updater: (prev: PlayerProfile) => PlayerProfile) => void;
  onCheckBadges: (currentProfile: PlayerProfile) => void;
}

interface FallingPod {
  id: string;
  word: VocabWord;
  isCorrect: boolean;
  xPercent: number; // 15 to 85%
  yPercent: number; // 0 to 100%
  speed: number;
}

export default function FallingWords({
  profile,
  onUpdateProfile,
  onCheckBadges
}: FallingWordsProps) {
  const maxShields = getMaxShields(profile.upgrades);
  const creditMultiplier = getCreditMultiplier(profile.upgrades);
  const chronoBonus = getChronoBonus(profile.upgrades);

  const [shields, setShields] = useState(maxShields);
  const [wave, setWave] = useState(1);
  const [score, setScore] = useState(0);
  const [targetWord, setTargetWord] = useState<VocabWord | null>(null);
  const [pods, setPods] = useState<FallingPod[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [laserEffect, setLaserEffect] = useState<{ x: number; y: number } | null>(null);

  const animationFrameRef = useRef<number | null>(null);

  // Setup next wave with 3-4 falling pods
  const spawnWave = useCallback((currentWaveNumber: number) => {
    // Focus primarily on curriculum words
    const targetPool = VOCABULARY_LIST.filter(w => ALL_CURRICULUM_IDS.includes(w.id));
    const target = targetPool[Math.floor(Math.random() * targetPool.length)];

    const distractors = VOCABULARY_LIST
      .filter(w => w.id !== target.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const waveWords = [...distractors, target].sort(() => Math.random() - 0.5);

    // Speed slowed down if chrono-warp is upgraded
    const baseSpeed = 0.18 + currentWaveNumber * 0.02;
    const effectiveSpeed = chronoBonus > 0 ? baseSpeed * 0.8 : baseSpeed;

    const newPods: FallingPod[] = waveWords.map((word, idx) => ({
      id: `${word.id}-${Date.now()}-${idx}`,
      word,
      isCorrect: word.id === target.id,
      xPercent: 12 + idx * 24 + Math.random() * 6,
      yPercent: -10 - Math.random() * 20,
      speed: effectiveSpeed + Math.random() * 0.05
    }));

    setTargetWord(target);
    setPods(newPods);
  }, [chronoBonus]);

  // Start game on mount
  useEffect(() => {
    setShields(maxShields);
    setWave(1);
    setScore(0);
    setIsGameOver(false);
    spawnWave(1);
  }, [maxShields, spawnWave]);

  // Main animation loop
  useEffect(() => {
    if (isGameOver || isPaused) return;

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 16.66; // normalize to 60fps
      lastTime = currentTime;

      setPods((prevPods) => {
        let reachedBottom = false;
        const updated = prevPods.map((p) => {
          const newY = p.yPercent + p.speed * delta;
          if (newY >= 92 && p.isCorrect) {
            reachedBottom = true;
          }
          return { ...p, yPercent: newY };
        });

        if (reachedBottom) {
          // The correct word hit bottom! Shield takes damage
          playErrorSound(profile.soundEnabled);
          setShields((prevShields) => {
            const nextShields = prevShields - 1;
            if (nextShields <= 0) {
              setIsGameOver(true);
            } else {
              setTimeout(() => {
                setWave((w) => {
                  const nextW = w + 1;
                  spawnWave(nextW);
                  return nextW;
                });
              }, 400);
            }
            return nextShields;
          });
          return [];
        }

        return updated.filter((p) => p.yPercent < 105);
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isGameOver, isPaused, profile.soundEnabled, spawnWave]);

  const handleCatchPod = (pod: FallingPod) => {
    if (isGameOver || isPaused) return;

    if (pod.isCorrect) {
      // Victory hit!
      playLaserSound(profile.soundEnabled);
      setLaserEffect({ x: pod.xPercent, y: pod.yPercent });

      setTimeout(() => {
        playSuccessSound(profile.soundEnabled);
        setLaserEffect(null);
      }, 150);

      const baseCredits = 50 + wave * 10;
      const awardedCredits = Math.round(baseCredits * creditMultiplier);
      const awardedScore = 80 + wave * 15;

      setScore((s) => s + awardedScore);

      onUpdateProfile((prev) => {
        const nextStreak = prev.streak + 1;
        const updated = {
          ...prev,
          xp: prev.xp + awardedScore,
          credits: prev.credits + awardedCredits,
          streak: nextStreak,
          highestStreak: Math.max(prev.highestStreak, nextStreak),
          correctAnswers: prev.correctAnswers + 1,
          wordsMastered: prev.wordsMastered.includes(pod.word.id)
            ? prev.wordsMastered
            : [...prev.wordsMastered, pod.word.id]
        };
        setTimeout(() => onCheckBadges(updated), 100);
        return updated;
      });

      // Clear pods and spawn next wave
      setPods([]);
      setTimeout(() => {
        setWave((w) => {
          const nextW = w + 1;
          spawnWave(nextW);
          return nextW;
        });
      }, 350);
    } else {
      // Wrong pod clicked!
      playErrorSound(profile.soundEnabled);
      setPods((prev) => prev.filter((p) => p.id !== pod.id));

      setShields((prevShields) => {
        const next = prevShields - 1;
        if (next <= 0) {
          setIsGameOver(true);
        }
        return next;
      });

      onUpdateProfile((prev) => ({
        ...prev,
        streak: 0
      }));
    }
  };

  const restartGame = () => {
    setShields(maxShields);
    setWave(1);
    setScore(0);
    setIsGameOver(false);
    spawnWave(1);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono uppercase tracking-wider mb-1">
            <span>Arcade Mini Game</span>
            <span aria-hidden="true">·</span>
            <span>Cosmic Cargo Drop</span>
            <span aria-hidden="true">·</span>
            <span>Wave {wave}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Falling Word Interceptor
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Read the target definition and tap the descending cargo pod containing the matching sci-fi word before it falls.
          </p>
        </div>

        {/* HUD Counters */}
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl p-3 sm:self-start">
          {/* Shields */}
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-mono mb-1">
              Shields ({shields}/{maxShields})
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: maxShields }).map((_, idx) => (
                <Shield
                  key={idx}
                  className={`w-4 h-4 ${
                    idx < shields ? 'text-cyan-400 fill-cyan-400/40' : 'text-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="border-l border-slate-800 pl-4">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-mono mb-1">
              Score
            </div>
            <div className="text-base font-mono font-bold text-amber-400 tabular-nums">
              {score} PTS
            </div>
          </div>
        </div>
      </div>

      {!isGameOver ? (
        <div className="mt-8 space-y-4">
          {/* Target Query Panel */}
          {targetWord && (
            <div className="p-4 bg-slate-900/90 border-2 border-cyan-500/50 rounded-2xl shadow-lg shadow-cyan-500/10">
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                <Target className="w-3.5 h-3.5" />
                <span>Interception Directive ({targetWord.category}):</span>
              </div>
              <p className="text-base sm:text-lg font-medium text-white">
                "{targetWord.definition}"
              </p>
            </div>
          )}

          {/* Falling Arena Canvas View */}
          <div className="relative h-[480px] bg-slate-950/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
            {/* Atmospheric Re-entry Danger Line at Bottom */}
            <div className="absolute bottom-16 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent border-t border-dashed border-rose-500/40 pointer-events-none" />
            <div className="absolute bottom-18 right-6 text-[10px] font-mono text-rose-400 uppercase tracking-widest pointer-events-none">
              Atmospheric Re-entry Limit
            </div>

            {/* Laser Line Visual */}
            {laserEffect && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
                <line
                  x1="50%"
                  y1="90%"
                  x2={`${laserEffect.x}%`}
                  y2={`${laserEffect.y}%`}
                  stroke="#38bdf8"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="animate-pulse shadow-lg"
                />
              </svg>
            )}

            {/* Falling Cargo Pods */}
            {pods.map((pod) => (
              <button
                key={pod.id}
                onClick={() => handleCatchPod(pod)}
                style={{
                  left: `${pod.xPercent}%`,
                  top: `${pod.yPercent}%`
                }}
                className="absolute -translate-x-1/2 p-3 sm:p-4 rounded-2xl bg-slate-900/90 hover:bg-cyan-900/90 border-2 border-cyan-400/80 hover:border-cyan-300 text-white font-mono text-xs sm:text-sm font-bold shadow-xl shadow-cyan-500/20 active:scale-95 transition-transform cursor-pointer z-20 flex flex-col items-center gap-1 select-none"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping mb-0.5" />
                <span className="tracking-wider">{pod.word.word}</span>
                <span className="text-[10px] text-slate-400 font-sans font-normal italic">
                  {pod.word.partOfSpeech}
                </span>
              </button>
            ))}

            {/* Player Starship Docked at Bottom */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
              <StarshipVisualizer
                shipId={profile.currentShip}
                petId={profile.currentPet}
                shieldId={profile.currentShield}
                size="sm"
              />
              <div className="text-[10px] font-mono text-slate-500 mt-1">
                Orbital Defense Station
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Game Over Screen */
        <div className="mt-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-rose-400" />
          </div>
          <h3 className="text-2xl font-bold text-white font-display">
            Planetary Shields Collapsed!
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mt-2 mb-6">
            You successfully intercepted cargo through <strong>Wave {wave - 1}</strong> with a total defensive score of <strong>{score} points</strong>!
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={restartGame}
              className="px-6 py-3 font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Relaunch Interceptor Mission</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
