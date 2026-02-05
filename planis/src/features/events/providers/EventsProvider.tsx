import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { CalendarEvent } from "../../../types";
import { storageProvider } from "../../../storage/IndexedDBStorageProvider";

export interface EventsContextType {
  events: CalendarEvent[];
  loading: boolean;
  selectedEvent: CalendarEvent | null;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<CalendarEvent>;
  updateEvent: (updates: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: () => Promise<void>;
  removeDrafts: () => Promise<void>;
  updateCustomField: (key: string, value: any) => void;
  getCustomFieldValue: (key: string) => any;
  refreshEvents: () => Promise<void>;
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
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  const refreshEvents = async () => {
    try {
      const allEvents = await storageProvider.getAllEvents();
      setEvents(allEvents);
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  useEffect(() => {
    const initEvents = async () => {
      setLoading(true);
      await refreshEvents();
      setLoading(false);
    };

    initEvents();
  }, []);

  const addEvent = async (event: Omit<CalendarEvent, "id">): Promise<CalendarEvent> => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    };

    await storageProvider.saveEvent(newEvent);
    await refreshEvents();
    
    return newEvent;
  };

  const removeDrafts = async () => {
    const drafts = events.filter((e) => e.isDraft);
    for (const draft of drafts) {
      await storageProvider.deleteEvent(draft.id);
    }
    await refreshEvents();
  };

  const updateEvent = async (updates: Partial<CalendarEvent>) => {
    if (!selectedEvent) return;

    const updatedEvent = { ...selectedEvent, ...updates };

    if (selectedEvent.isDraft && updates.title && updates.title.trim()) {
      updatedEvent.isDraft = false;
    }

    setSelectedEvent(updatedEvent);
    setEvents((prevEvents) =>
      prevEvents.map((e) => (e.id === selectedEvent.id ? updatedEvent : e)),
    );

    try {
      await storageProvider.updateEvent(selectedEvent.id, updatedEvent);
    } catch (error) {
      console.error('Failed to update event:', error);
      setSelectedEvent(selectedEvent);
      await refreshEvents();
    }
  };

  const deleteEvent = async () => {
    if (!selectedEvent) return;

    await storageProvider.deleteEvent(selectedEvent.id);
    await refreshEvents();
    setSelectedEvent(null);
  };

  const updateCustomField = (key: string, value: any) => {
    if (!selectedEvent) return;

    const updatedValues = {
      ...selectedEvent.customFieldsValues,
      [key]: value,
    };

    updateEvent({ customFieldsValues: updatedValues });
  };

  const getCustomFieldValue = (key: string): any => {
    if (!selectedEvent) return undefined;
    return selectedEvent.customFieldsValues[key];
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
    loading,
    selectedEvent,
    setSelectedEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    removeDrafts,
    updateCustomField,
    getCustomFieldValue,
    refreshEvents,
    getEventStyle,
  };

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
};
