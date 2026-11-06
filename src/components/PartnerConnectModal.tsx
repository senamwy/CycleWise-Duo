import React, { useState } from 'react';
import { User, PartnerConnection, PartnerInvitation } from '../types';
import {
  createPartnerInvitation,
  getInvitationByCode,
  acceptPartnerInvitation,
  getPartnerConnectionForUser,
  disconnectPartner
} from '../utils/storage';
import {
  HeartHandshake,
  Copy,
  Check,
  X,
  AlertTriangle,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Unlink,
  Sparkles
} from 'lucide-react';

interface PartnerConnectModalProps {
  user: User;
  onClose: () => void;
  onConnectionChange: () => void;
}

export const PartnerConnectModal: React.FC<PartnerConnectModalProps> = ({
  user,
  onClose,
  onConnectionChange
}) => {
  const [connection, setConnection] = useState<PartnerConnection | null>(() =>
    getPartnerConnectionForUser(user.id)
  );
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  const handleGenerateCode = () => {
    setError('');
    const inv = createPartnerInvitation(user);
    setActiveCode(inv.code);
  };

  const handleCopyCode = () => {
    if (!activeCode) return;
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAcceptCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      if (!inputCode.trim()) {
        setError('Bitte einen 6-stelligen Code eingeben.');
        return;
      }
      const newConn = acceptPartnerInvitation(inputCode, user);
      setConnection(newConn);
      setSuccessMsg('Erfolgreich verbunden! Ihr seid nun als Partner verknüpft.');
      onConnectionChange();
    } catch (err: any) {
      setError(err.message || 'Ungültiger Code.');
    }
  };

  const handleDisconnect = () => {
    disconnectPartner(user.id);
    setConnection(null);
    setShowDisconnectConfirm(false);
    onConnectionChange();
  };

  const partnerDisplayName =
    connection?.boyfriendId === user.id ? connection.girlfriendName : connection?.boyfriendName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-[#1A1A26] border border-purple-500/30 p-6 sm:p-8 text-slate-100 shadow-2xl relative my-8">
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-purple-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">Partner-Verbindung (Phase 2)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1" aria-label="Schließen">
            <X className="w-5 h-5" />
          </button>
        </div>

        {connection && connection.status === 'connected' ? (
          /* Active Connection View */
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
              <UserCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-300">Aktiv verbunden</p>
                <p className="text-sm font-semibold text-white mt-0.5">
                  Verknüpft mit {partnerDisplayName}
                </p>
                <p className="text-[11px] text-emerald-200/80 mt-1">
                  Alle geteilten Daten unterliegen den individuellen Freigabeeinstellungen der Partnerin.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#101018] border border-slate-800 text-xs text-slate-300 space-y-2">
              <p className="font-semibold text-white">Freiwilligkeit & Datenschutz:</p>
              <p className="text-slate-400">
                Jeder Partner kann die Verbindung jederzeit mit einem Klick beenden. Es werden keine unautorisierten Daten übertragen.
              </p>
            </div>

            {showDisconnectConfirm ? (
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-xs space-y-3">
                <p className="font-bold text-rose-300">Verbindung wirklich trennen?</p>
                <p className="text-slate-300">
                  Der Datenaustausch wird sofort gestoppt. Dein Partner hat keinen Zugriff mehr auf geteilte Inhalte.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDisconnectConfirm(false)}
                    className="w-1/2 py-2 bg-[#101018] border border-slate-700 text-slate-300 rounded-xl font-semibold"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="w-1/2 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold shadow-md"
                  >
                    Trennen
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDisconnectConfirm(true)}
                className="w-full py-2.5 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Unlink className="w-4 h-4" />
                <span>Partner-Verbindung trennen</span>
              </button>
            )}
          </div>
        ) : (
          /* Not Connected: Create or Enter Code */
          <div className="space-y-6">
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300">
                {successMsg}
              </div>
            )}

            {/* Option A: Generate invitation code */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#101018] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                <Sparkles className="w-4 h-4" />
                <span>Option 1: Einladungscode für Partner erstellen</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Erstelle einen sicheren Einladungscode und sende ihn deinem Partner. Dein Partner gibt den Code in der App ein.
              </p>

              {activeCode ? (
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-purple-300 uppercase font-semibold">Dein Einladungscode:</span>
                    <p className="text-xl font-black text-white tracking-widest">{activeCode}</p>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Kopiert!' : 'Kopieren'}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGenerateCode}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Code jetzt generieren
                </button>
              )}
            </div>

            {/* Option B: Enter received code */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#101018] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-pink-400">
                <HeartHandshake className="w-4 h-4" />
                <span>Option 2: Erhaltenen Code einlösen</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hat dir dein Partner einen 6-stelligen Code (z.B. "CW-4892") gesendet?
              </p>

              <form onSubmit={handleAcceptCode} className="flex gap-2">
                <input
                  type="text"
                  placeholder="CW-XXXX"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#1A1A26] border border-slate-700 text-xs font-bold tracking-wider text-white uppercase focus:border-purple-500 outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Verbinden</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/20 flex items-start gap-2.5 text-xs text-purple-200/90">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>
                <strong>100% Freiwillig:</strong> Nach der Verbindung entscheidet die Partnerin vollkommen selbstständig über einzelne Freigabestufen.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
