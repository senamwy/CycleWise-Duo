import React, { useState } from 'react';
import { User, GirlfriendSupportPreferences, SharingPermissions, PartnerConnection } from '../types';
import {
  getGirlfriendPreferences,
  saveGirlfriendPreferences,
  getPartnerConnectionForUser,
  getSharingPermissions,
  updateSharingPermissions
} from '../utils/storage';
import { GIRLFRIEND_DEFAULT_PREFERENCES } from '../utils/cycleCalculations';
import {
  Heart,
  ShieldCheck,
  Lock,
  Save,
  Check,
  Eye,
  EyeOff,
  UserCheck,
  Sparkles,
  HeartHandshake
} from 'lucide-react';

interface GirlfriendPreferencesViewProps {
  user: User;
  onOpenConnectModal: () => void;
}

export const GirlfriendPreferencesView: React.FC<GirlfriendPreferencesViewProps> = ({
  user,
  onOpenConnectModal
}) => {
  const [prefsData, setPrefsData] = useState<GirlfriendSupportPreferences>(() =>
    getGirlfriendPreferences(user.id)
  );
  const [customWish, setCustomWish] = useState(prefsData.customWish || '');
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>(prefsData.preferences || []);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Partner connection & Consent sharing state
  const connection = getPartnerConnectionForUser(user.id);
  const [permissions, setPermissions] = useState<SharingPermissions | null>(() => {
    if (!connection) return null;
    return getSharingPermissions(connection.id, user.id);
  });
  const [consentUpdated, setConsentUpdated] = useState(false);

  const togglePreference = (pref: string) => {
    setSelectedPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveGirlfriendPreferences(user.id, selectedPrefs, customWish);
    setPrefsData(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleTogglePermission = (key: keyof Omit<SharingPermissions, 'connectionId' | 'girlfriendId' | 'updatedAt'>) => {
    if (!permissions || !connection) return;
    const updated: SharingPermissions = {
      ...permissions,
      [key]: !permissions[key],
      updatedAt: new Date().toISOString()
    };
    updateSharingPermissions(updated);
    setPermissions(updated);
    setConsentUpdated(true);
    setTimeout(() => setConsentUpdated(false), 2000);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-3xl mx-auto px-4 sm:px-6 pt-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-pink-400 tracking-wide uppercase">
          <span>Persönliche Wünsche & Freigaben</span>
          <span aria-hidden="true">·</span>
          <span>100% Deine Entscheidung</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Wie kann er dich unterstützen?
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Formuliere deine individuellen Vorlieben und bestimme genau, was dein Partner sehen darf.
        </p>
      </div>

      {/* SECTION 1: GRANULAR CONSENT & SHARING SETTINGS */}
      <div className="rounded-3xl bg-[#1A1A26] border border-purple-500/30 p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Freigabe-Einstellungen für deinen Partner</h2>
              <span className="text-xs text-slate-400">
                {connection && connection.status === 'connected'
                  ? `Verbunden mit ${connection.boyfriendName}`
                  : 'Aktuell kein Partner verbunden'}
              </span>
            </div>
          </div>

          {!connection && (
            <button
              onClick={onOpenConnectModal}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Partner einladen
            </button>
          )}
        </div>

        {connection && connection.status === 'connected' && permissions ? (
          <div className="space-y-3 pt-1">
            <p className="text-xs text-slate-300 leading-relaxed">
              Wähle einzeln aus, welche Informationen für <strong>{connection.boyfriendName}</strong> auf seinem Dashboard sichtbar sein sollen. Standardmäßig ist alles deaktiviert.
            </p>

            <div className="space-y-2.5">
              {[
                {
                  key: 'shareGeneralPhase' as const,
                  label: 'Allgemeine Zyklusphase teilen',
                  desc: 'Z.B. "Menstruation", "Follikelphase", damit er weiß, in welcher Jahreszeit du bist.'
                },
                {
                  key: 'shareApproximateNextPeriod' as const,
                  label: 'Ungefähre Tage bis zur nächsten Periode',
                  desc: 'Hilft ihm, Termine und Dates rechtzeitig rücksichtsvoll zu planen.'
                },
                {
                  key: 'shareSelectedSymptoms' as const,
                  label: 'Erfasste Symptome teilen',
                  desc: 'Ermöglicht ihm, gezielte Hilfe (wie Wärmflasche oder Ruhe) vorzubereiten.'
                },
                {
                  key: 'shareSupportPreferences' as const,
                  label: 'Meine Unterstützungswünsche teilen',
                  desc: 'Zeigt ihm die unten ausgewählten Vorlieben und deinen persönlichen Wunsch.'
                },
                {
                  key: 'sharePrivateNotes' as const,
                  label: 'Persönliche Notizen teilen',
                  desc: 'Erlaubt ihm das Lesen deiner freien Tagebuch-Notizen.'
                }
              ].map((item) => {
                const isEnabled = permissions[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => handleTogglePermission(item.key)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isEnabled
                        ? 'bg-purple-950/40 border-purple-500/60'
                        : 'bg-[#101018] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-white">{item.label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                    </div>

                    <div
                      className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${
                        isEnabled ? 'bg-purple-600 justify-end' : 'bg-slate-800 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                    </div>
                  </div>
                );
              })}
            </div>

            {consentUpdated && (
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 pt-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" /> Freigabeeinstellungen in Echtzeit aktualisiert.
              </p>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#101018] border border-slate-800 text-xs text-slate-400 text-center">
            Verknüpfe dich zuerst mit deinem Partner über den Einladungscode, um gezielte Freigaben zu aktivieren.
          </div>
        )}
      </div>

      {/* SECTION 2: HOW SHE PREFERS TO BE SUPPORTED */}
      <div className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-6 sm:p-7 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-pink-400" />
          <h2 className="text-base font-bold text-white">Deine bevorzugte Unterstützung</h2>
        </div>

        <form onSubmit={handleSavePreferences} className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Wähle aus, was dir im Alltag am meisten guttut. Wenn du die Freigabe aktiviert hast, sieht dein Partner diese Punkte auf seinem Dashboard.
          </p>

          <div className="space-y-2">
            {GIRLFRIEND_DEFAULT_PREFERENCES.map((pref, idx) => {
              const isChecked = selectedPrefs.includes(pref);
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => togglePreference(pref)}
                  className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isChecked
                      ? 'bg-pink-950/40 border-pink-500/60 text-white'
                      : 'bg-[#101018] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{pref}</span>
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                      isChecked ? 'bg-pink-600 border-pink-500 text-white' : 'border-slate-700 bg-transparent'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Dein ganz persönlicher Wunsch an ihn <span className="text-slate-400 font-normal">(Freitext)</span>
            </label>
            <textarea
              rows={3}
              value={customWish}
              onChange={(e) => setCustomWish(e.target.value)}
              placeholder="Z.B.: 'Wenn ich Bauchschmerzen habe, hilft mir am besten einfach ein ruhiger Kuschelabend ohne Fragen nach dem Warum.'"
              className="w-full px-4 py-2.5 rounded-xl bg-[#101018] border border-slate-700 text-xs sm:text-sm text-white focus:border-pink-500 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-pink-600/20"
            >
              <Save className="w-4 h-4" />
              <span>Wünsche speichern</span>
            </button>

            {savedSuccess && (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" /> Gespeichert!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
