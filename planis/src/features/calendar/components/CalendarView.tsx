import { useRef, useEffect } from "react";
import { useCalendar } from "../providers/CalendarProvider";
import { CalendarHour } from "./CalendarHour";
import { CalendarEvents } from "../../events/components/CalendarEvents";
import { CalendarDragGhost } from "./CalendarDragGhost";
import { CalendarEventDragGhost } from "./CalendarEventDragGhost";
import { useEvents } from "../../events/providers/EventsProvider";
import { useConfig } from "../../configs/providers/ConfigProvider";
import { CalendarTimeIndicator } from "./CalendarTimeIndicator";

const hours = Array.from({ length: 24 }, (_, i) => i);

export const CalendarView = () => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const firstDayRef = useRef<HTMLDivElement>(null);
  const allDayContainerRef = useRef<HTMLDivElement>(null);

  const { currentTime, getDisplayDays, isToday, setHeaderHeight } =
    useCalendar();
  const { events, selectedEvent, setSelectedEvent } = useEvents();
  const { filteredConfigId } = useConfig();
  const displayDays = getDisplayDays();

  const filteredEvents = filteredConfigId
    ? events.filter((e) => e.eventConfigId === filteredConfigId)
    : events;

  useEffect(() => {
    const calculateHeaderHeight = () => {
      const dayHeight = firstDayRef.current?.offsetHeight || 0;
      const allDayHeight = allDayContainerRef.current?.offsetHeight || 0;
      setHeaderHeight(dayHeight + allDayHeight);
    };

    calculateHeaderHeight();

    const resizeObserver = new ResizeObserver(calculateHeaderHeight);

    if (firstDayRef.current) {
      resizeObserver.observe(firstDayRef.current);
    }
    if (allDayContainerRef.current) {
      resizeObserver.observe(allDayContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [setHeaderHeight]);

  const getDaysBetween = (start: Date, end: Date): number => {
    const startDay = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
    );
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    const diffTime = endDay.getTime() - startDay.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays + 1);
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const allDayEvents = filteredEvents.filter((e) => e.isAllDay);

  const eventsWithRows = allDayEvents
    .map((event) => {
      const startIndex = displayDays.findIndex((d) =>
        isSameDay(d, event.start),
      );
      const spanDays = getDaysBetween(event.start, event.end);
      const endIndex = Math.min(
        startIndex + spanDays - 1,
        displayDays.length - 1,
      );

      return {
        event,
        startIndex: startIndex !== -1 ? startIndex : -1,
        endIndex,
        spanDays: startIndex !== -1 ? endIndex - startIndex + 1 : 0,
      };
    })
    .filter((item) => item.startIndex !== -1);

  const sortedEvents = [...eventsWithRows].sort((a, b) => {
    if (a.startIndex !== b.startIndex) return a.startIndex - b.startIndex;
    return a.endIndex - b.endIndex;
  });

  const eventsWithRowsAndPosition: Array<{
    event: (typeof allDayEvents)[0];
    startIndex: number;
    endIndex: number;
    spanDays: number;
    row: number;
  }> = [];

  sortedEvents.forEach((item) => {
    const overlappingEvents = eventsWithRowsAndPosition.filter((placed) => {
      return !(
        placed.endIndex < item.startIndex || placed.startIndex > item.endIndex
      );
    });

    const usedRows = new Set(overlappingEvents.map((e) => e.row));

    let row = 0;
    while (usedRows.has(row)) {
      row++;
    }

    eventsWithRowsAndPosition.push({ ...item, row });
  });

  const maxRow =
    eventsWithRowsAndPosition.length > 0
      ? Math.max(...eventsWithRowsAndPosition.map((e) => e.row))
      : -1;

  return (
    <div
      ref={calendarRef}
      className="flex-1 overflow-auto bg-neo-yellow relative"
    >
      <CalendarTimeIndicator
        currentTime={currentTime}
        isTodayDisplayed={displayDays.some(isToday)}
      />
      <div
        className="grid min-h-full"
        style={{
          gridTemplateColumns: `60px repeat(${displayDays.length}, 1fr)`,
        }}
      >
        <div className="sticky top-0 bg-neo-yellow border-r-[3px] border-b-[3px] border-black z-2" />
        {displayDays.map((day, i) => {
          return (
            <div
              key={i}
              ref={i === 0 ? firstDayRef : null}
              className="sticky top-0 z-2"
            >
              <div
                className={`border-[3px] border-black p-4 text-center font-bold ${
                  i === 0 ? "border-l-[3px]" : "border-l-0"
                } ${
                  isToday(day)
                    ? "bg-neo-orange shadow-[0_4px_0_#000]"
                    : "bg-white"
                }`}
              >
                <div className="text-xs uppercase">
                  {day.toLocaleDateString("fr-FR", { weekday: "short" })}
                </div>
                <div className="text-2xl mt-1">{day.getDate()}</div>
              </div>
            </div>
          );
        })}
        {eventsWithRowsAndPosition.length > 0 && (
          <>
            <div className="sticky top-0 bg-neo-yellow border-r-[3px] border-b-[3px] border-black z-2" />
            <div
              ref={allDayContainerRef}
              className="grid gap-1 p-2 bg-white border-b-[3px] border-black border-l-[3px] border-r-[3px] sticky top-0"
              style={{
                gridColumn: `2 / -1`,
                gridTemplateColumns: `repeat(${displayDays.length}, 1fr)`,
                gridTemplateRows: `repeat(${maxRow + 1}, minmax(30px, auto))`,
              }}
            >
              {eventsWithRowsAndPosition.map(
                ({ event, startIndex, spanDays, row }) => (
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
                      gridColumn: `${startIndex + 1} / span ${spanDays}`,
                      gridRow: row + 1,
                    }}
                  >
                    <div className="font-bold text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                      {event.title || "Sans titre"}
                    </div>
                  </div>
                ),
              )}
            </div>
          </>
        )}

        {hours.map((hour) =>
          displayDays.map((day, dayIndex) => (
            <CalendarHour
              key={`${hour}-${dayIndex}`}
              hour={hour}
              day={day}
              dayIndex={dayIndex}
              isLastDay={dayIndex === displayDays.length - 1}
            />
          )),
        )}
      </div>
      <CalendarDragGhost displayDays={displayDays} calendarRef={calendarRef} />
      <CalendarEventDragGhost />
      <CalendarEvents
        displayDays={displayDays}
        calendarRef={calendarRef}
        filteredEvents={filteredEvents}
      />
    </div>
  );
};
