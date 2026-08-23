import React, { useState } from 'react';
import { X, Wallet, Download, Upload, Trash2, Check, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, ExpenseItem } from '../types';
import { translations } from '../utils/translations';
import { formatCurrency } from '../utils/calculator';

interface BudgetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: number;
  onSaveBudget: (newBudget: number) => void;
  currency: string;
  onSaveCurrency: (newCurrency: string) => void;
  expenses: ExpenseItem[];
  onRestoreData: (restored: ExpenseItem[]) => void;
  onClearAll: () => void;
  language: Language;
}

export const BudgetSettingsModal: React.FC<BudgetSettingsModalProps> = ({
  isOpen,
  onClose,
  budget,
  onSaveBudget,
  currency,
  onSaveCurrency,
  expenses,
  onRestoreData,
  onClearAll,
  language,
}) => {
  const t = translations[language];
  const [budgetVal, setBudgetVal] = useState<string>(budget > 0 ? String(budget) : '');
  const [selectedCurrency, setSelectedCurrency] = useState<string>(currency || '₹');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [isBudgetSet] = useState<boolean>(() => localStorage.getItem('daily_expense_diary_budget_v1') !== null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(budgetVal) || 0;
    onSaveBudget(num);
    onSaveCurrency(selectedCurrency);

    // Fire celebratory confetti if budget was set
    if (num > 0) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (err) {
        // ignore
      }
    }

    setSuccessMsg('सेटिंग्स सफलतापूर्वक सुरक्षित की गईं!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 900);
  };

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(expenses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Daily_Expense_Diary_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onRestoreData(parsed);
            alert(`सफलतापूर्वक ${parsed.length} प्रविष्टियां बहाल (Restore) की गईं!`);
            onClose();
          } else {
            alert('अमान्य बैकअप फ़ाइल (Invalid backup file)');
          }
        } catch {
          alert('फ़ाइल पढ़ने में त्रुटि हुई');
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div
        id="budget-settings-modal-box"
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-sans">
                Budget & Settings
              </h3>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">
                Manage App Configuration
              </p>
            </div>
          </div>
          {!isBudgetSet ? (
            <div className="w-10 h-10"></div> /* Placeholder for alignment */
          ) : (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          {successMsg && (
            <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-2.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600 animate-bounce" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Monthly Budget Input (Hidden if already set) */}
          {!isBudgetSet && (
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                Target Monthly Budget ({selectedCurrency})
              </label>
              <input
                type="number"
                id="settings-budget-input"
                placeholder="e.g. 20000"
                value={budgetVal}
                onChange={(e) => setBudgetVal(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors"
              />
              <p className="text-[11px] text-slate-400 font-medium mt-1.5">
                Set a monthly limit to track your spending progress.
              </p>
            </div>
          )}

          {/* Currency Selection */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
              Currency Symbol
            </label>
            <div className="flex items-center gap-2">
              {['₹', '$', '€', '£', 'AED', '¥'].map((cur) => (
                <button
                  type="button"
                  key={cur}
                  onClick={() => setSelectedCurrency(cur)}
                  className={`px-3.5 py-2 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                    selectedCurrency === cur
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>
          </div>

          {/* Backup & Restore Tools */}
          {isBudgetSet && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Data Management:
              </span>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>Export JSON</span>
                </button>

                <label className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm">
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span>Import JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => alert("APK Export option is not installed. Please build manually using a tool like Capacitor or download the source code.")}
                  className="col-span-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold py-2.5 px-3 rounded-xl border border-indigo-200 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <Smartphone className="w-4 h-4 text-indigo-400" />
                  <span>Export App (.apk)</span>
                </button>
              </div>
            </div>
          )}

          {/* Clear Data Danger Zone */}
          {isBudgetSet && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('WARNING: Are you sure you want to delete all diary data? This cannot be undone unless you have a backup.')) {
                    onClearAll();
                    onClose();
                  }
                }}
                className="w-full text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All Data (Reset)</span>
              </button>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-4">
            {isBudgetSet && (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!isBudgetSet && (!budgetVal || parseFloat(budgetVal) <= 0)}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer active:scale-95"
            >
              {isBudgetSet ? 'Save Settings' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
