import React, { type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ className, label, error, ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-bold text-sm uppercase">
          {label}
          {props.required && <span className="text-neo-orange ml-1">*</span>}
        </label>
      )}
      <textarea
        className={`w-full p-3 border-[3px] border-black rounded-lg font-space text-sm resize-none focus:outline-none focus:shadow-neo-sm transition-all ${className}`}
        {...props}
      />
      {error && <span className="text-neo-orange text-xs font-bold">{error}</span>}
    </div>
  );
};
