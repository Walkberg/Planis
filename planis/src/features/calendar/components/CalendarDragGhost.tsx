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

  const isMultiDay = (start: Date, end: Date): boolean => {
    return (
      start.getDate() !== end.getDate() ||
      start.getMonth() !== end.getMonth() ||
      start.getFullYear() !== end.getFullYear()
    );
  };

  if (isDragging && dragStart && dragEnd) {
    const start = dragStart.startTime!;
    const end =
      dragEnd.endTime && dragEnd.endTime > start
        ? dragEnd.endTime
        : new Date(start.getTime() + 30 * 60 * 1000);

    const multiDay = isMultiDay(start, end);

    const gridRef = calendarRef?.current;
    let columnWidth = 200;

    if (gridRef) {
      const gridWidth = gridRef.offsetWidth - 60;
      columnWidth = gridWidth / displayDays.length;
    }

    if (multiDay) {
      const blocks: React.ReactElement[] = [];
      let currentDate = new Date(start);
      const endDate = new Date(end);

      while (currentDate <= endDate) {
        const dayIndex = displayDays.findIndex((day) =>
          isSameDay(currentDate, day),
        );

        if (dayIndex !== -1) {
          const isFirstDay = isSameDay(currentDate, start);
          const isLastDay = isSameDay(currentDate, end);

          let topPosition: number;
          let height: number;

          if (isFirstDay && !isLastDay) {
            const startHour = start.getHours() + start.getMinutes() / 60;
            topPosition = startHour * 60 + headerHeight;
            height = (24 - startHour) * 60;
          } else if (isLastDay && !isFirstDay) {
            const endHour = end.getHours() + end.getMinutes() / 60;
            topPosition = headerHeight;
            height = endHour * 60;
          } else if (isFirstDay && isLastDay) {
            const startHour = start.getHours() + start.getMinutes() / 60;
            const endHour = end.getHours() + end.getMinutes() / 60;
            topPosition = startHour * 60 + headerHeight;
            height = (endHour - startHour) * 60;
          } else {
            topPosition = headerHeight;
            height = 24 * 60;
          }

          const leftPosition = 60 + dayIndex * columnWidth;

          blocks.push(
            <div
              key={`ghost-${dayIndex}`}
              className="absolute border-[3px] border-dashed border-neo-orange rounded-[10px] p-2 pointer-events-none bg-neo-orange/30 z-50"
              style={{
                top: `${topPosition}px`,
                left: `${leftPosition + 4}px`,
                width: `${columnWidth - 8}px`,
                height: `${height}px`,
              }}
            >
              {isFirstDay && (
                <>
                  <div className="font-bold text-xs mb-1">Nouvel événement</div>
                  <EventDate start={start} end={end} />
                </>
              )}
            </div>,
          );
        }

        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return <>{blocks}</>;
    }

    const dayIndex = displayDays.findIndex((day) => isSameDay(start, day));
    if (dayIndex === -1) return null;

    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    const duration = endHour - startHour;

    const topPosition = startHour * 60 + headerHeight;
    const height = duration * 60;
    const leftPosition = 60 + dayIndex * columnWidth;

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
    const start = targetDropPosition.startTime;
    const end = targetDropPosition.endTime;

    const multiDay = isMultiDay(start, end);

    const gridRef = calendarRef?.current;
    let columnWidth = 200;

    if (gridRef) {
      const gridWidth = gridRef.offsetWidth - 60;
      columnWidth = gridWidth / displayDays.length;
    }

    if (multiDay) {
      const blocks: React.ReactElement[] = [];
      let currentDate = new Date(start);
      const endDate = new Date(end);

      while (currentDate <= endDate) {
        const dayIndex = displayDays.findIndex((day) =>
          isSameDay(currentDate, day),
        );

        if (dayIndex !== -1) {
          const isFirstDay = isSameDay(currentDate, start);
          const isLastDay = isSameDay(currentDate, end);

          let topPosition: number;
          let height: number;

          if (isFirstDay && !isLastDay) {
            const startHour = start.getHours() + start.getMinutes() / 60;
            topPosition = startHour * 60 + headerHeight;
            height = (24 - startHour) * 60;
          } else if (isLastDay && !isFirstDay) {
            const endHour = end.getHours() + end.getMinutes() / 60;
            topPosition = headerHeight;
            height = endHour * 60;
          } else if (isFirstDay && isLastDay) {
            const startHour = start.getHours() + start.getMinutes() / 60;
            const endHour = end.getHours() + end.getMinutes() / 60;
            topPosition = startHour * 60 + headerHeight;
            height = (endHour - startHour) * 60;
          } else {
            topPosition = headerHeight;
            height = 24 * 60;
          }

          const leftPosition = 60 + dayIndex * columnWidth;

          blocks.push(
            <div
              key={`ghost-drag-${dayIndex}`}
              className="absolute border-[3px] border-dashed border-neo-cyan rounded-[10px] p-2 pointer-events-none bg-neo-cyan/30 z-50"
              style={{
                top: `${topPosition}px`,
                left: `${leftPosition + 4}px`,
                width: `${columnWidth - 8}px`,
                height: `${height}px`,
              }}
            >
              {isFirstDay && (
                <>
                  <div className="font-bold text-xs mb-1">Déplacer ici</div>
                  <EventDate start={start} end={end} />
                </>
              )}
            </div>,
          );
        }

        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return <>{blocks}</>;
    }

    const dayIndex = displayDays.findIndex((day) => isSameDay(start, day));
    if (dayIndex === -1) return null;

    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    const duration = endHour - startHour;

    const topPosition = startHour * 60 + headerHeight;
    const height = duration * 60;
    const leftPosition = 60 + dayIndex * columnWidth;

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
