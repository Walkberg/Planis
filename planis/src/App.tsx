import { useRef } from "react";
import { useCalendar } from "./features/calendar/providers/CalendarProvider";
import { useEvents } from "./features/events/providers/EventsProvider";
import { useDragInteraction } from "./features/interactions/providers/DragInteractionProvider";

export const CalendarApp = () => {
  const calendarRef = useRef(null);

  const {
    currentDate,
    currentTime,
    viewDays,
    setCurrentDate,
    setViewDays,
    changeMonth,
    getDisplayDays,
    getMonthCalendar,
    isSameDay,
    isToday,
  } = useCalendar();

  const {
    events,
    selectedEvent,
    setSelectedEvent,
    updateEvent,
    deleteEvent,
    getEventStyle,
  } = useEvents();

  const { handleMouseDown, handleMouseEnterCell, handleResizeStart } =
    useDragInteraction();

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const displayDays = getDisplayDays();
  const monthCalendar = getMonthCalendar();

  const formatTime = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  return (
    <div className="font-space h-screen bg-neo-yellow flex overflow-hidden">
      <div className="w-[280px] bg-neo-yellow border-r-4 border-black p-5 overflow-y-auto">
        <div className="bg-neo-cyan border-4 border-black p-4 mb-5 shadow-neo-xl rounded-xl">
          <h2 className="m-0 text-2xl font-bold uppercase">Calendrier</h2>
        </div>

        <div className="bg-white border-4 border-black p-4 shadow-neo-lg rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => changeMonth(-1)}
              className="bg-neo-amber border-[3px] border-black py-1 px-2.5 cursor-pointer font-space font-bold text-base rounded-lg hover:scale-105 transition-transform"
            >
              ◀
            </button>
            <div className="font-bold text-sm">
              {currentDate.toLocaleDateString("fr-FR", {
                month: "long",
                year: "numeric",
              })}
            </div>
            <button
              onClick={() => changeMonth(1)}
              className="bg-neo-amber border-[3px] border-black py-1 px-2.5 cursor-pointer font-space font-bold text-base rounded-lg hover:scale-105 transition-transform"
            >
              ▶
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => (
              <div key={i} className="text-center font-bold text-xs py-1">
                {day}
              </div>
            ))}
            {monthCalendar.map((day, i) => (
              <div
                key={i}
                onClick={() => setCurrentDate(new Date(day.date))}
                className={`text-center px-1 py-2 text-xs cursor-pointer border-2 border-black rounded-lg transition-all duration-200 hover:bg-neo-cyan ${
                  isToday(day.date)
                    ? "bg-neo-orange font-bold"
                    : isSameDay(day.date, currentDate)
                      ? "bg-neo-purple font-bold text-white"
                      : "bg-white"
                } ${day.isCurrentMonth ? "text-black" : "text-gray-400"}`}
              >
                {day.date.getDate()}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 bg-neo-purple border-4 border-black p-4 shadow-neo-lg rounded-xl text-white">
          <div className="font-bold mb-2.5">📅 {events.length} événements</div>
          <div className="text-xs opacity-90">
            Cliquez sur une heure pour créer un événement
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b-4 border-black p-5 flex justify-between items-center">
          <h1 className="m-0 text-[32px] font-bold uppercase">
            {currentDate.toLocaleDateString("fr-FR", {
              month: "long",
              year: "numeric",
            })}
          </h1>

          <div className="flex gap-2.5">
            {[1, 3, 7].map((days) => (
              <button
                key={days}
                onClick={() => setViewDays(days)}
                className={`border-[3px] border-black py-3 px-6 cursor-pointer font-space font-bold text-base rounded-[10px] transition-all duration-200 hover:bg-neo-cyan ${
                  viewDays === days
                    ? "bg-neo-orange shadow-neo-md -translate-x-0.5 -translate-y-0.5"
                    : "bg-white"
                }`}
              >
                {days} jour{days > 1 ? "s" : ""}
              </button>
            ))}
          </div>
        </div>

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
                className={`sticky top-0 border-[3px] border-black p-4 text-center font-bold z-[2] rounded-[10px] ${
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
            ))}
            {hours.map((hour) => (
              <>
                <div
                  key={`hour-${hour}`}
                  className="border-r-[3px] border-b border-black border-b-gray-300 p-1 text-right text-xs font-bold bg-neo-yellow sticky left-0 z-[1]"
                >
                  {formatTime(hour)}
                </div>

                {displayDays.map((day, dayIndex) => (
                  <div
                    key={`${hour}-${dayIndex}`}
                    onMouseDown={(e) => handleMouseDown(day, hour, e)}
                    onMouseEnter={() => handleMouseEnterCell(day, hour)}
                    className={`border-b border-b-gray-300 min-h-[60px] relative cursor-pointer bg-white transition-colors duration-100 hover:bg-gray-100 ${
                      dayIndex === displayDays.length - 1
                        ? "border-r-[3px] border-r-black"
                        : "border-r border-r-gray-200"
                    }`}
                  >
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
                ))}
              </>
            ))}
          </div>
        </div>
      </div>
      {selectedEvent && (
        <div className="w-80 bg-white border-l-4 border-black p-5 overflow-y-auto">
          <div className="bg-neo-purple border-4 border-black p-4 mb-5 shadow-neo-lg rounded-xl text-white">
            <h3 className="m-0 text-xl font-bold uppercase">
              Éditer l'événement
            </h3>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block font-bold mb-2 text-sm uppercase">
                Titre
              </label>
              <input
                type="text"
                value={selectedEvent.title}
                onChange={(e) => updateEvent({ title: e.target.value })}
                className="w-full p-3 border-[3px] border-black rounded-lg font-space text-sm box-border"
              />
            </div>

            <div>
              <label className="block font-bold mb-2 text-sm uppercase">
                Date de début
              </label>
              <input
                type="datetime-local"
                value={selectedEvent.start.toISOString().slice(0, 16)}
                onChange={(e) =>
                  updateEvent({ start: new Date(e.target.value) })
                }
                className="w-full p-3 border-[3px] border-black rounded-lg font-space text-sm box-border"
              />
            </div>

            <div>
              <label className="block font-bold mb-2 text-sm uppercase">
                Date de fin
              </label>
              <input
                type="datetime-local"
                value={selectedEvent.end.toISOString().slice(0, 16)}
                onChange={(e) => updateEvent({ end: new Date(e.target.value) })}
                className="w-full p-3 border-[3px] border-black rounded-lg font-space text-sm box-border"
              />
            </div>

            <div>
              <label className="block font-bold mb-2 text-sm uppercase">
                Couleur
              </label>
              <div className="flex gap-2 flex-wrap">
                {["#ff6b35", "#00D9FF", "#7B2FBE", "#F7931E"].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateEvent({ color })}
                    className={`w-[50px] h-[50px] rounded-[10px] cursor-pointer transition-all duration-200 ${
                      selectedEvent.color === color
                        ? "border-4 border-black shadow-neo-md scale-110"
                        : "border-[3px] border-black"
                    }`}
                    style={{ background: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setSelectedEvent(null)}
                className="flex-1 bg-neo-cyan border-[3px] border-black rounded-[10px] p-4 cursor-pointer font-space font-bold text-sm uppercase shadow-neo-md transition-all duration-200 hover:bg-[#00B8D9]"
              >
                Fermer
              </button>
              <button
                onClick={deleteEvent}
                className="flex-1 bg-neo-orange border-[3px] border-black rounded-[10px] p-4 cursor-pointer font-space font-bold text-sm uppercase shadow-neo-md transition-all duration-200 hover:bg-[#e55a2b]"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
