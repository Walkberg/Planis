import React, { useEffect, useState } from "react";
import type { StatusFieldConfig } from "../../../../types/FieldConfig";
import { Status } from "../../../../components/ui/Status";
import { storageProvider } from "../../../../storage/IndexedDBStorageProvider";

interface StatusFieldProps {
  field: StatusFieldConfig;
  eventId: string;
}

export const StatusField: React.FC<StatusFieldProps> = ({ field, eventId }) => {
  const [statusValue, setStatusValue] = useState<number>(3);
  const [loading, setLoading] = useState(true);

  const getStatusId = () => {
    return `status-${field.id}-event-${eventId}`;
  };

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const statusId = getStatusId();
        let status = await storageProvider.getStatus(statusId);

        if (!status) {
          const defaultValue =
            field.defaultValue !== undefined ? field.defaultValue : 3;

          status = {
            id: statusId,
            fieldId: field.id,
            eventId: eventId,
            value: defaultValue,
          };
          await storageProvider.saveStatus(status);
        }

        setStatusValue(status.value);
      } catch (error) {
        console.error("Error loading status:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStatus();
  }, [field.id, eventId, field.defaultValue]);

  const handleChange = async (newValue: number) => {
    try {
      const statusId = getStatusId();
      await storageProvider.updateStatusValue(statusId, newValue);
      setStatusValue(newValue);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-100 border-[3px] border-black rounded-lg">
        <span className="text-sm text-gray-500">Chargement...</span>
      </div>
    );
  }

  return <Status value={statusValue} onChange={handleChange} />;
};
