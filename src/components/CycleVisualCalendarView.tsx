import React, { useState } from 'react';
import { User, CycleEntry } from '../types';
import {
  calculateCycleStatus,
  COMMON_SYMPTOMS,
  MOOD_OPTIONS
} from '../utils/cycleCalculations';
import { formatDateGerman } from '../utils/helpers';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  Activity,
  Heart,
  Moon,
  Info,
  Check,
  Plus,
  BatteryLow,
  AlertCircle,
  X,
  TrendingUp,
  Dna
} from 'lucide-react';
import { saveCycleEntry, getCycleEntries } from '../utils/storage';
import { parseLocalDate, toLocalDateString } from '../utils/dateUtils';

interface CycleVisualCalendarViewProps {
  user: User;
  entries: CycleEntry[];
  onRefreshEntries: () => void;
  onOpenLogModal: () => void;
}

export const CycleVisualCalendarView: React.FC<CycleVisualCalendarViewProps> = ({
  user,
  entries,
  onRefreshEntries,
  onOpenLogModal
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDayDate, setSelectedDayDate] = useState<string | null>(null);

  // Day modal state for quick logging/viewing on a specific date
  const latestEntry = entries.length > 0 ? [...entries].sort((a, b) => b.startDate.localeCompare(a.startDate))[0] : null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Month name in German
  const monthNamesGerman = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  // Days in month
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  
  // Day of week for first day (0 = Sunday, 1 = Monday, etc.) -> adjust for Monday start (0 = Mon, 6 = Sun)
  let startDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6;

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Helper to determine phase and data for a given YYYY-MM-DD date string
  const getDayInfo = (dateStr: string) => {
    // Check if there is an exact entry starting on this date or overlapping
    const matchingEntry = entries.find((e) => {
      const start = parseLocalDate(e.startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + (e.cycleLengthDays || 28));
      const target = parseLocalDate(dateStr);
      return target >= start && target < end;
    });

    if (!matchingEntry && !latestEntry) return null;

    const activeEntry = matchingEntry || latestEntry;
    if (!activeEntry) return null;

    const status = calculateCycleStatus(
      activeEntry.startDate,
      activeEntry.cycleLengthDays,
      activeEntry.periodLengthDays,
      parseLocalDate(dateStr)
    );

    return {
      entry: activeEntry,
      status,
      isExactStart: matchingEntry?.startDate === dateStr
    };
  };

  interface CalendarCell {
    type: 'padding' | 'day';
    key: string;
    dayNumber?: number;
    dateStr?: string;
    info?: {
      entry: CycleEntry;
      status: ReturnType<typeof calculateCycleStatus>;
      isExactStart: boolean;
    } | null;
  }

  // Build calendar days array
  const calendarCells: CalendarCell[] = [];
  // Padding for previous month
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarCells.push({ type: 'padding', key: `pad-${i}` });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(d).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    const info = getDayInfo(dateStr);
    calendarCells.push({
      type: 'day',
      dayNumber: d,
      dateStr,
      info,
      key: dateStr
    });
  }

  const selectedDayInfo = selectedDayDate ? getDayInfo(selectedDayDate) : null;

  return (
    <div className="space-y-6">
      {/* Calendar Header with Month Navigator */}
      <div className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-pink-400 uppercase tracking-wide">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Visueller Zyklus-Kalender & Diagramm</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {monthNamesGerman[month]} {year}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Phasen, Hormon-Trends und erfasste Symptome direkt im Monatsverlauf.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={prevMonth}
              className="p-2.5 rounded-xl bg-[#12121A] hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              title="Vorheriger Monat"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3.5 py-2 rounded-xl bg-[#12121A] hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              Heute
            </button>
            <button
              onClick={nextMonth}
              className="p-2.5 rounded-xl bg-[#12121A] hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              title="Nächster Monat"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Diagram Legend & Phase Color Guide */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-[#101018] border border-pink-500/30 flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-pink-500 shrink-0 shadow-sm shadow-pink-500/50" />
            <div>
              <span className="text-[11px] font-bold text-white block">Menstruation</span>
              <span className="text-[10px] text-pink-300">Innerer Winter</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#101018] border border-purple-500/30 flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-purple-500 shrink-0 shadow-sm shadow-purple-500/50" />
            <div>
              <span className="text-[11px] font-bold text-white block">Follikelphase</span>
              <span className="text-[10px] text-purple-300">Innerer Frühling</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#101018] border border-amber-500/30 flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0 shadow-sm shadow-amber-500/50" />
            <div>
              <span className="text-[11px] font-bold text-white block">Ovulation</span>
              <span className="text-[10px] text-amber-300">Innerer Sommer</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#101018] border border-rose-500/30 flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-rose-500 shrink-0 shadow-sm shadow-rose-500/50" />
            <div>
              <span className="text-[11px] font-bold text-white block">Lutealphase</span>
              <span className="text-[10px] text-rose-300">Innerer Herbst</span>
            </div>
          </div>
        </div>

        {/* Mini Hormone & Energy Diagram Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 via-[#12121A] to-pink-950/20 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
              <Dna className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Biochemische Hormon-Kurve im Monatsverlauf</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Östrogen steigt vor dem Eisprung an · Progesteron dominiert die zweite Zyklushälfte. Klicke auf einen Tag für Details.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenLogModal}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-colors shrink-0 shadow-md shadow-purple-600/20 cursor-pointer"
          >
            Neuen Zyklus-Eintrag erfassen
          </button>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 pb-2 border-b border-slate-800">
          <div>Mo</div>
          <div>Di</div>
          <div>Mi</div>
          <div>Do</div>
          <div>Fr</div>
          <div>Sa</div>
          <div>So</div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarCells.map((cell, idx) => {
            if (cell.type === 'padding') {
              return <div key={cell.key} className="h-24 sm:h-28 rounded-2xl bg-[#12121A]/30 border border-slate-800/40 opacity-30" />;
            }

            const info = cell.info;
            const phaseNum = info?.status?.phaseNumber || 1;
            const isToday = cell.dateStr === toLocalDateString();

            // Phase background styling
            let phaseBg = 'bg-[#12121A] border-slate-800 hover:border-slate-700';
            let phaseDot = 'bg-slate-600';
            let phaseLabelColor = 'text-slate-400';

            if (info?.status) {
              if (phaseNum === 1) {
                phaseBg = 'bg-pink-950/20 border-pink-500/30 hover:border-pink-500/50';
                phaseDot = 'bg-pink-500';
                phaseLabelColor = 'text-pink-300';
              } else if (phaseNum === 2) {
                phaseBg = 'bg-purple-950/20 border-purple-500/30 hover:border-purple-500/50';
                phaseDot = 'bg-purple-500';
                phaseLabelColor = 'text-purple-300';
              } else if (phaseNum === 3) {
                phaseBg = 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50';
                phaseDot = 'bg-amber-500';
                phaseLabelColor = 'text-amber-300';
              } else if (phaseNum === 4) {
                phaseBg = 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50';
                phaseDot = 'bg-rose-500';
                phaseLabelColor = 'text-rose-300';
              }
            }

            const moodObj = info?.entry?.mood ? MOOD_OPTIONS.find((m) => m.id === info.entry.mood) : null;
            const hasSymptoms = info?.entry?.symptoms && info.entry.symptoms.length > 0;

            const getPhaseEmoji = (num: number) => {
              switch (num) {
                case 1: return '🩸'; // Menstruation (Innerer Winter)
                case 2: return '🌱'; // Follicular (Innerer Frühling)
                case 3: return '☀️'; // Ovulation (Innerer Sommer)
                case 4: return '🌙'; // Luteal (Innerer Herbst)
                default: return '✨';
              }
            };

            const phaseEmoji = info?.status ? getPhaseEmoji(info.status.phaseNumber) : '✨';
            const displayEmoji = phaseEmoji;

            return (
              <div
                key={cell.key}
                onClick={() => cell.dateStr && setSelectedDayDate(cell.dateStr)}
                className={`h-24 sm:h-28 rounded-2xl border p-2 flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden group ${phaseBg} ${
                  isToday ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/20' : ''
                }`}
              >
                {/* Top Row: Day number and phase indicator dot */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isToday ? 'text-purple-300 underline' : 'text-white'}`}>
                    {cell.dayNumber}
                  </span>
                  <div className="flex items-center gap-1">
                    {isToday && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-600 text-white font-bold">
                        Heute
                      </span>
                    )}
                    <div className={`w-2 h-2 rounded-full ${phaseDot}`} />
                  </div>
                </div>

                {/* Center: Phase name & contextual phase emoji */}
                <div className="my-auto space-y-1">
                  {info?.status && (
                    <span className={`text-[10px] font-bold block leading-tight truncate ${phaseLabelColor}`}>
                      {info.status.phaseName.split(' ')[0]}
                    </span>
                  )}

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-base" title={moodObj ? moodObj.label : `Zyklusphase ${info?.status?.phaseName || ''}`}>
                      {displayEmoji}
                    </span>
                    {moodObj && (
                      <span className="text-[9px] text-purple-300 font-medium">Geloggt</span>
                    )}
                    {hasSymptoms && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-200 font-mono">
                        {info!.entry!.symptoms.length} Sym.
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom: Energy level or details hint */}
                <div className="text-[9px] text-slate-400 font-medium truncate flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <span>Tag {info?.status?.currentDay || '-'}</span>
                  <span className="group-hover:text-purple-300 transition-colors">Details →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DAY DETAIL INSPECTOR MODAL */}
      {selectedDayDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl bg-[#1A1A26] border border-purple-500/30 p-6 sm:p-7 text-slate-100 shadow-2xl relative">
            <button
              onClick={() => setSelectedDayDate(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                  📅
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {formatDateGerman(selectedDayDate)}
                  </h3>
                  <p className="text-xs text-purple-300">
                    {selectedDayInfo?.status ? `Zyklustag ${selectedDayInfo.status.currentDay} · ${selectedDayInfo.status.phaseName}` : 'Kein aktiver Zyklus an diesem Tag'}
                  </p>
                </div>
              </div>

              {selectedDayInfo?.status ? (
                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-2xl bg-[#12121A] border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">
                      Phasen-Status & Saison
                    </span>
                    <div className="text-sm font-bold text-white">
                      {selectedDayInfo.status.phaseName} ({selectedDayInfo.status.phaseSeason})
                    </div>
                    <div className="text-xs text-slate-400">
                      Voraussichtliche nächste Periode in {selectedDayInfo.status.daysUntilNextPeriod} Tagen ({formatDateGerman(selectedDayInfo.status.nextPeriodDate)})
                    </div>
                  </div>

                  {selectedDayInfo.entry && (
                    <div className="p-4 rounded-2xl bg-[#12121A] border border-slate-800 space-y-3">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 block mb-1.5">Erfasste Stimmung:</span>
                        <div className="flex items-center gap-2 text-xs text-slate-200">
                          <span className="text-lg">
                            {MOOD_OPTIONS.find((m) => m.id === selectedDayInfo.entry.mood)?.emoji || '🌿'}
                          </span>
                          <span className="font-semibold">
                            {MOOD_OPTIONS.find((m) => m.id === selectedDayInfo.entry.mood)?.label || 'Ausgeglichen'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-slate-400 block mb-1.5">Symptome an diesem Tag:</span>
                        {selectedDayInfo.entry.symptoms.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">Keine Symptome hinterlegt.</p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {selectedDayInfo.entry.symptoms.map((sId) => {
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

                      {selectedDayInfo.entry.notes && (
                        <div className="pt-2 border-t border-slate-800 text-xs text-slate-300">
                          <span className="font-semibold text-slate-400 block mb-0.5">Notiz:</span>
                          {selectedDayInfo.entry.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-[#12121A] text-center text-xs text-slate-400">
                  Für diesen Tag liegt kein aktiver Zyklusverlauf vor.
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex gap-3">
                <button
                  onClick={() => {
                    setSelectedDayDate(null);
                    onOpenLogModal();
                  }}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-md shadow-purple-600/20"
                >
                  Zyklus & Symptome für diesen Tag anpassen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
