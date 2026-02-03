import { useRef } from "react";
import { useCalendar } from "../providers/CalendarProvider";
import { CalendarHour } from "./CalendarHour";
import { CalendarEvents } from "../../events/components/CalendarEvents";

export const CalendarView = () => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const { currentTime, getDisplayDays, isToday } = useCalendar();
  const displayDays = getDisplayDays();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div
      ref={calendarRef}
      className="flex-1 overflow-auto bg-neo-yellow relative"
    >
      {(() => {
        const now = currentTime;
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();
        const topPosition = currentHour * 60 + currentMinutes + 61;
        const isTodayDisplayed = displayDays.some((day) => isToday(day));

        if (isTodayDisplayed) {
          return (
            <div
              className="absolute left-[60px] right-0 h-[3px] bg-neo-orange z-[100] pointer-events-none"
              style={{
                top: `${topPosition}px`,
                boxShadow: "0 0 8px rgba(255, 107, 53, 0.6)",
              }}
            >
              <div className="absolute -left-1.5 -top-[5px] w-3 h-3 rounded-full bg-neo-orange border-2 border-black" />
            </div>
          );
        }
        return null;
      })()}

      <div
        className="grid min-h-full"
        style={{
          gridTemplateColumns: `60px repeat(${displayDays.length}, 1fr)`,
        }}
      >
        <div className="sticky top-0 bg-neo-yellow border-r-[3px] border-b-[3px] border-black z-[2]" />
        {displayDays.map((day, i) => (
          <div
            key={i}
            className={`sticky top-0 border-[3px] border-black p-4 text-center font-bold z-[2]  ${
              i === 0 ? "border-l-[3px]" : "border-l-0"
            } ${
              isToday(day) ? "bg-neo-orange shadow-[0_4px_0_#000]" : "bg-white"
            }`}
          >
            <div className="text-xs uppercase">
              {day.toLocaleDateString("fr-FR", { weekday: "short" })}
            </div>
            <div className="text-2xl mt-1">{day.getDate()}</div>
          </div>
        ))}
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
      <CalendarEvents displayDays={displayDays} calendarRef={calendarRef} />
    </div>
  );
};
