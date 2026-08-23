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
    <div className="bg-[#e2e8f0] p-4 sm:p-5 rounded-[24px] mb-6 mx-2 sm:mx-0 shadow-inner">
      <div id="quick-add-bar-container" className="bg-white rounded-[20px] p-4 sm:p-5 shadow-sm relative">
        {/* Floating Add Note Badge? Actually let's just make the header look like the screenshot */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-700">
            Quick Daily Expense Entry
          </span>
        </div>

        {/* Main Form Fields Grid */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Picker */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
              DATE
            </label>
            <input
              type="date"
              id="quick-add-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#f1f5f9] border-none rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-slate-300 transition-colors"
              required
            />
          </div>

          {/* Item Name (Kya Kharida) */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
              ITEM NAME
            </label>
            <input
              type="text"
              id="quick-add-item-name"
              placeholder="What did you buy? (e.g. Milk, Cab, Petrol)"
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
                if (error) setError('');
              }}
              className="w-full bg-[#f1f5f9] border-none rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-300 transition-colors"
              required
            />
          </div>

          {/* Amount (Rupaye) with integrated calc button */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 flex items-center justify-between uppercase tracking-wider">
              <span>AMOUNT</span>
              <button
                type="button"
                onClick={() => onOpenMiniCalculator((val) => setAmount(String(val)))}
                className="text-emerald-500 hover:text-emerald-600 bg-emerald-50 p-1 rounded-md cursor-pointer"
                title="कैलकुलेटर खोलें"
              >
                <Calculator className="w-3 h-3" />
              </button>
            </label>
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
              className="w-full bg-[#f1f5f9] border-none rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-300 transition-colors"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              id="quick-add-submit-btn"
              className="w-full bg-[#0f172a] hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition text-sm flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-md"
            >
              <span>+ Add</span>
            </button>
          </div>

          {/* Secondary Row: Category, Payment Mode, and Notes toggle */}
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
            {/* Category Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500">Category:</span>
              <select
                id="quick-add-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="bg-[#f8fafc] border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-600 focus:outline-hidden cursor-pointer"
              >
                {Object.entries(categoryMeta).map(([catKey, meta]) => (
                  <option key={catKey} value={catKey}>
                    {language === 'hi' ? meta.nameHi : language === 'hinglish' ? meta.nameHinglish : meta.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-slate-500 mr-1">Mode:</span>
                {(['upi', 'cash', 'card', 'udhar'] as PaymentMethod[]).map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    onClick={() => setPaymentMethod(mode)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                      paymentMethod === mode
                        ? 'bg-[#0f172a] text-white border-[#0f172a]'
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
                className="text-[10px] text-emerald-500 font-bold hover:text-emerald-600 cursor-pointer"
              >
                {showExtra ? 'Remove Note' : '+ Add Note'}
              </button>
            </div>

            {error && (
              <span className="text-xs text-rose-500 font-bold bg-rose-50 px-2 py-1 rounded-md border border-rose-200 inline-block mt-1">
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
                className="w-full bg-[#f1f5f9] border-none rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-300"
              />
            </div>
          )}
        </form>
        
        {/* Big Floating Action Button overlaid at bottom right */}
        <button
          onClick={() => document.getElementById('primary-add-expense-btn')?.click()}
          className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#0f172a] text-white rounded-full flex items-center justify-center shadow-xl hover:bg-slate-800 hover:scale-110 transition-all duration-300 active:scale-95 group"
        >
          <Plus className="w-6 h-6 transition-transform duration-500 group-hover:rotate-180" />
        </button>
      </div>
    </div>
  );
};
