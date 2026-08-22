import React from 'react';
import { Plus, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { DayLedger, ExpenseItem, Language } from '../types';
import { translations, categoryMeta } from '../utils/translations';
import { formatCurrency, getDaysInMonth, formatDateToKey } from '../utils/calculator';

interface CalendarMonthViewProps {
  year: number;
  month: number;
  ledgers: DayLedger[];
  language: Language;
  currency: string;
  onSelectDate: (dateStr: string) => void;
  onAddForDate: (dateStr: string) => void;
}

export const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  year,
  month,
  ledgers,
  language,
  currency,
  onSelectDate,
  onAddForDate,
}) => {
  const t = translations[language];

  // Map ledgers by day number
  const ledgerMap: Record<number, DayLedger> = {};
  ledgers.forEach((l) => {
    ledgerMap[l.dayNumber] = l;
  });

  const totalDays = getDaysInMonth(year, month);
  // Get start day of month (0 = Sun, 1 = Mon...)
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const weekdaysHi = ['रवि (Sun)', 'सोम (Mon)', 'मंगल (Tue)', 'बुध (Wed)', 'गुरु (Thu)', 'शुक्र (Fri)', 'शनि (Sat)'];
  const weekdaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekdays = language === 'hi' ? weekdaysHi : weekdaysEn;

  // Max spend day for color intensity calculation
  const maxDaySpend = Math.max(...ledgers.map((l) => l.totalAmount), 1);

  return (
    <div id="calendar-month-view-container" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-800 font-sans">
            Monthly Expense Calendar
          </h3>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
            Select any date to view or add expenses
          </p>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider pb-2">
        {weekdays.map((w, idx) => (
          <div key={idx} className="py-2 bg-slate-50 rounded-lg border border-slate-100">
            {w}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {/* Leading empty spaces */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[90px] sm:min-h-[110px] bg-slate-50/40 rounded-xl border border-dashed border-slate-200/60 opacity-40" />
        ))}

        {/* Days 1 to totalDays */}
        {Array.from({ length: totalDays }).map((_, i) => {
          const dayNum = i + 1;
          const ledger = ledgerMap[dayNum];
          const hasExpenses = ledger && ledger.items.length > 0;
          const isToday = ledger?.isToday;
          const ratio = ledger ? ledger.totalAmount / maxDaySpend : 0;

          return (
            <div
              key={`day-${dayNum}`}
              onClick={() => ledger && onSelectDate(ledger.date)}
              className={`min-h-[90px] sm:min-h-[110px] p-3 rounded-xl border flex flex-col justify-between transition-all cursor-pointer group relative overflow-hidden ${
                isToday
                  ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                  : hasExpenses
                  ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  : 'bg-slate-50/50 border-transparent hover:border-slate-200 hover:bg-white'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <span className={`text-xs sm:text-sm font-bold font-mono px-2 py-1 rounded-lg ${
                  isToday ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 bg-slate-100 group-hover:bg-slate-200 transition-colors'
                }`}>
                  {dayNum}
                </span>

                {hasExpenses && (
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden sm:inline">
                    {ledger.items.length} {t.totalItems}
                  </span>
                )}
              </div>

              {/* Middle Items preview */}
              <div className="my-2 space-y-1 overflow-hidden">
                {hasExpenses ? (
                  ledger.items.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      className="text-[10px] truncate text-slate-600 font-medium bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100"
                    >
                      {item.itemName}
                    </div>
                  ))
                ) : (
                  <span className="text-[10px] text-slate-300 font-medium italic sm:block hidden">No Expenses</span>
                )}
                {ledger && ledger.items.length > 2 && (
                  <div className="text-[10px] text-emerald-600 font-bold">
                    +{ledger.items.length - 2} more
                  </div>
                )}
              </div>

              {/* Bottom total */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className={`text-xs sm:text-sm font-bold font-mono ${
                  hasExpenses ? 'text-emerald-700' : 'text-slate-300'
                }`}>
                  {ledger && ledger.totalAmount > 0
                    ? formatCurrency(ledger.totalAmount, currency)
                    : '₹0'}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (ledger) onAddForDate(ledger.date);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-slate-900 bg-white rounded-lg border border-slate-200 shadow-sm transition-all"
                  title="Add Expense"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
