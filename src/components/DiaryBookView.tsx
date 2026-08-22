import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Search,
  Filter,
  CreditCard,
  Tag,
  Clock,
  Sparkles,
  ShoppingBag,
  ArrowUpDown,
  BookOpen,
} from 'lucide-react';
import { DayLedger, ExpenseItem, Language, ExpenseCategory, PaymentMethod } from '../types';
import { translations, categoryMeta, paymentMeta } from '../utils/translations';
import { formatCurrency } from '../utils/calculator';

interface DiaryBookViewProps {
  ledgers: DayLedger[];
  language: Language;
  currency: string;
  onAddForDate: (dateStr: string) => void;
  onEditItem: (item: ExpenseItem) => void;
  onDeleteItem: (id: string) => void;
  selectedCategoryFilter: ExpenseCategory | null;
  onSelectCategoryFilter: (category: ExpenseCategory | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const DiaryBookView: React.FC<DiaryBookViewProps> = ({
  ledgers,
  language,
  currency,
  onAddForDate,
  onEditItem,
  onDeleteItem,
  selectedCategoryFilter,
  onSelectCategoryFilter,
  searchQuery,
  onSearchChange,
}) => {
  const t = translations[language];
  const [activeDateFilter, setActiveDateFilter] = useState<'all' | 'withExpenses' | 'todayOnly'>('all');
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc');

  // Filter ledgers based on search, category, and date filter
  const filteredLedgers = ledgers
    .map((ledger) => {
      let items = ledger.items;

      if (selectedCategoryFilter) {
        items = items.filter((item) => item.category === selectedCategoryFilter);
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        items = items.filter(
          (item) =>
            item.itemName.toLowerCase().includes(q) ||
            (item.notes && item.notes.toLowerCase().includes(q))
        );
      }

      const filteredTotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

      return {
        ...ledger,
        items,
        totalAmount: filteredTotal,
      };
    })
    .filter((ledger) => {
      if (activeDateFilter === 'withExpenses') {
        return ledger.items.length > 0;
      }
      if (activeDateFilter === 'todayOnly') {
        return ledger.isToday;
      }
      return true;
    });

  const displayLedgers = sortBy === 'desc' ? [...filteredLedgers].reverse() : filteredLedgers;
  const totalFilteredAmount = displayLedgers.reduce((acc, l) => acc + l.totalAmount, 0);
  const totalFilteredItems = displayLedgers.reduce((acc, l) => acc + l.items.length, 0);

  return (
    <div id="diary-book-view-container" className="space-y-4">
      {/* Diary Control & Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        {/* Left: Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            id="diary-search-input"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 p-0.5"
            >
              ✕
            </button>
          )}
        </div>

        {/* Center: Quick Filter tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveDateFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeDateFilter === 'all'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            सभी तारीखें (1-31)
          </button>
          <button
            onClick={() => setActiveDateFilter('withExpenses')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeDateFilter === 'withExpenses'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            केवल दर्ज खर्च वाले दिन
          </button>
          <button
            onClick={() => setActiveDateFilter('todayOnly')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer !text-[#ff0000] ${
              activeDateFilter === 'todayOnly'
                ? 'bg-white shadow-sm font-bold'
                : 'hover:bg-slate-200/50'
            }`}
          >
            आज का कॉलम
          </button>
        </div>

        {/* Right: Sort toggle & stats */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSortBy(sortBy === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
            title="तारीख का क्रम बदलें"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortBy === 'asc' ? 'तारीख 1 → 31' : 'तारीख 31 → 1'}</span>
          </button>

          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800">
            {totalFilteredItems} सामान • <span className="font-mono">{formatCurrency(totalFilteredAmount, currency)}</span>
          </div>
        </div>
      </div>

      {/* Date Columns Container - Styled like a real Bahi-Khata / Ruled Ledger Diary */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {displayLedgers.map((ledger) => {
          const hasItems = ledger.items.length > 0;

          return (
            <div
              key={ledger.date}
              id={`date-column-${ledger.date}`}
              className={`rounded-2xl border flex flex-col justify-between shadow-sm transition-opacity ${
                ledger.isToday
                  ? 'bg-white border-slate-200 opacity-100'
                  : hasItems
                  ? 'bg-white border-slate-200 opacity-90'
                  : 'bg-white border-slate-200 opacity-70'
              }`}
            >
              {/* Date Column Header (डायरी तारीख हेडर) */}
              <div className={`p-4 border-b flex items-center justify-between rounded-t-2xl ${
                ledger.isToday
                  ? 'bg-emerald-50/50 border-slate-100'
                  : 'bg-slate-50/50 border-slate-100'
              }`}>
                {/* Date badge and day name */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-700">
                      {ledger.date}
                    </h3>
                    {ledger.isToday && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-widest">
                        Today
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">{ledger.dayName}</p>
                </div>

                {/* Day Total Amount badge */}
                <div className="text-right">
                  <div className={`text-xl font-bold font-mono tracking-tight ${
                    ledger.totalAmount > 0 ? (ledger.isToday ? 'text-emerald-600' : 'text-slate-800') : 'text-slate-400'
                  }`}>
                    {formatCurrency(ledger.totalAmount, currency)}
                  </div>
                </div>
              </div>

              {/* Items Ruled List (खरीदे गए सामान की सूची) */}
              <div className="p-4 flex-1 space-y-3">
                {!hasItems ? (
                  <div className="py-6 text-center">
                    <p className="text-xs text-slate-400 font-medium italic mb-3">
                      {t.noExpensesThisDay}
                    </p>
                    <button
                      onClick={() => onAddForDate(ledger.date)}
                      className="text-xs text-slate-600 hover:text-slate-900 font-bold bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.clickToAdd}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ledger.items.map((item, idx) => {
                      const cat = categoryMeta[item.category] || categoryMeta.other;
                      const pay = paymentMeta[item.paymentMethod] || paymentMeta.other;

                      return (
                        <div
                          key={item.id}
                          className="group flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-transparent hover:border-slate-200 transition-colors"
                        >
                          {/* Item details */}
                          <div className="flex-1 min-w-0 pr-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-slate-800 truncate">
                                {item.itemName}
                              </span>
                              {item.time && (
                                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                                  {item.time}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                {language === 'hi' ? cat.nameHi : language === 'hinglish' ? cat.nameHinglish : cat.nameEn}
                              </span>
                              {item.notes && (
                                <span className="text-[10px] text-slate-500 italic truncate max-w-[120px]" title={item.notes}>
                                  {item.notes}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Amount and Action buttons */}
                          <div className="text-right shrink-0 flex flex-col items-end gap-1">
                            <div className="text-sm font-bold text-slate-900 font-mono">
                              {formatCurrency(item.amount, currency)}
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => onEditItem(item)}
                                className="text-slate-400 hover:text-slate-700 transition cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(t.confirmDelete)) {
                                    onDeleteItem(item.id);
                                  }
                                }}
                                className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom Card Footer: Quick "+ सामान जोड़ें" button for this date */}
              <div className={`p-4 border-t rounded-b-2xl flex items-center justify-between ${ledger.isToday ? 'bg-emerald-50/50 border-slate-100' : 'bg-slate-50/50 border-slate-100'}`}>
                <span className="text-xs text-slate-500 font-medium">
                  {ledger.items.length} {t.totalItems}
                </span>

                <button
                  onClick={() => onAddForDate(ledger.date)}
                  className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Entry</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
