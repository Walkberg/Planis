import React, { type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full p-3 border-[3px] border-black rounded-lg font-space text-sm resize-none focus:outline-none focus:shadow-neo-sm transition-all ${className}`}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
