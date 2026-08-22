import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  Plus,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { ExpenseItem, Language, ExpenseCategory, PaymentMethod } from '../types';
import { translations, categoryMeta, paymentMeta } from '../utils/translations';
import { formatCurrency, getDayName } from '../utils/calculator';

interface TableViewProps {
  expenses: ExpenseItem[];
  language: Language;
  currency: string;
  onEditItem: (item: ExpenseItem) => void;
  onDeleteItem: (id: string) => void;
  onOpenAddModal: () => void;
  onExportCsv: () => void;
  year: number;
  month: number;
}

export const TableView: React.FC<TableViewProps> = ({
  expenses,
  language,
  currency,
  onEditItem,
  onDeleteItem,
  onOpenAddModal,
  onExportCsv,
  year,
  month,
}) => {
  const t = translations[language];
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'date' | 'amount' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter current month's items
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  let filtered = expenses.filter((e) => e.date.startsWith(monthPrefix));

  if (categoryFilter !== 'all') {
    filtered = filtered.filter((e) => e.category === categoryFilter);
  }
  if (paymentFilter !== 'all') {
    filtered = filtered.filter((e) => e.paymentMethod === paymentFilter);
  }
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (e) =>
        e.itemName.toLowerCase().includes(q) ||
        (e.notes && e.notes.toLowerCase().includes(q))
    );
  }

  // Sort
  filtered.sort((a, b) => {
    if (sortField === 'date') {
      const cmp = a.date.localeCompare(b.date);
      return sortOrder === 'asc' ? cmp : -cmp;
    }
    if (sortField === 'amount') {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    if (sortField === 'name') {
      const cmp = a.itemName.localeCompare(b.itemName);
      return sortOrder === 'asc' ? cmp : -cmp;
    }
    return 0;
  });

  const totalFiltered = filtered.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const toggleSort = (field: 'date' | 'amount' | 'name') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div id="table-view-container" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
      {/* Controls toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            id="table-search-input"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-hidden cursor-pointer"
          >
            <option value="all">{t.allCategories}</option>
            {Object.entries(categoryMeta).map(([k, v]) => (
              <option key={k} value={k}>
                {language === 'hi' ? v.nameHi : language === 'hinglish' ? v.nameHinglish : v.nameEn}
              </option>
            ))}
          </select>

          {/* Payment */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-hidden cursor-pointer"
          >
            <option value="all">{t.allPaymentModes}</option>
            {Object.entries(paymentMeta).map(([k, v]) => (
              <option key={k} value={k}>
                {language === 'hi' ? v.nameHi : v.nameEn}
              </option>
            ))}
          </select>

          {/* Export CSV Button */}
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportCsv}</span>
          </button>
        </div>
      </div>

      {/* Table grid */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 font-bold">#</th>
              <th
                onClick={() => toggleSort('date')}
                className="py-3 px-4 font-bold cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>{t.date}</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('name')}
                className="py-3 px-4 font-bold cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>{t.item}</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 font-bold">{t.category}</th>
              <th className="py-3 px-4 font-bold">{t.payment}</th>
              <th
                onClick={() => toggleSort('amount')}
                className="py-3 px-4 font-bold text-right cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>{t.amount} ({currency})</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                  कोई प्रविष्टि नहीं मिली (No entries found)
                </td>
              </tr>
            ) : (
              filtered.map((item, index) => {
                const cat = categoryMeta[item.category] || categoryMeta.other;
                const pay = paymentMeta[item.paymentMethod] || paymentMeta.other;
                const dayName = getDayName(item.date, language);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="py-3 px-4 text-slate-400 font-mono text-xs">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-800 whitespace-nowrap">
                      <div className="font-bold">{item.date}</div>
                      <div className="text-[11px] text-slate-500 font-sans uppercase tracking-wider">{dayName}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div>{item.itemName}</div>
                      {item.notes && (
                        <div className="text-xs text-slate-500 italic font-normal">
                          {item.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-block text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wider">
                        {language === 'hi' ? cat.nameHi : language === 'hinglish' ? cat.nameHinglish : cat.nameEn}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-block text-[10px] font-bold text-slate-600 border border-slate-200 bg-white px-2 py-1 rounded-md uppercase tracking-wider">
                        {language === 'hi' ? pay.nameHi : pay.nameEn}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 whitespace-nowrap">
                      {formatCurrency(item.amount, currency)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditItem(item)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(t.confirmDelete)) {
                              onDeleteItem(item.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {/* Footer Grand Total Row */}
          <tfoot>
            <tr className="bg-emerald-50/50 font-bold border-t-2 border-slate-200 text-slate-900">
              <td colSpan={5} className="py-4 px-4 text-right uppercase tracking-wider text-xs text-slate-500">
                {t.grandTotal} ({filtered.length} {t.totalItems}):
              </td>
              <td className="py-4 px-4 text-right font-mono text-lg font-bold text-emerald-700">
                {formatCurrency(totalFiltered, currency)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
