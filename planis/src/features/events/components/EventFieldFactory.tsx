import React from "react";
import type { FieldConfig } from "../../../types/FieldConfig";
import type { CalendarEvent } from "../../../types";
import { displayConfig } from "../config/EventDisplayConfig";

interface EventFieldFactoryProps {
  field: FieldConfig;
  event: CalendarEvent;
}

export const EventFieldFactory: React.FC<EventFieldFactoryProps> = ({
  field,
  event,
}) => {
  if (!field.displayOnEvent) {
    return null;
  }

  const config = displayConfig[field.type];

  if (!config || !config.displayElement) {
    return null;
  }

  return <>{config.displayElement({ field, event })}</>;
};
