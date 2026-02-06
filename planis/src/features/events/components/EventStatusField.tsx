import React from "react";
import { Status } from "../../../components/ui/Status";
import type { StatusFieldConfig } from "../../../types/FieldConfig";
import type { CalendarEvent } from "../../../types";
import { useEvents } from "../providers/EventsProvider";

interface EventStatusFieldProps {
  config: StatusFieldConfig;
  event: CalendarEvent;
}

export const EventStatusField: React.FC<EventStatusFieldProps> = ({
  config,
  event,
}) => {
  const { updateCustomField } = useEvents();
  const value = event.customFieldsValues?.[config.key] || 3;

  const handleChange = (newValue: number) => {
    updateCustomField(config.key, newValue);
  };

  return <Status value={value} onChange={handleChange} size="small" />;
};
