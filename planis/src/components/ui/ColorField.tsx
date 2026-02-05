import React, { type InputHTMLAttributes } from "react";
import { ColorPicker } from "./ColorPicker";

interface ColorFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const ColorField: React.FC<ColorFieldProps> = ({
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
        <ColorPicker value={value} onChange={onChange} {...props} />
        <input
          type="text"
          value={value as string}
          onChange={onChange}
          className="flex-1 p-3 border-[3px] border-black rounded-lg font-space text-sm uppercase"
          placeholder="#000000"
        />
      </div>
      {error && (
        <span className="text-neo-orange text-xs font-bold">{error}</span>
      )}
    </div>
  );
};
