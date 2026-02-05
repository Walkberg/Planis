import React, { useEffect, useState } from "react";
import type { IndicatorFieldConfig } from "../../../../types/FieldConfig";
import { Indicator } from "../../../../components/ui/Indicator";
import { storageProvider } from "../../../../storage/IndexedDBStorageProvider";

interface IndicatorFieldProps {
  field: IndicatorFieldConfig;
  eventId: string;
}

export const IndicatorField: React.FC<IndicatorFieldProps> = ({
  field,
  eventId,
}) => {
  const [indicatorValue, setIndicatorValue] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const getIndicatorId = () => {
    return `indicator-${field.id}-event-${eventId}`;
  };

  useEffect(() => {
    const loadIndicator = async () => {
      try {
        const indicatorId = getIndicatorId();
        let indicator = await storageProvider.getIndicator(indicatorId);

        if (!indicator) {
          const defaultValue =
            field.defaultValue !== undefined
              ? field.defaultValue
              : Math.floor((field.min + field.max) / 2);

          indicator = {
            id: indicatorId,
            fieldId: field.id,
            eventId: eventId,
            value: defaultValue,
          };
          await storageProvider.saveIndicator(indicator);
        }

        setIndicatorValue(indicator.value);
      } catch (error) {
        console.error("Error loading indicator:", error);
      } finally {
        setLoading(false);
      }
    };

    loadIndicator();
  }, [field.id, eventId, field.min, field.max, field.defaultValue]);

  const handleChange = async (value: number) => {
    try {
      const indicatorId = getIndicatorId();
      await storageProvider.updateIndicatorValue(indicatorId, value);
      setIndicatorValue(value);
    } catch (error) {
      console.error("Error updating indicator:", error);
    }
  };

  if (loading) {
    return (
      <div className="mb-4">
        {field.label && (
          <label className="block font-bold mb-2 text-sm uppercase">
            {field.label}
          </label>
        )}
        <div className="flex items-center justify-center p-4 bg-gray-100 border-[3px] border-black rounded-lg">
          <span className="text-sm text-gray-500">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <Indicator
      label={field.label}
      value={indicatorValue}
      min={field.min}
      max={field.max}
      onChange={handleChange}
      required={field.required}
    />
  );
};
