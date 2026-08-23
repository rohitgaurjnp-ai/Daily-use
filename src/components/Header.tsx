import React from 'react';
import {
  BookOpen,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Printer,
  Share2,
  Table as TableIcon,
  Calculator,
  Languages,
  Settings,
  PlusCircle,
} from 'lucide-react';
import { Language, ViewMode } from '../types';
import { translations } from '../utils/translations';
import { getMonthName as getCalMonthName } from '../utils/calculator';

interface HeaderProps {
  currentYear: number;
  currentMonth: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
  onSelectMonthYear: (year: number, month: number) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenAddModal: () => void;
  onOpenWhatsAppModal: () => void;
  onExportCsv: () => void;
  onPrint: () => void;
  onOpenSettings: () => void;
  totalMonthExpense: number;
  currency: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentYear,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
  onSelectMonthYear,
  language,
  onLanguageChange,
  viewMode,
  onViewModeChange,
  onOpenAddModal,
  onOpenWhatsAppModal,
  onExportCsv,
  onPrint,
  onOpenSettings,
  totalMonthExpense,
  currency,
}) => {
  const t = translations[language];
  const monthDisplay = getCalMonthName(currentMonth, language);

  return (
    <header className="bg-white sticky top-0 z-30">
      <div className="max-w-3xl mx-auto px-4 py-4 flex flex-col gap-3">
        {/* Row 1: Brand / Title */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-11 h-11 rounded-[14px] bg-[#0f172a] text-white flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
            <BookOpen className="w-5 h-5" />
          </div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#334155] leading-none transition-colors duration-300 group-hover:text-emerald-600">
            {t.appName}
          </h1>
        </div>

        {/* Row 2: Month Navigator & Today */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#d1d5db] rounded-full px-1 py-0.5 shadow-inner">
            <button
              onClick={onPrevMonth}
              className="p-1 hover:bg-slate-300 rounded-full text-slate-700 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-2 text-sm font-bold text-slate-800">
              {monthDisplay} {currentYear}
            </div>
            <button
              onClick={onNextMonth}
              className="p-1 hover:bg-slate-300 rounded-full text-slate-700 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={onGoToToday}
            className="text-[11px] font-bold bg-[#e5e7eb] text-slate-700 hover:bg-slate-300 px-3 py-1 rounded-full transition shadow-inner border border-[#d1d5db]"
          >
            आज (Today)
          </button>
        </div>

        {/* Row 3: Actions */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none pb-1">
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-50 rounded-lg p-0.5 border border-slate-200 text-[11px] font-bold">
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-1 rounded-md transition ${
                  language === 'hi' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => onLanguageChange('hinglish')}
                className={`px-2 py-1 rounded-md transition ${
                  language === 'hinglish' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                }`}
              >
                Hinglish
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 rounded-md transition ${
                  language === 'en' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={onOpenWhatsAppModal}
              className="p-1.5 text-emerald-500 bg-emerald-50 border border-emerald-100 rounded-lg transition hover:bg-emerald-100 group"
            >
              <Share2 className="w-4 h-4 transition-transform group-hover:scale-110 group-hover:-rotate-12" />
            </button>
            <button
              onClick={onPrint}
              className="p-1.5 text-slate-500 bg-slate-100 border border-slate-200 rounded-lg transition hover:bg-slate-200 group"
            >
              <Printer className="w-4 h-4 transition-transform group-hover:scale-110 group-hover:-translate-y-0.5" />
            </button>
            <button
              onClick={onOpenSettings}
              className="p-1.5 text-[#ff0000] bg-red-50 border border-red-100 rounded-lg transition hover:bg-red-100 group"
            >
              <Settings className="w-4 h-4 transition-transform group-hover:rotate-90 duration-500" />
            </button>
          </div>
          <button
            onClick={onOpenAddModal}
            className="shrink-0 bg-[#0f172a] hover:bg-slate-800 text-white text-[11px] font-bold px-4 py-1.5 rounded-[14px] transition flex flex-col items-center justify-center leading-tight shadow-md group"
          >
            <div className="flex items-center gap-1">
              <PlusCircle className="w-3 h-3 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-180" />
              <span>Add</span>
            </div>
            <span>Expense</span>
          </button>
        </div>

        {/* Row 4: View Tabs */}
        <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-[10px] sm:text-xs font-bold text-slate-500 mt-1">
          <button
            onClick={() => onViewModeChange('diary')}
            className={`flex flex-col items-center gap-0.5 px-2 sm:px-3 py-1.5 rounded-xl transition ${
              viewMode === 'diary'
                ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                : 'hover:text-slate-800'
            }`}
          >
            <span>Diary</span>
            <span>Book</span>
          </button>
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
          <button
            onClick={() => onViewModeChange('table')}
            className={`flex flex-col items-center gap-0.5 px-2 sm:px-3 py-1.5 rounded-xl transition ${
              viewMode === 'table'
                ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                : 'hover:text-slate-800'
            }`}
          >
            <span>Table</span>
            <span>Sheet</span>
          </button>
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
          <button
            onClick={() => onViewModeChange('calendar')}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl transition ${
              viewMode === 'calendar'
                ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                : 'hover:text-slate-800'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
          <button
            onClick={() => onViewModeChange('analytics')}
            className={`flex flex-col items-center gap-0.5 px-2 sm:px-3 py-1.5 rounded-xl transition ${
              viewMode === 'analytics'
                ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                : 'hover:text-slate-800'
            }`}
          >
            <span>Calculator</span>
            <span>& Analytics</span>
          </button>
        </div>
      </div>
      
      {/* Row 5: Total Monthly Expense */}
      <div className="border-t border-slate-100 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {t.totalMonthlyExpense}:
          </span>
          <span className="text-sm font-bold text-emerald-600">
            {currency}{totalMonthExpense.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </header>
  );
};
