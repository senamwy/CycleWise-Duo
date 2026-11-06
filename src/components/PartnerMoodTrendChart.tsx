import React from 'react';
import { User } from '../types';
import { getPartnerConnectionForUser, getSharingPermissions, getCycleEntries } from '../utils/storage';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { TrendingUp, Sparkles, Heart, ShieldCheck, Lock } from 'lucide-react';

interface PartnerMoodTrendChartProps {
  user: User;
}

export const PartnerMoodTrendChart: React.FC<PartnerMoodTrendChartProps> = ({ user }) => {
  const connection = getPartnerConnectionForUser(user.id);
  const isConnected = Boolean(connection && connection.status === 'connected');
  const permissions = isConnected ? getSharingPermissions(connection!.id, connection!.girlfriendId) : null;
  const canSeeSymptomsOrMood = permissions && (permissions.shareSelectedSymptoms || permissions.shareGeneralPhase);

  const entries = isConnected && canSeeSymptomsOrMood ? getCycleEntries(connection!.girlfriendId) : [];

  // Map entries to Recharts data points (mood & energy over last 3 months)
  const moodScoreMap: Record<string, number> = {
    energetic: 4,
    calm: 3,
    sensitive: 2,
    exhausted: 1
  };

  const energyScoreMap: Record<string, number> = {
    high: 3,
    medium: 2,
    low: 1
  };

  const chartData = entries
    .slice()
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .map((e) => {
      const dateLabel = new Date(e.startDate).toLocaleDateString('de-DE', { month: 'short', day: 'numeric' });
      const moodVal = moodScoreMap[e.mood || 'calm'] || 3;
      const energyVal = energyScoreMap[e.energyLevel || 'medium'] || 2;
      return {
        date: dateLabel,
        Wohlbefinden: moodVal * 25, // Convert to percentage scale 0-100
        Energie: energyVal * 33,
        Stimmung: e.mood || 'ausgeglichen'
      };
    });

  // Fallback demo data if not enough entries or privacy not shared
  const displayData = chartData.length >= 2 ? chartData : [
    { date: 'Vor 3 Mon.', Wohlbefinden: 70, Energie: 65, Stimmung: 'calm' },
    { date: 'Vor 2 Mon.', Wohlbefinden: 75, Energie: 70, Stimmung: 'energetic' },
    { date: 'Letzten Monat', Wohlbefinden: 80, Energie: 75, Stimmung: 'calm' },
    { date: 'Aktueller Zyklus', Wohlbefinden: 85, Energie: 80, Stimmung: 'energetic' }
  ];

  return (
    <div className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-6 sm:p-7 shadow-xl space-y-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-pink-600/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-pink-500/20 text-pink-300 flex items-center justify-center border border-pink-500/30">
            <TrendingUp className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-pink-400">
                Wohlbefinden & Trend
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/15 text-pink-300 border border-pink-500/25">
                3-Monats-Trend
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
              Wohlbefinden & Unterstützungswirkung
            </h3>
          </div>
        </div>
      </div>

      {!isConnected ? (
        <div className="p-6 rounded-2xl bg-[#12121A] border border-slate-800 text-center space-y-2">
          <Lock className="w-6 h-6 text-slate-500 mx-auto" />
          <p className="text-xs font-bold text-white">Partnerverbindung erforderlich</p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Sobald du mit deiner Partnerin verbunden bist und sie den Trend teilt, siehst du hier die visualisierten Wohlbefindens-Trends.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Diese Trendanalyse zeigt das allgemeine Wohlbefinden und Energielevel im Verlauf der letzten Zyklen. Aufmerksame Zuwendung und Entlastung spiegeln sich direkt in stabileren Erholungsphasen wider.
          </p>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWohlbefinden" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C084FC" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C084FC" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorEnergie" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F472B6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F472B6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3C" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161622',
                    borderColor: '#2A2A3C',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="Wohlbefinden"
                  stroke="#C084FC"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorWohlbefinden)"
                />
                <Area
                  type="monotone"
                  dataKey="Energie"
                  stroke="#F472B6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorEnergie)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-400 inline-block" />
              Wohlbefinden (%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-pink-400 inline-block" />
              Energielevel (%)
            </span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Positiver Trend
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
