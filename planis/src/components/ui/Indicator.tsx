import React from "react";

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

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-gray-600 w-10 text-right">
          {min}
        </span>
        <div className="flex-1 relative">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={handleChange}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer border-2 border-black"
            style={{
              background: `linear-gradient(to right, #00D9FF 0%, #00D9FF ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
            }}
          />
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
