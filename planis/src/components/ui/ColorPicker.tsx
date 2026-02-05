import React, { type InputHTMLAttributes } from 'react';

interface ColorPickerProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  className,
  label,
  error,
  value,
  onChange,
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
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12">
          <input
            type="color"
            value={value as string}
            onChange={onChange}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
            {...props}
          />
          <div
            className="w-full h-full rounded-lg border-[3px] border-black shadow-neo-sm transition-transform hover:scale-105"
            style={{ backgroundColor: value as string }}
          />
        </div>
        <input
          type="text"
          value={value as string}
          onChange={onChange}
          className="flex-1 p-3 border-[3px] border-black rounded-lg font-space text-sm uppercase"
          placeholder="#000000"
        />
      </div>
      {error && <span className="text-neo-orange text-xs font-bold">{error}</span>}
    </div>
  );
};
