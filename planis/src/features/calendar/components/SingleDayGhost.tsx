import { GhostBlock } from "./GhostBlock";
import { EventDate } from "./EventDate";
import { calculateSingleDayPosition } from "../utils/dragGhostUtils";

interface SingleDayGhostProps {
  start: Date;
  end: Date;
  displayDays: Date[];
  isSameDay: (date1: Date, date2: Date) => boolean;
  headerHeight: number;
  columnWidth: number;
  variant: "create" | "move";
  label: string;
}

export const SingleDayGhost = ({
  start,
  end,
  displayDays,
  isSameDay,
  headerHeight,
  columnWidth,
  variant,
  label,
}: SingleDayGhostProps) => {
  const dayIndex = displayDays.findIndex((day) => isSameDay(start, day));

  if (dayIndex === -1) return null;

  const position = calculateSingleDayPosition(
    start,
    end,
    dayIndex,
    headerHeight,
    columnWidth,
  );

  return (
    <GhostBlock
      top={position.top}
      left={position.left}
      width={position.width}
      height={position.height}
      variant={variant}
    >
      <div className="font-bold text-xs mb-1">{label}</div>
      <EventDate start={start} end={end} />
    </GhostBlock>
  );
};
