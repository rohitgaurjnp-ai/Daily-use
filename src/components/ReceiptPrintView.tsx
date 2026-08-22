import React from 'react';
import { MonthSummary, DayLedger, Language, ExpenseCategory } from '../types';
import { translations, categoryMeta, paymentMeta } from '../utils/translations';
import { formatCurrency } from '../utils/calculator';

interface ReceiptPrintViewProps {
  summary: MonthSummary;
  ledgers: DayLedger[];
  language: Language;
  currency: string;
}

export const ReceiptPrintView: React.FC<ReceiptPrintViewProps> = ({
  summary,
  ledgers,
  language,
  currency,
}) => {
  const t = translations[language];

  return (
    <div id="printable-khata-ledger" className="hidden print:block p-8 bg-white text-black font-sans max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-black pb-4 mb-6 text-center">
        <h1 className="text-2xl font-bold font-sans uppercase tracking-wider">
          दैनिक खर्च बहीखाता विवरण (Daily Expense Ledger)
        </h1>
        <h2 className="text-lg font-bold mt-1">
          {summary.monthName} {summary.year}
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          मुद्रित तिथि: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Summary Box */}
      <div className="grid grid-cols-4 gap-4 border border-black p-4 mb-6 text-sm">
        <div>
          <div className="text-xs text-gray-600">कुल मासिक खर्च:</div>
          <div className="text-lg font-bold font-mono">{formatCurrency(summary.totalExpenses, currency)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600">दैनिक औसत:</div>
          <div className="text-lg font-bold font-mono">{formatCurrency(summary.dailyAverage, currency)}/दिन</div>
        </div>
        <div>
          <div className="text-xs text-gray-600">कुल सामान प्रविष्टियां:</div>
          <div className="text-lg font-bold font-mono">{summary.totalItemsCount}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600">मासिक बजट:</div>
          <div className="text-lg font-bold font-mono">
            {summary.budget > 0 ? formatCurrency(summary.budget, currency) : 'लागू नहीं'}
          </div>
        </div>
      </div>

      {/* Date-wise Detailed Ledger Table */}
      <table className="w-full text-left text-xs border-collapse border border-black mb-6">
        <thead>
          <tr className="bg-gray-100 border-b border-black">
            <th className="border border-black p-2 font-bold">तारीख (Date)</th>
            <th className="border border-black p-2 font-bold">दिन</th>
            <th className="border border-black p-2 font-bold">क्या सामान खरीदा (Item / Description)</th>
            <th className="border border-black p-2 font-bold">श्रेणी</th>
            <th className="border border-black p-2 font-bold">माध्यम</th>
            <th className="border border-black p-2 font-bold text-right">रकम ({currency})</th>
          </tr>
        </thead>
        <tbody>
          {ledgers.map((l) => {
            if (l.items.length === 0) return null;
            return l.items.map((item, idx) => {
              const cat = categoryMeta[item.category];
              const pay = paymentMeta[item.paymentMethod];
              return (
                <tr key={item.id} className="border-b border-gray-300">
                  {idx === 0 ? (
                    <td
                      rowSpan={l.items.length}
                      className="border border-black p-2 font-mono font-bold align-top bg-gray-50"
                    >
                      {l.date}
                    </td>
                  ) : null}
                  {idx === 0 ? (
                    <td
                      rowSpan={l.items.length}
                      className="border border-black p-2 align-top bg-gray-50 font-medium"
                    >
                      {l.dayName}
                    </td>
                  ) : null}
                  <td className="border border-black p-2 font-medium">
                    {item.itemName}
                    {item.notes && <span className="text-gray-500 block text-[10px]">({item.notes})</span>}
                  </td>
                  <td className="border border-black p-2">{cat?.nameHi || item.category}</td>
                  <td className="border border-black p-2">{pay?.nameHi || item.paymentMethod}</td>
                  <td className="border border-black p-2 text-right font-mono font-bold">
                    {formatCurrency(item.amount, currency)}
                  </td>
                </tr>
              );
            });
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-black font-bold bg-gray-100 text-sm">
            <td colSpan={5} className="border border-black p-2 text-right">
              कुल महायोग (Total Month Expense):
            </td>
            <td className="border border-black p-2 text-right font-mono font-extrabold text-base">
              {formatCurrency(summary.totalExpenses, currency)}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Category Summary Grid */}
      <div className="border border-black p-3 mb-6">
        <h3 className="text-xs font-bold uppercase mb-2">श्रेणी अनुसार विवरण (Category Breakdown):</h3>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {(Object.entries(summary.categoryTotals) as [ExpenseCategory, number][]).map(([cat, amt]) => {
            if (amt <= 0) return null;
            const meta = categoryMeta[cat];
            return (
              <div key={cat} className="flex justify-between border-b border-gray-200 py-1">
                <span>{meta?.nameHi || cat}:</span>
                <span className="font-mono font-bold">{formatCurrency(amt, currency)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-300">
        दैनिक खर्च डायरी बहीखाता (Daily Expense Diary App) द्वारा जनरेट किया गया
      </div>
    </div>
  );
};
