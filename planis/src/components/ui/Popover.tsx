import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className = "", align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={`z-50 min-w-32 overflow-hidden rounded-lg border-[3px] border-black bg-white shadow-neo-md animate-in ${className}`}
      {...props}
    />
  </PopoverPrimitive.Portal>
));

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

interface PopoverItemProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  variant?: "default" | "danger";
}

const PopoverItem: React.FC<PopoverItemProps> = ({
  children,
  onClick,
  className = "",
  variant = "default",
}) => {
  const variantClasses =
    variant === "danger"
      ? "hover:bg-neo-orange/20 text-neo-orange"
      : "hover:bg-neo-cyan";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 transition-colors font-bold text-sm border-b-2 border-black last:border-b-0 ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
};

interface PopoverListProps {
  children: React.ReactNode;
  className?: string;
}

const PopoverList: React.FC<PopoverListProps> = ({
  children,
  className = "",
}) => {
  return <div className={`flex flex-col ${className}`}>{children}</div>;
};

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverItem,
  PopoverList,
};
