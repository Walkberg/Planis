import React from "react";
import { useCalendar } from "../../calendar/providers/CalendarProvider";
import { useEvents } from "../providers/EventsProvider";
import { CalendarEvent } from "./CalendarEvent";
import { expandEvents } from "../../../utils/recurrenceUtils";

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

  const startDate = displayDays[0];
  const endDate = displayDays[displayDays.length - 1];

  const rangeEnd = new Date(endDate);
  rangeEnd.setHours(23, 59, 59, 999);

  const expandedEvents = React.useMemo(() => {
    return expandEvents(events, startDate, rangeEnd);
  }, [events, startDate, rangeEnd]);

  return (
    <>
      {expandedEvents
        .filter((event) => !event.isAllDay)
        .map((event) => {
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
