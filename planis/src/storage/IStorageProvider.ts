import type { EventConfig } from "../types/EventConfig";
import type { CalendarEvent } from "../types";
import type { Counter } from "../types/Counter";
import type { Indicator } from "../types/Indicator";
import type { Mood } from "../types/Mood";
import type { Status } from "../types/Status";

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

  getCounter(id: string): Promise<Counter | null>;
  saveCounter(counter: Counter): Promise<void>;
  incrementCounter(id: string, amount?: number): Promise<number>;
  decrementCounter(id: string, amount?: number): Promise<number>;
  getCountersByConfigId(configId: string): Promise<Counter[]>;
  getCountersByEventId(eventId: string): Promise<Counter[]>;

  getIndicator(id: string): Promise<Indicator | null>;
  saveIndicator(indicator: Indicator): Promise<void>;
  updateIndicatorValue(id: string, value: number): Promise<void>;
  getIndicatorsByEventId(eventId: string): Promise<Indicator[]>;

  getMood(id: string): Promise<Mood | null>;
  saveMood(mood: Mood): Promise<void>;
  updateMoodValue(id: string, value: string): Promise<void>;
  getMoodsByEventId(eventId: string): Promise<Mood[]>;

  getStatus(id: string): Promise<Status | null>;
  saveStatus(status: Status): Promise<void>;
  updateStatusValue(id: string, value: number): Promise<void>;
  getStatusByEventId(eventId: string): Promise<Status[]>;
}
