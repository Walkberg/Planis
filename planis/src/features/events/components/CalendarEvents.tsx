import React from "react";
import { useCalendar } from "../../calendar/providers/CalendarProvider";
import { CalendarEvent } from "./CalendarEvent";
import { expandEvents } from "../../../utils/recurrenceUtils";
import type { CalendarEvent as CalendarEventType } from "../../../types";

interface CalendarEventsProps {
  displayDays: Date[];
  calendarRef: React.RefObject<HTMLDivElement | null> | null;
  filteredEvents: CalendarEventType[];
}

export const CalendarEvents = ({
  displayDays,
  calendarRef,
  filteredEvents,
}: CalendarEventsProps) => {
  const { isSameDay } = useCalendar();

  const startDate = displayDays[0];
  const endDate = displayDays[displayDays.length - 1];

  const rangeEnd = new Date(endDate);
  rangeEnd.setHours(23, 59, 59, 999);

  const expandedEvents = React.useMemo(() => {
    return expandEvents(filteredEvents, startDate, rangeEnd);
  }, [filteredEvents, startDate, rangeEnd]);

  if (!calendarRef) return null;

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
