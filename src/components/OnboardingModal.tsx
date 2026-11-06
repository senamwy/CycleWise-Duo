import React, { useState } from 'react';
import { User, UserPreferences } from '../types';
import { Heart, Sparkles, Check, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { saveUser } from '../utils/storage';

interface OnboardingModalProps {
  user: User;
  onComplete: (updatedUser: User) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user.name || '');
  const [partnerName, setPartnerName] = useState(user.preferences.partnerName || '');
  const [goals, setGoals] = useState<string[]>(
    user.preferences.relationshipGoals.length > 0
      ? user.preferences.relationshipGoals
      : ['Ihren Zyklus besser verstehen', 'Aufmerksamer Partner im Alltag sein']
  );
  const [areasToImprove, setAreasToImprove] = useState<string[]>(
    user.preferences.areasToImprove.length > 0
      ? user.preferences.areasToImprove
      : ['Zuhören ohne sofortige Ratschläge', 'Kleine Gesten im Alltag etablieren']
  );
  const [communicationStyle, setCommunicationStyle] = useState(
    user.preferences.communicationStyle || 'Einfühlsam & Direkt'
  );
  const [reminderFrequency, setReminderFrequency] = useState<'daily' | 'weekly' | 'occasional'>(
    user.preferences.reminderFrequency || 'daily'
  );

  const goalOptions = [
    'Ihren Zyklus besser verstehen',
    'Aufmerksamer Partner im Alltag sein',
    'Empathisch kommunizieren ohne Klischees',
    'Praktische Entlastung bei Beschwerden',
    'Wichtige Tage und Momente nicht vergessen',
    'Gemeinsam als Paar wachsen'
  ];

  const improvementOptions = [
    'Zuhören ohne sofortige Ratschläge',
    'Kleine Gesten im Alltag etablieren',
    'Ihr Bedürfnis nach Ruhe respektieren',
    'Konkrete Hilfe anbieten statt nur zu fragen',
    'Symptome wie Krämpfe und PMS richtig einschätzen'
  ];

  const toggleGoal = (option: string) => {
    setGoals((prev) =>
      prev.includes(option) ? prev.filter((g) => g !== option) : [...prev, option]
    );
  };

  const toggleImprovement = (option: string) => {
    setAreasToImprove((prev) =>
      prev.includes(option) ? prev.filter((i) => i !== option) : [...prev, option]
    );
  };

  const isGirlfriend = user.role === 'girlfriend';

  const handleFinishGirlfriend = () => {
    const updatedUser: User = {
      ...user,
      name: name.trim() || user.name || 'Partnerin',
      onboardingComplete: true,
      preferences: {
        ...user.preferences,
        partnerName: partnerName.trim() || undefined
      }
    };
    saveUser(updatedUser);
    onComplete(updatedUser);
  };

  const handleFinish = () => {
    const updatedPreferences: UserPreferences = {
      ...user.preferences,
      partnerName: partnerName.trim() || undefined,
      relationshipGoals: goals,
      areasToImprove: areasToImprove,
      communicationStyle,
      reminderFrequency
    };

    const updatedUser: User = {
      ...user,
      name: name.trim() || user.name || 'Partner',
      onboardingComplete: true,
      preferences: updatedPreferences
    };

    saveUser(updatedUser);
    onComplete(updatedUser);
  };

  if (isGirlfriend) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <div className="w-full max-w-lg rounded-3xl bg-[#1A1A26] border border-pink-500/30 p-6 sm:p-8 text-slate-100 shadow-2xl relative my-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold text-xs">
              ✦
            </div>
            <span className="text-xs text-pink-300 font-semibold uppercase tracking-wider">
              Willkommen bei CycleWise Duo
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            Dein sicherer, privater Raum
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Hier kannst du deinen Menstruationszyklus, Symptome und Wohlbefinden diskret und in voller Ruhe erfassen.
          </p>

          <div className="space-y-4 my-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Dein Vorname
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z.B. Sarah"
                className="w-full px-4 py-3 rounded-xl bg-[#101018] border border-slate-700 focus:border-pink-500 text-white placeholder-slate-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Name deines Partners <span className="text-slate-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="z.B. Leo"
                className="w-full px-4 py-3 rounded-xl bg-[#101018] border border-slate-700 focus:border-pink-500 text-white placeholder-slate-500 outline-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-2 text-xs text-purple-200">
              <div className="flex items-center gap-2 font-bold text-purple-300">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>100% Deine Kontrolle</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Nichts wird automatisch geteilt. Du allein entscheidest in den Einstellungen, ob und welche Informationen (z.B. Zyklusphase oder Wünsche) für deinen Partner sichtbar sein dürfen.
              </p>
            </div>
          </div>

          <button
            onClick={handleFinishGirlfriend}
            disabled={!name.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-pink-600/25 disabled:opacity-50"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Zyklus-Tagebuch öffnen</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-[#1A1A26] border border-purple-500/30 p-6 sm:p-8 text-slate-100 shadow-2xl relative my-8">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">
              {step}/4
            </div>
            <span className="text-xs text-purple-300/80 font-medium">Dein persönlicher Start</span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step ? 'w-6 bg-purple-500' : s < step ? 'w-3 bg-purple-400/50' : 'w-3 bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Basics */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Willkommen bei CycleWise Duo
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Lass uns deine App personalisieren. Schritt 1 dauert nur 30 Sekunden.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Wie darf die App dich ansprechen? (Dein Vorname)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="z.B. Leo"
                  className="w-full px-4 py-3 rounded-xl bg-[#101018] border border-slate-700 focus:border-purple-500 text-white placeholder-slate-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  Name deiner Partnerin <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="z.B. Sarah"
                  className="w-full px-4 py-3 rounded-xl bg-[#101018] border border-slate-700 focus:border-purple-500 text-white placeholder-slate-500 outline-none transition-colors"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Wird verwendet, um tägliche Unterstützungsideen persönlicher zu formulieren.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/20 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <p className="text-xs text-purple-200/90 leading-relaxed">
                  <strong>100% Privatsphäre:</strong> Wir fragen niemals nach intimen medizinischen Daten deiner Partnerin. Die App funktioniert komplett eigenständig für dich.
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-600/20"
            >
              <span>Weiter zu den Zielen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Relationship Goals */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Was möchtest du erreichen?
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Wähle die Ziele aus, die dir in eurer Partnerschaft besonders am Herzen liegen.
              </p>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {goalOptions.map((goal) => {
                const isSelected = goals.includes(goal);
                return (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500/60 text-white'
                        : 'bg-[#101018] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-medium">{goal}</span>
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'border-slate-700 bg-transparent'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-colors"
              >
                Zurück
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={goals.length === 0}
                className="w-2/3 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-600/20 disabled:opacity-50"
              >
                <span>Weiter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Areas to improve */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Wo möchtest du aufmerksamer werden?
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Echtes Wachstum beginnt mit kleinen, täglichen Gewohnheiten.
              </p>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {improvementOptions.map((item) => {
                const isSelected = areasToImprove.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggleImprovement(item)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500/60 text-white'
                        : 'bg-[#101018] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-medium">{item}</span>
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'border-slate-700 bg-transparent'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-3 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-colors"
              >
                Zurück
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={areasToImprove.length === 0}
                className="w-2/3 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-600/20 disabled:opacity-50"
              >
                <span>Weiter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Preferences & Finish */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Fast geschafft!
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Wie oft möchtest du nützliche Impulse und Erinnerungen erhalten?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Wie oft wünschst du dir Unterstützungsimpulse?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'daily', label: 'Täglich', desc: '1 kleiner Impuls/Tag' },
                    { id: 'weekly', label: 'Wöchentlich', desc: 'Fokus am Wochenende' },
                    { id: 'occasional', label: 'Nur bei Bedarf', desc: 'Auf Abruf' }
                  ].map((freq) => (
                    <button
                      key={freq.id}
                      onClick={() => setReminderFrequency(freq.id as any)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        reminderFrequency === freq.id
                          ? 'bg-purple-950/50 border-purple-500 text-white'
                          : 'bg-[#101018] border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <p className="text-xs font-bold">{freq.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{freq.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Bevorzugter Kommunikationsstil
                </label>
                <select
                  value={communicationStyle}
                  onChange={(e) => setCommunicationStyle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#101018] border border-slate-700 text-white text-sm outline-none focus:border-purple-500"
                >
                  <option value="Einfühlsam & Direkt">Einfühlsam & Direkt (Klar, herzlich und ohne Umschweife)</option>
                  <option value="Sanft & Zurückhaltend">Sanft & Zurückhaltend (Raum geben und abwarten)</option>
                  <option value="Praktisch & Tatkräftig">Praktisch & Tatkräftig (Konkrete Taten sprechen lassen)</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 to-pink-900/20 border border-purple-500/30">
                <div className="flex items-center gap-2 text-purple-300 text-xs font-bold mb-1">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  Dein Dashboard ist bereit
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ab jetzt erhältst du jeden Tag eine durchdachte Idee, lernst den Zyklus wissenschaftlich fundiert kennen und verpasst keine bedeutsamen Momente.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep(3)}
                className="w-1/3 py-3 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-colors"
              >
                Zurück
              </button>
              <button
                onClick={handleFinish}
                className="w-2/3 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-600/30"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Dashboard öffnen</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
