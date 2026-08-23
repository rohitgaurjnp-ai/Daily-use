import React, { useState, useEffect } from 'react';
import { X, Calculator, Plus, Save, Clock, Tag, CreditCard, Sparkles } from 'lucide-react';
import { ExpenseItem, ExpenseCategory, PaymentMethod, Language } from '../types';
import { translations, categoryMeta, paymentMeta, quickSuggestions } from '../utils/translations';
import { MiniCalculator } from './MiniCalculator';
import { getTodayKey } from '../utils/calculator';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<ExpenseItem, 'id' | 'createdAt'>, editingId?: string) => void;
  initialDate?: string;
  editingItem?: ExpenseItem | null;
  language: Language;
  currency: string;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDate,
  editingItem,
  language,
  currency,
}) => {
  const t = translations[language];

  const [date, setDate] = useState<string>(getTodayKey());
  const [itemName, setItemName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('groceries');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [notes, setNotes] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (editingItem) {
      setDate(editingItem.date);
      setItemName(editingItem.itemName);
      setAmount(String(editingItem.amount));
      setCategory(editingItem.category);
      setPaymentMethod(editingItem.paymentMethod);
      setNotes(editingItem.notes || '');
      setTime(editingItem.time || '');
    } else {
      setDate(initialDate || getTodayKey());
      setItemName('');
      setAmount('');
      setCategory('groceries');
      setPaymentMethod('upi');
      setNotes('');
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }));
    }
    setError('');
    setShowCalculator(false);
  }, [isOpen, editingItem, initialDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) {
      setError('कृपया सामान का नाम लिखें (Enter item name)');
      return;
    }
    const numAmt = parseFloat(amount);
    if (isNaN(numAmt) || numAmt <= 0) {
      setError('कृपया सही रकम भरें (Enter valid amount)');
      return;
    }

    onSave(
      {
        date: date || getTodayKey(),
        itemName: itemName.trim(),
        amount: Math.round(numAmt * 100) / 100,
        category,
        paymentMethod,
        notes: notes.trim() || undefined,
        time: time || undefined,
      },
      editingItem?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div
        id="add-expense-modal-box"
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              <Plus className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-sans">
                {editingItem ? 'Edit Expense' : 'Add Expense'}
              </h3>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">
                Record a new transaction
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

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                Date *
              </label>
              <input
                type="date"
                id="modal-expense-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
              Item Name *
            </label>
            <input
              type="text"
              id="modal-expense-name"
              placeholder="e.g. Milk, Groceries, Fuel..."
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
                if (error) setError('');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors"
              required
              autoFocus
            />

            {/* Quick Suggestions row */}
            <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 scrollbar-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Suggestions:</span>
              {quickSuggestions.slice(0, 5).map((s, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setItemName(language === 'hi' ? s.nameHi : language === 'hinglish' ? s.nameHinglish : s.name);
                    setCategory(s.category);
                    if (s.defaultAmount && !amount) setAmount(String(s.defaultAmount));
                  }}
                  className="shrink-0 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-[11px] font-bold px-3 py-1 rounded-full border border-slate-200 shadow-sm transition-colors cursor-pointer"
                >
                  {language === 'hi' ? s.nameHi : s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Amount (Rupaye) & Calculator */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Amount ({currency}) *
              </label>
              <button
                type="button"
                onClick={() => setShowCalculator(!showCalculator)}
                className="text-[11px] text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>{showCalculator ? 'Hide Calculator' : 'Use Calculator'}</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="number"
                id="modal-expense-amount"
                placeholder="0.00"
                step="any"
                min="0.1"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (error) setError('');
                }}
                className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-4 py-3 text-xl font-mono font-bold text-emerald-700 placeholder:text-emerald-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors"
                required
              />
            </div>

            {/* Embedded Mini Calculator */}
            {showCalculator && (
              <div className="mt-2.5 flex justify-center">
                <MiniCalculator
                  initialValue={parseFloat(amount) || 0}
                  onUseResult={(val) => {
                    setAmount(String(val));
                    setShowCalculator(false);
                  }}
                  onClose={() => setShowCalculator(false)}
                />
              </div>
            )}
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(categoryMeta).map(([catKey, meta]) => {
                const isSelected = category === catKey;
                return (
                  <button
                    type="button"
                    key={catKey}
                    onClick={() => setCategory(catKey as ExpenseCategory)}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span>{language === 'hi' ? meta.nameHi : language === 'hinglish' ? meta.nameHinglish : meta.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
              Payment Mode
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['cash', 'upi', 'card', 'udhar'] as PaymentMethod[]).map((mode) => {
                const meta = paymentMeta[mode];
                const isSelected = paymentMethod === mode;
                return (
                  <button
                    type="button"
                    key={mode}
                    onClick={() => setPaymentMethod(mode)}
                    className={`py-2 px-2 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {language === 'hi' ? meta.nameHi : meta.nameEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
              Optional Notes
            </label>
            <input
              type="text"
              placeholder="Add details, bill numbers, etc..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="modal-save-expense-btn"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer active:scale-95 group"
            >
              <Save className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5" />
              <span>{editingItem ? 'Update' : 'Save'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
