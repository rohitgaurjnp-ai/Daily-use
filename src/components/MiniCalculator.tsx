import React, { useState } from 'react';
import { Delete, Equal, X, RotateCcw } from 'lucide-react';

interface MiniCalculatorProps {
  onUseResult?: (val: number) => void;
  onClose?: () => void;
  initialValue?: number;
}

export const MiniCalculator: React.FC<MiniCalculatorProps> = ({
  onUseResult,
  onClose,
  initialValue = 0,
}) => {
  const [display, setDisplay] = useState<string>(initialValue ? String(initialValue) : '0');
  const [expression, setExpression] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);

  const handleNumber = (n: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(n);
    } else {
      setDisplay(display + n);
    }
  };

  const handleOperator = (op: string) => {
    if (display === 'Error') return;
    setExpression(`${display} ${op} `);
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
  };

  const handleBackspace = () => {
    if (display.length <= 1 || display === 'Error') {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleEquals = () => {
    if (!expression || display === 'Error') return;
    try {
      const fullExpr = expression + display;
      // Sanitize expression
      const sanitized = fullExpr.replace(/[^0-9+\-*/.]/g, '');
      // Calculate safely using Function
      const result = new Function(`return ${sanitized}`)();
      if (!isFinite(result)) {
        setDisplay('Error');
      } else {
        const rounded = Math.round(result * 100) / 100;
        setHistory((prev) => [`${fullExpr} = ${rounded}`, ...prev.slice(0, 4)]);
        setDisplay(String(rounded));
        setExpression('');
      }
    } catch {
      setDisplay('Error');
    }
  };

  const handleDecimal = () => {
    if (display.includes('.')) return;
    setDisplay(display + '.');
  };

  const currentNumber = parseFloat(display) || 0;

  return (
    <div id="mini-calculator-box" className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 w-72 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Calculator
        </span>
        {onClose && (
          <button
            id="close-calculator-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Screen Display */}
      <div className="bg-slate-900 rounded-xl p-3 text-right mb-3 font-mono text-white shadow-inner">
        <div className="text-xs text-slate-400 min-h-[16px] truncate">
          {expression || history[0] || ' '}
        </div>
        <div className="text-2xl font-bold tracking-tight truncate text-emerald-400">
          ₹ {display}
        </div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-2 text-sm font-medium">
        <button
          onClick={handleClear}
          className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold p-2.5 rounded-xl transition active:scale-95"
        >
          C
        </button>
        <button
          onClick={handleBackspace}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl flex items-center justify-center transition active:scale-95"
        >
          <Delete className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleOperator('/')}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold p-2.5 rounded-xl transition active:scale-95"
        >
          ÷
        </button>
        <button
          onClick={() => handleOperator('*')}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold p-2.5 rounded-xl transition active:scale-95"
        >
          ×
        </button>

        {['7', '8', '9'].map((n) => (
          <button
            key={n}
            onClick={() => handleNumber(n)}
            className="bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold p-2.5 rounded-xl transition active:scale-95"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => handleOperator('-')}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold p-2.5 rounded-xl transition active:scale-95"
        >
          -
        </button>

        {['4', '5', '6'].map((n) => (
          <button
            key={n}
            onClick={() => handleNumber(n)}
            className="bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold p-2.5 rounded-xl transition active:scale-95"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => handleOperator('+')}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold p-2.5 rounded-xl transition active:scale-95"
        >
          +
        </button>

        {['1', '2', '3'].map((n) => (
          <button
            key={n}
            onClick={() => handleNumber(n)}
            className="bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold p-2.5 rounded-xl transition active:scale-95"
          >
            {n}
          </button>
        ))}
        <button
          onClick={handleEquals}
          className="row-span-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center transition active:scale-95 shadow-md shadow-emerald-200"
        >
          <Equal className="w-5 h-5" />
        </button>

        <button
          onClick={() => handleNumber('0')}
          className="col-span-2 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold p-2.5 rounded-xl transition active:scale-95"
        >
          0
        </button>
        <button
          onClick={handleDecimal}
          className="bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold p-2.5 rounded-xl transition active:scale-95"
        >
          .
        </button>
      </div>

      {/* Use in Form Button */}
      {onUseResult && (
        <button
          id="apply-calc-to-amount-btn"
          onClick={() => onUseResult(currentNumber)}
          className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20"
        >
          <span>Use Amount: {display}</span>
        </button>
      )}
    </div>
  );
};
