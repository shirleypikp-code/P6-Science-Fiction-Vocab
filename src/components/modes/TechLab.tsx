import { useState } from 'react';
import { PlayerProfile, TechUpgrade } from '../../types/game';
import { TECH_UPGRADES } from '../../data/upgrades';
import { playLevelUpSound, playClickSound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, Check, ArrowUpCircle, ShieldCheck, Zap, Cpu } from 'lucide-react';

interface TechLabProps {
  profile: PlayerProfile;
  onUpdateProfile: (updater: (prev: PlayerProfile) => PlayerProfile) => void;
  onCheckBadges: (currentProfile: PlayerProfile) => void;
}

export default function TechLab({
  profile,
  onUpdateProfile,
  onCheckBadges
}: TechLabProps) {
  const [selectedUpgradeId, setSelectedUpgradeId] = useState<string>(TECH_UPGRADES[0].id);

  const handlePurchaseUpgrade = (upgrade: TechUpgrade) => {
    const currentLvl = profile.upgrades[upgrade.id] || 1;
    if (currentLvl >= upgrade.maxLevel) return;

    const nextLvlConfig = upgrade.levels[currentLvl]; // 0-based: index currentLvl is next level
    if (!nextLvlConfig || profile.credits < nextLvlConfig.cost) return;

    playLevelUpSound(profile.soundEnabled);
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn(e);
    }

    onUpdateProfile((prev) => {
      const updatedCredits = prev.credits - nextLvlConfig.cost;
      const updatedUpgrades = {
        ...prev.upgrades,
        [upgrade.id]: currentLvl + 1
      };

      const updated = {
        ...prev,
        credits: updatedCredits,
        upgrades: updatedUpgrades
      };

      setTimeout(() => onCheckBadges(updated), 100);
      return updated;
    });
  };

  const activeUpgrade = TECH_UPGRADES.find((u) => u.id === selectedUpgradeId) || TECH_UPGRADES[0];
  const activeLevel = profile.upgrades[activeUpgrade.id] || 1;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono uppercase tracking-wider mb-1">
            <span>Engineering Division</span>
            <span aria-hidden="true">·</span>
            <span>Starfleet Tech Lab & Upgrades</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Starship System Upgrades
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Spend your earned Cosmic Credits to enhance deflector shields, credit yield boosters, word scanners, and temporal chronometers.
          </p>
        </div>

        {/* Credit Balance */}
        <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 sm:self-start">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <div>
            <div className="text-[11px] font-mono uppercase text-slate-400">Available Credits</div>
            <div className="text-lg font-mono font-bold text-cyan-300 tabular-nums">
              {profile.credits} Credits
            </div>
          </div>
        </div>
      </div>

      {/* Main Upgrades Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Upgrades List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Available Starship Modules (Spend Credits to Upgrade):</span>
          </div>

          <div className="space-y-3.5">
            {TECH_UPGRADES.map((upgrade) => {
              const currentLvl = profile.upgrades[upgrade.id] || 1;
              const isMax = currentLvl >= upgrade.maxLevel;
              const nextLvlConfig = !isMax ? upgrade.levels[currentLvl] : null;
              const canAfford = nextLvlConfig ? profile.credits >= nextLvlConfig.cost : false;
              const isSelected = selectedUpgradeId === upgrade.id;

              return (
                <div
                  key={upgrade.id}
                  onClick={() => setSelectedUpgradeId(upgrade.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-slate-900/90 border-cyan-400 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shrink-0">
                      {upgrade.icon}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-base">
                          {upgrade.name}
                        </h4>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                          Tier {currentLvl} / {upgrade.maxLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {upgrade.levels[currentLvl - 1]?.effectDescription}
                      </p>
                    </div>
                  </div>

                  {/* Purchase Action Button */}
                  <div className="shrink-0 self-end sm:self-center">
                    {isMax ? (
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/50 px-3 py-1.5 rounded-xl">
                        <Check className="w-3.5 h-3.5" /> MAX LEVEL
                      </span>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePurchaseUpgrade(upgrade);
                        }}
                        className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30 active:scale-95'
                            : 'bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed'
                        }`}
                      >
                        <ArrowUpCircle className="w-4 h-4" />
                        <span>Upgrade ({nextLvlConfig?.cost} Cr)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Module Deep Dive & Blueprint */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 backdrop-blur-md sticky top-24 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-3xl">
              {activeUpgrade.icon}
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase text-cyan-400 tracking-wider">
                Module Schematic
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                {activeUpgrade.name}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {activeUpgrade.description}
          </p>

          {/* Level Progression Stepper */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-mono uppercase text-slate-400">
              Calibration Tiers:
            </div>

            {activeUpgrade.levels.map((lvl) => {
              const isUnlocked = activeLevel >= lvl.level;
              const isCurrent = activeLevel === lvl.level;

              return (
                <div
                  key={lvl.level}
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
                    isCurrent
                      ? 'bg-cyan-950/40 border-cyan-400/80 text-white shadow-md'
                      : isUnlocked
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-950/50 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1 font-mono">
                    <span className="flex items-center gap-1.5">
                      {isUnlocked && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      <span>Tier {lvl.level}: {lvl.title}</span>
                    </span>
                    <span>{lvl.cost > 0 ? `${lvl.cost} Credits` : 'Included'}</span>
                  </div>
                  <div className="text-[11px] opacity-90">
                    {lvl.effectDescription}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Level Summary */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs text-slate-300 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Current Status:</span>
              <span className="font-semibold text-cyan-400">
                Tier {activeLevel} Operational
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Upgrade Efficiency:</span>
              <span className="font-semibold text-white">
                {activeLevel >= activeUpgrade.maxLevel ? 'Maximum Capacity Reached' : 'Calibration Available'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
