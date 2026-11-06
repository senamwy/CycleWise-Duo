import React, { useState } from 'react';
import { User, PersonalReminder, SupportSuggestion } from '../types';
import {
  getGreeting,
  formatDateGerman,
  getDailySupportSuggestion,
  calculateProgressPercentage
} from '../utils/helpers';
import { EDUCATION_ARTICLES } from '../data/educationData';
import { SUPPORT_SUGGESTIONS } from '../data/supportData';
import {
  getReminders,
  updateReminder,
  getFavorites,
  toggleFavorite,
  getReadArticles,
  getCompletedSuggestions,
  toggleCompletedSuggestion
} from '../utils/storage';
import { triggerHapticFeedback } from '../utils/haptics';
import {
  Heart,
  CheckCircle,
  Circle,
  Plus,
  BookOpen,
  ArrowRight,
  Sparkles,
  Calendar,
  Lock,
  Unlock,
  ShieldCheck,
  Crown,
  Check,
  ChevronRight,
  Lightbulb,
  Microscope,
  Zap,
  Star,
  Clock
} from 'lucide-react';
import { NavTab } from './Navigation';
import { BoyfriendPartnerCard } from './BoyfriendPartnerCard';
import { MilestonesCard } from './MilestonesCard';
import { PartnerMoodTrendChart } from './PartnerMoodTrendChart';
import { EarlyWarningCard } from './EarlyWarningCard';
import { toLocalDateString } from '../utils/dateUtils';

