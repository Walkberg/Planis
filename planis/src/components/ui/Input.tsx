import React, { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ className, label, error, ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-bold text-sm uppercase">
          {label}
          {props.required && <span className="text-neo-orange ml-1">*</span>}
        </label>
      )}
      <input
        className={`w-full p-3 border-[3px] border-black rounded-lg font-space text-sm focus:outline-none focus:shadow-neo-sm transition-all ${className}`}
        {...props}
      />
      {error && <span className="text-neo-orange text-xs font-bold">{error}</span>}
    </div>
  );
};
