import React from 'react';
import { User } from '../types';
import { getEarlyWarningForBoyfriend } from '../utils/earlyWarning';
import { triggerHapticFeedback } from '../utils/haptics';
import { ShieldAlert, Sparkles, Heart, BellRing, ChevronRight } from 'lucide-react';

interface EarlyWarningCardProps {
  user: User;
  onNavigateToSupport?: () => void;
}

export const EarlyWarningCard: React.FC<EarlyWarningCardProps> = ({ user, onNavigateToSupport }) => {
  const warning = getEarlyWarningForBoyfriend(user.id);

  if (!warning.isActive) return null;

  return (
    <aside aria-label="Frühe Warnung" className="rounded-3xl bg-gradient-to-br from-amber-950/40 via-[#1A1A26] to-purple-950/40 border border-amber-500/40 p-6 sm:p-7 shadow-2xl relative overflow-hidden space-y-4">
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-amber-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/40 shrink-0">
            <BellRing className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
                Frühe Warnung & Beziehungs-Radar
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-200 border border-amber-500/40">
                Aktiv
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
              Sensible Phase im Anmarsch
            </h3>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#12121A]/90 border border-slate-800 space-y-2 relative z-10">
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
          {warning.reason}
        </p>
      </div>

      {/* Proactive Suggestions (3-Pillar Advice format) */}
      <div className="space-y-2.5 relative z-10">
        <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
          Proaktive Unterstützungsempfehlungen:
        </div>
        <ul className="space-y-2 text-xs text-slate-300">
          {warning.proactiveSuggestions.map((sug, idx) => (
            <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#12121A] border border-slate-800">
              <span className="text-amber-400 font-bold shrink-0">{idx + 1}.</span>
              <span className="leading-relaxed font-medium text-slate-200">{sug}</span>
            </li>
          ))}
        </ul>
      </div>

      {onNavigateToSupport && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              onNavigateToSupport();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <span>Passende Gesten & Ideen ansehen</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </aside>
  );
};
