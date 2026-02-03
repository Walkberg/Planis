import { useCalendar } from "../providers/CalendarProvider";
import { useDragInteraction } from "../../interactions/providers/DragInteractionProvider";

interface CalendarDragGhostProps {
  displayDays: Date[];
  calendarRef: React.RefObject<HTMLDivElement>;
}

export const CalendarDragGhost = ({
  displayDays,
  calendarRef,
}: CalendarDragGhostProps) => {
  const { isSameDay } = useCalendar();
  const { isDragging, dragStart, dragEnd } = useDragInteraction();

  if (!isDragging || !dragStart || !dragEnd) return null;

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

  const topPosition = startHour * 60 + 61;
  const height = duration * 60;

  const gridRef = calendarRef.current;
  let leftPosition = 60;
  let columnWidth = 200;

  if (gridRef) {
    const gridWidth = gridRef.offsetWidth - 60;
    columnWidth = gridWidth / displayDays.length;
    leftPosition = 60 + dayIndex * columnWidth;
  }

  return (
    <div
      className="absolute border-[3px] border-dashed border-neo-orange rounded-[10px] p-2 pointer-events-none bg-neo-orange/30 z-[50]"
      style={{
        top: `${topPosition}px`,
        left: `${leftPosition + 4}px`,
        width: `${columnWidth - 8}px`,
        height: `${height}px`,
      }}
    >
      <div className="font-bold text-xs mb-1">Nouvel événement</div>
      <div className="text-[10px]">
        {start.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}
        -{" "}
        {end.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
};
