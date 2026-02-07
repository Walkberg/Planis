import { useCalendar } from "../providers/CalendarProvider";
import { useDragInteraction } from "../../interactions/providers/DragInteractionProvider";
import { useColumnWidth } from "../hooks/useColumnWidth";
import { NewEventGhost } from "./NewEventGhost";
import { MoveEventGhost } from "./MoveEventGhost";

interface CalendarDragGhostProps {
  displayDays: Date[];
  calendarRef: React.RefObject<HTMLDivElement | null> | null;
}

export const CalendarDragGhost = ({
  displayDays,
  calendarRef,
}: CalendarDragGhostProps) => {
  const { isSameDay, headerHeight } = useCalendar();
  const {
    isDragging,
    dragStart,
    dragEnd,
    isDraggingEvent,
    targetDropPosition,
  } = useDragInteraction();

  const columnWidth = useColumnWidth(calendarRef, displayDays.length);

  if (isDragging && dragStart && dragEnd) {
    const start = dragStart.startTime!;
    const end =
      dragEnd.endTime && dragEnd.endTime > start
        ? dragEnd.endTime
        : new Date(start.getTime() + 30 * 60 * 1000);

    return (
      <NewEventGhost
        start={start}
        end={end}
        displayDays={displayDays}
        isSameDay={isSameDay}
        headerHeight={headerHeight}
        columnWidth={columnWidth}
      />
    );
  }

  if (isDraggingEvent && targetDropPosition) {
    const start = targetDropPosition.startTime;
    const end = targetDropPosition.endTime;

    return (
      <MoveEventGhost
        start={start}
        end={end}
        displayDays={displayDays}
        isSameDay={isSameDay}
        headerHeight={headerHeight}
        columnWidth={columnWidth}
      />
    );
  }

  return null;
};
