import { useEffect, useState } from "react";

export const useColumnWidth = (
  calendarRef: React.RefObject<HTMLDivElement | null> | null,
  displayDaysCount: number,
): number => {
  const [columnWidth, setColumnWidth] = useState(200);

  useEffect(() => {
    if (!calendarRef?.current) return;

    const updateWidth = () => {
      if (calendarRef.current) {
        const gridWidth = calendarRef.current.offsetWidth - 60;
        setColumnWidth(gridWidth / displayDaysCount);
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(calendarRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [calendarRef, displayDaysCount]);

  return columnWidth;
};
