import React, { useState, useEffect } from 'react';
import { ScientificStudy } from '../types';
import { SCIENTIFIC_STUDIES } from '../data/scientificResearchData';
import {
  ArrowLeft,
  Share2,
  Printer,
  ExternalLink,
  BookOpen,
  Sparkles,
  Flame,
  Brain,
  Moon,
  Activity,
  HeartHandshake,
  Check,
  Copy,
  ChevronLeft,
  ChevronRight,
  BookmarkCheck,
  Dna,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Layers,
  Quote,
  Eye,
  Type
} from 'lucide-react';

interface StudyDetailViewProps {
  studyId: string;
  onBack: () => void;
  onSelectStudy: (studyId: string) => void;
}

export const StudyDetailView: React.FC<StudyDetailViewProps> = ({
  studyId,
  onBack,
  onSelectStudy
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCitationFormat, setCopiedCitationFormat] = useState<string | null>(null);
  const [fontSizeLarge, setFontSizeLarge] = useState(false);
  const [activeSection, setActiveSection] = useState<'abstract' | 'methodology' | 'results' | 'mechanism' | 'partner' | 'citation'>('abstract');

  const study = SCIENTIFIC_STUDIES.find((s) => s.id === studyId) || SCIENTIFIC_STUDIES[0];

  const currentIndex = SCIENTIFIC_STUDIES.findIndex((s) => s.id === study.id);
  const prevStudy = currentIndex > 0 ? SCIENTIFIC_STUDIES[currentIndex - 1] : null;
  const nextStudy = currentIndex < SCIENTIFIC_STUDIES.length - 1 ? SCIENTIFIC_STUDIES[currentIndex + 1] : null;

  // Scroll to top on study change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Update document title for this study website
    const originalTitle = document.title;
    document.title = `${study.shortTitle} | CycleWise Duo Wissenschaft`;
    return () => {
      document.title = originalTitle;
    };
  }, [study.id, study.shortTitle]);

  const handleCopyLink = () => {
    const studyUrl = `${window.location.origin}${window.location.pathname}#study/${study.id}`;
    navigator.clipboard.writeText(studyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCitation = (format: 'apa' | 'bibtex' | 'vancouver', text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedCitationFormat(format);
    setTimeout(() => setCopiedCitationFormat(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

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
        return <BookOpen className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <article className="min-h-screen bg-[#101018] text-slate-100 pb-24">
      {/* Top Header / Sticky Bar */}
      <header className="sticky top-0 z-40 bg-[#101018]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Zurück zur Übersicht</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Toggle Font Size */}
            <button
              onClick={() => setFontSizeLarge(!fontSizeLarge)}
              title="Schriftgröße anpassen"
              className={`p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                fontSizeLarge
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/40'
                  : 'bg-[#1A1A26] text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              <Type className="w-4 h-4" />
            </button>

            {/* Print button */}
            <button
              onClick={handlePrint}
              title="Studienseite drucken / als PDF speichern"
              className="p-2 rounded-xl bg-[#1A1A26] text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Share / Copy direct link */}
            <button
              onClick={handleCopyLink}
              title="Direktlink zur Studie kopieren"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Link kopiert!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Link teilen</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Study Container */}
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-8 ${fontSizeLarge ? 'text-base' : 'text-sm'}`}>
        {/* Navigation Pager between Studies */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-400 pb-2 border-b border-slate-800/60">
          <div>
            {prevStudy ? (
              <button
                onClick={() => onSelectStudy(prevStudy.id)}
                className="inline-flex items-center gap-1 hover:text-purple-300 transition-colors cursor-pointer text-left"
              >
                <ChevronLeft className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline line-clamp-1 max-w-[200px]">{prevStudy.shortTitle}</span>
                <span className="md:hidden">Vorherige</span>
              </button>
            ) : (
              <span className="text-slate-600">Erste Studie</span>
            )}
          </div>

          <span className="text-slate-500 font-mono">
            Studie {currentIndex + 1} von {SCIENTIFIC_STUDIES.length}
          </span>

          <div>
            {nextStudy ? (
              <button
                onClick={() => onSelectStudy(nextStudy.id)}
                className="inline-flex items-center gap-1 hover:text-purple-300 transition-colors cursor-pointer text-right"
              >
                <span className="hidden md:inline line-clamp-1 max-w-[200px]">{nextStudy.shortTitle}</span>
                <span className="md:hidden">Nächste</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            ) : (
              <span className="text-slate-600">Letzte Studie</span>
            )}
          </div>
        </div>

        {/* Article Masthead */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {getDomainIcon(study.domain)}
              {study.domainLabel}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/25">
              {study.evidenceLevel}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
              Peer-Reviewed Journal
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
            {study.title}
          </h1>

          <div className="text-xs sm:text-sm text-purple-300 font-medium">
            Deutscher Kurztitel: <span className="text-white font-semibold">{study.shortTitle}</span>
          </div>

          {/* Authors and Journal Meta */}
          <div className="p-4 rounded-2xl bg-[#1A1A26] border border-slate-800 space-y-2">
            <div className="text-xs sm:text-sm text-slate-300">
              <span className="font-semibold text-slate-200">Autoren: </span>
              {study.authors}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-mono">
              <div>
                <span className="text-slate-500">Journal: </span>
                <span className="text-slate-300 font-semibold">{study.journal}</span>
              </div>
              <div>
                <span className="text-slate-500">Jahr: </span>
                <span className="text-slate-300">{study.year}</span>
              </div>
              {study.doi && (
                <div>
                  <span className="text-slate-500">DOI: </span>
                  <a
                    href={`https://doi.org/${study.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 hover:underline"
                  >
                    {study.doi}
                  </a>
                </div>
              )}
              {study.pmid && (
                <div>
                  <span className="text-slate-500">PMID: </span>
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/${study.pmid}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 hover:underline"
                  >
                    {study.pmid}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quantitative Highlights / Figures Bar */}
        {study.figuresOrStats && study.figuresOrStats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {study.figuresOrStats.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-gradient-to-br from-[#1A1A26] to-[#141420] border border-slate-800 shadow-md flex flex-col justify-between"
              >
                <div className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                  {item.value}
                </div>
                <div className="mt-1">
                  <div className="text-xs font-bold text-white">{item.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Central Takeaway Quote Callout */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/30 via-[#1A1A26] to-pink-950/20 border border-purple-500/40 shadow-xl space-y-3 relative overflow-hidden">
          <div className="absolute top-2 right-4 text-purple-500/10 text-8xl font-serif pointer-events-none">
            “
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Kernaussage der Publikation</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
            "{study.keyFinding}"
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
          <button
            onClick={() => setActiveSection('abstract')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'abstract'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-[#1A1A26] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            1. Strukturierter Abstract
          </button>
          <button
            onClick={() => setActiveSection('methodology')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'methodology'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-[#1A1A26] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            2. Methodik & Design
          </button>
          <button
            onClick={() => setActiveSection('results')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'results'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-[#1A1A26] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            3. Detaillierte Ergebnisse
          </button>
          <button
            onClick={() => setActiveSection('mechanism')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'mechanism'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-[#1A1A26] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            4. Biologischer Mechanismus
          </button>
          <button
            onClick={() => setActiveSection('partner')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'partner'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-[#1A1A26] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            5. Partner-Transfer
          </button>
          <button
            onClick={() => setActiveSection('citation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'citation'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-[#1A1A26] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            6. Zitation & Referenzen
          </button>
        </div>

        {/* SECTION 1: STRUCTURED ABSTRACT */}
        {activeSection === 'abstract' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span>Strukturierter wissenschaftlicher Abstract</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">Originalpublikation</span>
            </div>

            {study.fullAbstract ? (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-[#1A1A26] border border-slate-800 space-y-2">
                  <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wide">
                    Hintergrund & Fragestellung (Background)
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {study.fullAbstract.background}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#1A1A26] border border-slate-800 space-y-2">
                  <h3 className="text-xs font-bold text-blue-300 uppercase tracking-wide">
                    Methoden & Studiendesign (Methods)
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {study.fullAbstract.methods}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#1A1A26] border border-slate-800 space-y-2">
                  <h3 className="text-xs font-bold text-pink-300 uppercase tracking-wide">
                    Hauptergebnisse (Results)
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {study.fullAbstract.results}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#1A1A26] border border-slate-800 space-y-2">
                  <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                    Schlussfolgerungen (Conclusions)
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {study.fullAbstract.conclusions}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-[#1A1A26] border border-slate-800 space-y-3">
                <p className="text-slate-300 leading-relaxed">
                  {study.keyFinding}
                </p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Stichprobengröße: {study.sampleSize}
                </p>
              </div>
            )}
          </section>
        )}

        {/* SECTION 2: METHODOLOGY & DESIGN */}
        {activeSection === 'methodology' && (
          <section className="space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <span>Methodik, Studiendesign & Stichprobe</span>
            </h2>

            <div className="p-6 rounded-2xl bg-[#1A1A26] border border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="text-xs text-slate-500 font-mono">Evidenzgrad</div>
                  <div className="text-sm font-bold text-white mt-0.5">{study.evidenceLevel}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-mono">Stichprobengröße & Kohorte</div>
                  <div className="text-sm font-bold text-white mt-0.5">{study.sampleSize}</div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Untersuchungsprotokoll & Messverfahren
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {study.fullMethodology || 'Die Studie verwendete standardisierte, validierte klinische Messskalen und multivariate biostatistische Regressionsmodelle.'}
                </p>
              </div>

              {study.studyLimitations && (
                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Wissenschaftliche Limitationen & Einordnung</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {study.studyLimitations}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECTION 3: DETAILED RESULTS */}
        {activeSection === 'results' && (
          <section className="space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-pink-400" />
              <span>Detaillierte Messwerte & Statistische Endpunkte</span>
            </h2>

            <div className="p-6 rounded-2xl bg-[#1A1A26] border border-slate-800 space-y-4">
              <p className="text-slate-200 leading-relaxed">
                {study.detailedResults || study.keyFinding}
              </p>

              {/* Tag clouds */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-1.5">
                {study.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 4: BIOLOGICAL MECHANISM */}
        {activeSection === 'mechanism' && (
          <section className="space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Dna className="w-5 h-5 text-purple-400" />
              <span>Der biologische & zelluläre Mechanismus</span>
            </h2>

            <div className="p-6 rounded-2xl bg-[#1A1A26] border border-purple-500/30 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Physiologie & Rezeptorebene</span>
              </div>
              <p className="text-slate-200 leading-relaxed">
                {study.biologicalMechanism}
              </p>
            </div>
          </section>
        )}

        {/* SECTION 5: PARTNER TRANSFER GUIDE */}
        {activeSection === 'partner' && (
          <section className="space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-400" />
              <span>Der CycleWise Duo Partner-Transfer</span>
            </h2>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-[#1A1A26] border border-emerald-500/40 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Wie du dieses Wissen heute für sie einsetzt</span>
              </div>
              <p className="text-emerald-100 text-sm sm:text-base leading-relaxed font-medium">
                {study.practicalTakeaway}
              </p>

              <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/20 text-xs text-slate-300 space-y-2">
                <span className="font-bold text-emerald-300 block">
                  3 praktische Richtlinien für den Alltag:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>Nimm körperliche Symptome ernst – sie basieren auf messbarer Neurobiologie und Gewebe-Physiologie.</li>
                  <li>Reagiere mit proaktiver Entlastung (z.B. Wärme bringen, Termine entzerren), ohne dass sie erst darum bitten muss.</li>
                  <li>Verzichte auf Wertungen oder Besserwisserei; echtes Verständnis wirkt messbar stresssenkend ("Social Buffering").</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 6: CITATION & EXPORT */}
        {activeSection === 'citation' && (
          <section className="space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Quote className="w-5 h-5 text-blue-400" />
              <span>Wissenschaftliche Zitation & Export</span>
            </h2>

            <div className="space-y-4">
              {/* APA Format */}
              {study.citationApa && (
                <div className="p-4 rounded-2xl bg-[#1A1A26] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">APA (7th Edition)</span>
                    <button
                      onClick={() => handleCopyCitation('apa', study.citationApa)}
                      className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 cursor-pointer"
                    >
                      {copiedCitationFormat === 'apa' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCitationFormat === 'apa' ? 'Kopiert' : 'Kopieren'}</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm font-mono text-slate-300 select-all">
                    {study.citationApa}
                  </p>
                </div>
              )}

              {/* BibTeX Format */}
              {study.citationBibtex && (
                <div className="p-4 rounded-2xl bg-[#1A1A26] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">BibTeX</span>
                    <button
                      onClick={() => handleCopyCitation('bibtex', study.citationBibtex)}
                      className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 cursor-pointer"
                    >
                      {copiedCitationFormat === 'bibtex' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCitationFormat === 'bibtex' ? 'Kopiert' : 'Kopieren'}</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-slate-400 overflow-x-auto p-3 bg-black/40 rounded-xl select-all">
                    {study.citationBibtex}
                  </pre>
                </div>
              )}

              {/* Vancouver Format */}
              {study.citationVancouver && (
                <div className="p-4 rounded-2xl bg-[#1A1A26] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">Vancouver (NLM)</span>
                    <button
                      onClick={() => handleCopyCitation('vancouver', study.citationVancouver)}
                      className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 cursor-pointer"
                    >
                      {copiedCitationFormat === 'vancouver' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCitationFormat === 'vancouver' ? 'Kopiert' : 'Kopieren'}</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm font-mono text-slate-300 select-all">
                    {study.citationVancouver}
                  </p>
                </div>
              )}

              {/* MeSH Headings */}
              {study.meshTerms && study.meshTerms.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#1A1A26] border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase block">
                    MeSH (Medical Subject Headings)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {study.meshTerms.map((term) => (
                      <span
                        key={term}
                        className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Outbound Authoritative Links Bar */}
        <div className="p-6 rounded-3xl bg-[#1A1A26] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-purple-400" />
            <span>Offizielle wissenschaftliche Archive & Volltexte</span>
          </h3>
          <p className="text-xs text-slate-400">
            Lies das Originalmanuskript direkt auf den offiziellen Repositorien der National Library of Medicine (PubMed), Europe PMC oder direkt beim Verlag:
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            {study.externalUrl && (
              <a
                href={study.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors shadow-md shadow-purple-600/20"
              >
                <span>Verlag / Originalartikel öffnen</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {study.pmid && (
              <a
                href={`https://pubmed.ncbi.nlm.nih.gov/${study.pmid}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#12121A] hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-colors"
              >
                <span>PubMed (NLM) ID {study.pmid}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {study.pmid && (
              <a
                href={`https://europepmc.org/article/MED/${study.pmid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#12121A] hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-colors"
              >
                <span>Europe PMC Open Access</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Bottom Switcher: Browse Other Studies in the Library */}
        <div className="pt-8 border-t border-slate-800/80 space-y-4">
          <h3 className="text-sm font-bold text-white">Weitere Studien aus unserer evidenzbasierten Bibliothek</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {SCIENTIFIC_STUDIES.filter((s) => s.id !== study.id).slice(0, 3).map((other) => (
              <button
                key={other.id}
                onClick={() => onSelectStudy(other.id)}
                className="p-3.5 rounded-2xl bg-[#1A1A26] border border-slate-800 hover:border-purple-500/40 text-left transition-all group cursor-pointer"
              >
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wide">
                  {other.domainLabel}
                </div>
                <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 mt-1">
                  {other.shortTitle}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-mono">
                  {other.journal.split('&')[0]} · {other.year}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};
