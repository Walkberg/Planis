import { MultiDayGhost } from "./MultiDayGhost";
import { SingleDayGhost } from "./SingleDayGhost";
import { isMultiDay } from "../utils/dragGhostUtils";

interface MoveEventGhostProps {
  start: Date;
  end: Date;
  displayDays: Date[];
  isSameDay: (date1: Date, date2: Date) => boolean;
  headerHeight: number;
  columnWidth: number;
}

export const MoveEventGhost = ({
  start,
  end,
  displayDays,
  isSameDay,
  headerHeight,
  columnWidth,
}: MoveEventGhostProps) => {
  const multiDay = isMultiDay(start, end);

  if (multiDay) {
    return (
      <MultiDayGhost
        start={start}
        end={end}
        displayDays={displayDays}
        isSameDay={isSameDay}
        headerHeight={headerHeight}
        columnWidth={columnWidth}
        variant="move"
        label="Déplacer ici"
      />
    );
  }

  return (
    <SingleDayGhost
      start={start}
      end={end}
      displayDays={displayDays}
      isSameDay={isSameDay}
      headerHeight={headerHeight}
      columnWidth={columnWidth}
      variant="move"
      label="Déplacer ici"
    />
  );
};
