import type { CalendarEvent as CalendarEventType } from "../../../types";
import { useEvents } from "../providers/EventsProvider";
import { useDragInteraction } from "../../interactions/providers/DragInteractionProvider";

interface CalendarEventProps {
  event: CalendarEventType;
  dayIndex: number;
  displayDaysLength: number;
  calendarRef: React.RefObject<HTMLElement>;
}

export const CalendarEvent = ({
  event,
  dayIndex,
  displayDaysLength,
  calendarRef,
}: CalendarEventProps) => {
  const { selectedEvent, setSelectedEvent } = useEvents();
  const { handleResizeStart } = useDragInteraction();

  const startHour = event.start.getHours() + event.start.getMinutes() / 60;
  const endHour = event.end.getHours() + event.end.getMinutes() / 60;
  const duration = endHour - startHour;

  const topPosition = startHour * 60 + 61;
  const height = duration * 60;

  const gridRef = calendarRef.current;
  let leftPosition = 60;
  let columnWidth = 200;

  if (gridRef) {
    const gridWidth = gridRef.offsetWidth - 60;
    columnWidth = gridWidth / displayDaysLength;
    leftPosition = 60 + dayIndex * columnWidth;
  }

  return (
    <div
      className={`event absolute border-[3px] border-black rounded-[10px] p-2 cursor-pointer transition-all duration-200 ${
        selectedEvent?.id === event.id
          ? "shadow-neo-md scale-[1.02] z-[10]"
          : "shadow-neo z-[5]"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedEvent(event);
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onMouseUp={(e) => {
        e.stopPropagation();
      }}
      style={{
        top: `${topPosition}px`,
        left: `${leftPosition + 4}px`,
        width: `${columnWidth - 8}px`,
        height: `${height}px`,
        background: event.color,
      }}
    >
      <div className="font-bold text-xs mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
        {event.title || "Sans titre"}
      </div>
      <div className="text-[10px]">
        {event.start.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}
        -{" "}
        {event.end.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
      <div
        onMouseDown={(e) => handleResizeStart(event, e)}
        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-black opacity-30"
      />
    </div>
  );
};
