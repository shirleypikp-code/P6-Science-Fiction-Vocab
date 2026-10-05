import { useState, useEffect, useCallback } from 'react';
import { GameMode, PlayerProfile, Badge } from './types/game';
import { loadPlayerProfile, savePlayerProfile } from './utils/storage';
import { BADGES, CORE_SEVEN_IDS, ALL_CURRICULUM_IDS } from './data/vocabulary';
import { playLevelUpSound } from './utils/audio';
import confetti from 'canvas-confetti';

import Starfield from './components/Starfield';
import Navbar from './components/Navbar';
import CommandDeck from './components/modes/CommandDeck';
import WarpDecoder from './components/modes/WarpDecoder';
import AlienTransmission from './components/modes/AlienTransmission';
import WarpCoreStory from './components/modes/WarpCoreStory';
import AsteroidQuiz from './components/modes/AsteroidQuiz';
import HoloCodex from './components/modes/HoloCodex';
import StarshipHangar from './components/modes/StarshipHangar';
import CadetCertificate from './components/CadetCertificate';
import BadgeToast from './components/BadgeToast';

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(() => loadPlayerProfile());
  const [currentMode, setCurrentMode] = useState<GameMode>('menu');
  const [showCertificate, setShowCertificate] = useState(false);
  const [activeBadgeToast, setActiveBadgeToast] = useState<Badge | null>(null);

  // Save profile changes to local storage
  useEffect(() => {
    savePlayerProfile(profile);
  }, [profile]);

  // Badge unlock evaluator
  const checkBadges = useCallback((p: PlayerProfile) => {
    const newlyUnlocked: string[] = [];

    BADGES.forEach((b) => {
      if (p.unlockedBadges.includes(b.id)) return;

      let qualify = false;
      if (b.id === 'curriculum-master' && ALL_CURRICULUM_IDS.every(id => p.wordsMastered.includes(id))) qualify = true;
      if (b.id === 'core-seven-master' && CORE_SEVEN_IDS.every(id => p.wordsMastered.includes(id))) qualify = true;
      if (b.id === 'first-contact' && p.wordsMastered.length >= 1) qualify = true;
      if (b.id === 'speed-of-light' && p.streak >= 5) qualify = true;
      if (b.id === 'hyperdrive-10' && p.streak >= 10) qualify = true;
      if (b.id === 'core-savior' && p.wordsMastered.filter(id => CORE_SEVEN_IDS.includes(id)).length >= 5) qualify = true;
      if (b.id === 'lexicon-master' && p.wordsMastered.length >= 7) qualify = true;
      if (b.id === 'ship-captain' && p.currentShip !== 'ship-scout') qualify = true;
      if (b.id === 'alien-companion' && p.currentPet !== 'pet-none') qualify = true;
      if (b.id === 'astronomer-ear' && p.xp >= 300) qualify = true;

      if (qualify) {
        newlyUnlocked.push(b.id);
      }
    });

    if (newlyUnlocked.length > 0) {
      const firstBadge = BADGES.find((b) => b.id === newlyUnlocked[0]);
      if (firstBadge) {
        setActiveBadgeToast(firstBadge);
        playLevelUpSound(p.soundEnabled);
        try {
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.7 }
          });
        } catch (e) {
          console.warn(e);
        }
      }

      setProfile((prev) => ({
        ...prev,
        unlockedBadges: [...prev.unlockedBadges, ...newlyUnlocked]
      }));
    }
  }, []);

  const handleToggleSound = () => {
    setProfile((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled
    }));
  };

  const isWarpSpeed = profile.streak >= 3;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Dynamic Starfield Background */}
      <Starfield isWarpSpeed={isWarpSpeed} />

      {/* Top Bar Navigation */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        profile={profile}
        onToggleSound={handleToggleSound}
        onOpenCertificate={() => setShowCertificate(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 pb-16">
        {currentMode === 'menu' && (
          <CommandDeck
            profile={profile}
            onSelectMode={setCurrentMode}
            onUpdateProfile={setProfile}
            onOpenCertificate={() => setShowCertificate(true)}
          />
        )}

        {currentMode === 'decoder' && (
          <WarpDecoder
            profile={profile}
            onUpdateProfile={setProfile}
            onCheckBadges={checkBadges}
          />
        )}

        {currentMode === 'transmission' && (
          <AlienTransmission
            profile={profile}
            onUpdateProfile={setProfile}
            onCheckBadges={checkBadges}
          />
        )}

        {currentMode === 'story-cloze' && (
          <WarpCoreStory
            profile={profile}
            onUpdateProfile={setProfile}
            onCheckBadges={checkBadges}
          />
        )}

        {currentMode === 'asteroid-quiz' && (
          <AsteroidQuiz
            profile={profile}
            onUpdateProfile={setProfile}
            onCheckBadges={checkBadges}
          />
        )}

        {currentMode === 'holo-codex' && (
          <HoloCodex
            profile={profile}
            onUpdateProfile={setProfile}
            onCheckBadges={checkBadges}
          />
        )}

        {currentMode === 'hangar' && (
          <StarshipHangar
            profile={profile}
            onUpdateProfile={setProfile}
            onCheckBadges={checkBadges}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-[#0B0F19]/80 py-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Starfleet Academy Primary 6 Sci-Fi Lexicon Expedition
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>24 Sci-Fi Vocabulary Words</span>
            <span aria-hidden="true">·</span>
            <span>Audio Guides</span>
            <span aria-hidden="true">·</span>
            <span>Starship Rewards</span>
          </div>
        </div>
      </footer>

      {/* Starfleet Cadet Certificate Modal */}
      {showCertificate && (
        <CadetCertificate
          profile={profile}
          onClose={() => setShowCertificate(false)}
        />
      )}

      {/* Badge Achievement Toast */}
      <BadgeToast
        badge={activeBadgeToast}
        onDismiss={() => setActiveBadgeToast(null)}
      />
    </div>
  );
}
