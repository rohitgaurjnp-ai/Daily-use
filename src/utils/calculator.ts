import { ExpenseItem, DayLedger, MonthSummary, ExpenseCategory, PaymentMethod, Language } from '../types';

export const formatCurrency = (amount: number, currencySymbol: string = '₹'): string => {
  if (isNaN(amount)) return `${currencySymbol}0`;
  return `${currencySymbol}${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
};

export const getMonthName = (monthIndex: number, language: Language = 'hi'): string => {
  const monthsHi = [
    'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];
  const monthsHinglish = [
    'January (जनवरी)', 'February (फ़रवरी)', 'March (मार्च)', 'April (अप्रैल)',
    'May (मई)', 'June (जून)', 'July (जुलाई)', 'August (अगस्त)',
    'September (सितंबर)', 'October (अक्टूबर)', 'November (नवंबर)', 'December (दिसंबर)'
  ];
  const monthsEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (language === 'hi') return monthsHi[monthIndex] || '';
  if (language === 'hinglish') return monthsHinglish[monthIndex] || '';
  return monthsEn[monthIndex] || '';
};

export const getDayName = (dateStr: string, language: Language = 'hi'): string => {
  const d = new Date(dateStr + 'T00:00:00');
  const dayIndex = d.getDay(); // 0 = Sun

  const daysHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  const daysHinglish = ['Sunday (रवि)', 'Monday (सोम)', 'Tuesday (मंगल)', 'Wednesday (बुध)', 'Thursday (गुरु)', 'Friday (शुक्र)', 'Saturday (शनि)'];
  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (language === 'hi') return daysHi[dayIndex] || '';
  if (language === 'hinglish') return daysHinglish[dayIndex] || '';
  return daysEn[dayIndex] || '';
};

export const getDaysInMonth = (year: number, monthIndex: number): number => {
  return new Date(year, monthIndex + 1, 0).getDate();
};

export const formatDateToKey = (year: number, monthIndex: number, day: number): string => {
  const yStr = String(year);
  const mStr = String(monthIndex + 1).padStart(2, '0');
  const dStr = String(day).padStart(2, '0');
  return `${yStr}-${mStr}-${dStr}`;
};

export const isSameDay = (dateStr1: string, dateStr2: string): boolean => {
  return dateStr1 === dateStr2;
};

export const getTodayKey = (): string => {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const buildDayLedgers = (
  expenses: ExpenseItem[],
  year: number,
  monthIndex: number,
  language: Language = 'hi'
): DayLedger[] => {
  const totalDays = getDaysInMonth(year, monthIndex);
  const todayKey = getTodayKey();
  const ledgers: DayLedger[] = [];

  // Group items by date
  const itemsByDate: Record<string, ExpenseItem[]> = {};
  expenses.forEach((item) => {
    if (!itemsByDate[item.date]) {
      itemsByDate[item.date] = [];
    }
    itemsByDate[item.date].push(item);
  });

  for (let day = 1; day <= totalDays; day++) {
    const dateKey = formatDateToKey(year, monthIndex, day);
    const dayItems = itemsByDate[dateKey] || [];
    // Sort items by creation or time
    dayItems.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

    const total = dayItems.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    ledgers.push({
      date: dateKey,
      dayNumber: day,
      dayName: getDayName(dateKey, language),
      items: dayItems,
      totalAmount: total,
      isToday: dateKey === todayKey,
    });
  }

  return ledgers;
};

export const calculateMonthSummary = (
  expenses: ExpenseItem[],
  year: number,
  monthIndex: number,
  budget: number,
  language: Language = 'hi'
): MonthSummary => {
  const targetPrefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
  const monthExpenses = expenses.filter((item) => item.date.startsWith(targetPrefix));

  let totalExpenses = 0;
  const categoryTotals: Record<ExpenseCategory, number> = {
    groceries: 0,
    vegetables: 0,
    milk: 0,
    food: 0,
    bills: 0,
    travel: 0,
    medical: 0,
    shopping: 0,
    home: 0,
    education: 0,
    other: 0,
  };

  const paymentTotals: Record<PaymentMethod, number> = {
    cash: 0,
    upi: 0,
    card: 0,
    udhar: 0,
    other: 0,
  };

  const dayTotals: Record<string, number> = {};

  monthExpenses.forEach((item) => {
    const amt = Number(item.amount) || 0;
    totalExpenses += amt;

    if (categoryTotals[item.category] !== undefined) {
      categoryTotals[item.category] += amt;
    } else {
      categoryTotals.other += amt;
    }

    if (paymentTotals[item.paymentMethod] !== undefined) {
      paymentTotals[item.paymentMethod] += amt;
    } else {
      paymentTotals.other += amt;
    }

    dayTotals[item.date] = (dayTotals[item.date] || 0) + amt;
  });

  const daysWithExpenses = Object.keys(dayTotals).length;
  const daysInCurrentMonth = getDaysInMonth(year, monthIndex);
  
  // Daily average calculation (based on days recorded or days so far)
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === monthIndex;
  const elapsedDays = isCurrentMonth ? Math.max(1, today.getDate()) : daysInCurrentMonth;
  const dailyAverage = totalExpenses > 0 ? Math.round(totalExpenses / elapsedDays) : 0;

  // Highest and lowest spending days
  let highestDay: { date: string; amount: number; dayNumber: number } | null = null;
  let lowestDay: { date: string; amount: number; dayNumber: number } | null = null;

  Object.entries(dayTotals).forEach(([dateStr, amount]) => {
    const dayNum = parseInt(dateStr.split('-')[2], 10);
    if (!highestDay || amount > highestDay.amount) {
      highestDay = { date: dateStr, amount, dayNumber: dayNum };
    }
    if (!lowestDay || amount < lowestDay.amount) {
      lowestDay = { date: dateStr, amount, dayNumber: dayNum };
    }
  });

  const remainingBudget = budget - totalExpenses;
  const budgetUsedPercentage = budget > 0 ? Math.min(100, Math.round((totalExpenses / budget) * 100)) : 0;

  return {
    year,
    month: monthIndex,
    monthName: getMonthName(monthIndex, language),
    totalExpenses,
    totalItemsCount: monthExpenses.length,
    dailyAverage,
    highestSpendingDay: highestDay,
    lowestSpendingDay: lowestDay,
    budget,
    remainingBudget,
    budgetUsedPercentage,
    categoryTotals,
    paymentTotals,
    daysWithExpensesCount: daysWithExpenses,
  };
};

export const exportToCSV = (expenses: ExpenseItem[], year: number, monthIndex: number): void => {
  const targetPrefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
  const monthExpenses = expenses
    .filter((item) => item.date.startsWith(targetPrefix))
    .sort((a, b) => a.date.localeCompare(b.date));

  const headers = ['Date', 'Day', 'Item Name (Saman)', 'Category', 'Payment Mode', 'Amount (₹)', 'Notes'];
  const rows = monthExpenses.map((e) => {
    return [
      `"${e.date}"`,
      `"${getDayName(e.date, 'en')}"`,
      `"${(e.itemName || '').replace(/"/g, '""')}"`,
      `"${e.category}"`,
      `"${e.paymentMethod}"`,
      e.amount,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
    ];
  });

  const total = monthExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  rows.push(['"TOTAL"', '""', `"${monthExpenses.length} Items"`, '""', '""', total, '""']);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Daily_Expense_Diary_${year}_${monthIndex + 1}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateWhatsAppShareText = (
  summary: MonthSummary,
  ledgers: DayLedger[],
  currency: string = '₹'
): string => {
  let text = `📖 *${summary.monthName} ${summary.year} - दैनिक खर्च बहीखाता (Daily Expense Diary)*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `💰 *कुल मासिक खर्च (Total Spend):* ${currency}${summary.totalExpenses.toLocaleString('en-IN')}\n`;
  text += `📊 *दैनिक औसत खर्च (Daily Avg):* ${currency}${summary.dailyAverage.toLocaleString('en-IN')}/दिन\n`;
  text += `📝 *कुल सामान प्रविष्टियां (Total Items):* ${summary.totalItemsCount}\n`;
  
  if (summary.budget > 0) {
    text += `🎯 *महीने का बजट:* ${currency}${summary.budget.toLocaleString('en-IN')}\n`;
    text += `⚖️ *बचा हुआ बैलेंस:* ${currency}${summary.remainingBudget.toLocaleString('en-IN')} (${100 - summary.budgetUsedPercentage}% शेष)\n`;
  }

  text += `\n📦 *मुख्य श्रेणियां (Category Summary):*\n`;
  const catNames: Record<string, string> = {
    groceries: 'राशन / किराना',
    vegetables: 'फल व सब्जी',
    milk: 'दूध व डेयरी',
    food: 'खाना-नाश्ता',
    bills: 'बिजली व रिचार्ज',
    travel: 'पेट्रोल व किराया',
    medical: 'दवाई व सेहत',
    shopping: 'कपड़े व खरीदारी',
    home: 'घर खर्च',
    education: 'पढ़ाई',
    other: 'अन्य',
  };

  Object.entries(summary.categoryTotals).forEach(([cat, amount]) => {
    if (amount > 0) {
      text += `• ${catNames[cat] || cat}: ${currency}${amount.toLocaleString('en-IN')}\n`;
    }
  });

  text += `\n💳 *भुगतान माध्यम (Payment Modes):*\n`;
  if (summary.paymentTotals.upi > 0) text += `• ऑनलाइन / UPI: ${currency}${summary.paymentTotals.upi.toLocaleString('en-IN')}\n`;
  if (summary.paymentTotals.cash > 0) text += `• नकद (Cash): ${currency}${summary.paymentTotals.cash.toLocaleString('en-IN')}\n`;
  if (summary.paymentTotals.card > 0) text += `• कार्ड (Card): ${currency}${summary.paymentTotals.card.toLocaleString('en-IN')}\n`;
  if (summary.paymentTotals.udhar > 0) text += `• उधार (Udhar): ${currency}${summary.paymentTotals.udhar.toLocaleString('en-IN')}\n`;

  text += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `_Generated with Daily Expense Diary App_`;

  return text;
};
