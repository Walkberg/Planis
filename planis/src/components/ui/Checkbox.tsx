import React, { type InputHTMLAttributes } from "react";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", label, ...props }, ref) => {
    return (
      <label className={`flex items-center gap-2 cursor-pointer ${className}`}>
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            className="peer appearance-none w-5 h-5 border-[3px] border-black rounded cursor-pointer checked:bg-neo-purple transition-all"
            {...props}
          />
          <svg
            className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-1 top-1 transition-opacity"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        {label && (
          <span className="font-bold text-sm uppercase select-none">
            {label}
            {props.required && <span className="text-neo-orange ml-1">*</span>}
          </span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
