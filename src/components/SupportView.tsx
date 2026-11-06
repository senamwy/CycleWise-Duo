import React, { useState } from 'react';
import { User, SupportSuggestion, CustomSupportIdea, SupportCategory } from '../types';
import { SUPPORT_SUGGESTIONS } from '../data/supportData';
import {
  getFavorites,
  toggleFavorite,
  getCustomIdeas,
  addCustomIdea,
  deleteCustomIdea
} from '../utils/storage';
import { triggerHapticFeedback } from '../utils/haptics';
import {
  Heart,
  Plus,
  Search,
  Calendar,
  Sparkles,
  Trash2,
  X,
  Coffee,
  Ear,
  Utensils,
  Flame,
  Award,
  Check,
  Lightbulb,
  MessageCircle,
  ShieldAlert,
  HeartHandshake,
  CheckCircle2,
  HelpCircle,
  BookOpen
} from 'lucide-react';

interface SupportViewProps {
  user: User;
  onOpenNewReminder: (prefillTitle?: string, prefillCategory?: any) => void;
}

export const SupportView: React.FC<SupportViewProps> = ({ user, onOpenNewReminder }) => {
  const partnerName = user.preferences.partnerName || 'deine Partnerin';
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'custom' | 'communication'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavoritesState] = useState<string[]>(() => getFavorites(user.id));
  const [customIdeas, setCustomIdeasState] = useState<CustomSupportIdea[]>(() => getCustomIdeas(user.id));

  // Modal for new custom idea
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customCat, setCustomCat] = useState<SupportCategory>('gesture');

  // Interactive Communication Scenario state
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);

  const communicationScenarios = [
    {
      id: 'scen-1',
      phase: 'Menstruation / Erschöpfung',
      situation: 'Sie zieht sich abends schweigend zurück und möchte einfach nur ihre Ruhe haben.',
      commonMistake: 'Warum bist du heute so still? Habe ich etwas Falsches gesagt oder gemacht?',
      empatheticPhrase: 'Ich merke, dass du heute total geschafft bist. Soll ich uns einfach ein ruhiges Abendessen machen und den Fernseher auslassen?',
      scienceNote: 'In der Menstruationsphase ist der Körper mit Geweberegeneration und starkem Energieverbrauch beschäftigt. Ruhige Präsenz ohne Erwartungsdruck gibt ihr das Gefühl von Sicherheit.'
    },
    {
      id: 'scen-2',
      phase: 'Lutealphase / PMS (Innerer Herbst)',
      situation: 'Sie reagiert auf eine Kleinigkeit (z.B. vergessene Spülmaschine) sehr dünnhäutig oder gereizt.',
      commonMistake: 'Du übertreibst total, das ist doch gar kein Grund, sich so aufzuregen!',
      empatheticPhrase: 'Es tut mir leid, dass dich das gerade so stresst. Lass mich das schnell erledigen, du hast heute genug geschafft.',
      scienceNote: 'Progesteron-Schwankungen beeinflussen die Reizfilterschwelle im Gehirn. Sachliche Entlastung und Schuldbewusstsein zu vermeiden deeskaliert die Situation sofort.'
    },
    {
      id: 'scen-3',
      phase: 'Alltagsstress & Überforderung',
      situation: 'Sie erzählt von der Arbeit und schildert frustriert ein Problem.',
      commonMistake: 'Du musst einfach folgendes tun: [Sofort Ratschläge und Lösungsvorschläge geben].',
      empatheticPhrase: 'Möchtest du, dass wir nach einer Lösung suchen, oder tut es gerade einfach gut, dir den Frust von der Seele zu reden?',
      scienceNote: 'Oft suchen Frauen in stressigen Momenten empathische Validierung und emotionalen Rückhalt statt unaufgeforderter Problemlösungen ("Social Buffering").'
    },
    {
      id: 'scen-4',
      phase: 'Ovulation / Follikelphase',
      situation: 'Sie hat viel Energie, sprudelt vor Ideen und möchte gemeinsame Pläne schmieden.',
      commonMistake: 'Ach, lass uns lieber zu Hause bleiben, das ist mir zu anstrengend.',
      empatheticPhrase: 'Das klingt großartig! Lass uns das direkt fürs Wochenende einplanen – was brauchst du von mir dafür?',
      scienceNote: 'In dieser Phase ist das soziale Belohnungssystem im Gehirn besonders aktiv. Geteilte Vorfreude stärkt die partnerschaftliche Bindung enorm.'
    }
  ];

  const handleToggleFav = (id: string) => {
    triggerHapticFeedback('light');
    toggleFavorite(user.id, id);
    setFavoritesState(getFavorites(user.id));
  };

  const handleCreateCustomIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    triggerHapticFeedback('success');
    addCustomIdea(user.id, {
      title: customTitle.trim(),
      description: customDescription.trim(),
      category: customCat
    });

    setCustomIdeasState(getCustomIdeas(user.id));
    setCustomTitle('');
    setCustomDescription('');
    setShowAddCustomModal(false);
  };

  const handleDeleteCustomIdea = (id: string) => {
    triggerHapticFeedback('medium');
    deleteCustomIdea(user.id, id);
    setCustomIdeasState(getCustomIdeas(user.id));
  };

  const categories = [
    { id: 'all', label: 'Alle' },
    { id: 'gesture', label: 'Kleine Gesten' },
    { id: 'listening', label: 'Zuhören & Empathie' },
    { id: 'practical', label: 'Praktische Entlastung' },
    { id: 'comfort', label: 'Komfort & Erholung' },
    { id: 'appreciation', label: 'Wertschätzung' }
  ];

  // Filtering
  const filteredSuggestions = SUPPORT_SUGGESTIONS.filter((sug) => {
    if (activeTab === 'favorites' && !favorites.includes(sug.id)) return false;
    if (selectedCategory !== 'all' && sug.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        sug.title.toLowerCase().includes(q) ||
        sug.description.toLowerCase().includes(q) ||
        sug.whyItHelps.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredCustomIdeas = customIdeas.filter((idea) => {
    if (selectedCategory !== 'all' && idea.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        idea.title.toLowerCase().includes(q) ||
        idea.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Icon renderer
  const renderCategoryIcon = (category: string) => {
    switch (category) {
      case 'gesture':
        return <Coffee className="w-4 h-4 text-purple-400" />;
      case 'listening':
        return <Ear className="w-4 h-4 text-pink-400" />;
      case 'practical':
        return <Utensils className="w-4 h-4 text-purple-400" />;
      case 'comfort':
        return <Flame className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-pink-400" />;
    }
  };

  const currentScenario = communicationScenarios[selectedScenarioIndex % communicationScenarios.length];

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 tracking-wide uppercase">
            <span>Beziehungs-Begleiter & Kommunikation</span>
            <span aria-hidden="true">·</span>
            <span>Konkrete Handlungen</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Wie kann ich sie heute unterstützen?
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Aufmerksamkeiten, Kommunikations-Coach und praktische Entlastung für {partnerName}.
          </p>
        </div>

        <button
          onClick={() => {
            triggerHapticFeedback('light');
            setShowAddCustomModal(true);
          }}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-purple-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Eigene Idee anlegen</span>
        </button>
      </div>

      {/* Main Subtabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Subtabs */}
        <div className="flex items-center gap-1 bg-[#1A1A26] p-1 rounded-2xl border border-slate-800 overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('all');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Alle Vorschläge ({SUPPORT_SUGGESTIONS.length})
          </button>
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('communication');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'communication'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                : 'text-pink-300 hover:text-white bg-pink-950/20 border border-pink-500/20'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>💬 Kommunikations-Coach</span>
          </button>
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('favorites');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Meine Favoriten ({favorites.length})
          </button>
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('custom');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'custom'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Eigene Ideen ({customIdeas.length})
          </button>
        </div>

        {/* Search */}
        {activeTab !== 'communication' && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nach Ideen suchen..."
              className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl bg-[#1A1A26] border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-purple-500 outline-none"
            />
          </div>
        )}
      </div>

      {/* Categories Bar (Only for non-communication tabs) */}
      {activeTab !== 'communication' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#1A1A26] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* COMMUNICATION COACH TAB */}
      {activeTab === 'communication' && (
        <div className="space-y-6">
          {/* Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-pink-950/40 via-[#1A1A26] to-purple-950/30 border border-pink-500/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl space-y-4">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-pink-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold border border-pink-500/30">
                <MessageCircle className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-pink-400">
                  Paar-Kommunikation & Empathie-Trainer
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Sicher durch emotionale Momente navigieren
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              In stressigen oder hormonell sensiblen Momenten (wie PMS oder Menstruation) reagiert das Gehirn empfindlicher auf Reize. Was du sagst, entscheidet darüber, ob sich ein Konflikt entzündet oder ob ihr euch tief verbunden fühlt.
            </p>

            {/* Scenario Selector Pills */}
            <div className="pt-2 flex flex-wrap gap-2">
              {communicationScenarios.map((scen, idx) => (
                <button
                  key={scen.id}
                  onClick={() => {
                    triggerHapticFeedback('light');
                    setSelectedScenarioIndex(idx);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedScenarioIndex === idx
                      ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                      : 'bg-[#12121A] text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {scen.phase}
                </button>
              ))}
            </div>
          </div>

          {/* Active Scenario Card */}
          <div className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                Konkrete Alltagssituation
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                {currentScenario.situation}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Common Mistake (Red Box) */}
              <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>Instinktiv oft gesagt (Vermeiden)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-rose-200 font-medium italic mt-2 leading-relaxed">
                    "{currentScenario.commonMistake}"
                  </p>
                </div>
                <div className="text-[11px] text-rose-300/80 pt-3 border-t border-rose-500/20">
                  <strong>Wirkung:</strong> Führt oft zu Missverständnissen und Abwehrhaltung.
                </div>
              </div>

              {/* Empathetic Phrasing (Green Box) */}
              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase">
                    <HeartHandshake className="w-4 h-4 text-emerald-400" />
                    <span>Empathische Formulierung (Empfohlen)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-100 font-semibold mt-2 leading-relaxed">
                    "{currentScenario.empatheticPhrase}"
                  </p>
                </div>
                <div className="text-[11px] text-emerald-300/90 pt-3 border-t border-emerald-500/20">
                  <strong>Wirkung:</strong> Signalisiert biologische Sicherheit und tiefe Verbundenheit.
                </div>
              </div>
            </div>

            {/* Scientific Explanation */}
            <div className="p-4 rounded-2xl bg-[#12121A] border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Der biologische Hintergrund & Social Buffering:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentScenario.scienceNote}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM IDEAS TAB */}
      {activeTab === 'custom' && (
        <div className="space-y-4">
          {filteredCustomIdeas.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#1A1A26] border border-slate-800 text-center">
              <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-white">Noch keine eigenen Ideen eingetragen</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Halte persönliche Rituale, Lieblingssnacks oder Insider-Gesten fest, die nur für euch zwei gelten.
              </p>
              <button
                onClick={() => {
                  triggerHapticFeedback('light');
                  setShowAddCustomModal(true);
                }}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Erste Idee hinzufügen
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCustomIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="rounded-3xl bg-[#1A1A26] border border-purple-500/20 p-5 flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-purple-400 font-semibold mb-2">
                      <span className="capitalize">{idea.category}</span>
                      <button
                        onClick={() => handleDeleteCustomIdea(idea.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="Löschen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h3 className="text-base font-bold text-white">{idea.title}</h3>
                    {idea.description && (
                      <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                        {idea.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        triggerHapticFeedback('light');
                        onOpenNewReminder(idea.title, idea.category);
                      }}
                      className="text-xs text-purple-300 hover:text-purple-200 font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Zur Erinnerung machen</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CURATED SUGGESTIONS (All or Favorites) */}
      {activeTab !== 'communication' && activeTab !== 'custom' && (
        <div className="space-y-4">
          {filteredSuggestions.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#1A1A26] border border-slate-800 text-center">
              <Heart className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-white">Keine Vorschläge gefunden</h3>
              <p className="text-xs text-slate-400 mt-1">
                {activeTab === 'favorites'
                  ? 'Du hast noch keine Favoriten gespeichert. Klicke auf das Herz bei einer Idee.'
                  : 'Versuche einen anderen Suchbegriff oder eine andere Kategorie.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSuggestions.map((sug) => {
                const isFav = favorites.includes(sug.id);
                return (
                  <div
                    key={sug.id}
                    className="rounded-3xl bg-[#1A1A26] border border-slate-800 hover:border-purple-500/40 p-5 sm:p-6 transition-all flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      {/* Category & Time */}
                      <div className="flex items-center justify-between text-xs text-purple-400 font-semibold mb-2.5">
                        <div className="flex items-center gap-1.5">
                          {renderCategoryIcon(sug.category)}
                          <span>{sug.categoryLabel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400">{sug.timeToExecute}</span>
                          <button
                            onClick={() => handleToggleFav(sug.id)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isFav
                                ? 'bg-pink-500/20 border-pink-500/40 text-pink-400'
                                : 'bg-[#101018] border-slate-800 text-slate-500 hover:text-white'
                            }`}
                            title={isFav ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-pink-400' : ''}`} />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-white leading-snug">
                        {sug.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                        {sug.description}
                      </p>

                      <div className="mt-3 p-3 rounded-2xl bg-[#101018] border border-slate-800/80 text-xs text-purple-200/90 flex items-start gap-2">
                        <span className="font-semibold text-purple-400 shrink-0">Warum es hilft:</span>
                        <span>{sug.whyItHelps}</span>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => {
                          triggerHapticFeedback('light');
                          onOpenNewReminder(sug.title, sug.category);
                        }}
                        className="text-xs text-purple-300 hover:text-purple-200 font-semibold flex items-center gap-1.5 cursor-pointer py-1"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>In Erinnerungen übernehmen</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CREATE CUSTOM IDEA MODAL */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#1A1A26] border border-purple-500/30 p-6 sm:p-7 text-slate-100 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Eigene Unterstützungsidee
              </h3>
              <button
                onClick={() => {
                  triggerHapticFeedback('light');
                  setShowAddCustomModal(false);
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomIdea} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Titel der Aufmerksamkeit *
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="z.B. Sonntagskuchen backen & Playlist an"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101018] border border-slate-700 text-xs sm:text-sm text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Kategorie
                </label>
                <select
                  value={customCat}
                  onChange={(e) => setCustomCat(e.target.value as SupportCategory)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101018] border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                >
                  <option value="gesture">Kleine Geste</option>
                  <option value="listening">Zuhören & Empathie</option>
                  <option value="practical">Praktische Entlastung</option>
                  <option value="comfort">Komfort & Erholung</option>
                  <option value="appreciation">Wertschätzung</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Details / Persönliche Notiz <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Wie gehst du vor? Was mag sie besonders gerne?"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101018] border border-slate-700 text-xs sm:text-sm text-white focus:border-purple-500 outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerHapticFeedback('light');
                    setShowAddCustomModal(false);
                  }}
                  className="w-1/3 py-2.5 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={!customTitle.trim()}
                  className="w-2/3 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors shadow-md shadow-purple-600/20 cursor-pointer"
                >
                  Idee speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
