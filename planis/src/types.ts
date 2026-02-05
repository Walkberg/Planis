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
    type: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'monthly_day' | 'yearly';
    endDate?: Date;
  };
}
