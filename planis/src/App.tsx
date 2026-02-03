import React, { useState, useRef, useEffect } from "react";

export const CalendarApp = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewDays, setViewDays] = useState(7);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const calendarRef = useRef(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getDisplayDays = () => {
    const days = [];
    const start = new Date(currentDate);
    start.setHours(0, 0, 0, 0);

    if (viewDays === 1) {
      days.push(new Date(start));
    } else {
      const dayOfWeek = start.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      start.setDate(start.getDate() + diff);

      for (let i = 0; i < viewDays; i++) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        days.push(day);
      }
    }
    return days;
  };

  const displayDays = getDisplayDays();

  const getMonthCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({ date, isCurrentMonth: true });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  };

  const monthCalendar = getMonthCalendar();

  const formatTime = (hour) => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isToday = (date) => {
    return isSameDay(date, new Date());
  };

  const handleMouseDown = (day, hour, e) => {
    if (e.target.closest(".event")) return;

    const startTime = new Date(day);
    startTime.setHours(hour, 0, 0, 0);

    setIsDragging(true);
    setDragStart({ day, hour, startTime });
    setDragEnd({ day, hour, startTime });
  };

  const handleMouseEnterCell = (day, hour) => {
    if (!isDragging || !dragStart) return;

    const endTime = new Date(day);
    endTime.setHours(hour + 1, 0, 0, 0);

    setDragEnd({ day, hour, endTime });
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (!isDragging || !dragStart || !dragEnd) return;

      if (dragEnd.endTime > dragStart.startTime) {
        const newEvent = {
          id: Date.now(),
          title: "Nouvel événement",
          start: dragStart.startTime,
          end: dragEnd.endTime,
          color: "#ff6b35",
        };
        setEvents((prevEvents) => [...prevEvents, newEvent]);
        setSelectedEvent(newEvent);
      }

      setIsDragging(false);
      setDragStart(null);
      setDragEnd(null);
    };

    if (isDragging) {
      window.addEventListener("mouseup", handleGlobalMouseUp);
      return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
    }
  }, [isDragging, dragStart, dragEnd]);

  const getEventStyle = (event, day) => {
    if (!isSameDay(event.start, day)) return null;

    const startHour = event.start.getHours() + event.start.getMinutes() / 60;
    const endHour = event.end.getHours() + event.end.getMinutes() / 60;
    const duration = endHour - startHour;

    return {
      top: `${startHour * 60}px`,
      height: `${duration * 60}px`,
    };
  };

  const handleResizeStart = (event, e) => {
    e.stopPropagation();
    setIsResizing(event.id);
    setSelectedEvent(event);
  };

  const handleResizeMove = (e) => {
    if (!isResizing) return;
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleResizeMove);
      window.addEventListener("mouseup", handleResizeEnd);
      return () => {
        window.removeEventListener("mousemove", handleResizeMove);
        window.removeEventListener("mouseup", handleResizeEnd);
      };
    }
  }, [isResizing]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const updateEvent = (updates) => {
    setEvents(
      events.map((e) => (e.id === selectedEvent.id ? { ...e, ...updates } : e)),
    );
    setSelectedEvent({ ...selectedEvent, ...updates });
  };

  const deleteEvent = () => {
    setEvents(events.filter((e) => e.id !== selectedEvent.id));
    setSelectedEvent(null);
  };

  const changeMonth = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  return (
    <div
      style={{
        fontFamily: "'Space Mono', monospace",
        height: "100vh",
        background: "#FFFDE7",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "280px",
          background: "#FFFDE7",
          borderRight: "4px solid #000",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            background: "#00D9FF",
            border: "4px solid #000",
            padding: "15px",
            marginBottom: "20px",
            boxShadow: "8px 8px 0 #000",
            borderRadius: "12px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Calendrier
          </h2>
        </div>

        <div
          style={{
            background: "#fff",
            border: "4px solid #000",
            padding: "15px",
            boxShadow: "6px 6px 0 #000",
            borderRadius: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <button
              onClick={() => changeMonth(-1)}
              style={{
                background: "#F7931E",
                border: "3px solid #000",
                padding: "5px 10px",
                cursor: "pointer",
                fontFamily: "Space Mono",
                fontWeight: 700,
                fontSize: "16px",
                borderRadius: "8px",
              }}
            >
              ◀
            </button>
            <div style={{ fontWeight: 700, fontSize: "14px" }}>
              {currentDate.toLocaleDateString("fr-FR", {
                month: "long",
                year: "numeric",
              })}
            </div>
            <button
              onClick={() => changeMonth(1)}
              style={{
                background: "#F7931E",
                border: "3px solid #000",
                padding: "5px 10px",
                cursor: "pointer",
                fontFamily: "Space Mono",
                fontWeight: 700,
                fontSize: "16px",
                borderRadius: "8px",
              }}
            >
              ▶
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "4px",
            }}
          >
            {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "12px",
                  padding: "5px 0",
                }}
              >
                {day}
              </div>
            ))}
            {monthCalendar.map((day, i) => (
              <div
                key={i}
                onClick={() => setCurrentDate(new Date(day.date))}
                style={{
                  textAlign: "center",
                  padding: "8px 4px",
                  fontSize: "12px",
                  cursor: "pointer",
                  background: isToday(day.date)
                    ? "#ff6b35"
                    : isSameDay(day.date, currentDate)
                      ? "#7B2FBE"
                      : "#fff",
                  color: day.isCurrentMonth ? "#000" : "#999",
                  border: "2px solid #000",
                  borderRadius: "8px",
                  fontWeight:
                    isToday(day.date) || isSameDay(day.date, currentDate)
                      ? 700
                      : 400,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!isToday(day.date) && !isSameDay(day.date, currentDate)) {
                    e.target.style.background = "#00D9FF";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isToday(day.date) && !isSameDay(day.date, currentDate)) {
                    e.target.style.background = "#fff";
                  }
                }}
              >
                {day.date.getDate()}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            background: "#7B2FBE",
            border: "4px solid #000",
            padding: "15px",
            boxShadow: "6px 6px 0 #000",
            borderRadius: "12px",
            color: "#fff",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "10px" }}>
            📅 {events.length} événements
          </div>
          <div style={{ fontSize: "12px", opacity: 0.9 }}>
            Cliquez sur une heure pour créer un événement
          </div>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderBottom: "4px solid #000",
            padding: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {currentDate.toLocaleDateString("fr-FR", {
              month: "long",
              year: "numeric",
            })}
          </h1>

          <div style={{ display: "flex", gap: "10px" }}>
            {[1, 3, 7].map((days) => (
              <button
                key={days}
                onClick={() => setViewDays(days)}
                style={{
                  background: viewDays === days ? "#ff6b35" : "#fff",
                  border: "3px solid #000",
                  padding: "12px 24px",
                  cursor: "pointer",
                  fontFamily: "Space Mono",
                  fontWeight: 700,
                  fontSize: "16px",
                  borderRadius: "10px",
                  boxShadow: viewDays === days ? "4px 4px 0 #000" : "none",
                  transform:
                    viewDays === days ? "translate(-2px, -2px)" : "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (viewDays !== days) {
                    e.target.style.background = "#00D9FF";
                  }
                }}
                onMouseLeave={(e) => {
                  if (viewDays !== days) {
                    e.target.style.background = "#fff";
                  }
                }}
              >
                {days} jour{days > 1 ? "s" : ""}
              </button>
            ))}
          </div>
        </div>
        <div
          ref={calendarRef}
          style={{
            flex: 1,
            overflow: "auto",
            background: "#FFFDE7",
            position: "relative",
          }}
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
                  style={{
                    position: "absolute",
                    top: `${topPosition}px`,
                    left: "60px",
                    right: 0,
                    height: "3px",
                    background: "#ff6b35",
                    zIndex: 100,
                    pointerEvents: "none",
                    boxShadow: "0 0 8px rgba(255, 107, 53, 0.6)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "-6px",
                      top: "-5px",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "#ff6b35",
                      border: "2px solid #000",
                    }}
                  />
                </div>
              );
            }
            return null;
          })()}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `60px repeat(${displayDays.length}, 1fr)`,
              minHeight: "100%",
            }}
          >
            <div
              style={{
                position: "sticky",
                top: 0,
                background: "#FFFDE7",
                borderRight: "3px solid #000",
                borderBottom: "3px solid #000",
                zIndex: 2,
              }}
            />
            {displayDays.map((day, i) => (
              <div
                key={i}
                style={{
                  position: "sticky",
                  top: 0,
                  background: isToday(day) ? "#ff6b35" : "#fff",
                  border: "3px solid #000",
                  borderLeft: i === 0 ? "3px solid #000" : "none",
                  padding: "15px",
                  textAlign: "center",
                  fontWeight: 700,
                  zIndex: 2,
                  borderRadius: "10px",
                  boxShadow: isToday(day) ? "0 4px 0 #000" : "none",
                }}
              >
                <div style={{ fontSize: "12px", textTransform: "uppercase" }}>
                  {day.toLocaleDateString("fr-FR", { weekday: "short" })}
                </div>
                <div style={{ fontSize: "24px", marginTop: "5px" }}>
                  {day.getDate()}
                </div>
              </div>
            ))}

            {hours.map((hour) => (
              <React.Fragment key={hour}>
                <div
                  style={{
                    borderRight: "3px solid #000",
                    borderBottom: "1px solid #ccc",
                    padding: "5px",
                    textAlign: "right",
                    fontSize: "12px",
                    fontWeight: 700,
                    background: "#FFFDE7",
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                  }}
                >
                  {formatTime(hour)}
                </div>

                {displayDays.map((day, dayIndex) => (
                  <div
                    key={`${hour}-${dayIndex}`}
                    onMouseDown={(e) => handleMouseDown(day, hour, e)}
                    onMouseEnter={() => handleMouseEnterCell(day, hour)}
                    style={{
                      borderRight:
                        dayIndex === displayDays.length - 1
                          ? "3px solid #000"
                          : "1px solid #ddd",
                      borderBottom: "1px solid #ccc",
                      minHeight: "60px",
                      position: "relative",
                      cursor: "pointer",
                      background: "#fff",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => {
                      handleMouseEnterCell(day, hour);
                      if (!isDragging) {
                        e.target.style.background = "#f0f0f0";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isDragging) {
                        e.target.style.background = "#fff";
                      }
                    }}
                  >
                    {events.map((event) => {
                      const style = getEventStyle(event, day);
                      if (!style) return null;

                      return (
                        <div
                          key={event.id}
                          className="event"
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
                            position: "absolute",
                            left: "4px",
                            right: "4px",
                            ...style,
                            background: event.color,
                            border: "3px solid #000",
                            borderRadius: "10px",
                            padding: "8px",
                            cursor: "pointer",
                            zIndex: selectedEvent?.id === event.id ? 10 : 5,
                            boxShadow:
                              selectedEvent?.id === event.id
                                ? "4px 4px 0 #000"
                                : "2px 2px 0 #000",
                            transform:
                              selectedEvent?.id === event.id
                                ? "scale(1.02)"
                                : "scale(1)",
                            transition: "all 0.2s",
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: "12px",
                              marginBottom: "4px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {event.title}
                          </div>
                          <div style={{ fontSize: "10px" }}>
                            {event.start.toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -
                            {event.end.toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <div
                            onMouseDown={(e) => handleResizeStart(event, e)}
                            style={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              height: "8px",
                              cursor: "ns-resize",
                              background: "#000",
                              opacity: 0.3,
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {selectedEvent && (
        <div
          style={{
            width: "320px",
            background: "#fff",
            borderLeft: "4px solid #000",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              background: "#7B2FBE",
              border: "4px solid #000",
              padding: "15px",
              marginBottom: "20px",
              boxShadow: "6px 6px 0 #000",
              borderRadius: "12px",
              color: "#fff",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Éditer l'événement
            </h3>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 700,
                  marginBottom: "8px",
                  fontSize: "14px",
                  textTransform: "uppercase",
                }}
              >
                Titre
              </label>
              <input
                type="text"
                value={selectedEvent.title}
                onChange={(e) => updateEvent({ title: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "3px solid #000",
                  borderRadius: "8px",
                  fontFamily: "Space Mono",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 700,
                  marginBottom: "8px",
                  fontSize: "14px",
                  textTransform: "uppercase",
                }}
              >
                Date de début
              </label>
              <input
                type="datetime-local"
                value={selectedEvent.start.toISOString().slice(0, 16)}
                onChange={(e) =>
                  updateEvent({ start: new Date(e.target.value) })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "3px solid #000",
                  borderRadius: "8px",
                  fontFamily: "Space Mono",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 700,
                  marginBottom: "8px",
                  fontSize: "14px",
                  textTransform: "uppercase",
                }}
              >
                Date de fin
              </label>
              <input
                type="datetime-local"
                value={selectedEvent.end.toISOString().slice(0, 16)}
                onChange={(e) => updateEvent({ end: new Date(e.target.value) })}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "3px solid #000",
                  borderRadius: "8px",
                  fontFamily: "Space Mono",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 700,
                  marginBottom: "8px",
                  fontSize: "14px",
                  textTransform: "uppercase",
                }}
              >
                Couleur
              </label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["#ff6b35", "#00D9FF", "#7B2FBE", "#F7931E"].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateEvent({ color })}
                    style={{
                      width: "50px",
                      height: "50px",
                      background: color,
                      border:
                        selectedEvent.color === color
                          ? "4px solid #000"
                          : "3px solid #000",
                      borderRadius: "10px",
                      cursor: "pointer",
                      boxShadow:
                        selectedEvent.color === color
                          ? "4px 4px 0 #000"
                          : "none",
                      transform:
                        selectedEvent.color === color
                          ? "scale(1.1)"
                          : "scale(1)",
                      transition: "all 0.2s",
                    }}
                  />
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() => setSelectedEvent(null)}
                style={{
                  flex: 1,
                  background: "#00D9FF",
                  border: "3px solid #000",
                  borderRadius: "10px",
                  padding: "15px",
                  cursor: "pointer",
                  fontFamily: "Space Mono",
                  fontWeight: 700,
                  fontSize: "14px",
                  textTransform: "uppercase",
                  boxShadow: "4px 4px 0 #000",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#00B8D9";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#00D9FF";
                }}
              >
                Fermer
              </button>
              <button
                onClick={deleteEvent}
                style={{
                  flex: 1,
                  background: "#ff6b35",
                  border: "3px solid #000",
                  borderRadius: "10px",
                  padding: "15px",
                  cursor: "pointer",
                  fontFamily: "Space Mono",
                  fontWeight: 700,
                  fontSize: "14px",
                  textTransform: "uppercase",
                  boxShadow: "4px 4px 0 #000",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#e55a2b";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#ff6b35";
                }}
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
