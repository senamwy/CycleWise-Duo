import React from 'react';
import { User } from '../types';
import { MILESTONE_BADGES, MilestoneBadge } from '../data/milestonesData';
import {
  getPartnerConnectionForUser,
  getReadArticles,
  getCycleEntries,
  getFavorites
} from '../utils/storage';
import { triggerHapticFeedback } from '../utils/haptics';
import {
  Award,
  Sparkles,
  HeartHandshake,
  MessageCircle,
  BookOpen,
  Calendar,
  Heart,
  CheckCircle2,
  Lock,
  Star
} from 'lucide-react';

interface MilestonesCardProps {
  user: User;
}

export const MilestonesCard: React.FC<MilestonesCardProps> = ({ user }) => {
  const connection = getPartnerConnectionForUser(user.id);
  const isConnected = Boolean(connection && connection.status === 'connected');
  const readArticles = getReadArticles(user.id);
  const cycleEntries = getCycleEntries(user.id);
  const favorites = getFavorites(user.id);

  // Evaluate badge unlock status
  const isBadgeUnlocked = (badge: MilestoneBadge): boolean => {
    switch (badge.id) {
      case 'badge-connect':
        return isConnected;
      case 'badge-first-task':
        return true; // Unlocked upon starting
      case 'badge-communicator':
        return true; // Unlocked when exploring communication coach
      case 'badge-science':
        return readArticles.length >= badge.requiredCount;
      case 'badge-support-streak':
        return favorites.length >= 1;
      case 'badge-cycle-tracker':
        return cycleEntries.length >= 1 || isConnected;
      default:
        return false;
    }
  };

  const unlockedCount = MILESTONE_BADGES.filter(isBadgeUnlocked).length;

  const renderBadgeIcon = (iconName: string, unlocked: boolean) => {
    const className = `w-5 h-5 ${unlocked ? 'text-amber-300' : 'text-slate-500'}`;
    switch (iconName) {
      case 'HeartHandshake':
        return <HeartHandshake className={className} />;
      case 'MessageCircle':
        return <MessageCircle className={className} />;
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'Calendar':
        return <Calendar className={className} />;
      case 'Heart':
        return <Heart className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-6 sm:p-7 shadow-xl space-y-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
                Gemeinsame Meilensteine
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {unlockedCount} / {MILESTONE_BADGES.length} Freigeschaltet
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
              Eure Beziehungs-Abzeichen & Ziele
            </h3>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {MILESTONE_BADGES.map((badge) => {
          const unlocked = isBadgeUnlocked(badge);
          return (
            <div
              key={badge.id}
              onClick={() => {
                if (unlocked) triggerHapticFeedback('success');
                else triggerHapticFeedback('light');
              }}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                unlocked
                  ? 'bg-gradient-to-br from-amber-950/30 via-[#12121A] to-purple-950/20 border-amber-500/40 shadow-lg'
                  : 'bg-[#12121A] border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    unlocked
                      ? 'bg-amber-500/20 border-amber-500/40'
                      : 'bg-slate-800/80 border-slate-700'
                  }`}
                >
                  {renderBadgeIcon(badge.iconName, unlocked)}
                </div>

                {unlocked ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <CheckCircle2 className="w-3 h-3 text-amber-400" />
                    <span>Aktiv</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                    <Lock className="w-3 h-3" />
                    <span>Gesperrt</span>
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{badge.title}</h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  {badge.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
