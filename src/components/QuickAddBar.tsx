import React, { useState } from 'react';
import { Plus, Calculator, Zap, Calendar as CalendarIcon, Tag, Check, Sparkles } from 'lucide-react';
import { ExpenseCategory, PaymentMethod, Language, ExpenseItem } from '../types';
import { translations, categoryMeta, quickSuggestions } from '../utils/translations';
import { getTodayKey } from '../utils/calculator';

interface QuickAddBarProps {
  onAddExpense: (item: Omit<ExpenseItem, 'id' | 'createdAt'>) => void;
  language: Language;
  currency: string;
  defaultDate?: string;
  onOpenMiniCalculator: (onUse: (val: number) => void) => void;
}

export const QuickAddBar: React.FC<QuickAddBarProps> = ({
  onAddExpense,
  language,
  currency,
  defaultDate,
  onOpenMiniCalculator,
}) => {
  const t = translations[language];
  const todayKey = getTodayKey();

  const [date, setDate] = useState<string>(defaultDate || todayKey);
  const [itemName, setItemName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('groceries');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [notes, setNotes] = useState<string>('');
  const [showExtra, setShowExtra] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!itemName.trim()) {
      setError('कृपया सामान का नाम लिखें');
      return;
    }
    const numAmt = parseFloat(amount);
    if (isNaN(numAmt) || numAmt <= 0) {
      setError('कृपया सही रकम भरें');
      return;
    }

    onAddExpense({
      date: date || todayKey,
      itemName: itemName.trim(),
      amount: Math.round(numAmt * 100) / 100,
      category,
      paymentMethod,
      notes: notes.trim() || undefined,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
    });

    // Reset inputs
    setItemName('');
    setAmount('');
    setNotes('');
    setError('');
  };

  const handleQuickChipClick = (suggestion: typeof quickSuggestions[0]) => {
    const chipName = language === 'hi' ? suggestion.nameHi : language === 'hinglish' ? suggestion.nameHinglish : suggestion.name;
    setItemName(chipName);
    setCategory(suggestion.category);
    if (suggestion.defaultAmount) {
      setAmount(String(suggestion.defaultAmount));
    }
  };

  return (
    <div id="quick-add-bar-container" className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">
      {/* Header text */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-slate-800 font-sans">
            Quick Daily Expense Entry
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          तारीख चुनें, सामान का नाम व रकम लिखकर डायरी में दर्ज करें
        </span>
      </div>

      {/* Main Form Fields Grid */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
          {/* Date Picker */}
          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="quick-add-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Item Name (Kya Kharida) */}
          <div className="sm:col-span-5">
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              Item Name
            </label>
            <input
              type="text"
              id="quick-add-item-name"
              placeholder={t.quickAddPlaceholder}
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
                if (error) setError('');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors"
              required
            />
          </div>

          {/* Amount (Rupaye) with integrated calc button */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center justify-between uppercase tracking-wider">
              <span>Amount</span>
              <button
                type="button"
                onClick={() => onOpenMiniCalculator((val) => setAmount(String(val)))}
                className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-0.5 cursor-pointer"
                title="कैलकुलेटर खोलें"
              >
                <Calculator className="w-3 h-3" />
              </button>
            </label>
            <div className="relative">
              <input
                type="number"
                id="quick-add-amount"
                placeholder="0.00"
                min="0.1"
                step="any"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (error) setError('');
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold text-emerald-600 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              id="quick-add-submit-btn"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-3 rounded-xl transition text-sm flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <span>+ Add</span>
            </button>
          </div>
        </div>

        {/* Secondary Row: Category, Payment Mode, and Notes toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {/* Category Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Category:</span>
              <select
                id="quick-add-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-700 focus:outline-hidden cursor-pointer"
              >
                {Object.entries(categoryMeta).map(([catKey, meta]) => (
                  <option key={catKey} value={catKey}>
                    {language === 'hi' ? meta.nameHi : language === 'hinglish' ? meta.nameHinglish : meta.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-slate-500 ml-2">Mode:</span>
              {(['upi', 'cash', 'card', 'udhar'] as PaymentMethod[]).map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setPaymentMethod(mode)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition cursor-pointer ${
                    paymentMethod === mode
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {mode === 'upi' ? 'UPI' : mode === 'cash' ? 'Cash' : mode === 'card' ? 'Card' : 'Credit'}
                </button>
              ))}
            </div>

            {/* Extra notes toggle */}
            <button
              type="button"
              onClick={() => setShowExtra(!showExtra)}
              className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium ml-2 cursor-pointer"
            >
              {showExtra ? 'Remove Note' : '+ Add Note'}
            </button>
          </div>

          {error && (
            <span className="text-xs text-rose-500 font-medium bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              {error}
            </span>
          )}
        </div>

        {/* Optional Notes Input */}
        {showExtra && (
          <div className="pt-2">
            <input
              type="text"
              placeholder="Add details, bill numbers, etc..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}

        {/* Quick Suggestion Chips (1-Click Fill) */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 scrollbar-thin">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Frequent:</span>
          </span>
          {quickSuggestions.slice(0, 6).map((item, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => handleQuickChipClick(item)}
              className="shrink-0 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full transition shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>{language === 'hi' ? item.nameHi : language === 'hinglish' ? item.nameHinglish : item.name}</span>
              <span className="font-mono text-emerald-600 font-bold">₹{item.defaultAmount}</span>
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};
