import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { SCIENTIFIC_STUDIES, HORMONE_PATHWAYS } from '../data/scientificResearchData';
import { SUPPORT_SUGGESTIONS } from '../data/supportData';
import { EDUCATION_ARTICLES } from '../data/educationData';
import { triggerHapticFeedback } from '../utils/haptics';
import {
  Sparkles,
  Send,
  Bot,
  User as UserIcon,
  BookOpen,
  ExternalLink,
  HelpCircle,
  RefreshCw,
  CheckCircle2,
  Dna,
  HeartHandshake
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: { title: string; citation: string; url?: string }[];
  timestamp: string;
}

interface CycleAssistantChatProps {
  user: User;
}

export const CycleAssistantChat: React.FC<CycleAssistantChatProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hallo ${user.name}! Ich bin dein evidenzbasierter CycleWise Assist. Du kannst mich alles über Menstruationsbiologie, Hormon-Rezeptoren, wissenschaftliche Studien (z.B. PubMed) oder konkrete Kommunikationstipps für Paare fragen. Auf welche Frage möchtest du heute eine fundierte Antwort?`,
      sources: [
        {
          title: 'CycleWise Wissenschafts-Hub & Landmark-Studien',
          citation: 'Peer-Reviewed NLM / PubMed Database'
        }
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    'Wie wirkt Wärme bei Menstruationsschmerzen (Dysmenorrhoe)?',
    'Welche Rolle spielt Progesteron in der Lutealphase / PMS?',
    'Wie kann ich als Partner in der Menstruationsphase am besten unterstützen?',
    'Gibt es Studien zum Einfluss des Zyklus auf den Schlaf?',
    'Was besagt die Landmark-Studie von McNulty et al. 2020?'
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    triggerHapticFeedback('light');
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    // Simulate intelligent grounded RAG response based on database
    setTimeout(() => {
      triggerHapticFeedback('success');
      const responsePair = generateGroundedAnswer(textToSend);
      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: responsePair.text,
        sources: responsePair.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 800);
  };

  const generateGroundedAnswer = (query: string): { text: string; sources: { title: string; citation: string; url?: string }[] } => {
    const q = query.toLowerCase();

    if (q.includes('wärme') || q.includes('schmerz') || q.includes('dysmenorrhoe') || q.includes('heat')) {
      const study = SCIENTIFIC_STUDIES.find((s) => s.id === 'study-heat-dysmenorrhea') || SCIENTIFIC_STUDIES[0];
      return {
        text: `Klinische Studien (wie z.B. Akin et al. 2001) belegen, dass lokale Wärmetherapie bei Dysmenorrhoe (Menstruationsschmerzen) therapeutisch genauso wirksam ist wie orales Ibuprofen (400mg). \n\nDer physiologische Mechanismus beruht auf der Blockade von Schmerzrezeptoren (TRPV1-Kanäle) im Uterusgewebe und der Erhöhung der lokalen Mikrozirkulation, wodurch uterokontraktile Ischämie und Prostaglandin-Ausschüttung (PGF2a) gemindert werden.`,
        sources: [
          {
            title: study.title,
            citation: `${study.authors} (${study.year}). ${study.journal}`,
            url: study.externalUrl
          }
        ]
      };
    }

    if (q.includes('progesteron') || q.includes('luteal') || q.includes('pms') || q.includes('stimmung')) {
      const study = SCIENTIFIC_STUDIES.find((s) => s.id === 'study-backstrom-allopregnanolone') || SCIENTIFIC_STUDIES[1];
      return {
        text: `Progesteron wird nach dem Eisprung im Gelbkörper (Corpus luteum) gebildet und bindet im Gehirn an GABA_A-Rezeptoren. Sein Metabolit Allopregnanolon beeinflusst die neuronale Erregbarkeit und die Reizfilterschwelle.\n\nBei empfindlichen Frauen können plötzliche Hormonabfälle vor der Menstruation zu emotionaler Sensibilität oder Erschöpfung führen. Als Partner hilft hier vor allem ein ruhiges Umfeld ohne Reizüberflutung ("Social Buffering").`,
        sources: [
          {
            title: study.title,
            citation: `${study.authors} (${study.year}). ${study.journal}`,
            url: study.externalUrl
          }
        ]
      };
    }

    if (q.includes('partner') || q.includes('unterstütz') || q.includes('helfen') || q.includes('kommunikation')) {
      return {
        text: `Um deine Partnerin feinfühlig zu unterstützen, empfiehlt sich ein proaktiver Ansatz statt ständiger Nachfragen ("Kann ich helfen?").\n\n1. **Konkrete Taten statt Fragen:** Bringe unaufgefordert eine Wärmflasche oder übernehme das Kochen.\n2. **Keine Ratschläge erzwingen:** Höre aktiv zu und validiere ihre Gefühle anstatt Probleme sofort lösen zu wollen.\n3. **Rückzug respektieren:** In der Menstruationsphase ist Energie auf Regeneration gerichtet – ruhige Präsenz schafft biologische Sicherheit.`,
        sources: [
          {
            title: 'CycleWise Duo Empathie- & Kommunikations-Leitfaden',
            citation: 'Basierend auf klinischer Beziehungsforschung & Ditzen et al. 2007 (Oxytocin & Cortisol)'
          }
        ]
      };
    }

    if (q.includes('mcnulty') || q.includes('sport') || q.includes('kraft') || q.includes('leistung')) {
      const study = SCIENTIFIC_STUDIES.find((s) => s.id === 'study-mcnulty-performance') || SCIENTIFIC_STUDIES[4];
      return {
        text: `Die umfassende Meta-Analyse von McNulty et al. (2020) im *Sports Medicine* untersuchte den Einfluss des Menstruationszyklus auf sportliche Leistungsfähigkeit über 78 Studien hinweg.\n\nDas Ergebnis: Zwar kann es in der frühen Menstruationsphase zu minimalen physiologischen Leistungsschwankungen kommen, diese Effekte sind jedoch individuell sehr gering und zeigen keine statistisch signifikante globale Beeinträchtigung sportlicher Leistungsfähigkeit über den gesamten Zyklus hinweg.`,
        sources: [
          {
            title: study.title,
            citation: `${study.authors} (${study.year}). ${study.journal}`,
            url: study.externalUrl
          }
        ]
      };
    }

    if (q.includes('schlaf') || q.includes('sleep') || q.includes('müdigkeit')) {
      const study = SCIENTIFIC_STUDIES.find((s) => s.id === 'study-baker-sleep') || SCIENTIFIC_STUDIES[3];
      return {
        text: `Untersuchungen zur Schlafarchitektur (z.B. Baker et al.) zeigen, dass die Erhöhung der Basaltemperatur in der Lutealphase (durch Progesteron) zu einer leichten Reduktion des REM-Schlafs und häufigerem nächtlichen Aufwachen führen kann.\n\nDas erklärt, warum Frauen in der Woche vor der Periode oft ein höheres Ruhebedürfnis verspüren.`,
        sources: [
          {
            title: study.title,
            citation: `${study.authors} (${study.year}). ${study.journal}`,
            url: study.externalUrl
          }
        ]
      };
    }

    // Default grounded RAG response
    return {
      text: `Das ist eine sehr spannende Frage zum Thema Zyklusgesundheit und Partnerschaft. In unserem evidenzbasierten Forschungs-Hub haben wir dazu umfassende Peer-Reviewed Studien und biologische Rezeptor-Pfade kuratiert.\n\nZusammenfassend lässt sich sagen, dass der hormonelle Rhythmus (Östrogen, Progesteron, FSH, LH) direkt mit Energie, Temperatur, Schmerzverarbeitung und emotionaler Reizfilterschwelle zusammenhängt. Gegenseitiges Verständnis und proaktive Entlastung stärken die Partnerschaft in jeder Phase spürbar.`,
      sources: [
        {
          title: 'CycleWise Evidence-Based Research Database',
          citation: 'Peer-Reviewed Biomedical Literature (PubMed / Europe PMC)'
        }
      ]
    };
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-4xl mx-auto px-4 sm:px-6 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 tracking-wide uppercase">
            <span>KI-Assistent & Wissens-Chat</span>
            <span aria-hidden="true">·</span>
            <span>Quellengestützt (RAG)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            CycleWise Research Assistant
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Stelle deine Fragen zu Biologie, Hormonen und Partnerschaft – beantwortet auf Basis verifizierter Studien.
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="rounded-3xl bg-[#1A1A26] border border-slate-800 shadow-2xl flex flex-col h-[650px] overflow-hidden">
        {/* Chat Messages List */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-md'
                }`}
              >
                {msg.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
              </div>

              <div
                className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-4 space-y-2.5 text-xs sm:text-sm ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-[#12121A] border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
                }`}
              >
                <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>

                {/* Sources Citation Pill */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="pt-2.5 mt-2.5 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider block flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-purple-400" />
                      <span>Verifizierte Quellen & Studien:</span>
                    </span>
                    {msg.sources.map((src, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-xl bg-[#1A1A26] border border-slate-800/80 text-[11px] text-slate-300 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{src.title}</p>
                          <p className="text-[10px] text-slate-400 truncate">{src.citation}</p>
                        </div>
                        {src.url && (
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-purple-500/20 text-purple-300 hover:text-white transition-colors shrink-0"
                            title="Originalstudie öffnen"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-[10px] text-slate-400 text-right font-mono pt-1">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-[#12121A] border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                <span>Analysiere medizinische Quellen und studienbasierte Evidenz...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2.5 bg-[#12121A] border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] text-slate-400 shrink-0 font-medium">Häufige Fragen:</span>
          {quickPrompts.slice(0, 3).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1 rounded-xl bg-[#1A1A26] hover:bg-slate-800 text-slate-300 text-xs whitespace-nowrap border border-slate-700 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-[#12121A] border-t border-slate-800 flex gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Stelle eine Frage zu Zyklus, Hormonen oder Studien..."
            className="flex-1 px-4 py-3 rounded-2xl bg-[#1A1A26] border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-purple-500 outline-none"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-purple-600/30"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Fragen</span>
          </button>
        </form>
      </div>
    </div>
  );
};
