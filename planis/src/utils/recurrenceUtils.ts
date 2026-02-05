import type { CalendarEvent } from "../types";

export const expandEvents = (
  events: CalendarEvent[],
  rangeStart: Date,
  rangeEnd: Date,
): CalendarEvent[] => {
  const expandedEvents: CalendarEvent[] = [];

  events.forEach((event) => {
    if (!event.recurrence) {
      if (
        (event.start >= rangeStart && event.start <= rangeEnd) ||
        (event.end >= rangeStart && event.end <= rangeEnd) ||
        (event.start <= rangeStart && event.end >= rangeEnd)
      ) {
        expandedEvents.push(event);
      }
      return;
    }

    const { type, endDate } = event.recurrence;
    let currentInstanceStart = new Date(event.start);
    let currentInstanceEnd = new Date(event.end);
    const duration =
      currentInstanceEnd.getTime() - currentInstanceStart.getTime();

    const effectiveEndDate = endDate && endDate < rangeEnd ? endDate : rangeEnd;

    while (currentInstanceStart <= effectiveEndDate) {
      if (
        (currentInstanceStart >= rangeStart &&
          currentInstanceStart <= rangeEnd) ||
        (currentInstanceEnd >= rangeStart && currentInstanceEnd <= rangeEnd) ||
        (currentInstanceStart <= rangeStart && currentInstanceEnd >= rangeEnd)
      ) {
        expandedEvents.push({
          ...event,
          id: `${event.id}_${currentInstanceStart.getTime()}`,
          start: new Date(currentInstanceStart),
          end: new Date(currentInstanceEnd),
        });
      }

      const advanceDate = (
        date: Date,
        amount: number,
        unit: "day" | "week" | "month" | "year",
      ) => {
        const newDate = new Date(date);
        if (unit === "day") newDate.setDate(newDate.getDate() + amount);
        if (unit === "week") newDate.setDate(newDate.getDate() + amount * 7);
        if (unit === "month") newDate.setMonth(newDate.getMonth() + amount);
        if (unit === "year")
          newDate.setFullYear(newDate.getFullYear() + amount);
        return newDate;
      };

      const getNthWeekdayOfMonth = (
        year: number,
        month: number,
        weekday: number,
        nth: number,
      ) => {
        const firstDayOfMonth = new Date(year, month, 1);
        let day = firstDayOfMonth.getDay();
        let date = 1;

        while (day !== weekday) {
          day = (day + 1) % 7;
          date++;
        }

        date += (nth - 1) * 7;

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        if (date > daysInMonth) {
          return null;
        }

        return new Date(
          year,
          month,
          date,
          currentInstanceStart.getHours(),
          currentInstanceStart.getMinutes(),
        );
      };

      switch (type) {
        case "daily":
          currentInstanceStart = advanceDate(currentInstanceStart, 1, "day");
          break;
        case "weekly":
          currentInstanceStart = advanceDate(currentInstanceStart, 1, "week");
          break;
        case "biweekly":
          currentInstanceStart = advanceDate(currentInstanceStart, 2, "week");
          break;
        case "monthly":
          currentInstanceStart = advanceDate(currentInstanceStart, 1, "month");
          break;
        case "monthly_day":
          const originalDay = event.start.getDate();
          const originalWeekday = event.start.getDay();
          const nth = Math.floor((originalDay - 1) / 7) + 1;

          let nextMonthDate = new Date(currentInstanceStart);
          let found = false;

          while (!found && nextMonthDate <= effectiveEndDate) {
            nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
            const candidate = getNthWeekdayOfMonth(
              nextMonthDate.getFullYear(),
              nextMonthDate.getMonth(),
              originalWeekday,
              nth,
            );

            if (candidate) {
              currentInstanceStart = candidate;
              found = true;
            }
          }
          if (!found) {
            currentInstanceStart = new Date(effectiveEndDate.getTime() + 1);
          }
          break;
        case "yearly":
          currentInstanceStart = advanceDate(currentInstanceStart, 1, "year");
          break;
      }

      currentInstanceEnd = new Date(currentInstanceStart.getTime() + duration);
    }
  });

  return expandedEvents;
};
