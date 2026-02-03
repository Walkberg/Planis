import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  color: string;
  isDraft?: boolean;
  isAllDay?: boolean;
}

interface EventsContextType {
  events: CalendarEvent[];
  selectedEvent: CalendarEvent | null;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (updates: Partial<CalendarEvent>) => void;
  deleteEvent: () => void;
  removeDrafts: () => void;
  getEventStyle: (
    event: CalendarEvent,
    day: Date,
    isSameDay: (d1: Date, d2: Date) => boolean,
  ) => { top: string; height: string } | null;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within EventsProvider");
  }
  return context;
};

interface EventsProviderProps {
  children: ReactNode;
}

export const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  const addEvent = (event: CalendarEvent) => {
    setEvents((prevEvents) => [...prevEvents, event]);
  };

  const removeDrafts = () => {
    setEvents((prevEvents) => prevEvents.filter((e) => !e.isDraft));
  };

  const updateEvent = (updates: Partial<CalendarEvent>) => {
    if (!selectedEvent) return;

    // Si on met à jour le titre d'un draft et qu'il n'est pas vide, valider le draft
    const updatedEvent = { ...selectedEvent, ...updates };
    if (selectedEvent.isDraft && updates.title && updates.title.trim()) {
      updatedEvent.isDraft = false;
    }

    setEvents(
      events.map((e) => (e.id === selectedEvent.id ? updatedEvent : e)),
    );
    setSelectedEvent(updatedEvent);
  };

  const deleteEvent = () => {
    if (!selectedEvent) return;

    setEvents(events.filter((e) => e.id !== selectedEvent.id));
    setSelectedEvent(null);
  };

  const getEventStyle = (
    event: CalendarEvent,
    day: Date,
    isSameDay: (d1: Date, d2: Date) => boolean,
  ): { top: string; height: string } | null => {
    if (!isSameDay(event.start, day)) return null;

    const startHour = event.start.getHours() + event.start.getMinutes() / 60;
    const endHour = event.end.getHours() + event.end.getMinutes() / 60;
    const duration = endHour - startHour;

    return {
      top: `${startHour * 60}px`,
      height: `${duration * 60}px`,
    };
  };

  const value: EventsContextType = {
    events,
    selectedEvent,
    setSelectedEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    removeDrafts,
    getEventStyle,
  };

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
};
