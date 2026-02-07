import type { ReactNode } from "react";

interface GhostBlockProps {
  top: number;
  left: number;
  width: number;
  height: number;
  variant: "create" | "move";
  children?: ReactNode;
}

export const GhostBlock = ({
  top,
  left,
  width,
  height,
  variant,
  children,
}: GhostBlockProps) => {
  const isCreate = variant === "create";

  return (
    <div
      className={`absolute border-[3px] border-dashed rounded-[10px] p-2 pointer-events-none z-50 ${
        isCreate
          ? "border-neo-orange bg-neo-orange/30"
          : "border-neo-cyan bg-neo-cyan/30"
      }`}
      style={{
        top: `${top}px`,
        left: `${left + 4}px`,
        width: `${width - 8}px`,
        height: `${height}px`,
      }}
    >
      {children}
    </div>
  );
};
