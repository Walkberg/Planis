import React, { type SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className = "", options, placeholder = "Sélectionner...", ...props },
    ref,
  ) => {
    return (
      <select
        ref={ref}
        className={`w-full p-3 border-[3px] border-black rounded-lg font-space text-sm focus:outline-none focus:shadow-neo-sm transition-all appearance-none bg-white ${className}`}
        style={{ backgroundImage: "none" }}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  },
);

Select.displayName = "Select";
