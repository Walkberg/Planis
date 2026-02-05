import React from "react";

interface CounterProps {
  label?: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  required?: boolean;
}

export const Counter: React.FC<CounterProps> = ({
  label,
  value,
  onIncrement,
  onDecrement,
  required,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block font-bold mb-2 text-sm uppercase">
          {label}
          {required && <span className="text-neo-orange ml-1">*</span>}
        </label>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrement}
          className="w-12 h-12 bg-neo-orange border-[3px] border-black rounded-lg font-bold text-xl shadow-neo-md transition-all hover:bg-[#e55a2b] active:scale-95"
          aria-label="Décrémenter"
        >
          −
        </button>
        <div className="flex-1 bg-white border-[3px] border-black rounded-lg p-3 text-center">
          <span className="text-3xl font-bold font-space">{value}</span>
        </div>
        <button
          type="button"
          onClick={onIncrement}
          className="w-12 h-12 bg-neo-green border-[3px] border-black rounded-lg font-bold text-xl shadow-neo-md transition-all hover:bg-[#2ecc71] active:scale-95"
          aria-label="Incrémenter"
        >
          +
        </button>
      </div>
    </div>
  );
};
