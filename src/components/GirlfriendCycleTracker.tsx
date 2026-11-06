import React, { useState } from 'react';
import { User, CycleEntry } from '../types';
import {
  getCycleEntries,
  getLatestCycleEntry,
  saveCycleEntry,
  deleteCycleEntry
} from '../utils/storage';
import {
  calculateCycleStatus,
  COMMON_SYMPTOMS,
  MOOD_OPTIONS,
  MEDICAL_CYCLE_DISCLAIMER
} from '../utils/cycleCalculations';
import { formatDateGerman } from '../utils/helpers';
import { triggerHapticFeedback } from '../utils/haptics';
import {
  Calendar,
  Plus,
  Flame,
  Activity,
  Heart,
  Moon,
  Sparkles,
  ShieldAlert,
  Trash2,
  X,
  Check,
  Clock,
  BatteryLow,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { CyclePredictionChart } from './CyclePredictionChart';
import { CycleVisualCalendarView } from './CycleVisualCalendarView';
import { MilestonesCard } from './MilestonesCard';

interface GirlfriendCycleTrackerProps {
  user: User;
}

export const GirlfriendCycleTracker: React.FC<GirlfriendCycleTrackerProps> = ({ user }) => {
  const [entries, setEntries] = useState<CycleEntry[]>(() => getCycleEntries(user.id));
  const [activeTab, setActiveTab] = useState<'tracker' | 'predictions'>('tracker');
  const latestEntry = entries.length > 0 ? entries.sort((a, b) => b.startDate.localeCompare(a.startDate))[0] : null;

  // New cycle log modal state
  const [showLogModal, setShowLogModal] = useState(false);
  const [startDate, setStartDate] = useState(
    latestEntry ? latestEntry.startDate : new Date().toISOString().split('T')[0]
  );
  const [cycleLength, setCycleLength] = useState(latestEntry?.cycleLengthDays || 28);
  const [periodLength, setPeriodLength] = useState(latestEntry?.periodLengthDays || 5);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(latestEntry?.symptoms || []);
  const [selectedMood, setSelectedMood] = useState<string>(latestEntry?.mood || 'calm');
  const [energyLevel, setEnergyLevel] = useState<'low' | 'medium' | 'high'>(latestEntry?.energyLevel || 'medium');
  const [notes, setNotes] = useState(latestEntry?.notes || '');

  const cycleStatus = latestEntry
    ? calculateCycleStatus(latestEntry.startDate, latestEntry.cycleLengthDays, latestEntry.periodLengthDays)
    : null;

  const toggleSymptom = (id: string) => {
    triggerHapticFeedback('light');
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate) return;

    triggerHapticFeedback('success');
    saveCycleEntry(user.id, {
      startDate,
      cycleLengthDays: Number(cycleLength),
      periodLengthDays: Number(periodLength),
      symptoms: selectedSymptoms,
      mood: selectedMood,
      energyLevel,
      notes: notes.trim() || undefined
    });

    setEntries(getCycleEntries(user.id));
    setShowLogModal(false);
  };

  const handleDelete = (id: string) => {
    triggerHapticFeedback('medium');
    deleteCycleEntry(user.id, id);
    setEntries(getCycleEntries(user.id));
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-4xl mx-auto px-4 sm:px-6 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-400 tracking-wide uppercase">
            <span>Privater Bereich</span>
            <span aria-hidden="true">·</span>
            <span>Nur für dich sichtbar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Dein Zyklus-Tagebuch
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Erfasse deinen Rhythmus, Symptome und Wohlbefinden ganz in deinem Tempo.
          </p>
        </div>

        <button
          onClick={() => {
            triggerHapticFeedback('light');
            setShowLogModal(true);
          }}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-pink-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{latestEntry ? 'Eintrag anpassen / Neu erfassen' : 'Zyklus beginnen'}</span>
        </button>
      </div>

      {/* Medical uncertainty disclaimer banner */}
      <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/20 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <p className="text-xs text-purple-200/90 leading-relaxed">
          {MEDICAL_CYCLE_DISCLAIMER}
        </p>
      </div>

      {/* Relationship Milestones & Badges */}
      <MilestonesCard user={user} />

      {/* Sub-tab navigation: Tracker vs Recharts Prediction */}
      <div className="flex items-center gap-2 bg-[#1A1A26] p-1.5 rounded-2xl border border-slate-800 self-start">
        <button
          onClick={() => {
            triggerHapticFeedback('light');
            setActiveTab('tracker');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'tracker'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Visueller Kalender & Diagramm</span>
        </button>

        <button
          onClick={() => {
            triggerHapticFeedback('light');
            setActiveTab('predictions');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'predictions'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-pink-300" />
          <span>Phasen-Vorhersage (Recharts)</span>
        </button>
      </div>

      {/* RECHARTS CYCLE PREDICTION VIEW */}
      {activeTab === 'predictions' && (
        <CyclePredictionChart
          user={user}
          entries={entries}
          onRefreshEntries={() => setEntries(getCycleEntries(user.id))}
          onOpenLogModal={() => setShowLogModal(true)}
        />
      )}

      {/* TRACKER TAB CONTENT: VISUAL CALENDAR WITH DIAGRAMS */}
      {activeTab === 'tracker' && (
        <div className="space-y-6">
          <CycleVisualCalendarView
            user={user}
            entries={entries}
            onRefreshEntries={() => setEntries(getCycleEntries(user.id))}
            onOpenLogModal={() => setShowLogModal(true)}
          />

          {/* CURRENT CYCLE STATUS CARD */}
          {cycleStatus ? (
            <div className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-6 sm:p-7 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-pink-600/10 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                {cycleStatus.phaseSeason}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {cycleStatus.phaseName}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Tag {cycleStatus.currentDay} deines Zyklus (Start: {formatDateGerman(latestEntry!.startDate)})
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#101018] border border-slate-800 text-right">
              <span className="text-[11px] text-slate-400 block">Nächste Periode (Schätzung):</span>
              <span className="text-base font-bold text-purple-300">
                in ca. {cycleStatus.daysUntilNextPeriod} Tagen
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                ca. {formatDateGerman(cycleStatus.nextPeriodDate)}
              </span>
            </div>
          </div>

          {/* Phase progress visual indicator */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[
              { num: 1, name: 'Menstruation', color: 'bg-pink-500' },
              { num: 2, name: 'Follikel', color: 'bg-purple-500' },
              { num: 3, name: 'Ovulation', color: 'bg-amber-500' },
              { num: 4, name: 'Luteal', color: 'bg-rose-500' }
            ].map((p) => {
              const isCurrent = cycleStatus.phaseNumber === p.num;
              return (
                <div
                  key={p.num}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-purple-950/50 border-purple-500/80 text-white shadow-md'
                      : 'bg-[#101018] border-slate-800/80 text-slate-400 opacity-60'
                  }`}
                >
                  <span className="text-[10px] block font-bold">Phase {p.num}</span>
                  <span className="text-xs font-semibold">{p.name}</span>
                </div>
              );
            })}
          </div>

          {/* Current Symptoms & Mood Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">Erfasste Symptome:</span>
              {latestEntry!.symptoms.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Keine Symptome hinterlegt.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {latestEntry!.symptoms.map((sId) => {
                    const found = COMMON_SYMPTOMS.find((s) => s.id === sId);
                    return (
                      <span
                        key={sId}
                        className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200"
                      >
                        {found ? found.label : sId}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">Stimmung & Energie:</span>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <span className="px-2.5 py-1 rounded-lg bg-[#101018] border border-slate-800">
                  Stimmung: {MOOD_OPTIONS.find((m) => m.id === latestEntry!.mood)?.label || 'Ausgeglichen'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#101018] border border-slate-800 capitalize">
                  Energie: {latestEntry!.energyLevel === 'low' ? 'Niedrig' : latestEntry!.energyLevel === 'high' ? 'Hoch' : 'Mittel'}
                </span>
              </div>
            </div>
          </div>

          {latestEntry!.notes && (
            <div className="mt-4 p-3 rounded-xl bg-[#101018] border border-slate-800/80 text-xs text-slate-300">
              <span className="font-semibold text-slate-400 block mb-0.5">Deine Notiz:</span>
              {latestEntry!.notes}
            </div>
          )}
        </div>
      ) : (
        /* Empty state */
        <div className="p-10 rounded-3xl bg-[#1A1A26] border border-slate-800 text-center">
          <Calendar className="w-10 h-10 text-pink-400/60 mx-auto mb-3" />
          <h2 className="text-base font-bold text-white">Noch kein Zyklus erfasst</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Trage das Startdatum deiner letzten Menstruation ein, um deine Zyklusphasen und Schätzungen privat zu verfolgen.
          </p>
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setShowLogModal(true);
            }}
            className="mt-4 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Startdatum eintragen
          </button>
        </div>
      )}

      {/* CYCLE HISTORY LIST */}
      <div className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-6 space-y-4 shadow-xl">
        <h2 className="text-base font-bold text-white">Bisherige Zyklen</h2>
        {entries.length === 0 ? (
          <p className="text-xs text-slate-400">Keine vorherigen Zyklen archiviert.</p>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-3.5 rounded-2xl bg-[#101018] border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-white">
                    Start: {formatDateGerman(entry.startDate)}
                  </span>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Zykluslänge: {entry.cycleLengthDays} Tage · Periode: {entry.periodLengthDays} Tage
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-slate-500 hover:text-rose-400 p-1.5 transition-colors cursor-pointer"
                  title="Löschen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
        </div>
      )}

      {/* NEW / EDIT ENTRY MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-[#1A1A26] border border-purple-500/30 p-6 sm:p-7 text-slate-100 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-pink-400" />
                Zyklusdaten erfassen
              </h3>
              <button
                onClick={() => {
                  triggerHapticFeedback('light');
                  setShowLogModal(false);
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Startdatum der Menstruationsblutung *
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#101018] border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Typische Zykluslänge (Tage)
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={50}
                    value={cycleLength}
                    onChange={(e) => setCycleLength(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101018] border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Ø 28 Tage</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Dauer der Periode (Tage)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={12}
                    value={periodLength}
                    onChange={(e) => setPeriodLength(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101018] border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Ø 5 Tage</span>
                </div>
              </div>

              {/* Symptoms Checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Aktuelle Symptome <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {COMMON_SYMPTOMS.map((sym) => {
                    const isChecked = selectedSymptoms.includes(sym.id);
                    return (
                      <button
                        type="button"
                        key={sym.id}
                        onClick={() => toggleSymptom(sym.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          isChecked
                            ? 'bg-purple-950/50 border-purple-500 text-white'
                            : 'bg-[#101018] border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span>{sym.label}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mood */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Deine Stimmung
                </label>
                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#101018] border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                >
                  {MOOD_OPTIONS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.emoji} {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Persönliche Notizen <span className="text-slate-400 font-normal">(nur für dich)</span>
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Wie fühlst du dich heute? Was hilft dir gut?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#101018] border border-slate-700 text-xs text-white focus:border-purple-500 outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerHapticFeedback('light');
                    setShowLogModal(false);
                  }}
                  className="w-1/3 py-2.5 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer"
                >
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
