import React, { useState } from 'react';
import { User, UserPreferences, CycleEntry } from '../types';
import {
  saveUser,
  exportUserData,
  deleteUserAccount,
  getReminders,
  getFavorites,
  getReadArticles,
  getCycleEntries
} from '../utils/storage';
import { PWAInstallButton } from './PWAInstallButton';
import { CyclePredictionChart } from './CyclePredictionChart';
import {
  User as UserIcon,
  Settings,
  Download,
  Trash2,
  Moon,
  Sun,
  ShieldCheck,
  Heart,
  Save,
  Check,
  LogOut,
  AlertTriangle,
  Lock,
  Sparkles,
  Calendar,
  Activity
} from 'lucide-react';
import { toLocalDateString } from '../utils/dateUtils';

interface ProfileViewProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenConnectModal?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  onLogout,
  isDark,
  onToggleTheme,
  onOpenConnectModal
}) => {
  const isGirlfriend = user.role === 'girlfriend';
  const [cycleEntries, setCycleEntries] = useState<CycleEntry[]>(() =>
    isGirlfriend ? getCycleEntries(user.id) : []
  );

  const handleRefreshCycles = () => {
    if (isGirlfriend) {
      setCycleEntries(getCycleEntries(user.id));
    }
  };

  const [name, setName] = useState(user.name);
  const [partnerName, setPartnerName] = useState(user.preferences.partnerName || '');
  const [communicationStyle, setCommunicationStyle] = useState(
    user.preferences.communicationStyle || 'Einfühlsam & Direkt'
  );
  const [reminderFrequency, setReminderFrequency] = useState(
    user.preferences.reminderFrequency || 'daily'
  );
  const [savedNotification, setSavedNotification] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPreferences: UserPreferences = {
      ...user.preferences,
      partnerName: partnerName.trim() || undefined,
      communicationStyle,
      reminderFrequency
    };

    const updatedUser: User = {
      ...user,
      name: name.trim() || user.name,
      preferences: updatedPreferences
    };

    saveUser(updatedUser);
    onUpdateUser(updatedUser);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const handleExportData = () => {
    const jsonStr = exportUserData(user.id);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyclewise-data-export-${toLocalDateString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    deleteUserAccount(user.id);
    onLogout();
  };

  const remindersCount = getReminders(user.id).length;
  const favoritesCount = getFavorites(user.id).length;
  const readCount = getReadArticles(user.id).length;

  const avgLength = cycleEntries.length > 0
    ? Math.round(
        (cycleEntries.reduce((acc, c) => acc + (c.cycleLengthDays || 28), 0) / cycleEntries.length) * 10
      ) / 10
    : 28;

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-4xl mx-auto px-4 sm:px-6 pt-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 tracking-wide uppercase">
          <span>{isGirlfriend ? 'Partnerin-Profil & Zyklus-Analyse' : 'Einstellungen & Konto'}</span>
          <span aria-hidden="true">·</span>
          <span>100% Datenschutzkonform</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          {isGirlfriend ? 'Dein Profil & Zyklus-Prognose' : 'Dein Profil'}
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {isGirlfriend
            ? 'Deine persönlichen Angaben, Recharts-Zyklusprognose und Einstellungen.'
            : 'Verwalte deine persönlichen Angaben, Präferenzen und exportiere jederzeit deine Daten.'}
        </p>
      </div>

      {/* Account Overview Card */}
      <div className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-purple-600/30">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user.name}</h2>
            <p className="text-xs text-slate-400">{user.email}</p>
            <div className="flex items-center gap-2 text-[11px] text-purple-300 mt-1">
              <span>
                {isGirlfriend ? 'Partner-Rolle: Partnerin (Private Zyklusdaten)' : 'Partner-Rolle: Freund / Partner'}
              </span>
              <span aria-hidden="true">·</span>
              <span>Konto aktiv</span>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#101018] hover:bg-rose-950/30 border border-slate-800 hover:border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors self-start sm:self-auto cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Abmelden</span>
        </button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-3">
        {isGirlfriend ? (
          <>
            <div className="p-4 rounded-2xl bg-[#1A1A26] border border-slate-800 text-center">
              <p className="text-xl font-bold text-pink-300 tabular-nums">{cycleEntries.length}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Erfasste Zyklen</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#1A1A26] border border-slate-800 text-center">
              <p className="text-xl font-bold text-purple-300 tabular-nums">{avgLength}d</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Ø Zyklusdauer</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#1A1A26] border border-slate-800 text-center">
              <p className="text-xl font-bold text-white tabular-nums">{readCount}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Artikel gelesen</p>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 rounded-2xl bg-[#1A1A26] border border-slate-800 text-center">
              <p className="text-xl font-bold text-white tabular-nums">{remindersCount}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Erinnerungen</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#1A1A26] border border-slate-800 text-center">
              <p className="text-xl font-bold text-white tabular-nums">{favoritesCount}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Favoriten</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#1A1A26] border border-slate-800 text-center">
              <p className="text-xl font-bold text-white tabular-nums">{readCount}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Artikel gelesen</p>
            </div>
          </>
        )}
      </div>

      {/* Prominently render the Recharts Cycle Prediction Chart on Girlfriend Profile */}
      {isGirlfriend && (
        <CyclePredictionChart
          user={user}
          entries={cycleEntries}
          onRefreshEntries={handleRefreshCycles}
        />
      )}

      {/* Edit Profile Form */}
      <div className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-6 sm:p-7 shadow-xl">
        <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-purple-400" />
          Persönliche Einstellungen
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Dein Vorname
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#101018] border border-slate-700 text-xs sm:text-sm text-white focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isGirlfriend ? 'Name deines Partners' : 'Name deiner Partnerin'}{' '}
                <span className="text-slate-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder={isGirlfriend ? 'z.B. Leo' : 'z.B. Sarah'}
                className="w-full px-4 py-2.5 rounded-xl bg-[#101018] border border-slate-700 text-xs sm:text-sm text-white focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kommunikationsstil
              </label>
              <select
                value={communicationStyle}
                onChange={(e) => setCommunicationStyle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#101018] border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
              >
                <option value="Einfühlsam & Direkt">Einfühlsam & Direkt</option>
                <option value="Sanft & Zurückhaltend">Sanft & Zurückhaltend</option>
                <option value="Praktisch & Tatkräftig">Praktisch & Tatkräftig</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Erinnerungs-Häufigkeit
              </label>
              <select
                value={reminderFrequency}
                onChange={(e) => setReminderFrequency(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#101018] border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
              >
                <option value="daily">Täglicher Impuls</option>
                <option value="weekly">Wöchentlicher Fokus</option>
                <option value="occasional">Nur bei konkretem Bedarf</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-purple-600/20"
            >
              <Save className="w-4 h-4" />
              <span>Änderungen speichern</span>
            </button>

            {savedNotification && (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" /> Gespeichert!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* App & Display Settings */}
      <div className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-6 space-y-4 shadow-xl">
        <h2 className="text-base font-bold text-white mb-2">Darstellung & Installation</h2>

        {/* Theme toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#101018] border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300">
              {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-300" />}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-white">Design-Modus</p>
              <p className="text-[11px] text-slate-400">
                {isDark ? 'Dunkles Design (Standard: #101018)' : 'Helles Design aktiv'}
              </p>
            </div>
          </div>
          <button
            onClick={onToggleTheme}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors cursor-pointer"
          >
            {isDark ? 'Zu Hell wechseln' : 'Zu Dunkel wechseln'}
          </button>
        </div>

        {/* PWA Install */}
        <PWAInstallButton variant="profile" />
      </div>

      {/* Phase 2 Architecture Ready Card */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950/30 to-pink-950/20 border border-purple-500/30 p-6 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-purple-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">
              {isGirlfriend ? 'Deine Privatsphäre & Kontrolle' : 'Vorbereitung für Phase 2'}
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              {isGirlfriend
                ? 'Volle Selbstbestimmung über deine Gesundheitsdaten'
                : 'Partner-Verbindung & Privates Zyklus-Tracking'}
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {isGirlfriend
                ? 'Deine Zyklusdaten gehören dir allein. Du entscheidest im Bereich "Wünsche & Freigaben" mit einzelnen Schaltern, ob dein Partner deine Phase, dein nächstes Periodenfenster oder Wohlfühlwünsche sehen darf. Standardmäßig ist alles privat.'
                : 'In Phase 2 kann deine Partnerin ein eigenes, 100% privates Konto anlegen und eigenständig entscheiden, welche Informationen sie mit dir teilen möchte (z.B. Zyklusphasen, bevorzugte Unterstützung oder Ruhewünsche). Es gibt niemals automatische Weiterleitungen ohne ihr ausdrückliches Einverständnis.'}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-300 font-medium">
              <Lock className="w-3 h-3 text-purple-400" />
              <span>{isGirlfriend ? 'Zero-Knowledge & Lokale Datenkontrolle' : 'Phase 1 MVP aktiv · Phase 2 folgt nach Freigabe'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* GDPR Data Management & Deletion */}
      <div className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h2 className="text-base font-bold text-white">Datenschutz & Rechte (DSGVO)</h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Deine Daten gehören dir. Du kannst jederzeit eine vollständige Kopie all deiner Erinnerungen, Notizen und Präferenzen im JSON-Format herunterladen oder dein Konto unwiderruflich löschen.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            onClick={handleExportData}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#101018] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-purple-400" />
            <span>Meine Daten exportieren (JSON)</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-xs font-semibold text-rose-300 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Konto & Daten löschen</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#1A1A26] border border-rose-500/40 p-6 sm:p-7 text-slate-100 shadow-2xl relative">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white text-center">
              Konto wirklich löschen?
            </h3>
            <p className="text-xs text-slate-300 text-center mt-2 leading-relaxed">
              Diese Aktion kann nicht rückgängig gemacht werden. Alle deine persönlichen Erinnerungen, Lernfortschritte und Favoriten werden sofort dauerhaft gelöscht.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-1/2 py-2.5 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDeleteAccount}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-md shadow-rose-600/30 cursor-pointer"
              >
                Endgültig löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
