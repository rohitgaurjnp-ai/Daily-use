import React from 'react';
import {
  Calculator,
  TrendingUp,
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  DollarSign,
  Wallet,
  Sparkles,
  ShoppingBag,
  ArrowUpRight,
  Plus,
} from 'lucide-react';
import { MonthSummary, Language, ExpenseCategory, PaymentMethod } from '../types';
import { translations, categoryMeta, paymentMeta } from '../utils/translations';
import { formatCurrency } from '../utils/calculator';

interface MonthlySummaryCalculatorProps {
  summary: MonthSummary;
  language: Language;
  currency: string;
  onOpenBudgetModal: () => void;
  onOpenMiniCalculator: () => void;
  onSelectCategoryFilter?: (category: ExpenseCategory | null) => void;
  selectedCategoryFilter?: ExpenseCategory | null;
}

export const MonthlySummaryCalculator: React.FC<MonthlySummaryCalculatorProps> = ({
  summary,
  language,
  currency,
  onOpenBudgetModal,
  onOpenMiniCalculator,
  onSelectCategoryFilter,
  selectedCategoryFilter,
}) => {
  const t = translations[language];

  const isOverBudget = summary.budget > 0 && summary.totalExpenses > summary.budget;
  const budgetPercentage = summary.budget > 0 ? (summary.totalExpenses / summary.budget) * 100 : 0;

  // Sort categories by highest spend
  const sortedCategories = (Object.entries(summary.categoryTotals) as [ExpenseCategory, number][])
    .filter(([_, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div id="monthly-summary-calculator" className="bg-slate-900 text-white rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
      {/* Decorative Gradient Blob (Optional for 'sleek') */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mt-32 -mr-32"></div>

      {/* Top Banner / Heading */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center border border-slate-700">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>{summary.monthName} {summary.year} - {t.monthlyCalculator}</span>
            </h2>
            <p className="text-xs text-slate-400">
              Daily Purchase & Monthly Expense Tracker
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="open-mini-calc-btn"
            onClick={onOpenMiniCalculator}
            className="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>जोड़-घटाव कैलकुलेटर</span>
          </button>

          <button
            id="set-budget-modal-btn"
            onClick={onOpenBudgetModal}
            className="text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>{summary.budget > 0 ? `बजट: ${formatCurrency(summary.budget, currency)}` : t.setBudget}</span>
          </button>
        </div>
      </div>

      {/* Main 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6 relative z-10">
        {/* Total Expense */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>{t.totalMonthlyExpense}</span>
            <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShoppingBag className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight my-1">
            {formatCurrency(summary.totalExpenses, currency)}
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
            <span>{summary.totalItemsCount} {t.totalItems} दर्ज</span>
            <span>•</span>
            <span>{summary.daysWithExpensesCount} सक्रिय दिन</span>
          </div>
        </div>

        {/* Daily Average */}
        <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center justify-between">
            <span>{t.dailyAverage}</span>
            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-100 font-mono tracking-tight my-1">
            {formatCurrency(summary.dailyAverage, currency)}
            <span className="text-xs font-normal text-emerald-400/70 ml-1">/ दिन</span>
          </div>
          <div className="text-xs text-emerald-400/80 truncate">
            महीने के दिनों के आधार पर औसत
          </div>
        </div>

        {/* Budget Status */}
        <div className={`rounded-xl p-4 border ${
          isOverBudget
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-100'
            : 'bg-slate-800/50 border-slate-700 text-white'
        }`}>
          <div className={`text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-between ${isOverBudget ? 'text-rose-400' : 'text-slate-400'}`}>
            <span>{t.remaining}</span>
            <span className={`p-1 rounded-lg ${isOverBudget ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700 text-slate-300'}`}>
              {isOverBudget ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight my-1">
            {summary.budget > 0
              ? formatCurrency(Math.abs(summary.remainingBudget), currency)
              : 'बजट सेट नहीं'}
          </div>
          <div className={`text-xs font-medium truncate ${isOverBudget ? 'text-rose-400/80' : 'text-slate-400'}`}>
            {summary.budget > 0
              ? isOverBudget
                ? `बजट से ${formatCurrency(Math.abs(summary.remainingBudget), currency)} अधिक`
                : `${Math.round(100 - budgetPercentage)}% बजट बचा है`
              : 'बजट सेट करने के लिए ऊपर क्लिक करें'}
          </div>
        </div>

        {/* Highest Spending Day */}
        <div className="bg-sky-500/10 rounded-xl p-4 border border-sky-500/20">
          <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1 flex items-center justify-between">
            <span>{t.highestDay}</span>
            <span className="p-1 rounded-lg bg-sky-500/20 text-sky-300">
              <Calendar className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-sky-100 font-mono tracking-tight my-1">
            {summary.highestSpendingDay
              ? formatCurrency(summary.highestSpendingDay.amount, currency)
              : '₹ 0'}
          </div>
          <div className="text-xs text-sky-400/80 font-medium">
            {summary.highestSpendingDay
              ? `तारीख: ${summary.highestSpendingDay.dayNumber} ${summary.monthName}`
              : 'अभी कोई बड़ा खर्च नहीं'}
          </div>
        </div>
      </div>

      {/* Budget Progress Bar (If Budget is Set) */}
      {summary.budget > 0 && (
        <div className="mb-6 relative z-10">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span>मासिक बजट प्रगति (Budget Progress):</span>
            <span className="text-white font-mono">
              {formatCurrency(summary.totalExpenses, currency)} / {formatCurrency(summary.budget, currency)} ({Math.round(budgetPercentage)}%)
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverBudget
                  ? 'bg-rose-500'
                  : budgetPercentage > 80
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, budgetPercentage)}%` }}
            />
          </div>
        </div>
      )}

      {/* Category Breakdown Chips / Filter Bar */}
      <div className="pt-4 border-t border-slate-800 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <PieChart className="w-3.5 h-3.5 text-emerald-400" />
            <span>श्रेणी अनुसार खर्च (Category Khata):</span>
          </span>
          {selectedCategoryFilter && (
            <button
              onClick={() => onSelectCategoryFilter?.(null)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline cursor-pointer"
            >
              {t.clearFilter}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {sortedCategories.length === 0 ? (
            <span className="text-xs text-slate-500 italic">इस महीने अभी कोई खर्च दर्ज नहीं है</span>
          ) : (
            sortedCategories.map(([cat, amount]) => {
              const meta = categoryMeta[cat];
              const pct = summary.totalExpenses > 0 ? Math.round((amount / summary.totalExpenses) * 100) : 0;
              const isSelected = selectedCategoryFilter === cat;

              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategoryFilter?.(isSelected ? null : cat)}
                  className={`text-xs px-3 py-1.5 rounded-xl border font-medium flex items-center gap-2 transition cursor-pointer ${
                    isSelected
                      ? 'ring-1 ring-emerald-400 bg-emerald-500/10 border-emerald-400 font-bold text-white shadow-[0_0_10px_rgba(52,211,153,0.2)]'
                      : `bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white`
                  }`}
                  title={`${meta.nameHi}: ${formatCurrency(amount, currency)} (${pct}%)`}
                >
                  <span className={`${isSelected ? 'text-emerald-300' : 'text-slate-400'}`}>{language === 'hi' ? meta.nameHi : language === 'hinglish' ? meta.nameHinglish : meta.nameEn}</span>
                  <span className={`font-mono font-bold px-1.5 py-0.5 rounded-md border ${isSelected ? 'bg-emerald-400/20 text-emerald-200 border-emerald-400/30' : 'bg-slate-900/50 text-slate-200 border-slate-700/50'}`}>
                    {formatCurrency(amount, currency)}
                  </span>
                  <span className="text-[10px] opacity-75 font-semibold">({pct}%)</span>
                </button>
              );
            })
          )}
        </div>

        {/* Payment Modes Summary Pills */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5" />
            <span>भुगतान माध्यम:</span>
          </span>
          {(Object.entries(summary.paymentTotals) as [PaymentMethod, number][]).map(([mode, amt]) => {
            if (amt <= 0) return null;
            const pMeta = paymentMeta[mode] || paymentMeta.other;
            return (
               <span
                key={mode}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold bg-slate-800 border-slate-700 text-slate-300`}
              >
                <span className="opacity-80">{language === 'hi' ? pMeta.nameHi : pMeta.nameEn}:</span>
                <span className="font-mono text-white font-bold">{formatCurrency(amt, currency)}</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
