import React from "react";
import { Slider } from "./Slider";

interface IndicatorProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export const Indicator: React.FC<IndicatorProps> = ({
  value,
  min,
  max,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      onChange(Math.max(min, Math.min(max, newValue)));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-gray-600 w-10 text-right">
          {min}
        </span>
        <div className="flex-1 relative">
          <Slider min={min} max={max} value={value} onChange={onChange} />
        </div>
        <span className="text-sm font-bold text-gray-600 w-10">{max}</span>
      </div>
      <div className="bg-white border-[3px] border-black rounded-lg p-3 text-center">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          className="w-20 text-2xl font-bold font-space text-center bg-transparent border-none outline-none"
        />
      </div>
    </div>
  );
};
