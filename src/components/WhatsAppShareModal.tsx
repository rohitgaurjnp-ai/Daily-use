import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageSquare } from 'lucide-react';
import { MonthSummary, DayLedger, Language } from '../types';
import { translations } from '../utils/translations';
import { generateWhatsAppShareText } from '../utils/calculator';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: MonthSummary;
  ledgers: DayLedger[];
  language: Language;
  currency: string;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  summary,
  ledgers,
  language,
  currency,
}) => {
  const t = translations[language];
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const shareText = generateWhatsAppShareText(summary, ledgers, currency);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div
        id="whatsapp-share-modal-box"
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-sans">
                {t.shareWhatsApp}
              </h3>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">
                Share ledger with family
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body preview */}
        <div className="p-5 space-y-4 flex-1 overflow-y-auto">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Preview of message to send:
          </p>

          <div className="bg-slate-50 text-slate-800 p-5 rounded-2xl font-mono text-xs whitespace-pre-wrap select-all leading-relaxed shadow-inner max-h-72 overflow-y-auto border border-slate-200">
            {shareText}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
          <button
            onClick={handleCopy}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition cursor-pointer shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleOpenWhatsApp}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-md shadow-emerald-600/20 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Open WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
