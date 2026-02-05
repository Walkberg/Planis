import React, { type SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({ 
  className, 
  label, 
  error, 
  options, 
  placeholder = "Sélectionner...",
  ...props 
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-bold text-sm uppercase">
          {label}
          {props.required && <span className="text-neo-orange ml-1">*</span>}
        </label>
      )}
      <select
        className={`w-full p-3 border-[3px] border-black rounded-lg font-space text-sm focus:outline-none focus:shadow-neo-sm transition-all appearance-none bg-white ${className}`}
        style={{ backgroundImage: 'none' }}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-neo-orange text-xs font-bold">{error}</span>}
    </div>
  );
};
