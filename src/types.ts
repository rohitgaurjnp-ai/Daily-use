export type Language = 'hi' | 'hinglish' | 'en';

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'udhar' | 'other';

export type ExpenseCategory =
  | 'groceries'     // राशन / Kirana
  | 'vegetables'    // फल-सब्जी / Veg & Fruits
  | 'milk'          // दूध / Dairy
  | 'food'          // खाना-नाश्ता / Food & Dining
  | 'bills'         // बिजली-बिल / Utility & Recharge
  | 'travel'        // पेट्रोल-किराया / Travel & Fuel
  | 'medical'       // दवाई / Health & Medicine
  | 'shopping'      // कपड़े-खरीदारी / Shopping & Personal
  | 'home'          // घर खर्च / Home Maintenance
  | 'education'     // पढ़ाई / Fees & Books
  | 'other';        // अन्य / Miscellaneous

export interface ExpenseItem {
  id: string;
  date: string; // YYYY-MM-DD
  itemName: string;
  amount: number;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  notes?: string;
  time?: string; // HH:MM
  createdAt: number;
}

export interface DayLedger {
  date: string; // YYYY-MM-DD
  dayNumber: number;
  dayName: string;
  items: ExpenseItem[];
  totalAmount: number;
  isToday: boolean;
}

export interface MonthSummary {
  year: number;
  month: number; // 0-11
  monthName: string;
  totalExpenses: number;
  totalItemsCount: number;
  dailyAverage: number;
  highestSpendingDay: { date: string; amount: number; dayNumber: number } | null;
  lowestSpendingDay: { date: string; amount: number; dayNumber: number } | null;
  budget: number;
  remainingBudget: number;
  budgetUsedPercentage: number;
  categoryTotals: Record<ExpenseCategory, number>;
  paymentTotals: Record<PaymentMethod, number>;
  daysWithExpensesCount: number;
}

export type ViewMode = 'diary' | 'table' | 'calendar' | 'analytics';

export interface QuickChip {
  name: string;
  nameHi: string;
  nameHinglish: string;
  category: ExpenseCategory;
  defaultAmount?: number;
  iconName: string;
}
