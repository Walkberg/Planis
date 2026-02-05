import React, { type InputHTMLAttributes } from "react";

interface ColorPickerProps extends InputHTMLAttributes<HTMLInputElement> {}
export const ColorPicker: React.FC<ColorPickerProps> = ({
  className,
  value,
  onChange,
  ...props
}) => {
  return (
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
  );
};
