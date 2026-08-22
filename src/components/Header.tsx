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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800 font-sans">
                {t.appName}
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                बहीखाता डायरी
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Daily Purchase & Monthly Expense Tracker
            </p>
          </div>
        </div>

        {/* Center: Month Navigator */}
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-sm">
          <button
            id="prev-month-btn"
            onClick={onPrevMonth}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition active:scale-95"
            title="पिछला महीना (Previous Month)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="px-2.5 sm:px-4 py-0.5 text-center">
            <div className="text-sm font-bold text-slate-800 font-sans flex items-center gap-1">
              <span>{monthDisplay}</span>
              <span>{currentYear}</span>
            </div>
          </div>

          <button
            id="next-month-btn"
            onClick={onNextMonth}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition active:scale-95"
            title="अगला महीना (Next Month)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            id="today-btn"
            onClick={onGoToToday}
            className="ml-1 text-[11px] font-semibold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg transition shadow-sm"
          >
            आज (Today)
          </button>
        </div>

        {/* Right: Quick Actions & Language */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-1 rounded-md font-medium transition ${
                language === 'hi'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => onLanguageChange('hinglish')}
              className={`px-2 py-1 rounded-md font-medium transition ${
                language === 'hinglish'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hinglish
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded-md font-medium transition ${
                language === 'en'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
          </div>

          {/* Share WhatsApp */}
          <button
            id="whatsapp-share-btn"
            onClick={onOpenWhatsAppModal}
            className="p-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
            title={t.shareWhatsApp}
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Print/PDF */}
          <button
            id="print-ledger-btn"
            onClick={onPrint}
            className="p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition"
            title={t.exportPdf}
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            id="settings-btn"
            onClick={onOpenSettings}
            className="p-2 !text-[#ff0000] bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition"
            title={t.settings}
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Big Add Expense Button */}
          <button
            id="primary-add-expense-btn"
            onClick={onOpenAddModal}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.addExpense}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-bar: View Selector */}
      <div className="bg-white border-t border-slate-100 px-3 sm:px-6 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          {/* View Mode Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium">
            <button
              id="view-tab-diary"
              onClick={() => onViewModeChange('diary')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'diary'
                  ? 'bg-white text-slate-900 font-bold shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.diaryView}</span>
            </button>

            <button
              id="view-tab-table"
              onClick={() => onViewModeChange('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 font-bold shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>{t.tableView}</span>
            </button>

            <button
              id="view-tab-calendar"
              onClick={() => onViewModeChange('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white text-slate-900 font-bold shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{t.calendarView}</span>
            </button>

            <button
              id="view-tab-analytics"
              onClick={() => onViewModeChange('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'analytics'
                  ? 'bg-white text-slate-900 font-bold shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{t.analyticsView}</span>
            </button>
          </div>

          {/* Quick Header Stat badge */}
          <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
            <span className="uppercase tracking-widest">{t.totalMonthlyExpense}:</span>
            <span className="text-sm sm:text-base font-bold text-emerald-600 font-mono">
              {currency}{totalMonthExpense.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
