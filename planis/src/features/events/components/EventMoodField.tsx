import React from "react";
import { Mood } from "../../../components/ui/Mood";
import type { MoodFieldConfig } from "../../../types/FieldConfig";
import type { CalendarEvent } from "../../../types";
import { useEvents } from "../providers/EventsProvider";

interface EventMoodFieldProps {
  config: MoodFieldConfig;
  event: CalendarEvent;
}

export const EventMoodField: React.FC<EventMoodFieldProps> = ({
  config,
  event,
}) => {
  const { updateCustomField } = useEvents();
  const value = event.customFieldsValues?.[config.key] || "";

  const handleChange = (newValue: string) => {
    updateCustomField(config.key, newValue);
  };

  return <Mood value={value} onChange={handleChange} size="small" />;
};
