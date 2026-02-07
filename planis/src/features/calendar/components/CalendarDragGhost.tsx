import { useCalendar } from "../providers/CalendarProvider";
import { useDragInteraction } from "../../interactions/providers/DragInteractionProvider";
import { formatDate } from "../../../utils/dateUtils";

interface CalendarDragGhostProps {
  displayDays: Date[];
  calendarRef: React.RefObject<HTMLDivElement> | null;
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

  if (isDragging && dragStart && dragEnd) {
    const dayIndex = displayDays.findIndex((day) =>
      isSameDay(dragStart.startTime!, day),
    );
    if (dayIndex === -1) return null;

    const start = dragStart.startTime!;
    const end =
      dragEnd.endTime && dragEnd.endTime > start
        ? dragEnd.endTime
        : new Date(start.getTime() + 30 * 60 * 1000);

    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    const duration = endHour - startHour;

    const topPosition = startHour * 60 + headerHeight;
    const height = duration * 60;

    const gridRef = calendarRef?.current;
    let leftPosition = 60;
    let columnWidth = 200;

    if (gridRef) {
      const gridWidth = gridRef.offsetWidth - 60;
      columnWidth = gridWidth / displayDays.length;
      leftPosition = 60 + dayIndex * columnWidth;
    }

    return (
      <div
        className="absolute border-[3px] border-dashed border-neo-orange rounded-[10px] p-2 pointer-events-none bg-neo-orange/30 z-50"
        style={{
          top: `${topPosition}px`,
          left: `${leftPosition + 4}px`,
          width: `${columnWidth - 8}px`,
          height: `${height}px`,
        }}
      >
        <div className="font-bold text-xs mb-1">Nouvel événement</div>
        <EventDate start={start} end={end} />
      </div>
    );
  }

  if (isDraggingEvent && targetDropPosition) {
    const dayIndex = displayDays.findIndex((day) =>
      isSameDay(targetDropPosition.startTime, day),
    );
    if (dayIndex === -1) return null;

    const start = targetDropPosition.startTime;
    const end = targetDropPosition.endTime;

    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    const duration = endHour - startHour;

    const topPosition = startHour * 60 + headerHeight;
    const height = duration * 60;

    const gridRef = calendarRef?.current;
    let leftPosition = 60;
    let columnWidth = 200;

    if (gridRef) {
      const gridWidth = gridRef.offsetWidth - 60;
      columnWidth = gridWidth / displayDays.length;
      leftPosition = 60 + dayIndex * columnWidth;
    }

    return (
      <div
        className="absolute border-[3px] border-dashed border-neo-cyan rounded-[10px] p-2 pointer-events-none bg-neo-cyan/30 z-50"
        style={{
          top: `${topPosition}px`,
          left: `${leftPosition + 4}px`,
          width: `${columnWidth - 8}px`,
          height: `${height}px`,
        }}
      >
        <div className="font-bold text-xs mb-1">Déplacer ici</div>
        <EventDate start={start} end={end} />
      </div>
    );
  }

  return null;
};

export const EventDate = ({ start, end }: { start: Date; end: Date }) => {
  return (
    <div className="text-[10px]">
      {formatDate(start)} - {formatDate(end)}
    </div>
  );
};
