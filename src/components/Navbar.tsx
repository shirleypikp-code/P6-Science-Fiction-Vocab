import { GameMode, PlayerProfile } from '../types/game';
import { getPlayerRank } from '../utils/storage';
import { Volume2, VolumeX, Sparkles, Award } from 'lucide-react';

interface NavbarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  profile: PlayerProfile;
  onToggleSound: () => void;
  onOpenCertificate: () => void;
}

export default function Navbar({
  currentMode,
  onSelectMode,
  profile,
  onToggleSound,
  onOpenCertificate
}: NavbarProps) {
  const rank = getPlayerRank(profile.xp);

  const navLinks: { id: GameMode; label: string }[] = [
    { id: 'menu', label: 'Command Deck' },
    { id: 'decoder', label: 'Warp Decoder' },
    { id: 'transmission', label: 'Alien Transmission' },
    { id: 'story-cloze', label: 'Warp Core Story' },
    { id: 'asteroid-quiz', label: 'Asteroid Quiz' },
    { id: 'holo-codex', label: 'Holo-Codex' },
    { id: 'hangar', label: 'Starship Hangar' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectMode('menu')}
          className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded"
        >
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors font-display">
            COSMIC LEXICON
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navLinks.map((link) => {
            const isActive = currentMode === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectMode(link.id)}
                className={`transition-colors whitespace-nowrap cursor-pointer py-1 border-b-2 ${
                  isActive
                    ? 'text-cyan-400 border-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 border-transparent'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions with clean unboxed metadata */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Cadet Rank & XP unboxed */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <span>{rank.badge}</span>
              <span className="hidden sm:inline">{rank.title}</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-cyan-400 font-mono tabular-nums font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {profile.credits} <span className="hidden sm:inline text-xs text-slate-400 font-normal">Credits</span>
            </span>
          </div>

          {/* Certificate Button */}
          <button
            onClick={onOpenCertificate}
            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
            title="View & Print Starfleet Cadet Certificate"
            aria-label="View Starfleet Cadet Certificate"
          >
            <Award className="w-5 h-5 text-amber-400" />
          </button>

          {/* Audio toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
            title={profile.soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            aria-label={profile.soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {profile.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Nav Slider */}
      <div className="lg:hidden flex items-center gap-4 px-4 py-2 border-t border-slate-800/60 overflow-x-auto text-xs">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => onSelectMode(link.id)}
            className={`whitespace-nowrap px-2.5 py-1 rounded transition-colors ${
              currentMode === link.id
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
}
