import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import { DEFAULT_CONFIGS, type EventConfig } from "../types/EventConfig";
import type { CalendarEvent } from "../types";
import type { Counter } from "../types/Counter";
import type { Indicator } from "../types/Indicator";
import type { IStorageProvider } from "./IStorageProvider";

interface PlanisDB extends DBSchema {
  eventConfigs: {
    key: string;
    value: EventConfig;
  };
  calendarEvents: {
    key: string;
    value: CalendarEvent;
    indexes: { "by-config": string };
  };
  counters: {
    key: string;
    value: Counter;
    indexes: { "by-config": string; "by-event": string; "by-field": string };
  };
  indicators: {
    key: string;
    value: Indicator;
    indexes: { "by-event": string; "by-field": string };
  };
}

export class IndexedDBStorageProvider implements IStorageProvider {
  private db: IDBPDatabase<PlanisDB> | null = null;
  private readonly DB_NAME = "PlanisDB";
  private readonly DB_VERSION = 3;

  async initialize(): Promise<void> {
    this.db = await openDB<PlanisDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("eventConfigs")) {
          db.createObjectStore("eventConfigs", { keyPath: "id" });
        }

        if (!db.objectStoreNames.contains("calendarEvents")) {
          const eventStore = db.createObjectStore("calendarEvents", {
            keyPath: "id",
          });
          eventStore.createIndex("by-config", "eventConfigId");
        }

        if (!db.objectStoreNames.contains("counters")) {
          const counterStore = db.createObjectStore("counters", {
            keyPath: "id",
          });
          counterStore.createIndex("by-config", "configId");
          counterStore.createIndex("by-event", "eventId");
          counterStore.createIndex("by-field", "fieldId");
        }

        if (!db.objectStoreNames.contains("indicators")) {
          const indicatorStore = db.createObjectStore("indicators", {
            keyPath: "id",
          });
          indicatorStore.createIndex("by-event", "eventId");
          indicatorStore.createIndex("by-field", "fieldId");
        }
      },
    });

    const existingConfigs = await this.getAllConfigs();
    if (existingConfigs.length === 0) {
      for (const config of DEFAULT_CONFIGS) {
        await this.saveConfig(config);
      }
    }

    this.cleanupOldStorage();
  }

  private cleanupOldStorage(): void {
    try {
      localStorage.removeItem("planis_events_v1");
    } catch (e) {
      console.warn("Failed to cleanup old storage:", e);
    }
  }

  async getAllConfigs(): Promise<EventConfig[]> {
    if (!this.db) throw new Error("Database not initialized");
    return this.db.getAll("eventConfigs");
  }

  async getConfigById(id: string): Promise<EventConfig | null> {
    if (!this.db) throw new Error("Database not initialized");
    const config = await this.db.get("eventConfigs", id);
    return config || null;
  }

  async saveConfig(config: EventConfig): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");
    await this.db.put("eventConfigs", config);
  }

  async deleteConfig(id: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");
    await this.db.delete("eventConfigs", id);
  }

  async getAllEvents(): Promise<CalendarEvent[]> {
    if (!this.db) throw new Error("Database not initialized");
    const events = await this.db.getAll("calendarEvents");
    return events.map(this.deserializeEvent);
  }

  async getEventById(id: string): Promise<CalendarEvent | null> {
    if (!this.db) throw new Error("Database not initialized");
    const event = await this.db.get("calendarEvents", id);
    return event ? this.deserializeEvent(event) : null;
  }

  async saveEvent(event: CalendarEvent): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");
    const serialized = this.serializeEvent(event);
    await this.db.put("calendarEvents", serialized);
  }

  async updateEvent(
    id: string,
    updates: Partial<CalendarEvent>,
  ): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");
    const existing = await this.getEventById(id);
    if (!existing) {
      throw new Error(`Event with id ${id} not found`);
    }

    const updated = { ...existing, ...updates };
    await this.saveEvent(updated);
  }

  async deleteEvent(id: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");
    await this.db.delete("calendarEvents", id);
  }

  async getEventsByConfigId(configId: string): Promise<CalendarEvent[]> {
    if (!this.db) throw new Error("Database not initialized");
    const events = await this.db.getAllFromIndex(
      "calendarEvents",
      "by-config",
      configId,
    );
    return events.map(this.deserializeEvent);
  }

  private serializeEvent(event: CalendarEvent): any {
    return {
      ...event,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
    };
  }

  private deserializeEvent(event: any): CalendarEvent {
    return {
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    };
  }

  async getCounter(id: string): Promise<Counter | null> {
    if (!this.db) throw new Error("Database not initialized");
    const counter = await this.db.get("counters", id);
    return counter || null;
  }

  async saveCounter(counter: Counter): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");
    await this.db.put("counters", counter);
  }

  async incrementCounter(id: string, amount: number = 1): Promise<number> {
    if (!this.db) throw new Error("Database not initialized");
    let counter = await this.getCounter(id);

    if (!counter) {
      counter = {
        id,
        fieldId: id.split("-")[1] || "",
        value: 0,
      };
    }

    counter.value += amount;
    await this.saveCounter(counter);
    return counter.value;
  }

  async decrementCounter(id: string, amount: number = 1): Promise<number> {
    if (!this.db) throw new Error("Database not initialized");
    let counter = await this.getCounter(id);

    if (!counter) {
      counter = {
        id,
        fieldId: id.split("-")[1] || "",
        value: 0,
      };
    }

    counter.value = Math.max(0, counter.value - amount);
    await this.saveCounter(counter);
    return counter.value;
  }

  async getCountersByConfigId(configId: string): Promise<Counter[]> {
    if (!this.db) throw new Error("Database not initialized");
    const counters = await this.db.getAllFromIndex(
      "counters",
      "by-config",
      configId,
    );
    return counters;
  }

  async getCountersByEventId(eventId: string): Promise<Counter[]> {
    if (!this.db) throw new Error("Database not initialized");
    const counters = await this.db.getAllFromIndex(
      "counters",
      "by-event",
      eventId,
    );
    return counters;
  }

  // Indicator methods
  async getIndicator(id: string): Promise<Indicator | null> {
    if (!this.db) throw new Error("Database not initialized");
    const indicator = await this.db.get("indicators", id);
    return indicator || null;
  }

  async saveIndicator(indicator: Indicator): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");
    await this.db.put("indicators", indicator);
  }

  async updateIndicatorValue(id: string, value: number): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");
    let indicator = await this.getIndicator(id);

    if (!indicator) {
      throw new Error(`Indicator with id ${id} not found`);
    }

    indicator.value = value;
    await this.saveIndicator(indicator);
  }

  async getIndicatorsByEventId(eventId: string): Promise<Indicator[]> {
    if (!this.db) throw new Error("Database not initialized");
    const indicators = await this.db.getAllFromIndex(
      "indicators",
      "by-event",
      eventId,
    );
    return indicators;
  }
}

export const storageProvider = new IndexedDBStorageProvider();
