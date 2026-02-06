import React, { useEffect, useState } from "react";
import { Status } from "../../../components/ui/Status";
import type { StatusFieldConfig } from "../../../types/FieldConfig";
import type { CalendarEvent } from "../../../types";
import { storageProvider } from "../../../storage/IndexedDBStorageProvider";

interface EventStatusFieldProps {
  config: StatusFieldConfig;
  event: CalendarEvent;
}

export const EventStatusField: React.FC<EventStatusFieldProps> = ({
  config,
  event,
}) => {
  const [statusValue, setStatusValue] = useState<number>(3);

  const getStatusId = () => {
    return `status-${config.id}-event-${event.id}`;
  };

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const statusId = getStatusId();
        let status = await storageProvider.getStatus(statusId);

        if (!status) {
          const defaultValue =
            config.defaultValue !== undefined ? config.defaultValue : 3;

          status = {
            id: statusId,
            fieldId: config.id,
            eventId: event.id,
            value: defaultValue,
          };
          await storageProvider.saveStatus(status);
        }

        setStatusValue(status.value);
      } catch (error) {
        console.error("Error loading status:", error);
      }
    };

    loadStatus();
  }, [config.id, event.id, config.defaultValue]);

  const handleChange = async (newValue: number) => {
    try {
      const statusId = getStatusId();
      await storageProvider.updateStatusValue(statusId, newValue);
      setStatusValue(newValue);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return <Status value={statusValue} onChange={handleChange} size="small" />;
};
