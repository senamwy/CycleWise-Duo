import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  BarChart
} from 'recharts';
import { CycleEntry, User } from '../types';
import {
  calculateHistoricalStats,
  generateDayByDayPredictionCurve,
  generateCycleComparisonData,
  generateMultiCycleForecast,
  formatShortDate
} from '../utils/cyclePrediction';
import { seedSampleHistoricalCycles } from '../utils/storage';
import {
  Sparkles,
  TrendingUp,
  Calendar,
  Activity,
  ShieldCheck,
  Info,
  Layers,
  Clock,
  HelpCircle,
  Flame,
  Zap,
  RefreshCw,
  Plus,
  BookOpen
} from 'lucide-react';

interface CyclePredictionChartProps {
  user: User;
  entries: CycleEntry[];
  onRefreshEntries?: () => void;
  onOpenLogModal?: () => void;
}

type ViewMode = 'phase_curve' | 'history_comparison' | 'three_month_forecast';

export const CyclePredictionChart: React.FC<CyclePredictionChartProps> = ({
  user,
  entries,
  onRefreshEntries,
  onOpenLogModal
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('phase_curve');
  const [showHormones, setShowHormones] = useState<boolean>(true);
  const [showFertility, setShowFertility] = useState<boolean>(true);
  const [showEnergy, setShowEnergy] = useState<boolean>(false);
  const [showScientificModal, setShowScientificModal] = useState<boolean>(false);

  // Compute statistical metrics from historical data
  const stats = useMemo(() => calculateHistoricalStats(entries), [entries]);

  // Compute day-by-day continuous curve points for Recharts
  const curveData = useMemo(() => {
    // Current day estimate if latest cycle exists
    let currentDay = 1;
    if (entries.length > 0) {
      const sorted = [...entries].sort((a, b) => b.startDate.localeCompare(a.startDate));
      const latest = sorted[0];
      const startMs = new Date(latest.startDate).getTime();
      const diffDays = Math.floor((Date.now() - startMs) / (1000 * 60 * 60 * 24));
      const len = latest.cycleLengthDays || 28;
      currentDay = (diffDays % len) + 1;
    }
    return generateDayByDayPredictionCurve(stats.averageCycleLength, stats.averagePeriodLength, currentDay);
  }, [entries, stats]);

  // Compute historical comparison items
  const comparisonData = useMemo(
    () => generateCycleComparisonData(entries, stats),
    [entries, stats]
  );

  // Compute 3-cycle forward forecast
  const forecastData = useMemo(
    () => generateMultiCycleForecast(stats, 3),
    [stats]
  );

  const handleSeedDemoCycles = () => {
    seedSampleHistoricalCycles(user.id);
    if (onRefreshEntries) {
      onRefreshEntries();
    }
  };

  // Custom Recharts Tooltip for the Day-by-Day Curve
  const CustomDayTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#101018]/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700 shadow-2xl text-xs max-w-xs z-50">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
            <span className="font-bold text-white text-sm">
              Zyklustag {data.day}
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ backgroundColor: `${data.phaseColor}25`, color: data.phaseColor }}
            >
              {data.phaseName}
            </span>
          </div>

          <div className="space-y-1.5 text-slate-300">
            {showFertility && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Fruchtbarkeit:
                </span>
                <span className="font-semibold text-white">{data.fertilityProbability}%</span>
              </div>
            )}

            {showHormones && (
              <>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-purple-300">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    Östrogen:
                  </span>
                  <span className="font-semibold text-white">{data.estrogenLevel}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-pink-300">
                    <span className="w-2 h-2 rounded-full bg-pink-400" />
                    Progesteron:
                  </span>
                  <span className="font-semibold text-white">{data.progesteroneLevel}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    LH-Surge (Peak):
                  </span>
                  <span className="font-semibold text-white">{data.lhSurgeLevel}%</span>
                </div>
              </>
            )}

            {showEnergy && (
              <>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    Energielevel:
                  </span>
                  <span className="font-semibold text-white">{data.predictedEnergy} / 5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-rose-300">
                    <Flame className="w-3 h-3 text-rose-400" />
                    Krampf-Risiko:
                  </span>
                  <span className="font-semibold text-white">{data.crampProbability}%</span>
                </div>
              </>
            )}

            {data.isCurrentDay && (
              <div className="mt-2 pt-1.5 border-t border-slate-800 text-center text-purple-300 font-semibold text-[11px]">
                📍 Heutiger geschätzter Tag im Zyklus
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Recharts Tooltip for History Bar Chart
  const CustomHistoryTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#101018]/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700 shadow-2xl text-xs max-w-xs z-50">
          <div className="font-bold text-white text-sm mb-1.5">
            {data.label}
          </div>
          <p className="text-[11px] text-slate-400 mb-2">
            Startdatum: {formatShortDate(data.startDate)} · Gesamtlänge:{' '}
            <span className="text-white font-bold">{data.totalDays} Tage</span>
          </p>

          <div className="space-y-1 text-slate-300">
            <div className="flex justify-between items-center text-rose-300">
              <span>Menstruation:</span>
              <span className="font-semibold text-white">{data.periodDays} Tage</span>
            </div>
            <div className="flex justify-between items-center text-purple-300">
              <span>Follikelphase:</span>
              <span className="font-semibold text-white">{data.follicularDays} Tage</span>
            </div>
            <div className="flex justify-between items-center text-amber-300">
              <span>Eisprung-Fenster:</span>
              <span className="font-semibold text-white">{data.ovulationDays} Tage</span>
            </div>
            <div className="flex justify-between items-center text-pink-300">
              <span>Lutealphase:</span>
              <span className="font-semibold text-white">{data.lutealDays} Tage</span>
            </div>

            {data.isPrediction && (
              <div className="mt-2 pt-1.5 border-t border-slate-800 text-purple-300 text-[11px]">
                ✦ Statistische Vorhersage (80% Konfidenz: ±{data.confidenceMargin} Tage)
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header with Title and Scientific Info Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Zyklus-Prognose & Historische Datenanalyse</span>
            <span aria-hidden="true">·</span>
            <span className="text-pink-300 font-semibold">Recharts Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Phasen-Vorhersage für dein Profil
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Berechnet aus deinen {stats.totalCyclesLogged} erfassten Zyklen mit 80% statistischem Konfidenzintervall.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setShowScientificModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101018] hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 text-purple-300 text-xs font-semibold transition-all cursor-pointer"
            title="Wissenschaftliche Methodik anzeigen"
          >
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>Wie funktioniert die 80%-Prognose?</span>
          </button>

          {stats.totalCyclesLogged < 3 && (
            <button
              onClick={handleSeedDemoCycles}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 text-xs font-semibold transition-all cursor-pointer"
              title="Lade 4 realistische Testzyklen zur Simulation"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
              <span>Beispiel-Historie (4 Zyklen) laden</span>
            </button>
          )}

          {onOpenLogModal && (
            <button
              onClick={onOpenLogModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 text-white text-xs font-semibold shadow-md shadow-pink-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Zyklus eintragen</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div className="p-3.5 rounded-2xl bg-[#101018] border border-slate-800/90 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Ø Zyklusdauer</span>
          <div className="mt-1">
            <span className="text-xl font-black text-white">{stats.averageCycleLength}</span>
            <span className="text-xs text-slate-400 ml-1">Tage</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">
            Schwankung: ±{stats.stdDeviationDays} Tage
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#101018] border border-slate-800/90 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Ø Periodendauer</span>
          <div className="mt-1">
            <span className="text-xl font-black text-rose-300">{stats.averagePeriodLength}</span>
            <span className="text-xs text-slate-400 ml-1">Tage</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">
            Follikelphase: ~{stats.estimatedOvulationDay - Math.round(stats.averagePeriodLength)} Tage
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#101018] border border-slate-800/90 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Nächster Eisprung</span>
          <div className="mt-1">
            <span className="text-sm font-bold text-amber-300">
              {formatShortDate(stats.nextOvulationEstimatedDate)}
            </span>
          </div>
          <span className="text-[10px] text-amber-400/80 mt-0.5">
            Fenster: {formatShortDate(stats.nextOvulationConfidenceRange.minDate)} – {formatShortDate(stats.nextOvulationConfidenceRange.maxDate)}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#101018] border border-slate-800/90 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Nächste Periode</span>
          <div className="mt-1">
            <span className="text-sm font-bold text-pink-300">
              {formatShortDate(stats.nextPeriodEstimatedDate)}
            </span>
          </div>
          <span className="text-[10px] text-pink-400/80 mt-0.5">
            80% Bereich: {formatShortDate(stats.nextPeriodConfidenceRange.minDate)} – {formatShortDate(stats.nextPeriodConfidenceRange.maxDate)}
          </span>
        </div>

        <div className="col-span-2 lg:col-span-1 p-3.5 rounded-2xl bg-purple-950/25 border border-purple-500/30 flex flex-col justify-between">
          <span className="text-[11px] text-purple-300 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            Zuverlässigkeit
          </span>
          <div className="mt-1">
            <span className="text-xl font-black text-purple-200">
              {stats.confidenceScorePercent}%
            </span>
            <span className="text-[11px] text-purple-300 ml-1.5 font-medium">
              ({stats.totalCyclesLogged} Zyklen)
            </span>
          </div>
          <span className="text-[10px] text-purple-300/80 mt-0.5">
            {stats.confidenceScorePercent >= 80
              ? '✓ 80%-Schwelle erreicht'
              : 'Noch 3–4 Zyklen für >80% nötig'}
          </span>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 bg-[#101018] p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setViewMode('phase_curve')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'phase_curve'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Phasen- & Hormonkurve</span>
          </button>

          <button
            onClick={() => setViewMode('history_comparison')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'history_comparison'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Zyklus-Historie (Recharts)</span>
          </button>

          <button
            onClick={() => setViewMode('three_month_forecast')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'three_month_forecast'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>3-Monats-Vorausschau</span>
          </button>
        </div>

        {/* Dynamic Controls for Mode 1 */}
        {viewMode === 'phase_curve' && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowFertility(!showFertility)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-colors cursor-pointer ${
                showFertility
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-[#101018] border-slate-800 text-slate-500'
              }`}
            >
              Fruchtbarkeit
            </button>

            <button
              onClick={() => setShowHormones(!showHormones)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-colors cursor-pointer ${
                showHormones
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                  : 'bg-[#101018] border-slate-800 text-slate-500'
              }`}
            >
              Hormone (Östrogen / Prog / LH)
            </button>

            <button
              onClick={() => setShowEnergy(!showEnergy)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-colors cursor-pointer ${
                showEnergy
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                  : 'bg-[#101018] border-slate-800 text-slate-500'
              }`}
            >
              Energie & Krämpfe
            </button>
          </div>
        )}
      </div>

      {/* CHART CONTAINER: VIEW MODE 1 - DAY-BY-DAY CURVE */}
      {viewMode === 'phase_curve' && (
        <div className="space-y-4">
          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={curveData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  {/* Gradients */}
                  <linearGradient id="fertilityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="estrogenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="progesteroneGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#262638" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#64748B"
                  fontSize={11}
                  tickFormatter={(val) => `Tag ${val}`}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  domain={[0, 100]}
                  tickFormatter={(val) => `${val}%`}
                  tickLine={false}
                />
                <Tooltip content={<CustomDayTooltip />} />

                {/* Reference line for ovulation day */}
                <ReferenceLine
                  x={stats.estimatedOvulationDay}
                  stroke="#F59E0B"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Eisprung (~Tag ' + stats.estimatedOvulationDay + ')',
                    fill: '#F59E0B',
                    fontSize: 10,
                    position: 'top'
                  }}
                />

                {/* Reference line for period end */}
                <ReferenceLine
                  x={Math.round(stats.averagePeriodLength)}
                  stroke="#F43F5E"
                  strokeDasharray="2 2"
                  label={{
                    value: 'Ende Menstruation',
                    fill: '#F43F5E',
                    fontSize: 9,
                    position: 'insideTopLeft'
                  }}
                />

                {/* Fertility Area */}
                {showFertility && (
                  <Area
                    type="monotone"
                    dataKey="fertilityProbability"
                    name="Fruchtbarkeit"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#fertilityGradient)"
                  />
                )}

                {/* Hormones */}
                {showHormones && (
                  <>
                    <Area
                      type="monotone"
                      dataKey="estrogenLevel"
                      name="Östrogen"
                      stroke="#A855F7"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#estrogenGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="progesteroneLevel"
                      name="Progesteron"
                      stroke="#EC4899"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#progesteroneGradient)"
                    />
                    <Line
                      type="monotone"
                      dataKey="lhSurgeLevel"
                      name="LH-Peak (Surge)"
                      stroke="#10B981"
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </>
                )}

                {/* Energy & Cramps */}
                {showEnergy && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="crampProbability"
                      name="Krampf-Risiko"
                      stroke="#F43F5E"
                      strokeWidth={2}
                      strokeDasharray="3 3"
                      dot={false}
                    />
                  </>
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Phase Color Badges Footer */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <div className="p-2.5 rounded-xl bg-[#101018] border border-slate-800 flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Tage 1 – {Math.round(stats.averagePeriodLength)}</span>
                <span className="text-xs font-bold text-white">Menstruation</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#101018] border border-slate-800 flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-purple-500 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Tage {Math.round(stats.averagePeriodLength) + 1} – {stats.estimatedOvulationDay - 2}</span>
                <span className="text-xs font-bold text-white">Follikelphase</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#101018] border border-slate-800 flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Tage {stats.estimatedOvulationDay - 1} – {stats.estimatedOvulationDay + 1}</span>
                <span className="text-xs font-bold text-white">Ovulation (Eisprung)</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#101018] border border-slate-800 flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-pink-500 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Tage {stats.estimatedOvulationDay + 2} – {Math.round(stats.averageCycleLength)}</span>
                <span className="text-xs font-bold text-white">Lutealphase</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHART CONTAINER: VIEW MODE 2 - HISTORICAL COMPARISON BAR CHART */}
      {viewMode === 'history_comparison' && (
        <div className="space-y-4">
          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonData}
                margin={{ top: 20, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid stroke="#262638" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  domain={[0, 40]}
                  tickFormatter={(val) => `${val}d`}
                  tickLine={false}
                />
                <Tooltip content={<CustomHistoryTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  formatter={(value) => {
                    const map: Record<string, string> = {
                      periodDays: 'Menstruation',
                      follicularDays: 'Follikelphase',
                      ovulationDays: 'Eisprung-Fenster',
                      lutealDays: 'Lutealphase'
                    };
                    return map[value] || value;
                  }}
                />

                {/* Reference line for 28-day population average */}
                <ReferenceLine
                  y={28}
                  stroke="#64748B"
                  strokeDasharray="3 3"
                  label={{ value: 'Standard (28d)', fill: '#64748B', fontSize: 10, position: 'right' }}
                />

                {/* Stacked Bars for each phase */}
                <Bar dataKey="periodDays" stackId="a" fill="#F43F5E" radius={[0, 0, 0, 0]} />
                <Bar dataKey="follicularDays" stackId="a" fill="#A855F7" radius={[0, 0, 0, 0]} />
                <Bar dataKey="ovulationDays" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
                <Bar dataKey="lutealDays" stackId="a" fill="#EC4899" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-400 text-center">
            Die letzte Säule visualisiert deine errechnete <span className="text-purple-300 font-semibold">Prognose</span> inklusive Aufteilung der vier biologischen Phasen.
          </p>
        </div>
      )}

      {/* CHART CONTAINER: VIEW MODE 3 - 3-MONTH FORECAST */}
      {viewMode === 'three_month_forecast' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400 mb-2">
            Vorausschau der kommenden 3 Zyklen basierend auf deinem individuellen Rhythmus:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {forecastData.map((f) => (
              <div
                key={f.cycleIndex}
                className="p-4 rounded-2xl bg-[#101018] border border-slate-800 hover:border-purple-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-purple-300 uppercase tracking-wide">
                      {f.cycleLabel}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold">
                      ±{f.confidenceWindowDays} Tage
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Prognostizierter Start:</span>
                      <span className="font-bold text-white text-sm">
                        {formatShortDate(f.startDate)}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <span className="text-[10px] text-amber-300 font-semibold block">
                        Fruchtbares Fenster & Eisprung:
                      </span>
                      <span className="font-bold text-white text-xs">
                        {f.ovulationWindow}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Peak: ~{formatShortDate(f.ovulationDate)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block">Voraussichtliches Ende:</span>
                      <span className="font-medium text-slate-300">
                        {formatShortDate(f.endDate)} ({f.cycleLength} Tage)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-purple-400" />
                  <span>Berechnet nach Luteal-Konstanz</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Most frequent symptoms insight from history */}
      {stats.commonSymptoms.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="text-slate-300 font-medium">Häufigste Symptome in deiner Historie:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {stats.commonSymptoms.slice(0, 4).map((s) => (
              <span
                key={s.id}
                className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-200 text-xs font-medium"
              >
                {s.label} <span className="text-purple-400/80">({s.count}x)</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Scientific Methodology Modal */}
      {showScientificModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-[#1A1A26] border border-purple-500/30 p-6 text-slate-100 shadow-2xl relative">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Wie erreicht die App die 80%-Prognose?
                </h3>
                <p className="text-xs text-purple-300">
                  Wissenschaftliche Grundlagen nach Bull et al. & WHO
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-3.5 rounded-xl bg-[#101018] border border-slate-800 space-y-2">
                <span className="font-bold text-white block">
                  1. Warum 1 Zyklus nicht ausreicht (~55% Genauigkeit):
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Nur 13–16% aller Frauen haben einen exakt 28-Tage-Zyklus. Ohne Historie muss jede App mit Standard-Mittelwerten schätzen.
                </p>
                <button
                  onClick={() => {
                    setShowScientificModal(false);
                    window.location.hash = '#study/study-bull-2019';
                  }}
                  className="inline-flex items-center gap-1.5 text-[11px] text-purple-400 hover:text-purple-300 font-semibold underline cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Studie: Bull et al. (Nature, 612.000 Zyklen) direkt lesen →</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                <span className="font-bold text-purple-200 block">
                  2. Die 80%-Schwelle bei 3–4 Zyklen (Stichproben):
                </span>
                <p className="text-purple-300/90 text-[11px] leading-relaxed">
                  Nach 3 bis 4 vollständigen Zyklen erfasst der Algorithmus die persönliche Varianz der Follikelphase und die Stabilität der Lutealphase (typischerweise 13–15 Tage). Damit erreicht die statistische Vorhersage eine Trefferquote von <strong>über 80–85%</strong>.
                </p>
                <button
                  onClick={() => {
                    setShowScientificModal(false);
                    window.location.hash = '#study/study-wilcox-2000';
                  }}
                  className="inline-flex items-center gap-1.5 text-[11px] text-pink-300 hover:text-pink-200 font-semibold underline cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Studie: Wilcox et al. (BMJ, Fertiles Fenster) direkt lesen →</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#101018] border border-slate-800">
                <span className="font-bold text-white block mb-1">
                  3. LH-Teststreifen (Test-Stifte):
                </span>
                <p className="text-slate-400 text-[11px]">
                  Für einen physischen Nachweis des Eisprungs werden <strong>5 bis 7 Test-Stifte</strong> in Folge benötigt, um den 24–36 Stunden kurzen LH-Peak sicher abzufangen.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-rose-200 text-[11px]">
                <strong>Wichtiger medizinischer Hinweis:</strong> Diese statistischen Prognosen dienen dem Wohlbefinden und der partnerschaftlichen Unterstützung. Sie sind <em>nicht</em> als Verhütungsmethode oder für Schwangerschaftsdiagnostik zugelassen.
              </div>
            </div>

            <button
              onClick={() => setShowScientificModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Verstanden & Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
