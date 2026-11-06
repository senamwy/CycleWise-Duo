import React, { useState } from 'react';
import { User } from '../types';
import { getSharedPartnerDataForBoyfriend, getPartnerConnectionForUser } from '../utils/storage';
import { COMMON_SYMPTOMS } from '../utils/cycleCalculations';
import {
  Heart,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Calendar,
  Flame,
  MessageCircle,
  HelpCircle,
  Lock,
  ArrowRight,
  CheckCircle2,
  Ear,
  Coffee,
  ShieldAlert,
  Lightbulb,
  RefreshCw,
  BellRing,
  TrendingUp,
  Moon
} from 'lucide-react';

interface BoyfriendPartnerCardProps {
  user: User;
  onOpenConnectModal: () => void;
}

export const BoyfriendPartnerCard: React.FC<BoyfriendPartnerCardProps> = ({
  user,
  onOpenConnectModal
}) => {
  const connection = getPartnerConnectionForUser(user.id);
  const sharedData = connection && connection.status === 'connected'
    ? getSharedPartnerDataForBoyfriend(user.id)
    : null;

  const partnerName = connection?.girlfriendName || user.preferences.partnerName || 'deine Partnerin';
  const phaseNum = sharedData?.cycleStatus?.phaseNumber || 1;
  const currentDay = sharedData?.cycleStatus?.currentDay || 1;

  // State for cycling through daily insight tips
  const [tipIndex, setTipIndex] = useState(0);

  // Phase-specific Daily Insight Tips for Emotional Intelligence & Support Communication
  const getDailyInsightTips = (num: number) => {
    switch (num) {
      case 1: // Menstruation
        return [
          {
            title: 'Konkrete Entlastung statt Fragen',
            tip: 'Frage heute nicht: "Kann ich dir helfen?", sondern sage: "Ich habe dir eine Wärmflasche gemacht und koche heute Abend." Konkrete Taten zeigen mehr Feingefühl.',
            category: 'Unterstützung'
          },
          {
            title: 'Ruhige Präsenz',
            tip: 'Wenn sie sich zurückzieht, ist das keine Ablehnung. Sie verarbeitet hormonelle Umschwünge. Deine ruhige, geduldige Anwesenheit ist das beste Geschenk.',
            category: 'Kommunikation'
          },
          {
            title: 'Keine schnellen Ratschläge',
            tip: 'Versuche nicht, sofort Probleme zu lösen oder Ratschläge zu erteilen. Höre einfach aktiv zu und bestätige: "Ich verstehe, dass das gerade anstrengend ist."',
            category: 'Empathie'
          }
        ];
      case 2: // Follicular
        return [
          {
            title: 'Gemeinsame Energie nutzen',
            tip: 'Ihr Östrogenspiegel steigt spürbar an! Nutzt diesen Elan für einen gemeinsamen Ausflug, ein spontanes Date oder ein neues Projekt.',
            category: 'Gemeinsamkeit'
          },
          {
            title: 'Echtes Interesse an ihren Ideen',
            tip: 'Frage sie heute nach ihren Plänen und Zielen. Sie sprudelt vor Tatendrang und freut sich enorm, wenn du ihre Visionen aktiv unterstützt.',
            category: 'Kommunikation'
          }
        ];
      case 3: // Ovulation
        return [
          {
            title: 'Offene & wertschätzende Worte',
            tip: 'Dies ist die Phase der höchsten sozialen Energie. Genießt gemeinsame Gesellschaft, tiefe Gespräche und unbeschwerte Momente zu zweit.',
            category: 'Verbindung'
          },
          {
            title: 'Spezifisches Kompliment',
            tip: 'Mach ihr ein ehrliches Kompliment, das ihre Stärke, Kreativität oder Ausstrahlung lobt. Das stärkt eure emotionale Intimität.',
            category: 'Wertschätzung'
          }
        ];
      case 4: // Luteal
        return [
          {
            title: 'Rücksicht auf Reizüberflutung',
            tip: 'In der Lutealphase reagiert das Gehirn sensibler auf Stress und Reize. Halte den Abend ruhig und vermeide unnötigen Trubel.',
            category: 'Achtsamkeit'
          },
          {
            title: 'Wahlfreiheit schenken',
            tip: 'Frage vor Verabredungen rücksichtsvoll: "Möchtest du heute Abend ausgehen oder machen wir es uns lieber gemütlich zu Hause bequem?" Das gibt ihr Kontrolle.',
            category: 'Kommunikation'
          },
          {
            title: 'Oxytocin durch sanfte Berührung',
            tip: 'Eine 10-minütige Nacken- oder Rückenmassage senkt Cortisol messbar und schüttet beruhigendes Oxytocin aus. Du musst nichts erklären – einfach da sein.',
            category: 'Unterstützung'
          }
        ];
      default:
        return [
          {
            title: 'Aufmerksames Zuhören',
            tip: 'Echtes Interesse und geduldiges Zuhören sind das Fundament einer starken Partnerschaft.',
            category: 'Kommunikation'
          },
          {
            title: 'Kleine Alltagsgesten',
            tip: 'Eine liebe Nachricht zwischendurch oder eine Tasse Kaffee am Morgen zeigen ihr, dass du an sie denkst.',
            category: 'Aufmerksamkeit'
          }
        ];
    }
  };

  const tips = getDailyInsightTips(phaseNum);
  const currentTip = tips[tipIndex % tips.length];

  const handleNextTip = () => {
    setTipIndex((prev) => prev + 1);
  };

  // Phase-specific boyfriend guide
  const getPhaseGuide = (num: number) => {
    switch (num) {
      case 1:
        return {
          title: 'Innerer Winter (Menstruation)',
          attention: 'Uterus-Kontraktionen und Ischämie verursachen echten Schmerz. Ihr Energiebedürfnis ist auf Regeneration ausgerichtet.',
          communication: 'Höre geduldig zu, ohne sofort Ratschläge zu suchen. Validiere ihre Gefühle anstatt sie als "Hormone" abzutun.',
          support: 'Bringe unaufgefordert eine Wärmflasche, Tee und übernehme Aufgaben im Haushalt.'
        };
      case 2:
        return {
          title: 'Innerer Frühling (Follikelphase)',
          attention: 'Steigender Östrogenspiegel bringt frischen Elan, Kreativität und Tatendrang mit sich.',
          communication: 'Teile neue Ideen und plant gemeinsam aktive Unternehmungen.',
          support: 'Nutzt den Energieschub für schöne gemeinsame Dates und gemeinsame Erlebnisse.'
        };
      case 3:
        return {
          title: 'Innerer Sommer (Ovulation)',
          attention: 'Höhepunkt der Energie, sozialen Offenheit und emotionalen Verbundenheit.',
          communication: 'Offene, tiefe Gespräche und unbeschwerte Zweisamkeit stärken eure Bindung.',
          support: 'Sei präsent, unternimmt etwas Schönes und zeige ihr deine Zuneigung.'
        };
      case 4:
        return {
          title: 'Innerer Herbst (Lutealphase / PMS)',
          attention: 'Progesteron-Schwankungen beeinflussen die Reizfilterschwelle im Gehirn. Sie braucht mehr Ruhe.',
          communication: 'Vermeide Reizüberflutung und frage vor Abendplänen rücksichtsvoll nach.',
          support: 'Schenke ihr einen ruhigen Rückzugsort und sanfte Nähe (z.B. Massage).'
        };
      default:
        return {
          title: 'Allgemeiner Begleiter',
          attention: 'Respektiere ihren persönlichen Rhythmus und ihre individuellen Bedürfnisse.',
          communication: 'Ehrliche und wertschätzende Gespräche ohne Vorurteile.',
          support: 'Kleine Gesten und unaufgeforderte Entlastung im Alltag.'
        };
    }
  };

  const guide = getPhaseGuide(phaseNum);

  // CALCULATE PREDICTIVE UPCOMING PHASE INDICATOR
  const getUpcomingPhasePrediction = (day: number) => {
    if (day <= 5) {
      return {
        nextPhaseName: 'Follikelphase (Innerer Frühling)',
        expectedInDays: Math.max(1, 6 - day),
        proactiveTip: 'Ihr Östrogenspiegel beginnt bald zu steigen. Freue dich auf ihren anstehenden Energieschub und plant gemeinsame Unternehmungen!'
      };
    } else if (day <= 13) {
      return {
        nextPhaseName: 'Ovulation (Innerer Sommer / Eisprung)',
        expectedInDays: Math.max(1, 14 - day),
        proactiveTip: 'Die Phase höchster sozialer Energie und Lebensfreude steht bevor. Nutzt den Elan für schöne gemeinsame Dates!'
      };
    } else if (day <= 21) {
      return {
        nextPhaseName: 'Lutealphase (Innerer Herbst / PMS)',
        expectedInDays: Math.max(1, 22 - day),
        proactiveTip: 'Progesteron setzt bald ein. Halte den Terminkalender in den kommenden Tagen entspannt und bereite gemütliche Abende vor.'
      };
    } else {
      return {
        nextPhaseName: 'Menstruation (Innerer Winter / Periode)',
        expectedInDays: Math.max(1, 29 - day),
        proactiveTip: 'Die Menstruation kündigt sich an. Besorge rechtzeitig dunkle Schokolade, Kräutertee und halte eine Wärmflasche bereit.'
      };
    }
  };

  const upcomingPrediction = getUpcomingPhasePrediction(currentDay);

  if (!connection || connection.status !== 'connected') {
    return (
      <div className="space-y-4">
        {/* Unconnected Banner */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-950/30 to-pink-950/20 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white">Partnerin einladen</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                Verbinde dich mit deiner Partnerin. Sie kann freiwillig ihre Zyklusphase, Symptome oder persönliche Wünsche mit dir teilen.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenConnectModal}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 shadow-md shadow-purple-600/20"
          >
            <span>Partner verbinden</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Permanent Boyfriend Guide Box (Always Visible) */}
        <div className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
              💡
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Dein Boyfriend-Leitfaden: Worauf du immer achten kannst
              </h3>
              <p className="text-xs text-slate-400">Fundierte Unterstützung & feinfühlige Kommunikation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#12121A] border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-purple-300">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>1. Worauf du achten musst</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Der weibliche Zyklus beeinflusst Energie, Schlafarchitektur und Schmerzempfinden (Prostaglandine). Nimm körperliche Anzeichen ernst.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#12121A] border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-pink-300">
                <Ear className="w-4 h-4 text-pink-400" />
                <span>2. Wie du kommunizierst</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Höre aktiv zu, ohne sofort Ratschläge aufzudrängen. Validiere ihre Gefühle anstatt sie als "Hormone" abzutun.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#12121A] border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <span>3. Wie du für sie da bist</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Übernehme unaufgefordert Alltagsaufgaben, bringe eine Wärmflasche oder schenke ihr verständnisvollen Rückhalt.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Connected with partner
  return (
    <div className="rounded-3xl bg-[#1A1A26] border border-purple-500/40 p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-5">
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-pink-600/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center">
            <Heart className="w-4 h-4 fill-pink-400" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {partnerName}s aktuelle Phase & dein Leitfaden
            </h3>
            <span className="text-[11px] text-purple-300">100% freiwillig von ihr freigegeben</span>
          </div>
        </div>

        <button
          onClick={onOpenConnectModal}
          className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-[#101018] border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
        >
          Status & Verbindung
        </button>
      </div>

      {sharedData && sharedData.hasAnySharedData ? (
        <div className="space-y-4">
          {/* Shared Cycle Phase */}
          {sharedData.cycleStatus && (
            <div className="p-4 rounded-2xl bg-[#101018] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-pink-400 tracking-wider">
                  Aktuelle Zyklusphase
                </span>
                <p className="text-base font-black text-white mt-0.5">
                  {sharedData.cycleStatus.phaseName} ({sharedData.cycleStatus.phaseSeason})
                </p>
                <p className="text-xs text-slate-300">Tag {sharedData.cycleStatus.currentDay} im Zyklus</p>
              </div>

              {sharedData.cycleStatus.daysUntilNextPeriod > 0 && (
                <div className="text-left sm:text-right text-xs p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20">
                  <span className="text-slate-400 block">Nächste Periode geschätzt:</span>
                  <span className="font-bold text-purple-300 text-sm">
                    in ca. {sharedData.cycleStatus.daysUntilNextPeriod} Tagen
                  </span>
                </div>
              )}
            </div>
          )}

          {/* PREDICTIVE 'UPCOMING PHASE' INDICATOR (Proactive Support) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-950/30 via-[#12121A] to-purple-950/30 border border-blue-500/30 shadow-lg space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center">
                <BellRing className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block">
                  Proaktive Phasen-Vorschau (Upcoming Phase)
                </span>
                <span className="text-xs text-slate-300 font-semibold">
                  Nächste erwartete Phase: <strong className="text-white">{upcomingPrediction.nextPhaseName}</strong> (in ca. {upcomingPrediction.expectedInDays} Tagen)
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#101018] border border-slate-800 text-xs text-slate-200 leading-relaxed flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-purple-300 block mb-0.5">Tipp zur proaktiven Unterstützung:</span>
                {upcomingPrediction.proactiveTip}
              </div>
            </div>
          </div>

          {/* DAILY INSIGHT TIPS & COMMUNICATION COACH CARD */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-[#12121A] to-pink-950/30 border border-purple-500/40 shadow-lg space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">
                    Täglicher Empathie- & Kommunikations-Tipp
                  </span>
                  <span className="text-xs text-slate-400">Basierend auf ihrer aktuellen Phase</span>
                </div>
              </div>

              <button
                onClick={handleNextTip}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101018] hover:bg-slate-800 text-xs font-semibold text-purple-300 border border-slate-700 transition-colors cursor-pointer"
                title="Nächsten Impuls anzeigen"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Nächster Tipp</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#101018] border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>{currentTip.title}</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 text-[10px]">
                  {currentTip.category}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                "{currentTip.tip}"
              </p>
            </div>
          </div>

          {/* DEDICATED BOYFRIEND ACTION & COMMUNICATION GUIDE BASED ON HER PHASE */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#12121A] border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Dein Fokus für diese Phase ({guide.title})
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#1A1A26] border border-slate-800 space-y-1.5">
                <span className="font-bold text-purple-300 block">1. Worauf du achten musst:</span>
                <p className="text-slate-300 leading-relaxed">{guide.attention}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#1A1A26] border border-slate-800 space-y-1.5">
                <span className="font-bold text-pink-300 block">2. Wie du mit ihr kommunizierst:</span>
                <p className="text-slate-300 leading-relaxed">{guide.communication}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#1A1A26] border border-slate-800 space-y-1.5">
                <span className="font-bold text-emerald-300 block">3. Wie du sie unterstützt:</span>
                <p className="text-slate-300 leading-relaxed">{guide.support}</p>
              </div>
            </div>
          </div>

          {/* Shared Symptoms */}
          {sharedData.symptoms && sharedData.symptoms.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-2">
              <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider block">
                Von ihr geteilte Symptome:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sharedData.symptoms.map((sId) => {
                  const found = COMMON_SYMPTOMS.find((s) => s.id === sId);
                  return (
                    <span
                      key={sId}
                      className="px-2.5 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-xs text-pink-200 font-medium"
                    >
                      {found ? found.label : sId}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Shared Support Preferences & Custom Wish */}
          {(sharedData.preferences || sharedData.customWish) && (
            <div className="p-4 rounded-2xl bg-[#101018] border border-slate-800 space-y-3">
              <span className="text-[10px] uppercase font-bold text-pink-400 tracking-wider block">
                Wie {partnerName} am liebsten unterstützt wird:
              </span>

              {sharedData.preferences && (
                <ul className="space-y-1 text-xs text-slate-200 pl-1">
                  {sharedData.preferences.map((pref, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-pink-400 shrink-0">•</span>
                      <span>{pref}</span>
                    </li>
                  ))}
                </ul>
              )}

              {sharedData.customWish && (
                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200">
                  <span className="font-bold text-pink-300 block mb-0.5">Ihr persönlicher Wunsch an dich:</span>
                  "{sharedData.customWish}"
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Connected but no shared data */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#101018] border border-slate-800 text-center text-xs text-slate-400 space-y-2">
            <Lock className="w-5 h-5 text-purple-400 mx-auto opacity-80" />
            <p className="font-semibold text-slate-300">
              {partnerName} hat aktuell keine privaten Zyklusdaten freigegeben.
            </p>
            <p className="max-w-md mx-auto">
              Das ist vollkommen in Ordnung. Nutze den allgemeinen Leitfaden, um aufmerksam, verständnisvoll und für sie da zu sein.
            </p>
          </div>

          {/* General Boyfriend Guide Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-950/30 via-[#12121A] to-pink-950/20 border border-purple-500/30 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Dein universeller Boyfriend-Leitfaden
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#101018] border border-slate-800 space-y-1">
                <span className="font-bold text-purple-300 block">1. Worauf du achtest:</span>
                <p className="text-slate-300 leading-relaxed">Respektiere ihren persönlichen Rhythmus und nimm Stimmungsschwankungen oder Erschöpfung als echte körperliche Signale wahr.</p>
              </div>

              <div className="p-3 rounded-xl bg-[#101018] border border-slate-800 space-y-1">
                <span className="font-bold text-pink-300 block">2. Kommunikation:</span>
                <p className="text-slate-300 leading-relaxed">Höre zu, ohne sofort Lösungen aufzuzwängen. Frage freundlich nach, anstatt Vermutungen anzustellen.</p>
              </div>

              <div className="p-3 rounded-xl bg-[#101018] border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-300 block">3. Unterstützung:</span>
                <p className="text-slate-300 leading-relaxed">Kleine Gesten wie eine Tasse Tee, eine sanfte Massage oder unaufgeforderte Entlastung im Alltag bewirken Wunder.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
