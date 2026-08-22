import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Calculator,
  Share2,
  Download,
  Calendar,
  Wallet,
  Settings,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  ExpenseItem,
  Language,
  ViewMode,
  ExpenseCategory,
  DayLedger,
  MonthSummary,
} from './types';
import { generateInitialData } from './data/defaultData';
import {
  buildDayLedgers,
  calculateMonthSummary,
  exportToCSV,
  getTodayKey,
} from './utils/calculator';
import { translations } from './utils/translations';
import { Header } from './components/Header';
import { MonthlySummaryCalculator } from './components/MonthlySummaryCalculator';
import { QuickAddBar } from './components/QuickAddBar';
import { DiaryBookView } from './components/DiaryBookView';
import { TableView } from './components/TableView';
import { CalendarMonthView } from './components/CalendarMonthView';
import { AnalyticsView } from './components/AnalyticsView';
import { AddExpenseModal } from './components/AddExpenseModal';
import { BudgetSettingsModal } from './components/BudgetSettingsModal';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { MiniCalculator } from './components/MiniCalculator';
import { ReceiptPrintView } from './components/ReceiptPrintView';

const STORAGE_KEY = 'daily_expense_diary_items_v1';
const BUDGET_KEY = 'daily_expense_diary_budget_v1';
const CURRENCY_KEY = 'daily_expense_diary_currency_v1';
const LANG_KEY = 'daily_expense_diary_lang_v1';

