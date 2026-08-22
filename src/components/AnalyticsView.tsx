import React, { useState } from 'react';
import {
  Calculator,
  PieChart,
  TrendingUp,
  CreditCard,
  Target,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { MonthSummary, DayLedger, Language, ExpenseCategory, PaymentMethod } from '../types';
import { translations, categoryMeta, paymentMeta } from '../utils/translations';
import { formatCurrency, getDaysInMonth } from '../utils/calculator';
import { MiniCalculator } from './MiniCalculator';

interface AnalyticsViewProps {
  summary: MonthSummary;
  ledgers: DayLedger[];
  language: Language;
  currency: string;
  onOpenBudgetModal: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  summary,
  ledgers,
  language,
  currency,
  onOpenBudgetModal,
}) => {
  const t = translations[language];

  // Simulator State: What-if calculator
  const [dailyProjectionSpend, setDailyProjectionSpend] = useState<number>(summary.dailyAverage || 500);
  const totalDaysInMonth = getDaysInMonth(summary.year, summary.month);
  const projectedTotal = dailyProjectionSpend * totalDaysInMonth;

  // Active days with spending
  const activeDays = ledgers.filter((l) => l.totalAmount > 0);

  return (
    <div id="analytics-view-container" className="space-y-6">
      {/* Top Banner Calculator Hub */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-700/50 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-2">
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span>Smart Expense Intelligence</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight">
              {summary.monthName} {summary.year} - Financial Analysis
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl font-medium">
              Detailed mathematical calculation and savings report based on your daily purchases.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-right min-w-[200px]">
            <span className="text-xs text-slate-300 uppercase tracking-wider font-semibold">Total Monthly Expenses</span>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white mt-1">
              {formatCurrency(summary.totalExpenses, currency)}
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">
              Average: {formatCurrency(summary.dailyAverage, currency)}/day
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Category Breakdown + Simulator + Payment Modes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Category Progress & Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <PieChart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-800 font-sans">
                  Category Share
                </h3>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Where your money went</p>
              </div>
            </div>
          </div>

          <div className="space-y-3.5 pt-1">
            {(Object.entries(summary.categoryTotals) as [ExpenseCategory, number][])
              .filter(([_, amt]) => amt > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([catKey, amount]) => {
                const meta = categoryMeta[catKey] || categoryMeta.other;
                const percentage = summary.totalExpenses > 0 ? (amount / summary.totalExpenses) * 100 : 0;

                return (
                  <div key={catKey} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${meta.bgColor} border ${meta.borderColor}`} />
                        <span className="text-slate-800">
                          {language === 'hi' ? meta.nameHi : language === 'hinglish' ? meta.nameHinglish : meta.nameEn}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-slate-900 font-bold">{formatCurrency(amount, currency)}</span>
                        <span className="text-slate-500 text-[11px] w-12 text-right">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Payment Method Distribution */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span>Payment Split (Cash vs UPI vs Card vs Credit)</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(Object.entries(summary.paymentTotals) as [PaymentMethod, number][]).map(([mode, amt]) => {
                const pMeta = paymentMeta[mode] || paymentMeta.other;
                const pct = summary.totalExpenses > 0 ? ((amt / summary.totalExpenses) * 100).toFixed(1) : '0';

                return (
                  <div key={mode} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {language === 'hi' ? pMeta.nameHi : pMeta.nameEn}
                    </div>
                    <div className="text-lg font-bold font-mono text-slate-800 mt-1.5">
                      {formatCurrency(amt, currency)}
                    </div>
                    <div className="text-xs font-bold text-emerald-600 mt-1">
                      {pct}% share
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Predictive Budget Calculator & Mini Tool (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Smart Budget Estimator / What-If Projection */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-800 font-sans">
                  Spending Estimator
                </h3>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">If you spend a fixed amount daily</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
                  Daily Estimated Spend ({currency}/day):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="50"
                    value={dailyProjectionSpend}
                    onChange={(e) => setDailyProjectionSpend(Number(e.target.value))}
                    className="flex-1 accent-slate-800 cursor-pointer"
                  />
                  <span className="font-mono font-bold text-sm bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800 min-w-[90px] text-center">
                    {formatCurrency(dailyProjectionSpend, currency)}
                  </span>
                </div>
              </div>

              {/* Estimated Result Card */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span>Total Days in Month:</span>
                  <span className="font-mono text-slate-800">{totalDaysInMonth} days</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span>Projected Monthly Spend:</span>
                  <span className="font-mono font-bold text-slate-900 text-base">
                    {formatCurrency(projectedTotal, currency)}
                  </span>
                </div>
                {summary.budget > 0 && (
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                    <span className="text-slate-500">Vs Current Budget:</span>
                    <span className={projectedTotal <= summary.budget ? 'text-emerald-600' : 'text-rose-600'}>
                      {projectedTotal <= summary.budget
                        ? `Under Budget (${formatCurrency(summary.budget - projectedTotal, currency)} saved)`
                        : `Over Budget by ${formatCurrency(projectedTotal - summary.budget, currency)}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Standalone Mini Calculator */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col items-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5 self-start">
              <Calculator className="w-4 h-4 text-slate-400" />
              <span>Quick Keypad</span>
            </h4>
            <MiniCalculator />
          </div>
        </div>
      </div>
    </div>
  );
};
