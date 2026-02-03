import React, { useMemo, useState } from "react";
import { type CalendarEvent } from "../types";

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(d: Date, days: number) {
  const n = new Date(d);
  n.setDate(n.getDate() + days);
  return n;
}

function formatISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function Calendar({
  events,
  onDayClick,
  onEventClick,
}: {
  events: CalendarEvent[];
  onDayClick: (dateISO: string) => void;
  onEventClick: (e: CalendarEvent) => void;
}) {
  const [cursor, setCursor] = useState(new Date());

  const monthGrid = useMemo(() => {
    const first = startOfMonth(cursor);
    const dayOfWeek = first.getDay(); // 0..6 Sun..Sat
    const start = addDays(first, -dayOfWeek);
    const cells: { date: Date; iso: string }[] = [];
    for (let i = 0; i < 42; i++) {
      const d = addDays(start, i);
      cells.push({ date: d, iso: formatISO(d) });
    }
    return cells;
  }, [cursor]);

  const eventsByDate = useMemo(() => {
    const m = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const arr = m.get(e.date) || [];
      arr.push(e);
      m.set(e.date, arr);
    }
    return m;
  }, [events]);

  const monthLabel = cursor.toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          onClick={() =>
            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
          }
        >
          {"<"}
        </button>
        <div className="month-label">{monthLabel}</div>
        <button
          onClick={() =>
            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
          }
        >
          {">"}
        </button>
      </div>
      <div className="calendar-grid">
        {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((d) => (
          <div key={d} className="calendar-cell calendar-cell-weekday">
            {d}
          </div>
        ))}
        {monthGrid.map((cell) => {
          const inMonth = cell.date.getMonth() === cursor.getMonth();
          const dayEvents = eventsByDate.get(cell.iso) || [];
          return (
            <div
              key={cell.iso}
              className={`calendar-cell ${inMonth ? "" : "faded"}`}
              onClick={() => onDayClick(cell.iso)}
            >
              <div className="cell-date">{cell.date.getDate()}</div>
              <div className="cell-events">
                {dayEvents.slice(0, 3).map((ev) => (
                  <div
                    key={ev.id}
                    className={`ev ev-${ev.type}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(ev);
                    }}
                  >
                    {ev.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="more">+{dayEvents.length - 3}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
