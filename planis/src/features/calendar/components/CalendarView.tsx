import { useRef } from "react";
import { useCalendar } from "../providers/CalendarProvider";
import { CalendarHour } from "./CalendarHour";
import { CalendarEvents } from "../../events/components/CalendarEvents";
import { CalendarDragGhost } from "./CalendarDragGhost";
import { useEvents } from "../../events/providers/EventsProvider";
import { CalendarTimeIndicator } from "./CalendarTimeIndicator";

const hours = Array.from({ length: 24 }, (_, i) => i);

export const CalendarView = () => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const { currentTime, getDisplayDays, isToday, isSameDay } = useCalendar();
  const { events, selectedEvent, setSelectedEvent } = useEvents();
  const displayDays = getDisplayDays();

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
        <div className="sticky top-0 bg-neo-yellow border-r-[3px] border-b-[3px] border-black z-[2]" />
        {displayDays.map((day, i) => {
          const allDayEvents = events.filter(
            (event) => event.isAllDay && isSameDay(event.start, day),
          );
          return (
            <div key={i} className="sticky top-0 z-[2]">
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
              {allDayEvents.length > 0 && (
                <div
                  className={`bg-white p-2 flex flex-col gap-1 border-b-[3px] border-black ${
                    i === 0 ? "border-l-[3px]" : "border-l-0"
                  } border-r-[3px]`}
                >
                  {allDayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`border-[3px] border-black rounded-lg px-2 py-1 cursor-pointer transition-all duration-200 ${
                        selectedEvent?.id === event.id
                          ? "shadow-neo-md scale-[1.02] z-[10]"
                          : "shadow-neo z-[5]"
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
              )}
            </div>
          );
        })}

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
      <CalendarEvents displayDays={displayDays} calendarRef={calendarRef} />
    </div>
  );
};
