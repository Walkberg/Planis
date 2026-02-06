import React, { useState, useRef, useEffect } from "react";

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export const Popover: React.FC<PopoverProps> = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={popoverRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 bg-white border-[3px] border-black rounded-lg shadow-neo-md min-w-[150px]">
          {children}
        </div>
      )}
    </div>
  );
};
