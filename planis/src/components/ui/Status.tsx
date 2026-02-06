import React from "react";
import { STATUS_OPTIONS } from "../../types/MoodConstants";

interface StatusProps {
  value: number;
  onChange: (value: number) => void;
  size?: "default" | "small";
}

export const Status: React.FC<StatusProps> = ({
  value,
  onChange,
  size = "default",
}) => {
  const isSmall = size === "small";

  return (
    <div
      className={`flex ${isSmall ? "gap-1.5" : "gap-3"} items-center justify-center`}
    >
      {STATUS_OPTIONS.map((status) => (
        <button
          key={status.value}
          type="button"
          onClick={() => onChange(status.value)}
          className={`${isSmall ? "w-8 h-8 text-xl" : "w-10 h-10 text-2xl"} ${isSmall ? "border-2" : "border-[2px]"} border-black rounded-lg font-bold transition-all ${
            value === status.value
              ? "bg-neo-yellow shadow-neo-md scale-110"
              : "bg-white shadow-neo-sm hover:bg-neo-yellow/50 hover:scale-105"
          }`}
          title={status.label}
          aria-label={status.label}
        >
          {status.emoji}
        </button>
      ))}
    </div>
  );
};