interface DashboardViewProps {
  user: User;
  onNavigate: (tab: NavTab) => void;
  onSelectArticle: (articleId: string) => void;
  onOpenNewReminder: (prefillTitle?: string, prefillCategory?: any) => void;
  onOpenConnectModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onNavigate,
  onSelectArticle,
  onOpenNewReminder,
  onOpenConnectModal
}) => {
  const todayStr = toLocalDateString();
  const partnerName = user.preferences.partnerName || 'deine Partnerin';

  // State loaded from persistent storage
  const [reminders, setRemindersState] = useState<PersonalReminder[]>(() => getReminders(user.id));
  const [favorites, setFavoritesState] = useState<string[]>(() => getFavorites(user.id));
  const [completedSuggestions, setCompletedSuggestions] = useState<string[]>(() =>
    getCompletedSuggestions(user.id, todayStr)
  );

  // 3 Months Free Trial Calculation (90 days from user creation)
  const userCreatedAt = new Date(user.createdAt || Date.now()).getTime();
  const daysSinceCreation = Math.floor((Date.now() - userCreatedAt) / (1000 * 60 * 60 * 24));
  const trialDaysTotal = 90; // 3 months free trial
  const trialDaysRemaining = Math.max(0, trialDaysTotal - daysSinceCreation);
  const isTrialActive = trialDaysRemaining > 0;

  // Manual permanent VIP unlock state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return localStorage.getItem(`cyclewise_unlocked_${user.id}`) === 'true' || isTrialActive;
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  // Daily suggestion rotation
  const [suggestionOffset, setSuggestionOffset] = useState(0);
  const baseSuggestion = getDailySupportSuggestion();
  const currentSuggestion =
    suggestionOffset === 0
      ? baseSuggestion
      : SUPPORT_SUGGESTIONS[(SUPPORT_SUGGESTIONS.findIndex((s) => s.id === baseSuggestion.id) + suggestionOffset + SUPPORT_SUGGESTIONS.length) % SUPPORT_SUGGESTIONS.length];

  const isSuggestionDone = completedSuggestions.includes(currentSuggestion.id);
  const isFavorite = favorites.includes(currentSuggestion.id);

  const toggleSuggestionDone = () => {
    triggerHapticFeedback('success');
    toggleCompletedSuggestion(user.id, todayStr, currentSuggestion.id);
    setCompletedSuggestions(getCompletedSuggestions(user.id, todayStr));
  };

  const handleToggleFavorite = () => {
    toggleFavorite(user.id, currentSuggestion.id);
    setFavoritesState(getFavorites(user.id));
  };

  const handleUnlockSubscription = () => {
    setIsUnlocked(true);
    localStorage.setItem(`cyclewise_unlocked_${user.id}`, 'true');
    setUpgradeSuccess(true);
    setTimeout(() => {
      setShowUpgradeModal(false);
      setUpgradeSuccess(false);
    }, 2000);
  };

  const upcomingReminders = reminders.filter((r) => !r.isCompleted).slice(0, 2);

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-4xl mx-auto px-4 sm:px-6 pt-4">
      {/* Minimalist Greeting & 3 Months Free Trial Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-purple-400 tracking-wider uppercase">
            <span>{formatDateGerman(todayStr)}</span>
            <span>·</span>
            <span className="text-pink-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Geheimer Partner-Fokus</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            {getGreeting()}, {user.name}
          </h1>
        </div>

        {/* 3 Months Free Trial / VIP Badge */}
        <div className="self-start sm:self-auto flex items-center gap-2">
          {isTrialActive ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-md">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>3 Monate Gratis-Testphase ({trialDaysRemaining} Tage übrig)</span>
            </span>
          ) : isUnlocked ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Duo VIP Vollzugriff Aktiv</span>
            </span>
          ) : (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all cursor-pointer animate-pulse"
            >
              <Crown className="w-4 h-4 text-amber-200" />
              <span>Vollzugriff Freischalten</span>
            </button>
          )}
        </div>
      </div>

      {/* Partner Connection Card */}
      <BoyfriendPartnerCard
        user={user}
        onOpenConnectModal={onOpenConnectModal || (() => {})}
      />

      {/* Relationship Milestones & Badges */}
      <MilestonesCard user={user} />

      {/* Early Warning / High-Symptom Phase Alert */}
      <EarlyWarningCard user={user} onNavigateToSupport={() => onNavigate('support')} />

      {/* Partner Mood & Wellbeing Trend Chart (Recharts) */}
      <PartnerMoodTrendChart user={user} />

      {/* CLEAN & MYSTERIOUS HERO CARD: The Secret Daily Support Focus */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1E1B2E] via-[#1A1A26] to-[#13121C] border border-purple-500/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-500/15 via-pink-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-base border border-purple-500/30">
                🔒
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-400">
                  Heutiger Geheim-Impuls für {partnerName}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {currentSuggestion.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleFavorite}
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors cursor-pointer ${
                  isFavorite
                    ? 'bg-pink-500/20 border-pink-500/40 text-pink-400'
                    : 'bg-[#12121A] border-slate-700 text-slate-400 hover:text-white'
                }`}
                title="Merken"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-pink-400' : ''}`} />
              </button>
              <button
                onClick={() => setSuggestionOffset((prev) => prev + 1)}
                className="px-3 py-1.5 rounded-xl bg-[#12121A] border border-slate-700 hover:border-slate-600 text-xs text-slate-300 font-medium cursor-pointer transition-colors"
              >
                Nächster Tipp
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {/* Pillar 1: Attention */}
            <div className="p-3.5 rounded-2xl bg-[#12121A]/90 border border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>🔬 1. Worauf du achten musst</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {currentSuggestion.whyItHelps}
              </p>
            </div>

            {/* Pillar 2: Communication */}
            <div className="p-3.5 rounded-2xl bg-[#12121A]/90 border border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>💬 2. Wie du mit ihr kommunizierst</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                "{currentSuggestion.title}: " {currentSuggestion.description}
              </p>
            </div>

            {/* Pillar 3: Support */}
            <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-1">
              <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>💖 3. Wie du für sie da bist</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 font-semibold leading-relaxed">
                Setze diesen Impuls heute ganz konkret um: {currentSuggestion.timeToExecute}.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              onClick={toggleSuggestionDone}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isSuggestionDone
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30'
              }`}
            >
              <CheckCircle className={`w-4 h-4 ${isSuggestionDone ? 'text-emerald-400' : 'text-white'}`} />
              <span>{isSuggestionDone ? 'Heute erfolgreich umgesetzt ✓' : 'Als erledigt markieren'}</span>
            </button>

            <span className="text-xs text-slate-400 font-mono">
              Zeitaufwand: {currentSuggestion.timeToExecute}
            </span>
          </div>
        </div>
      </div>

      {/* CONDENSED CLEAN GRID: Just 2 sleek cards (Reminders + Quick Knowledge Preview) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Reminders Card */}
        <div className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">
                  📅
                </div>
                <h3 className="text-base font-bold text-white">Anstehende Erinnerungen</h3>
              </div>
              <button
                onClick={() => onOpenNewReminder()}
                className="w-8 h-8 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 flex items-center justify-center transition-colors cursor-pointer"
                title="Erinnerung hinzufügen"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {upcomingReminders.length === 0 ? (
              <div className="p-4 rounded-2xl bg-[#12121A] border border-slate-800 text-center text-xs text-slate-400">
                Keine anstehenden Aufgaben. Erstelle eine Erinnerung für kleine Aufmerksamkeiten.
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingReminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="p-3 rounded-2xl bg-[#12121A] border border-slate-800 flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{rem.title}</p>
                      <p className="text-[10px] text-slate-400">{formatDateGerman(rem.dueDate)}</p>
                    </div>
                    <button
                      onClick={() => {
                        const updated = { ...rem, isCompleted: !rem.isCompleted };
                        updateReminder(user.id, updated);
                        setRemindersState(getReminders(user.id));
                      }}
                      className="text-slate-500 hover:text-emerald-400 transition-colors"
                    >
                      <Circle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('reminders')}
            className="w-full mt-4 py-2.5 bg-[#12121A] hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Alle Erinnerungen anzeigen</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Knowledge Preview Card */}
        <div className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">
                📚
              </div>
              <h3 className="text-base font-bold text-white">Wissenschaft & Artikel</h3>
            </div>

            <div className="p-4 rounded-2xl bg-[#12121A] border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">
                {EDUCATION_ARTICLES[0].categoryLabel}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2">
                {EDUCATION_ARTICLES[0].title}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {EDUCATION_ARTICLES[0].summary}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onSelectArticle(EDUCATION_ARTICLES[0].id);
              onNavigate('learn');
            }}
            className="w-full mt-4 py-2.5 bg-[#12121A] hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Bibliothek & Studien öffnen</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 MONTHS FREE TRIAL BANNER */}
      {isTrialActive && (
        <div className="rounded-3xl bg-gradient-to-br from-emerald-950/50 via-[#1A1A26] to-purple-950/40 border border-emerald-500/30 p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>3 Monate kostenlose Testphase aktiv</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Du nutzt CycleWise Duo aktuell komplett gratis!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Als neuer Nutzer profitierst du automatisch von einer vollen 3-monatigen Testphase. Alle Hormone-Kurven, Studien-Reader und Partner-Tools sind für dich und deine Partnerin komplett freigeschaltet. Noch <strong className="text-emerald-300">{trialDaysRemaining} Tage</strong> verbleibend.
              </p>
            </div>

            <div className="bg-[#12121A] border border-slate-800 rounded-2xl p-5 text-center space-y-3 shrink-0">
              <div className="text-lg font-bold text-white">
                0,00 € <span className="text-xs font-normal text-emerald-400">/ Testphase</span>
              </div>
              <div className="text-[11px] text-slate-400">Keine automatische Belastung</div>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-purple-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all cursor-pointer"
              >
                VIP Pass sichern
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPGRADE MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-[#1A1A26] border border-emerald-500/40 p-6 sm:p-8 space-y-6 shadow-2xl">
            {upgradeSuccess ? (
              <div className="text-center space-y-4 py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-xl font-black text-white">VIP Pass dauerhaft aktiv!</h3>
                <p className="text-xs text-slate-300">
                  Vielen Dank für deine Unterstützung von CycleWise Duo.
                </p>
              </div>
            ) : (
              <>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Crown className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-white">CycleWise Duo VIP</h3>
                  <p className="text-xs text-slate-300">
                    Deine 3 Monate Gratis-Testphase läuft noch {trialDaysRemaining} Tage. Du kannst jederzeit upgraden.
                  </p>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#12121A] border border-slate-800">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Präzise Östrogen- & Progesteron-Hormonkurven</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#12121A] border border-slate-800">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Vollständiger PubMed & Europe PMC Studien-Reader</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#12121A] border border-slate-800">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Erweiterter Empathie- & Kommunikations-Coach</span>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={handleUnlockSubscription}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 hover:opacity-95 transition-all cursor-pointer"
                  >
                    Dauerhaften VIP Pass aktivieren (€9.99 / Monat)
                  </button>
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="w-full py-2.5 rounded-xl bg-[#12121A] hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Zurück zur Testphase
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
