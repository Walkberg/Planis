import { useMemo } from "react";
import type { DayBlockPosition } from "../utils/dragGhostUtils";
import { calculateDayBlockPosition } from "../utils/dragGhostUtils";

interface UseMultiDayBlocksParams {
  start: Date;
  end: Date;
  displayDays: Date[];
  isSameDay: (date1: Date, date2: Date) => boolean;
  headerHeight: number;
  columnWidth: number;
}

export const useMultiDayBlocks = ({
  start,
  end,
  displayDays,
  isSameDay,
  headerHeight,
  columnWidth,
}: UseMultiDayBlocksParams): DayBlockPosition[] => {
  return useMemo(() => {
    const blocks: DayBlockPosition[] = [];
    let currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      const dayIndex = displayDays.findIndex((day) =>
        isSameDay(currentDate, day),
      );

      if (dayIndex !== -1) {
        const isFirstDay = isSameDay(currentDate, start);
        const isLastDay = isSameDay(currentDate, end);

        const position = calculateDayBlockPosition(
          start,
          end,
          dayIndex,
          headerHeight,
          columnWidth,
          isFirstDay,
          isLastDay,
        );

        blocks.push(position);
      }

      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return blocks;
  }, [start, end, displayDays, isSameDay, headerHeight, columnWidth]);
};
