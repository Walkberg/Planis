export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  isAllDay: boolean;
  eventConfigId: string;
  customFieldsValues: Record<string, any>;
  isDraft?: boolean;
  recurrence?: {
    type: RecurrenceType;
    endDate?: Date;
  };
}

export type RecurrenceType =
  | "daily"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "monthly_day"
  | "yearly";
