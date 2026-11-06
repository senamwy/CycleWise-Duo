import React, { useState } from 'react';
import { User } from '../types';
import { registerUser, loginUser } from '../utils/storage';
import {
  Heart,
  ShieldCheck,
  BookOpen,
  Bell,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Lock,
  Smartphone,
  EyeOff,
  UserCheck,
  Microscope,
  Dna,
  ExternalLink
} from 'lucide-react';
import { SCIENTIFIC_STUDIES } from '../data/scientificResearchData';

interface LandingPageProps {
  onLoginSuccess: (user: User) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginSuccess }) => {
  // Auth Modal State
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authRole, setAuthRole] = useState<'boyfriend' | 'girlfriend'>('boyfriend');
  const [authError, setAuthError] = useState('');

  // Legal Modals State
  const [showDatenschutz, setShowDatenschutz] = useState(false);
  const [showImpressum, setShowImpressum] = useState(false);

  // FAQ open items
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authModal === 'register') {
        if (!authName.trim() || !authEmail.trim()) {
          setAuthError('Bitte Name und E-Mail ausfüllen.');
          return;
        }
        const newUser = registerUser(authEmail, authName, authPassword, authRole);
        onLoginSuccess(newUser);
      } else {
        const user = loginUser(authEmail);
        onLoginSuccess(user);
      }
      setAuthModal(null);
    } catch (err: any) {
      setAuthError(err.message || 'Authentifizierungsfehler');
    }
  };

  const handleDemoBoyfriendLogin = () => {
    try {
      const user = loginUser('leo@cyclewise.app');
      onLoginSuccess(user);
    } catch {
      const user = registerUser('leo@cyclewise.app', 'Leo', 'demo1234', 'boyfriend');
      onLoginSuccess(user);
    }
  };

  const handleDemoGirlfriendLogin = () => {
    try {
      const user = loginUser('sarah@cyclewise.app');
      onLoginSuccess(user);
    } catch {
      const user = registerUser('sarah@cyclewise.app', 'Sarah', 'demo1234', 'girlfriend');
      onLoginSuccess(user);
    }
  };

  const faqs = [
    {
      q: 'Muss sich meine Partnerin registrieren oder Daten teilen?',
      a: 'Nein, absolut nicht! CycleWise Duo wurde bewusst so entwickelt, dass du als Partner die App 100% eigenständig und unabhängig nutzen kannst. Du lernst die biologischen Grundlagen des Zyklus, erhältst tägliche Inspirationen für kleine Gesten und verwaltest deine eigenen Erinnerungen – ganz ohne dass deine Partnerin ein Konto besitzen oder intime Gesundheitsdaten preisgeben muss.'
    },
    {
      q: 'Macht die App Vorhersagen über die Laune meiner Partnerin?',
      a: 'Nein. CycleWise Duo verurteilt emotionale Manipulation und Vorurteile wie "Hast du etwa deine Tage?". Stattdessen vermittelt die App wissenschaftliches Verständnis über Hormone, Entlastungsmöglichkeiten bei körperlichen Beschwerden wie Krämpfen und hilft dir, ein verlässlicher, aufmerksamer Partner zu sein.'
    },
    {
      q: 'Wie sicher sind meine eingegebenen Daten?',
      a: 'Deine Daten werden streng isoliert gespeichert und niemals an Dritte verkauft. Du hast jederzeit die volle Kontrolle (DSGVO Art. 20 Datenexport, Art. 17 Recht auf Löschung) und kannst dein Konto mit einem Klick vollständig entfernen.'
    },
    {
      q: 'Was ist in späteren Phasen für Paare geplant?',
      a: 'In Phase 2 wird es eine vollkommen freiwillige Partner-Verbindung geben. Deine Partnerin kann dann auf Wunsch ein eigenes, geschütztes Konto erstellen und eigenständig auswählen, welche Daten sie mit dir teilen möchte – mit voller Kontroll- und Widerrufsoption zu jedem Zeitpunkt.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#101018] text-slate-100 selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#101018]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-[#101018] rounded-[10px] flex items-center justify-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-tr from-purple-400 to-pink-300 font-extrabold text-lg">C</span>
              </div>
            </div>
            <span className="text-base font-bold text-white tracking-tight">
              CycleWise <span className="text-purple-400 font-medium text-xs px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">Duo</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
            <a href="#vorteile" className="hover:text-white transition-colors">Vorteile</a>
            <a href="#phasen" className="hover:text-white transition-colors">Zyklusphasen</a>
            <a href="#preise" className="hover:text-white transition-colors">Preise</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAuthModal('login');
                setAuthError('');
              }}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              Anmelden
            </button>
            <button
              onClick={() => {
                setAuthModal('register');
                setAuthError('');
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-purple-600/20 transition-all cursor-pointer"
            >
              Kostenlos starten
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-b from-purple-600/15 via-pink-600/10 to-transparent blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Phase 1: Der aufmerksame Partner-Begleiter</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-3xl mx-auto text-balance">
            Verstehe sie besser. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-200">
              Sei für sie da.
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Dein persönlicher Begleiter, um den Zyklus deiner Partnerin besser zu verstehen und sie aufmerksam im Alltag zu unterstützen.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setAuthModal('register');
                setAuthError('');
              }}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-purple-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              <span>Jetzt kostenlos starten</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={handleDemoBoyfriendLogin}
              className="w-full sm:w-auto px-5 py-3.5 bg-[#1A1A26] hover:bg-[#222232] border border-purple-500/30 hover:border-purple-500/60 text-purple-200 font-semibold text-xs sm:text-sm rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Demo: Freund (Leo)</span>
            </button>

            <button
              onClick={handleDemoGirlfriendLogin}
              className="w-full sm:w-auto px-5 py-3.5 bg-[#1A1A26] hover:bg-[#222232] border border-pink-500/30 hover:border-pink-500/60 text-pink-200 font-semibold text-xs sm:text-sm rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <Heart className="w-4 h-4 text-pink-400" />
              <span>Demo: Partnerin (Sarah)</span>
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Phase 2: Partnerin-Konto & Privater Zyklus
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> 100% Freiwillige Freigaben (Opt-In)
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Wissenschaftlich & Respektvoll
            </span>
          </div>

          {/* Interactive Product Preview Card Mockup */}
          <div className="mt-12 sm:mt-16 rounded-3xl bg-[#1A1A26] border border-purple-500/30 p-5 sm:p-7 text-left shadow-2xl relative max-w-3xl mx-auto overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-slate-400 font-medium ml-2">Boyfriend Dashboard Live Preview</span>
              </div>
              <span className="text-xs font-semibold text-purple-400">Guten Morgen, Leo!</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#101018] border border-slate-800">
                <span className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">Tages-Impuls</span>
                <h4 className="text-sm font-bold text-white mt-1">Wärmflasche & Kräutertee vorbereiten</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Körperliche Wärme erweitert verengte Gefäße und lindert Krämpfe nachweislich. Eine kleine Geste mit großer Wirkung.
                </p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">Dauer: 5 Min.</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Umsetzbar
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#101018] border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Wissen des Tages</span>
                  <h4 className="text-sm font-bold text-white mt-1">Die 4 Phasen des Zyklus</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Lerne, warum Progesteron und Östrogen Energie und Ruhebedürfnis natürlicherweise beeinflussen.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-purple-300 font-medium">
                  <span>Modul 1 von 5</span>
                  <span>100% fundiert</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Explanations Section */}
      <section id="vorteile" className="py-16 sm:py-24 border-t border-slate-800/80 bg-[#12121D]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Deine Werkzeuge</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Alles, was du als aufmerksamer Partner brauchst
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Keine komplizierten Tabellen. Praktische Unterstützung, echtes Wissen und feinfühlige Gesten für eure Beziehung.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: 'Zyklus-Bibliothek',
                desc: 'Verstehe die 4 Zyklusphasen, Hormone und Symptome wie Krämpfe und PMS – einfach erklärt und ohne Tabus.'
              },
              {
                icon: Microscope,
                title: 'Wissenschaft & Studien',
                desc: 'Peer-Reviewed Forschung aus The Lancet, Cochrane & Nature über Neurosteroide, Prostaglandine & Schmerzmechanismen.'
              },
              {
                icon: HeartHandshake,
                title: 'Tägliche Unterstützung',
                desc: '30+ kuratierte Gesten, von Entlastung im Haushalt bis zur richtigen Art des vorurteilsfreien Zuhörens.'
              },
              {
                icon: Bell,
                title: 'Persönliche Erinnerungen',
                desc: 'Erstelle eigene Erinnerungen für Dates, wichtige Anlässe oder kleine Taten, damit du nie wieder etwas vergisst.'
              },
              {
                icon: Sparkles,
                title: 'Wissens-Quizze',
                desc: 'Interaktive Quizze mit verständlichen Erklärungen, um dein Feingefühl spielerisch zu vertiefen.'
              },
              {
                icon: UserCheck,
                title: 'Freiwillige Partner-Kopplung',
                desc: 'Sichere Verknüpfung via Code in Phase 2 – deine Partnerin entscheidet granular über jeden einzelnen geteilten Einblick.'
              }
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-6 flex flex-col justify-between shadow-lg hover:border-purple-500/40 transition-colors"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cycle Phases Overview Section */}
      <section id="phasen" className="py-16 sm:py-24 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Hintergrundwissen</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Die vier Phasen des Menstruationszyklus
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Der Zyklus ist weit mehr als nur die Blutungstage. Er ist ein natürlicher Rhythmus mit vier verschiedenen Phasen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: '1',
                title: 'Menstruation',
                days: 'Tage 1 – 5',
                season: 'Der innere Winter',
                body: 'Hormone auf Tiefstand. Häufig Krämpfe durch Prostaglandine. Wärme, Rückzug und praktische Entlastung sind Gold wert.'
              },
              {
                step: '2',
                title: 'Follikelphase',
                days: 'Tage 6 – 13',
                season: 'Der innere Frühling',
                body: 'Steigendes Östrogen sorgt für frische Energie und Tatendrang. Perfekte Zeit für gemeinsame Pläne und Unternehmungen.'
              },
              {
                step: '3',
                title: 'Eisprung / Ovulation',
                days: 'Tag 14 (ca.)',
                season: 'Der innere Sommer',
                body: 'Hormonelles Maximum und höchste Fruchtbarkeit. Gesteigertes Selbstvertrauen, manchmal kurzer Mittelschmerz.'
              },
              {
                step: '4',
                title: 'Lutealphase & PMS',
                days: 'Tage 15 – 28',
                season: 'Der innere Herbst',
                body: 'Progesteron dominiert, gefolgt von Hormonabfall vor der Periode. Erhöhter Bedarf an Verständnis, Ruhe und Sicherheit.'
              }
            ].map((p, i) => (
              <div
                key={i}
                className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-6 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-purple-400 font-bold mb-2">
                    <span>Phase {p.step}</span>
                    <span className="text-slate-400 font-normal">{p.days}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{p.title}</h3>
                  <p className="text-xs text-pink-300 font-medium mt-0.5">{p.season}</p>
                  <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Peer-Reviewed Scientific Studies Section */}
      <section id="studien" className="py-16 sm:py-24 border-t border-slate-800/80 bg-[#101018]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider mb-2">
              <Microscope className="w-3.5 h-3.5" />
              Evidenzbasierte Forschung
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Wissenschaftliche Studien direkt im Volltext lesen
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Kein Halbwissen oder veraltete Klischees: Jede unserer Empfehlungen basiert auf publizierten Studien renommierter Fachjournale (*The Lancet*, *Nature*, *BMJ*, *Cochrane*).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCIENTIFIC_STUDIES.slice(0, 6).map((study) => (
              <div
                key={study.id}
                className="rounded-3xl bg-[#1A1A26] border border-slate-800 hover:border-purple-500/40 p-6 flex flex-col justify-between shadow-xl transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/15 text-purple-300 font-bold border border-purple-500/20">
                      {study.domainLabel}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {study.journal.split('(')[0].split('&')[0]} · {study.year}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                    {study.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {study.authors}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-[#12121A] border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                    <span className="text-purple-300 font-semibold block mb-0.5">Kernaussage:</span>
                    <span className="line-clamp-3">{study.keyFinding}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      window.location.hash = `#study/${study.id}`;
                    }}
                    className="text-xs font-bold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Studie vollständig lesen →</span>
                  </button>

                  <a
                    href={study.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-slate-300 p-1.5"
                    title="Originalpublikation auf PubMed/Verlag"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => {
                window.location.hash = `#study/${SCIENTIFIC_STUDIES[0].id}`;
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-600/20 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Alle {SCIENTIFIC_STUDIES.length} Studien im Detail-Viewer durchblättern</span>
            </button>
          </div>
        </div>
      </section>

      {/* Privacy & Respect Statement */}
      <section className="py-16 sm:py-24 border-t border-slate-800/80 bg-[#12121D]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-gradient-to-br from-purple-950/40 via-[#1A1A26] to-pink-950/20 border border-purple-500/30 p-8 sm:p-12 text-center shadow-2xl relative">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center mx-auto mb-5 shadow-lg">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Unser Versprechen: Respekt & 100% Privatsphäre
            </h2>

            <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed max-w-2xl mx-auto">
              CycleWise Duo fördert ehrliche Fürsorge – niemals Überwachung. Wir fragen dich in Phase 1 niemals nach vertraulichen Menstruationsdaten deiner Partnerin und ermutigen dich dazu, ihr mit echtem Respekt und Aufmerksamkeit zu begegnen.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-left">
              <div className="p-4 rounded-2xl bg-[#101018]/80 border border-slate-800">
                <EyeOff className="w-5 h-5 text-purple-400 mb-2" />
                <h4 className="text-xs font-bold text-white">Keine Überwachung</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Keine heimlichen Tracking-Funktionen oder unbefugten Zugriffe.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#101018]/80 border border-slate-800">
                <Heart className="w-5 h-5 text-pink-400 mb-2" />
                <h4 className="text-xs font-bold text-white">Keine Klischees</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Stimmungen und Gefühle werden niemals auf Hormone reduziert.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#101018]/80 border border-slate-800">
                <Lock className="w-5 h-5 text-purple-400 mb-2" />
                <h4 className="text-xs font-bold text-white">DSGVO-Konform</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Vollständiger Datenexport und sofortige Kontolöschung jederzeit möglich.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section id="preise" className="py-16 sm:py-24 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Faire Mitgliedschaften</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Transparente Preise für jedes Paar
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Der Kern des Boyfriend-Begleiters ist und bleibt kostenlos nutzbar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-6 sm:p-7 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Kostenlos</span>
                <div className="flex items-baseline gap-1 mt-2 mb-4">
                  <span className="text-3xl font-black text-white">0 €</span>
                  <span className="text-xs text-slate-400">/ dauerhaft</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Perfekt für den Start, um die Grundlagen zu verstehen und tägliche Inspirationen zu erhalten.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Boyfriend Dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Tägliche Beziehungsimpulse</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Basis Zyklus-Bibliothek</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Persönliche Erinnerungen</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setAuthModal('register');
                  setAuthError('');
                }}
                className="w-full mt-8 py-3 bg-[#101018] hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Kostenlos starten
              </button>
            </div>

            {/* Plus (Featured) */}
            <div className="rounded-3xl bg-gradient-to-b from-purple-950/40 via-[#1A1A26] to-[#1A1A26] border-2 border-purple-500 p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                Beliebteste Wahl
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Plus</span>
                <div className="flex items-baseline gap-1 mt-2 mb-4">
                  <span className="text-3xl font-black text-white">4,99 €</span>
                  <span className="text-xs text-slate-400">/ Monat</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Erweiterte Lerninhalte, unbegrenzte Erinnerungen und Vorbereitung auf alle Beziehungs-Features.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Alle Free-Funktionen inklusive</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Vollständige Wissens-Bibliothek</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Unbegrenzte Erinnerungen & Notizen</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Alle Beziehungs-Quizze</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setAuthModal('register');
                  setAuthError('');
                }}
                className="w-full mt-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                14 Tage unverbindlich testen
              </button>
            </div>

            {/* Duo Premium */}
            <div className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-6 sm:p-7 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-pink-300">Duo Premium</span>
                <div className="flex items-baseline gap-1 mt-2 mb-4">
                  <span className="text-3xl font-black text-white">8,99 €</span>
                  <span className="text-xs text-slate-400">/ Monat</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Das Rundum-Paket für beide Partner (inkl. Partner-Kopplung ab Phase 2).
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-pink-400 shrink-0" />
                    <span>Alle Plus-Features enthalten</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-pink-400 shrink-0" />
                    <span>2 verbundene Konten (Partner-Sync)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-pink-400 shrink-0" />
                    <span>Gemeinsame Date-Planung</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-pink-400 shrink-0" />
                    <span>Prioritäts-Support</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setAuthModal('register');
                  setAuthError('');
                }}
                className="w-full mt-8 py-3 bg-[#101018] hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Duo wählen
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-24 border-t border-slate-800/80 bg-[#12121D]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Häufige Fragen</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Transparente Antworten
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#1A1A26] border border-slate-800 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-white">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-purple-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 bg-[#101018] text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">CycleWise Duo</span>
            <span>·</span>
            <span>Verstehe sie besser. Sei für sie da.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowDatenschutz(true)}
              className="hover:text-purple-300 transition-colors cursor-pointer"
            >
              Datenschutz
            </button>
            <span>·</span>
            <button
              onClick={() => setShowImpressum(true)}
              className="hover:text-purple-300 transition-colors cursor-pointer"
            >
              Impressum
            </button>
          </div>
        </div>
      </footer>

      {/* AUTH MODAL (Login / Register) */}
      {authModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#1A1A26] border border-purple-500/30 p-6 sm:p-7 text-slate-100 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {authModal === 'register' ? 'Konto erstellen' : 'Anmelden'}
              </h3>
              <button
                onClick={() => setAuthModal(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {authError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {authModal === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Konto-Typ *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAuthRole('boyfriend')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          authRole === 'boyfriend'
                            ? 'bg-purple-950/60 border-purple-500 text-white'
                            : 'bg-[#101018] border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <p className="text-xs font-bold">Freund / Partner</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Fürsorge & Tipps</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthRole('girlfriend')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          authRole === 'girlfriend'
                            ? 'bg-pink-950/60 border-pink-500 text-white'
                            : 'bg-[#101018] border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <p className="text-xs font-bold">Partnerin</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Privater Zyklus</p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Dein Vorname *
                    </label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder={authRole === 'boyfriend' ? 'z.B. Leo' : 'z.B. Sarah'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#101018] border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  E-Mail-Adresse *
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#101018] border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Passwort *
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#101018] border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                {authModal === 'register' ? 'Registrieren & Starten' : 'Anmelden'}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
              {authModal === 'register' ? (
                <span>
                  Bereits registriert?{' '}
                  <button
                    onClick={() => {
                      setAuthModal('login');
                      setAuthError('');
                    }}
                    className="text-purple-400 hover:underline font-semibold"
                  >
                    Hier anmelden
                  </button>
                </span>
              ) : (
                <span>
                  Noch kein Konto?{' '}
                  <button
                    onClick={() => {
                      setAuthModal('register');
                      setAuthError('');
                    }}
                    className="text-purple-400 hover:underline font-semibold"
                  >
                    Jetzt registrieren
                  </button>
                </span>
              )}
            </div>

            <div className="mt-3.5 pt-2 border-t border-slate-800/80 flex flex-col gap-1 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Schnell-Zugang (1-Klick Demo):
              </span>
              <div className="flex gap-2 justify-center mt-1">
                <button
                  onClick={handleDemoBoyfriendLogin}
                  className="px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 text-[11px] font-medium hover:bg-purple-900/40"
                >
                  Als Leo (Freund)
                </button>
                <button
                  onClick={handleDemoGirlfriendLogin}
                  className="px-2.5 py-1 rounded-lg bg-pink-950/40 border border-pink-500/30 text-pink-300 text-[11px] font-medium hover:bg-pink-900/40"
                >
                  Als Sarah (Partnerin)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DATENSCHUTZ MODAL */}
      {showDatenschutz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#1A1A26] border border-purple-500/30 p-6 sm:p-7 text-slate-100 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                Datenschutzerklärung (DSGVO)
              </h3>
              <button onClick={() => setShowDatenschutz(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p><strong>1. Verantwortlichkeit:</strong> CycleWise Duo schützt Ihre Privatsphäre nach strengsten europäischen Datenschutzgesetzen (DSGVO).</p>
              <p><strong>2. Datensparsamkeit in Phase 1:</strong> In der aktuellen ersten Version werden keine sensiblen Gesundheitsdaten der Partnerin erhoben oder gespeichert. Alle Notizen, Erinnerungen und Favoriten verbleiben ausschließlich in Ihrem geschützten Benutzerbereich.</p>
              <p><strong>3. Keine Weitergabe an Werbenetzwerke:</strong> Es werden keinerlei Daten an externe Datenbroker oder unautorisierte Werbetreibende übermittelt.</p>
              <p><strong>4. Ihre Rechte:</strong> Sie haben das Recht auf jederzeitige Auskunft und Datenexport (JSON-Export in Ihrem Profil) sowie das Recht auf sofortige, rückstandslose Kontolöschung.</p>
            </div>
            <button
              onClick={() => setShowDatenschutz(false)}
              className="w-full mt-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold"
            >
              Schließen
            </button>
          </div>
        </div>
      )}

      {/* IMPRESSUM MODAL */}
      {showImpressum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#1A1A26] border border-purple-500/30 p-6 sm:p-7 text-slate-100 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Impressum</h3>
              <button onClick={() => setShowImpressum(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p><strong>CycleWise Duo</strong></p>
              <p>Beziehungs-Wellness & Partnerschafts-Begleiter</p>
              <p>Verantwortlich für den Inhalt: CycleWise Duo Team</p>
              <p>Kontakt: support@cyclewise.app</p>
              <p className="pt-2 text-slate-400 text-[11px]">
                Medizinischer Hinweis: Die bereitgestellten Informationen dienen ausschließlich der allgemeinen Aufklärung und Beziehungsunterstützung und stellen keine ärztliche Beratung oder Behandlung dar.
              </p>
            </div>
            <button
              onClick={() => setShowImpressum(false)}
              className="w-full mt-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold"
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
