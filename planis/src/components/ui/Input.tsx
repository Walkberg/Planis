import React, { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full p-3 border-[3px] border-black rounded-lg font-space text-sm focus:outline-none focus:shadow-neo-sm transition-all ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
