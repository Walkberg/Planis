import { GhostBlock } from "./GhostBlock";
import { EventDate } from "./EventDate";
import { useMultiDayBlocks } from "../hooks/useMultiDayBlocks";

interface MultiDayGhostProps {
  start: Date;
  end: Date;
  displayDays: Date[];
  isSameDay: (date1: Date, date2: Date) => boolean;
  headerHeight: number;
  columnWidth: number;
  variant: "create" | "move";
  label: string;
}

export const MultiDayGhost = ({
  start,
  end,
  displayDays,
  isSameDay,
  headerHeight,
  columnWidth,
  variant,
  label,
}: MultiDayGhostProps) => {
  const blocks = useMultiDayBlocks({
    start,
    end,
    displayDays,
    isSameDay,
    headerHeight,
    columnWidth,
  });

  return (
    <>
      {blocks.map((position) => (
        <GhostBlock
          key={`ghost-${variant}-${position.dayIndex}`}
          top={position.top}
          left={position.left}
          width={position.width}
          height={position.height}
          variant={variant}
        >
          {position.isFirstDay && (
            <>
              <div className="font-bold text-xs mb-1">{label}</div>
              <EventDate start={start} end={end} />
            </>
          )}
        </GhostBlock>
      ))}
    </>
  );
};
