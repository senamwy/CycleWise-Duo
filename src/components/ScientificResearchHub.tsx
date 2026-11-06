import React, { useState, useEffect } from 'react';
import {
  ScientificStudy,
  HormonePathway,
  ScientificMythbuster,
  ScientificDomain,
  EuropePmcArticle
} from '../types';
import {
  SCIENTIFIC_STUDIES,
  HORMONE_PATHWAYS,
  SCIENTIFIC_MYTHBUSTERS,
  SCIENTIFIC_DOMAINS
} from '../data/scientificResearchData';
import { searchEuropePmc } from '../utils/europePmc';
import {
  Search,
  ExternalLink,
  BookOpen,
  Sparkles,
  Flame,
  Brain,
  Moon,
  Activity,
  HeartHandshake,
  CheckCircle2,
  XCircle,
  FileText,
  Dna,
  Microscope,
  Info,
  X,
  Share2,
  BookmarkCheck,
  ChevronRight,
  Filter,
  Check,
  RefreshCw
} from 'lucide-react';

interface ScientificResearchHubProps {
  onOpenStudyArticle?: (studyId: string) => void;
}

export const ScientificResearchHub: React.FC<ScientificResearchHubProps> = ({
  onOpenStudyArticle
}) => {
  // Main view sections inside the hub
  const [researchSection, setResearchSection] = useState<'studies' | 'hormones' | 'myths' | 'live_search'>('studies');
  
  // Studies filter
  const [selectedDomain, setSelectedDomain] = useState<ScientificDomain | 'all'>('all');
  const [studySearchQuery, setStudySearchQuery] = useState('');
  const [activeStudyModal, setActiveStudyModal] = useState<ScientificStudy | null>(null);

  // Live Europe PMC search state
  const [liveQuery, setLiveQuery] = useState('dysmenorrhea heat therapy');
  const [liveResults, setLiveResults] = useState<EuropePmcArticle[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveHits, setLiveHits] = useState(0);
  const [liveSource, setLiveSource] = useState<'live' | 'fallback'>('live');

  // Trigger default live search on mount or when tab activated
  useEffect(() => {
    if (researchSection === 'live_search' && liveResults.length === 0) {
      executeLiveSearch(liveQuery);
    }
  }, [researchSection]);

  const executeLiveSearch = async (term: string) => {
    if (!term.trim()) return;
    setLiveLoading(true);
    try {
      const res = await searchEuropePmc(term, 8);
      setLiveResults(res.articles);
      setLiveHits(res.totalHits);
      setLiveSource(res.source);
    } catch (err) {
      console.error('Error fetching live articles:', err);
    } finally {
      setLiveLoading(false);
    }
  };

  const filteredStudies = SCIENTIFIC_STUDIES.filter((study) => {
    const matchesDomain = selectedDomain === 'all' || study.domain === selectedDomain;
    const matchesSearch =
      !studySearchQuery ||
      study.title.toLowerCase().includes(studySearchQuery.toLowerCase()) ||
      study.shortTitle.toLowerCase().includes(studySearchQuery.toLowerCase()) ||
      study.biologicalMechanism.toLowerCase().includes(studySearchQuery.toLowerCase()) ||
      study.tags.some((t) => t.toLowerCase().includes(studySearchQuery.toLowerCase()));
    return matchesDomain && matchesSearch;
  });

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case 'pain_physiology':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'hormones_brain':
        return <Brain className="w-4 h-4 text-purple-400" />;
      case 'sleep_circadian':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'metabolism_nutrition':
        return <Activity className="w-4 h-4 text-emerald-400" />;
      case 'psychology_empathy':
        return <HeartHandshake className="w-4 h-4 text-pink-400" />;
      default:
        return <Microscope className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner for Science Hub */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#1E1B2E] via-[#1A1A26] to-[#12111E] border border-purple-500/20 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-500/15 via-pink-500/10 to-transparent blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Microscope className="w-3.5 h-3.5" />
                Evidenzbasierte Forschung
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Peer-Reviewed Publikationen
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/25">
                <Dna className="w-3.5 h-3.5" />
                Biochemische Rezeptor-Pfade
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Wissenschaftliche Studien & Biologie
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Verstehe die echten biochemischen Prozesse hinter Menstruation, Schmerz, Neurosteroiden und Schlafarchitektur. Fundierte Wissenschaft ersetzt Klischees durch echtes Verständnis.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="bg-[#12121A]/80 border border-slate-800 rounded-2xl p-4 flex flex-row md:flex-col justify-around gap-4 min-w-[200px]">
            <div>
              <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                7+
              </div>
              <div className="text-xs text-slate-400 font-medium">Kuratierte Landmark-Studien</div>
            </div>
            <div className="h-full w-px bg-slate-800 md:w-full md:h-px" />
            <div>
              <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-300">
                Live
              </div>
              <div className="text-xs text-slate-400 font-medium">Europe PMC / PubMed Suche</div>
            </div>
          </div>
        </div>

        {/* Section Navigation Pills */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap gap-2">
          <button
            onClick={() => setResearchSection('studies')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              researchSection === 'studies'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-[#14141E] text-slate-300 hover:text-white hover:bg-[#1E1E2C] border border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Landmark-Studien ({SCIENTIFIC_STUDIES.length})</span>
          </button>

          <button
            onClick={() => setResearchSection('hormones')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              researchSection === 'hormones'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-[#14141E] text-slate-300 hover:text-white hover:bg-[#1E1E2C] border border-slate-800'
            }`}
          >
            <Dna className="w-4 h-4" />
            <span>Hormon- & Rezeptor-Kompass</span>
          </button>

          <button
            onClick={() => setResearchSection('myths')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              researchSection === 'myths'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-[#14141E] text-slate-300 hover:text-white hover:bg-[#1E1E2C] border border-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mythen vs. Wissenschaft ({SCIENTIFIC_MYTHBUSTERS.length})</span>
          </button>

          <button
            onClick={() => setResearchSection('live_search')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              researchSection === 'live_search'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-[#14141E] text-slate-300 hover:text-white hover:bg-[#1E1E2C] border border-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Live PubMed / Europe PMC Suche</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Curated Landmark Studies */}
      {researchSection === 'studies' && (
        <div className="space-y-6">
          {/* Domain Category Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Domain Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {SCIENTIFIC_DOMAINS.map((domain) => (
                <button
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedDomain === domain.id
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                      : 'bg-[#1A1A26] text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {domain.label}
                </button>
              ))}
            </div>

            {/* Keyword search in studies */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={studySearchQuery}
                onChange={(e) => setStudySearchQuery(e.target.value)}
                placeholder="Studien durchsuchen (z.B. Wärme, GABA)..."
                className="w-full bg-[#1A1A26] border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/60"
              />
              {studySearchQuery && (
                <button
                  onClick={() => setStudySearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Studies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredStudies.map((study) => (
              <div
                key={study.id}
                className="rounded-3xl bg-[#1A1A26] border border-slate-800 hover:border-purple-500/40 p-6 flex flex-col justify-between transition-all group relative overflow-hidden shadow-lg"
              >
                <div className="space-y-4">
                  {/* Card Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/25">
                      {getDomainIcon(study.domain)}
                      {study.domainLabel}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {study.journal} · {study.year}
                    </span>
                  </div>

                  {/* Title & Short Title */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                      {study.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 italic">
                      {study.authors}
                    </p>
                  </div>

                  {/* Evidence Level & Sample size */}
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 font-semibold border border-blue-500/20">
                      {study.evidenceLevel}
                    </span>
                    <span className="text-slate-400">
                      Stichprobe: {study.sampleSize}
                    </span>
                  </div>

                  {/* Key Finding Box */}
                  <div className="rounded-2xl bg-[#13131E] border border-slate-800/80 p-4 space-y-1.5">
                    <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Kernbefund der Studie:
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {study.keyFinding}
                    </p>
                  </div>

                  {/* Biological Mechanism Preview */}
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <span className="font-semibold text-slate-200">Biologischer Mechanismus: </span>
                    <span className="line-clamp-2 text-slate-400">{study.biologicalMechanism}</span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (onOpenStudyArticle) {
                          onOpenStudyArticle(study.id);
                        } else {
                          window.location.hash = `#study/${study.id}`;
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Studien-Webseite lesen</span>
                    </button>

                    <button
                      onClick={() => setActiveStudyModal(study)}
                      className="px-3 py-2 rounded-xl bg-[#12121A] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Kompakte Modal-Übersicht"
                    >
                      <span>Quick-View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <a
                    href={study.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 self-end sm:self-auto rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Originalpublikation auf PubMed/Verlag ansehen"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredStudies.length === 0 && (
            <div className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-12 text-center space-y-3">
              <Microscope className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">Keine Studien gefunden</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Für deine Suchkombination gibt es aktuell keine kuratierte Studie. Probiere einen anderen Suchbegriff oder wechsle zur Live-Suche.
              </p>
              <button
                onClick={() => {
                  setSelectedDomain('all');
                  setStudySearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition-colors"
              >
                Filter zurücksetzen
              </button>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: Hormone & Receptor Pathways */}
      {researchSection === 'hormones' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-[#1A1A26] border border-slate-800 p-5">
            <h3 className="text-base font-bold text-white mb-1">
              Die 4 biochemischen Hauptakteure im Zyklus
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Hormone sind chemische Botenstoffe, die an spezifische Zielrezeptoren im Gewebe und im Gehirn binden. Hier erfährst du, wie sie physiologisch wirken:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HORMONE_PATHWAYS.map((hormone) => (
              <div
                key={hormone.id}
                className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-6 space-y-4 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-10 pointer-events-none"
                  style={{ backgroundColor: hormone.accentColor }}
                />

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-purple-400">
                      {hormone.chemicalName}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      {hormone.name}
                    </h3>
                  </div>
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: hormone.accentColor }}
                  />
                </div>

                {/* Target Receptors */}
                <div className="rounded-2xl bg-[#13131E] p-3.5 space-y-1.5 border border-slate-800/80">
                  <div className="text-xs text-slate-400 font-semibold">
                    Zielrezeptoren & Wirkorte:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {hormone.targetReceptors.map((rec, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 text-xs font-mono font-semibold border border-purple-500/20"
                      >
                        {rec}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-slate-400 pt-1">
                    <span className="text-slate-300 font-medium">Bildungsort: </span>
                    {hormone.origin}
                  </div>
                </div>

                {/* Functions */}
                <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  <div>
                    <span className="font-semibold text-slate-200">Hauptfunktion: </span>
                    {hormone.primaryFunction}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200">Verlauf im Zyklus: </span>
                    <span className="text-slate-400">{hormone.cycleBehavior}</span>
                  </div>
                </div>

                {/* Scientific Highlight */}
                <div className="rounded-2xl bg-purple-950/20 border border-purple-500/20 p-3.5 text-xs text-purple-200 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Biologischer Fakt: </span>
                    {hormone.scientificFact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: Myths vs. Science */}
      {researchSection === 'myths' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-[#1A1A26] border border-slate-800 p-5">
            <h3 className="text-base font-bold text-white mb-1">
              Fakten-Check: Was die Medizin wirklich sagt
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Rund um die Menstruation kursieren hartnäckige gesellschaftliche Vorurteile. Wir stellen gängige Klischees den wissenschaftlichen Fakten und klinischen Studien gegenüber.
            </p>
          </div>

          <div className="space-y-4">
            {SCIENTIFIC_MYTHBUSTERS.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition-colors"
              >
                {/* Myth header (crossed out / rejected) */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-rose-400 uppercase tracking-wide">
                      Weit verbreiteter Mythos
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-slate-300 italic mt-0.5">
                      {item.myth}
                    </div>
                  </div>
                </div>

                {/* Scientific Fact (approved / confirmed) */}
                <div className="flex items-start gap-3 pl-0 sm:pl-4 border-l-0 sm:border-l-2 border-purple-500/40">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="text-xs font-bold text-emerald-300 uppercase tracking-wide flex items-center justify-between">
                      <span>Wissenschaftliche Realität</span>
                      <span className="text-xs font-normal text-slate-400 normal-case font-mono">
                        {item.studyCitation}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                      {item.scientificFact}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed pt-1">
                      <span className="font-semibold text-slate-300">Biologischer Hintergrund: </span>
                      {item.biologicalExplanation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: Live PubMed / Europe PMC Search */}
      {researchSection === 'live_search' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-6 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase">
                <Microscope className="w-4 h-4" />
                Live PubMed & Europe PMC Recherche
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                Durchsuche Millionen wissenschaftlicher Originalarbeiten
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Gib einen medizinischen Suchbegriff ein oder wähle eines der vordefinierten Forschungsthemen:
              </p>
            </div>

            {/* Quick search chip pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                'dysmenorrhea heat therapy',
                'allopregnanolone premenstrual dysphoria',
                'oxytocin partner support cortisol',
                'iron deficiency fatigue menstruating',
                'menstrual cycle sleep architecture',
                'prostaglandin uterine ischemia'
              ].map((queryChip) => (
                <button
                  key={queryChip}
                  onClick={() => {
                    setLiveQuery(queryChip);
                    executeLiveSearch(queryChip);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    liveQuery === queryChip
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-[#13131E] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {queryChip}
                </button>
              ))}
            </div>

            {/* Live Search Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeLiveSearch(liveQuery);
              }}
              className="flex gap-2 pt-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={liveQuery}
                  onChange={(e) => setLiveQuery(e.target.value)}
                  placeholder="Thema auf Englisch eingeben (z.B. dysmenorrhea, progesterone, sleep)..."
                  className="w-full bg-[#12121A] border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                type="submit"
                disabled={liveLoading}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {liveLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Suchen...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Recherchieren</span>
                  </>
                )}
              </button>
            </form>

            {liveHits > 0 && (
              <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
                <span>
                  Gefundene Publikationen in Europe PMC / PubMed: <strong className="text-white">{liveHits.toLocaleString('de-DE')}</strong> Treffer
                </span>
                {liveSource === 'fallback' && (
                  <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Offline / Kuratierter Modus
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Live Articles List */}
          {liveLoading ? (
            <div className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
              <p className="text-sm font-bold text-white">Abfrage an Europe PMC wird ausgeführt...</p>
              <p className="text-xs text-slate-400">Verbindung mit PubMed und Europe PMC wird aufgebaut.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {liveResults.map((article) => {
                const articleUrl = article.doi
                  ? `https://doi.org/${article.doi}`
                  : article.pmid
                  ? `https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`
                  : `https://europepmc.org/article/MED/${article.id}`;

                return (
                  <div
                    key={article.id}
                    className="rounded-2xl bg-[#1A1A26] border border-slate-800 p-5 space-y-2 hover:border-purple-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        {article.isOpenAccess === 'Y' && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-500/20">
                            Open Access
                          </span>
                        )}
                        <span className="text-xs font-bold text-slate-300">
                          {article.journalTitle || 'Biomedical Journal'}
                        </span>
                        <span className="text-xs text-slate-500">· {article.pubYear}</span>
                      </div>

                      {article.citedByCount !== undefined && article.citedByCount > 0 && (
                        <span className="text-xs text-slate-400 font-mono">
                          {article.citedByCount} Zitationen
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-white hover:text-purple-300 transition-colors">
                      <a href={articleUrl} target="_blank" rel="noopener noreferrer">
                        {article.title}
                      </a>
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-1">
                      {article.authorString}
                    </p>

                    <div className="flex items-center justify-between pt-2 text-xs">
                      <div className="flex items-center gap-3 text-slate-500 font-mono">
                        {article.pmid && <span>PMID: {article.pmid}</span>}
                        {article.doi && <span className="line-clamp-1">DOI: {article.doi}</span>}
                      </div>

                      <a
                        href={articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
                      >
                        <span>Studie öffnen</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* STUDY MODAL INSPECTOR: Full deep-dive analysis */}
      {activeStudyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl bg-[#1A1A26] border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
            {/* Close button */}
            <button
              onClick={() => setActiveStudyModal(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-3 pr-8">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {getDomainIcon(activeStudyModal.domain)}
                  {activeStudyModal.domainLabel}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/25">
                  {activeStudyModal.evidenceLevel}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {activeStudyModal.journal} ({activeStudyModal.year})
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                {activeStudyModal.title}
              </h2>
              <p className="text-xs text-slate-400">
                Autoren: {activeStudyModal.authors}
              </p>
            </div>

            {/* Methodology & Cohort */}
            <div className="rounded-2xl bg-[#12121A] p-4 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Studiendesign & Stichprobe
              </div>
              <div className="text-xs sm:text-sm text-slate-200">
                {activeStudyModal.sampleSize}
              </div>
            </div>

            {/* Key Finding */}
            <div className="rounded-2xl bg-purple-950/20 border border-purple-500/30 p-5 space-y-2">
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Kernaussage der Wissenschaftler
              </div>
              <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                "{activeStudyModal.keyFinding}"
              </p>
            </div>

            {/* Biological Pathway Breakdown */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <Dna className="w-4 h-4 text-purple-400" />
                Der biologische & physiologische Mechanismus
              </div>
              <div className="rounded-2xl bg-[#12121A] p-4 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeStudyModal.biologicalMechanism}
              </div>
            </div>

            {/* Practical Takeaway for Boyfriend / Relationship */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                Was das konkret für dich als Partner bedeutet
              </div>
              <div className="rounded-2xl bg-emerald-950/20 border border-emerald-500/30 p-4 text-xs sm:text-sm text-emerald-100 leading-relaxed font-medium">
                {activeStudyModal.practicalTakeaway}
              </div>
            </div>

            {/* Footer Outbound Link */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                {activeStudyModal.pmid && <span>PMID: {activeStudyModal.pmid}</span>}
                {activeStudyModal.doi && <span>DOI: {activeStudyModal.doi}</span>}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const id = activeStudyModal.id;
                    setActiveStudyModal(null);
                    if (onOpenStudyArticle) {
                      onOpenStudyArticle(id);
                    } else {
                      window.location.hash = `#study/${id}`;
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-purple-600/20"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Vollständige Studien-Webseite lesen</span>
                </button>

                <a
                  href={activeStudyModal.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#12121A] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>PubMed / Verlag</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
