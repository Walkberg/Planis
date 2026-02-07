import { useCalendar } from "../providers/CalendarProvider";
import { useEvents } from "../../events/providers/EventsProvider";

interface CalendarAllDayEventsProps {
  displayDays: Date[];
}

export const CalendarAllDayEvents = ({
  displayDays,
}: CalendarAllDayEventsProps) => {
  const { isSameDay } = useCalendar();
  const { events, selectedEvent, setSelectedEvent } = useEvents();

  const allDayEvents = events.filter((event) => event.isAllDay);

  const eventsByDay = displayDays.map((day) => {
    const dayEvents = allDayEvents.filter((event) =>
      isSameDay(event.start, day),
    );
    return {
      day,
      events: dayEvents,
    };
  });

  const hasAnyAllDayEvents = allDayEvents.length > 0;

  if (!hasAnyAllDayEvents) return null;

  return (
    <div
      className="grid border-b-4 border-black"
      style={{
        gridTemplateColumns: `60px repeat(${displayDays.length}, 1fr)`,
      }}
    >
      <div className="bg-neo-yellow border-r-[3px] border-black" />
      {eventsByDay.map(({ day, events: dayEvents }, dayIndex) => (
        <div
          key={dayIndex}
          className={`bg-white min-h-[60px] p-2 flex flex-col gap-1 ${
            dayIndex === displayDays.length - 1
              ? "border-r-[3px] border-r-black"
              : "border-r border-r-gray-200"
          }`}
        >
          {dayEvents.map((event) => (
            <div
              key={event.id}
              className={`border-[3px] border-black rounded-lg px-2 py-1 cursor-pointer transition-all duration-200 ${
                selectedEvent?.id === event.id
                  ? "shadow-neo-md scale-[1.02] z-10"
                  : "shadow-neo z-5"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEvent(event);
              }}
              style={{
                background: event.color,
              }}
            >
              <div className="font-bold text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                {event.title || "Sans titre"}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
