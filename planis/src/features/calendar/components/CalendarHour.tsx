import { useCalendar } from "../providers/CalendarProvider";
import { useEvents } from "../../events/providers/EventsProvider";
import { useDragInteraction } from "../../interactions/providers/DragInteractionProvider";

interface CalendarHourProps {
  hour: number;
  day: Date;
  dayIndex: number;
  isLastDay: boolean;
}

export const CalendarHour = ({
  hour,
  day,
  dayIndex,
  isLastDay,
}: CalendarHourProps) => {
  const { isSameDay } = useCalendar();
  const { events, selectedEvent, setSelectedEvent, getEventStyle } =
    useEvents();
  const { handleCellClick, handleResizeStart } = useDragInteraction();

  const formatTime = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  const quarters = [0, 15, 30, 45];

  return (
    <>
      {dayIndex === 0 && (
        <div className="border-r-[3px] border-b border-black border-b-gray-300 p-1 text-right text-xs font-bold bg-neo-yellow sticky left-0 z-[1]">
          {formatTime(hour)}
        </div>
      )}

      <div
        className={`border-b border-b-gray-300 min-h-[60px] relative grid grid-rows-4 ${
          isLastDay
            ? "border-r-[3px] border-r-black"
            : "border-r border-r-gray-200"
        }`}
      >
        {quarters.map((minutes, idx) => (
          <div
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              if (!(e.target as HTMLElement).closest(".event")) {
                handleCellClick(day, hour, minutes);
              }
            }}
            className={`cursor-pointer transition-colors duration-100 hover:bg-gray-100 ${
              idx < 3 ? "border-b border-b-gray-200" : ""
            }`}
          />
        ))}
        {events.map((event) => {
          const style = getEventStyle(event, day, isSameDay);
          if (!style) return null;

          return (
            <div
              key={event.id}
              className={`event absolute left-1 right-1 border-[3px] border-black rounded-[10px] p-2 cursor-pointer transition-all duration-200 ${
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
                ...style,
                background: event.color,
              }}
            >
              <div className="font-bold text-xs mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {event.title}
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
        })}
      </div>
    </>
  );
};
