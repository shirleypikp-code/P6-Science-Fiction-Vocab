import { PlayerProfile } from '../types/game';
import { getPlayerRank } from '../utils/storage';
import { VOCABULARY_LIST, BADGES } from '../data/vocabulary';
import { Award, Printer, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface CadetCertificateProps {
  profile: PlayerProfile;
  onClose: () => void;
}

export default function CadetCertificate({ profile, onClose }: CadetCertificateProps) {
  const rank = getPlayerRank(profile.xp);
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-10 shadow-2xl text-slate-100 print:bg-white print:text-black print:border-black print:p-6 print:m-0">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors print:hidden cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Border Frame */}
        <div className="border-4 border-double border-amber-400/40 p-6 sm:p-8 rounded-2xl relative bg-slate-950/60 print:bg-white print:border-black">
          {/* Top Seal */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20 text-slate-950 mb-1">
              ⭐
            </div>
            <div className="text-xs font-mono tracking-widest text-amber-400 uppercase print:text-amber-800">
              STARFLEET ACADEMY DIPLOMA OF EXCELLENCE
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display uppercase tracking-wide print:text-black">
              Certificate of Galactic Vocabulary Mastery
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 italic max-w-lg print:text-slate-600">
              Primary 6 Science Fiction Literature & Scientific Lexicon Expedition
            </p>
          </div>

          {/* Recipient */}
          <div className="my-8 text-center">
            <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2 print:text-slate-500">
              This Official Starfleet Commendation is Proudly Awarded To:
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-cyan-300 font-display border-b-2 border-cyan-400/40 pb-2 inline-block px-8 print:text-black print:border-black">
              {profile.name}
            </div>
            <div className="mt-3 text-sm text-amber-300 font-semibold print:text-amber-900">
              {rank.badge} Achieved Rank: {rank.title} (Tier {rank.rank})
            </div>
          </div>

          {/* Citation Body */}
          <p className="text-sm text-slate-300 text-center leading-relaxed max-w-xl mx-auto mb-8 print:text-slate-800">
            Having successfully navigated interstellar communication frequencies, stabilized the Sector 7 warp core,
            and mastered the advanced scientific concepts of space exploration, cybernetics, and cosmic physics.
          </p>

          {/* Stats Badges Row */}
          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto p-4 bg-slate-900/80 rounded-xl border border-slate-800 mb-8 text-center print:bg-slate-100 print:border-slate-300 print:text-black">
            <div>
              <div className="text-xs text-slate-400 uppercase font-mono">Mastered</div>
              <div className="text-lg font-bold font-mono text-cyan-400 print:text-cyan-800">
                {profile.wordsMastered.length} / {VOCABULARY_LIST.length}
              </div>
            </div>
            <div className="border-x border-slate-700 print:border-slate-300">
              <div className="text-xs text-slate-400 uppercase font-mono">Total XP</div>
              <div className="text-lg font-bold font-mono text-amber-400 print:text-amber-800">
                {profile.xp} PTS
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-mono">Max Streak</div>
              <div className="text-lg font-bold font-mono text-emerald-400 print:text-emerald-800">
                {profile.highestStreak}x Combo
              </div>
            </div>
          </div>

          {/* Signature Line */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 print:text-black print:border-slate-400">
            <div className="text-center sm:text-left">
              <div className="font-mono text-slate-300 font-semibold print:text-black">Date Awarded:</div>
              <div>{dateStr}</div>
            </div>
            <div className="text-center sm:text-right">
              <div className="font-mono text-slate-300 font-semibold border-b border-slate-700 pb-1 px-6 print:text-black print:border-black">
                Grand Admiral & Science Division
              </div>
              <div className="mt-1">Starfleet Academy Examination Board</div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex items-center justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
}