export default function App() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0-11
  const [language, setLanguage] = useState<Language>('hi');
  const [viewMode, setViewMode] = useState<ViewMode>('diary');
  const [currency, setCurrency] = useState<string>('₹');
  const [budget, setBudget] = useState<number>(15000);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<ExpenseCategory | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);
  const [addModalInitialDate, setAddModalInitialDate] = useState<string>(getTodayKey());
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState<boolean>(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState<boolean>(false);

  // Floating Mini Calculator Modal
  const [isFloatingCalculatorOpen, setIsFloatingCalculatorOpen] = useState<boolean>(false);
  const [calcCallback, setCalcCallback] = useState<((val: number) => void) | null>(null);

  // Expenses State initialized with localStorage or rich default realistic data
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load from storage', e);
    }
    return generateInitialData();
  });

  // Load other preferences
  useEffect(() => {
    try {
      const savedBudget = localStorage.getItem(BUDGET_KEY);
      if (savedBudget) setBudget(Number(savedBudget) || 0);

      const savedCurrency = localStorage.getItem(CURRENCY_KEY);
      if (savedCurrency) setCurrency(savedCurrency);

      const savedLang = localStorage.getItem(LANG_KEY);
      if (savedLang && (savedLang === 'hi' || savedLang === 'hinglish' || savedLang === 'en')) {
        setLanguage(savedLang as Language);
      }
    } catch (e) {
      console.error('Failed to load config', e);
    }
  }, []);

  // Save expenses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (e) {
      console.error('Failed to save to storage', e);
    }
  }, [expenses]);

  // Handlers for month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleGoToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
  };

  const handleSelectMonthYear = (y: number, m: number) => {
    setCurrentYear(y);
    setCurrentMonth(m);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem(LANG_KEY, lang);
  };

  const handleSaveBudget = (newBudget: number) => {
    setBudget(newBudget);
    localStorage.setItem(BUDGET_KEY, String(newBudget));
  };

  const handleSaveCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
    localStorage.setItem(CURRENCY_KEY, newCurrency);
  };

  // Add / Edit / Delete Expense operations
  const handleAddExpense = (
    itemData: Omit<ExpenseItem, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    if (editingId) {
      // Edit existing
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...itemData,
              }
            : item
        )
      );
    } else {
      // Create new
      const newItem: ExpenseItem = {
        ...itemData,
        id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: Date.now(),
      };
      setExpenses((prev) => [newItem, ...prev]);

      // If user added item into a different month, switch to that month so they see it
      if (itemData.date) {
        const [y, m] = itemData.date.split('-').map(Number);
        if (y && m) {
          setCurrentYear(y);
          setCurrentMonth(m - 1);
        }
      }
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOpenAddForDate = (dateStr: string) => {
    setEditingItem(null);
    setAddModalInitialDate(dateStr);
    setIsAddModalOpen(true);
  };

  const handleOpenEditItem = (item: ExpenseItem) => {
    setEditingItem(item);
    setAddModalInitialDate(item.date);
    setIsAddModalOpen(true);
  };

  const handleOpenMiniCalc = (onUse?: (val: number) => void) => {
    if (onUse) {
      setCalcCallback(() => onUse);
    } else {
      setCalcCallback(null);
    }
    setIsFloatingCalculatorOpen(true);
  };

  const handleRestoreData = (restored: ExpenseItem[]) => {
    setExpenses(restored);
  };

  const handleClearAllData = () => {
    setExpenses([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    exportToCSV(expenses, currentYear, currentMonth);
  };

  // Build computed data
  const ledgers: DayLedger[] = useMemo(() => {
    return buildDayLedgers(expenses, currentYear, currentMonth, language);
  }, [expenses, currentYear, currentMonth, language]);

  const monthSummary: MonthSummary = useMemo(() => {
    return calculateMonthSummary(expenses, currentYear, currentMonth, budget, language);
  }, [expenses, currentYear, currentMonth, budget, language]);

  const t = translations[language];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans overflow-x-hidden">
      {/* Navigation Header */}
      <Header
        currentYear={currentYear}
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onGoToToday={handleGoToToday}
        onSelectMonthYear={handleSelectMonthYear}
        language={language}
        onLanguageChange={handleLanguageChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenAddModal={() => {
          setEditingItem(null);
          setAddModalInitialDate(getTodayKey());
          setIsAddModalOpen(true);
        }}
        onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
        onExportCsv={handleExportCsv}
        onPrint={handlePrint}
        onOpenSettings={() => setIsBudgetModalOpen(true)}
        totalMonthExpense={monthSummary.totalExpenses}
        currency={currency}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 print:hidden">
        {/* Quick Add Bar for instant entry */}
        <QuickAddBar
          onAddExpense={handleAddExpense}
          language={language}
          currency={currency}
          defaultDate={getTodayKey()}
          onOpenMiniCalculator={handleOpenMiniCalc}
        />

        {/* Monthly Summary & Calculator Component */}
        <MonthlySummaryCalculator
          summary={monthSummary}
          language={language}
          currency={currency}
          onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
          onOpenMiniCalculator={() => handleOpenMiniCalc()}
          onSelectCategoryFilter={setSelectedCategoryFilter}
          selectedCategoryFilter={selectedCategoryFilter}
        />

        {/* Active View: Diary Columns / Table / Calendar / Analytics */}
        {viewMode === 'diary' && (
          <DiaryBookView
            ledgers={ledgers}
            language={language}
            currency={currency}
            onAddForDate={handleOpenAddForDate}
            onEditItem={handleOpenEditItem}
            onDeleteItem={handleDeleteExpense}
            selectedCategoryFilter={selectedCategoryFilter}
            onSelectCategoryFilter={setSelectedCategoryFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {viewMode === 'table' && (
          <TableView
            expenses={expenses}
            language={language}
            currency={currency}
            onEditItem={handleOpenEditItem}
            onDeleteItem={handleDeleteExpense}
            onOpenAddModal={() => {
              setEditingItem(null);
              setAddModalInitialDate(getTodayKey());
              setIsAddModalOpen(true);
            }}
            onExportCsv={handleExportCsv}
            year={currentYear}
            month={currentMonth}
          />
        )}

        {viewMode === 'calendar' && (
          <CalendarMonthView
            year={currentYear}
            month={currentMonth}
            ledgers={ledgers}
            language={language}
            currency={currency}
            onSelectDate={(d) => handleOpenAddForDate(d)}
            onAddForDate={handleOpenAddForDate}
          />
        )}

        {viewMode === 'analytics' && (
          <AnalyticsView
            summary={monthSummary}
            ledgers={ledgers}
            language={language}
            currency={currency}
            onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
          />
        )}
      </main>

      {/* Printable Ledger Sheet Component (Shows only during window.print()) */}
      <ReceiptPrintView
        summary={monthSummary}
        ledgers={ledgers}
        language={language}
        currency={currency}
      />

      {/* Floating Action Button on Mobile */}
      <button
        id="floating-add-btn"
        onClick={() => {
          setEditingItem(null);
          setAddModalInitialDate(getTodayKey());
          setIsAddModalOpen(true);
        }}
        className="sm:hidden fixed bottom-5 right-5 w-14 h-14 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl flex items-center justify-center z-40 active:scale-95 transition"
        title={t.addExpense}
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Add / Edit Expense Modal */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddExpense}
        initialDate={addModalInitialDate}
        editingItem={editingItem}
        language={language}
        currency={currency}
      />

      {/* Budget & Settings Modal */}
      <BudgetSettingsModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        budget={budget}
        onSaveBudget={handleSaveBudget}
        currency={currency}
        onSaveCurrency={handleSaveCurrency}
        expenses={expenses}
        onRestoreData={handleRestoreData}
        onClearAll={handleClearAllData}
        language={language}
      />

      {/* WhatsApp Share Modal */}
      <WhatsAppShareModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        summary={monthSummary}
        ledgers={ledgers}
        language={language}
        currency={currency}
      />

      {/* Floating Standalone Calculator Modal */}
      {isFloatingCalculatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="animate-fadeIn">
            <MiniCalculator
              onUseResult={(val) => {
                if (calcCallback) {
                  calcCallback(val);
                }
                setIsFloatingCalculatorOpen(false);
              }}
              onClose={() => setIsFloatingCalculatorOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          <p className="font-bold text-slate-700">
            दैनिक खर्च डायरी बहीखाता (Daily Expense Diary & Monthly Calculator)
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            हर दिन की खरीदारी और मासिक हिसाब-किताब का सुरक्षित डिजिटल बहीखाता
          </p>
        </div>
      </footer>
    </div>
  );
}
