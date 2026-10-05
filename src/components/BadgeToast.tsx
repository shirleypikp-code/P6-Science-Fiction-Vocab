import { Badge } from '../types/game';
import { Award, Sparkles, X } from 'lucide-react';

interface BadgeToastProps {
  badge: Badge | null;
  onDismiss: () => void;
}

export default function BadgeToast({ badge, onDismiss }: BadgeToastProps) {
  if (!badge) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 border-2 border-amber-500/80 rounded-2xl p-4 shadow-2xl shadow-amber-500/20 backdrop-blur-md animate-bounce-short">
      <div className="flex items-start gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0">
          {badge.icon}
        </div>

        <div className="flex-1 pr-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Badge Commendation Unlocked!</span>
          </div>
          <h4 className="text-base font-bold text-white mt-0.5">
            {badge.title}
          </h4>
          <p className="text-xs text-slate-300 mt-0.5 leading-snug">
            {badge.description}
          </p>
        </div>

        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
