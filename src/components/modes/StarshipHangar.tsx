import { useState } from 'react';
import { PlayerProfile, ShipCustomization } from '../../types/game';
import { SHOP_ITEMS } from '../../data/vocabulary';
import { playSuccessSound, playLevelUpSound, playClickSound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import StarshipVisualizer from '../StarshipVisualizer';
import { Sparkles, Check, ShoppingBag, ShieldCheck } from 'lucide-react';

interface StarshipHangarProps {
  profile: PlayerProfile;
  onUpdateProfile: (updater: (prev: PlayerProfile) => PlayerProfile) => void;
  onCheckBadges: (currentProfile: PlayerProfile) => void;
}

export default function StarshipHangar({
  profile,
  onUpdateProfile,
  onCheckBadges
}: StarshipHangarProps) {
  const [activeTab, setActiveTab] = useState<'hull' | 'pet' | 'shield'>('hull');

  const filteredItems = SHOP_ITEMS.filter((item) => item.type === activeTab);

  const isUnlocked = (item: ShipCustomization) => {
    if (item.type === 'hull') return profile.unlockedShips.includes(item.id);
    if (item.type === 'pet') return profile.unlockedPets.includes(item.id);
    return profile.unlockedShields.includes(item.id);
  };

  const isEquipped = (item: ShipCustomization) => {
    if (item.type === 'hull') return profile.currentShip === item.id;
    if (item.type === 'pet') return profile.currentPet === item.id;
    return profile.currentShield === item.id;
  };

  const handlePurchase = (item: ShipCustomization) => {
    if (profile.credits < item.price) return;

    playLevelUpSound(profile.soundEnabled);
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn(e);
    }

    onUpdateProfile((prev) => {
      let updated: PlayerProfile = {
        ...prev,
        credits: prev.credits - item.price
      };

      if (item.type === 'hull') {
        updated = {
          ...updated,
          unlockedShips: [...prev.unlockedShips, item.id],
          currentShip: item.id
        };
      } else if (item.type === 'pet') {
        updated = {
          ...updated,
          unlockedPets: [...prev.unlockedPets, item.id],
          currentPet: item.id
        };
      } else if (item.type === 'shield') {
        updated = {
          ...updated,
          unlockedShields: [...prev.unlockedShields, item.id],
          currentShield: item.id
        };
      }

      setTimeout(() => onCheckBadges(updated), 100);
      return updated;
    });
  };

  const handleEquip = (item: ShipCustomization) => {
    playClickSound(profile.soundEnabled);
    onUpdateProfile((prev) => {
      if (item.type === 'hull') return { ...prev, currentShip: item.id };
      if (item.type === 'pet') return { ...prev, currentPet: item.id };
      return { ...prev, currentShield: item.id };
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono uppercase tracking-wider mb-1">
            <span>Cosmic Outpost</span>
            <span aria-hidden="true">·</span>
            <span>Starship Hangar & Fleet Forge</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Starfleet Shipyard & Customizer
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Spend your earned Cosmic Credits from vocabulary missions to upgrade your starship chassis, deflector shields, and alien pets.
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

      {/* Main Showcase & Shop Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Live Ship Inspection Bay (Left) */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md flex flex-col items-center text-center shadow-2xl">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Active Starship Configuration</span>
          </div>

          <div className="py-6">
            <StarshipVisualizer
              shipId={profile.currentShip}
              petId={profile.currentPet}
              shieldId={profile.currentShield}
              size="lg"
            />
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 w-full text-left space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Chassis:</span>
              <span className="font-semibold text-white">
                {SHOP_ITEMS.find((s) => s.id === profile.currentShip)?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Deflector Shield:</span>
              <span className="font-semibold text-cyan-300">
                {SHOP_ITEMS.find((s) => s.id === profile.currentShield)?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Co-pilot Pet:</span>
              <span className="font-semibold text-amber-300">
                {SHOP_ITEMS.find((s) => s.id === profile.currentPet)?.name}
              </span>
            </div>
          </div>
        </div>

        {/* Shop Items Bay (Right) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            {(['hull', 'pet', 'shield'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer ${
                  activeTab === tab
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'hull' ? 'Starship Hulls' : tab === 'pet' ? 'Alien Companions' : 'Deflector Shields'}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const unlocked = isUnlocked(item);
              const equipped = isEquipped(item);
              const canAfford = profile.credits >= item.price;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    equipped
                      ? 'bg-cyan-950/40 border-cyan-400/80 shadow-md shadow-cyan-500/10'
                      : unlocked
                      ? 'bg-slate-900/80 border-slate-700'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono text-slate-500 uppercase">{item.rarity}</span>
                      {equipped && (
                        <span className="text-cyan-400 font-semibold text-[11px] flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Equipped
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-white text-base mb-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  {/* Button Action */}
                  <div>
                    {unlocked ? (
                      <button
                        disabled={equipped}
                        onClick={() => handleEquip(item)}
                        className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          equipped
                            ? 'bg-cyan-500/20 text-cyan-300 cursor-default'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        {equipped ? 'Active in Flight' : 'Equip Module'}
                      </button>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => handlePurchase(item)}
                        className={`w-full py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30'
                            : 'bg-slate-800/50 text-slate-500 border border-slate-800 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Unlock ({item.price} Credits)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
