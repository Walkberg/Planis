import type { CalendarEvent as CalendarEventType } from "../../../types";
import { useEvents } from "../providers/EventsProvider";
import { useDragInteraction } from "../../interactions/providers/DragInteractionProvider";
import { useConfig } from "../../configs/providers/ConfigProvider";
import { useCalendar } from "../../calendar/providers/CalendarProvider";
import { EventFieldFactory } from "./EventFieldFactory";
import { formatDate } from "../../../utils/dateUtils";

interface CalendarEventProps {
  event: CalendarEventType;
  dayIndex: number;
  displayDaysLength: number;
  calendarRef: React.RefObject<HTMLDivElement | null>;
}

export const CalendarEvent = ({
  event,
  dayIndex,
  displayDaysLength,
  calendarRef,
}: CalendarEventProps) => {
  const { selectedEvent, setSelectedEvent } = useEvents();
  const {
    handleResizeStart,
    handleEventDragStart,
    isResizing,
    tempResizeEnd,
    isDraggingEvent,
    draggedEvent,
  } = useDragInteraction();
  const { configs } = useConfig();
  const { headerHeight } = useCalendar();

  const isBeingDragged = isDraggingEvent && draggedEvent?.id === event.id;

  if (isBeingDragged) return null;

  const effectiveEnd =
    isResizing === event.id && tempResizeEnd ? tempResizeEnd : event.end;

  const startHour = event.start.getHours() + event.start.getMinutes() / 60;
  const endHour = effectiveEnd.getHours() + effectiveEnd.getMinutes() / 60;
  const duration = endHour - startHour;

  const topPosition = startHour * 60 + headerHeight;
  const height = duration * 60;

  const gridRef = calendarRef.current;
  let leftPosition = 60;
  let columnWidth = 200;

  if (gridRef) {
    const gridWidth = gridRef.offsetWidth - 60;
    columnWidth = gridWidth / displayDaysLength;
    leftPosition = 60 + dayIndex * columnWidth;
  }

  const config = event.eventConfigId
    ? configs.find((c) => c.id === event.eventConfigId)
    : null;
  const displayFields =
    height >= 80 && config && config.fieldConfigs
      ? config.fieldConfigs.filter((field) => field.displayOnEvent)
      : [];

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInteractiveElement =
      target.closest("button") ||
      target.closest("input") ||
      target.closest("select") ||
      target.closest("textarea") ||
      target.closest("a") ||
      target.closest(".resize-handle") ||
      target.closest('[role="button"]');

    if (!isInteractiveElement) {
      handleEventDragStart(event, e);
    }
  };

  return (
    <div
      className={`event absolute border-[3px] border-black rounded-[10px] p-2 cursor-move transition-all duration-200 ${
        selectedEvent?.id === event.id
          ? "shadow-neo-md scale-[1.02] z-10"
          : "shadow-neo z-5"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedEvent(event);
      }}
      onMouseDown={handleMouseDown}
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
      <div className="text-[10px] mb-2">
        {formatDate(event.start)} - {formatDate(effectiveEnd)}
      </div>
      {displayFields.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {displayFields.map((field) => (
            <EventFieldFactory key={field.id} field={field} event={event} />
          ))}
        </div>
      )}
      <div
        onMouseDown={(e) => handleResizeStart(event, e)}
        className="resize-handle absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize hover:bg-black/50 transition-colors group"
        title="Glisser pour redimensionner"
      >
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-black/40 group-hover:bg-black/70 rounded-full" />
      </div>
    </div>
  );
};
