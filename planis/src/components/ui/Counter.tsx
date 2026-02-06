import React from "react";

interface CounterProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const Counter: React.FC<CounterProps> = ({
  value,
  onIncrement,
  onDecrement,
}) => {
  return (
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
  );
};
