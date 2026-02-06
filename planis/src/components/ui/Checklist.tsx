import React from "react";

export interface ChecklistOption {
  value: string;
  label: string;
}

interface ChecklistProps {
  options: ChecklistOption[];
  value: string[];
  onChange: (value: string[]) => void;
}

export const Checklist: React.FC<ChecklistProps> = ({
  options,
  value = [],
  onChange,
}) => {
  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  return (
    <div className="flex flex-col gap-2 border-[3px] border-black rounded-lg p-3 bg-white">
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
            value.includes(option.value)
              ? "bg-gray-100 opacity-60"
              : "hover:bg-neo-yellow/20"
          }`}
        >
          <div className="relative w-5 h-5 flex-shrink-0">
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              className="peer appearance-none w-5 h-5 border-[3px] border-black rounded cursor-pointer bg-white checked:bg-neo-green"
            />
            <svg
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
              viewBox="0 0 12 10"
              fill="none"
            >
              <path
                d="M1 5L4.5 9L11 1"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            className={`font-space text-sm select-none transition-all ${
              value.includes(option.value)
                ? "line-through text-gray-500 font-normal"
                : "font-bold"
            }`}
          >
            {option.label}
          </span>
        </label>
      ))}
      {options.length === 0 && (
        <span className="text-gray-500 italic text-sm">
          Aucune tâche définie
        </span>
      )}
    </div>
  );
};
