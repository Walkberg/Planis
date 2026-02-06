import React from "react";

interface CounterProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: "default" | "small";
}

export const Counter: React.FC<CounterProps> = ({
  value,
  onIncrement,
  onDecrement,
  size = "default",
}) => {
  const isSmall = size === "small";

  return (
    <div className={`flex items-center ${isSmall ? "gap-2" : "gap-3"}`}>
      <button
        type="button"
        onClick={onDecrement}
        className={`${isSmall ? "w-8 h-8 text-base" : "w-12 h-12 text-xl"} bg-neo-orange ${isSmall ? "border-2" : "border-[3px]"} border-black rounded-lg font-bold shadow-neo-md transition-all hover:bg-[#e55a2b] active:scale-95`}
        aria-label="Décrémenter"
      >
        −
      </button>
      <div
        className={`flex-1 bg-white ${isSmall ? "border-2" : "border-[3px]"} border-black rounded-lg ${isSmall ? "" : "p-3"} text-center`}
      >
        <span
          className={`${isSmall ? "text-xl" : "text-3xl"} font-bold font-space`}
        >
          {value}
        </span>
      </div>
      <button
        type="button"
        onClick={onIncrement}
        className={`${isSmall ? "w-8 h-8 text-base" : "w-12 h-12 text-xl"} bg-neo-green ${isSmall ? "border-2" : "border-[3px]"} border-black rounded-lg font-bold shadow-neo-md transition-all hover:bg-[#2ecc71] active:scale-95`}
        aria-label="Incrémenter"
      >
        +
      </button>
    </div>
  );
};
