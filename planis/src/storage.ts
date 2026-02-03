import type { CalendarEvent } from "./types";

const KEY = "planis_events_v1";

export function loadEvents(): CalendarEvent[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CalendarEvent[];
  } catch (e) {
    console.error("loadEvents error", e);
    return [];
  }
}

export function saveEvents(events: CalendarEvent[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(events));
  } catch (e) {
    console.error("saveEvents error", e);
  }
}
