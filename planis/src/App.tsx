import React, { useEffect, useState } from "react";
import "./App.css";
import Calendar from "./components/Calendar";
import EventForm from "./components/EventForm";
import type { CalendarEvent } from "./types";
import { loadEvents, saveEvents } from "./storage";

function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | undefined>(undefined);

  useEffect(() => {
    setEvents(loadEvents());
  }, []);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  function handleDayClick(dateISO: string) {
    setEditing({ date: dateISO } as CalendarEvent);
    setShowForm(true);
  }

  function handleEventClick(ev: CalendarEvent) {
    setEditing(ev);
    setShowForm(true);
  }

  function handleSave(ev: CalendarEvent) {
    setEvents((prev) => {
      const exists = prev.find((p) => p.id === ev.id);
      if (exists) return prev.map((p) => (p.id === ev.id ? ev : p));
      return [...prev, ev];
    });
    setShowForm(false);
    setEditing(undefined);
  }

  function handleCancel() {
    setShowForm(false);
    setEditing(undefined);
  }

  return (
    <div className="app-root">
      <header>
        <h1>Planis — Calendrier local</h1>
        <div className="controls">
          <button
            onClick={() => {
              setEditing(undefined);
              setShowForm(true);
            }}
          >
            Créer
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              setEvents([]);
            }}
          >
            Réinitialiser
          </button>
        </div>
      </header>
      <main>
        <Calendar
          events={events}
          onDayClick={handleDayClick}
          onEventClick={handleEventClick}
        />
      </main>
      {showForm && (
        <EventForm
          initial={editing}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default App;
