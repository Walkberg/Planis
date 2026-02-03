export type EventType = "anniversaire" | "evenement" | "tache";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: EventType;
  activity?: string;
  notes?: string;
  completed?: boolean;
}
