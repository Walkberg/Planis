import { useCalendar } from "../../calendar/providers/CalendarProvider";
import { useEvents } from "../providers/EventsProvider";
import { CalendarEvent } from "./CalendarEvent";

interface CalendarEventsProps {
  displayDays: Date[];
  calendarRef: React.RefObject<HTMLElement>;
}

export const CalendarEvents = ({
  displayDays,
  calendarRef,
}: CalendarEventsProps) => {
  const { isSameDay } = useCalendar();
  const { events } = useEvents();

  return (
    <>
      {events.map((event) => {
        const dayIndex = displayDays.findIndex((day) =>
          isSameDay(event.start, day),
        );
        if (dayIndex === -1) return null;

        return (
          <CalendarEvent
            key={event.id}
            event={event}
            dayIndex={dayIndex}
            displayDaysLength={displayDays.length}
            calendarRef={calendarRef}
          />
        );
      })}
    </>
  );
};
