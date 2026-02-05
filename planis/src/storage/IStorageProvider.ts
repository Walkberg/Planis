import type { EventConfig } from "../types/EventConfig";
import type { CalendarEvent } from "../types";

export interface IStorageProvider {
  initialize(): Promise<void>;

  getAllConfigs(): Promise<EventConfig[]>;
  getConfigById(id: string): Promise<EventConfig | null>;
  saveConfig(config: EventConfig): Promise<void>;
  deleteConfig(id: string): Promise<void>;

  getAllEvents(): Promise<CalendarEvent[]>;
  getEventById(id: string): Promise<CalendarEvent | null>;
  saveEvent(event: CalendarEvent): Promise<void>;
  updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<void>;
  deleteEvent(id: string): Promise<void>;

  getEventsByConfigId(configId: string): Promise<CalendarEvent[]>;
}
