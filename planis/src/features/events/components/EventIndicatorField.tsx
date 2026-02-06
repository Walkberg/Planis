import React, { useEffect, useState } from "react";
import type { IndicatorFieldConfig } from "../../../types/FieldConfig";
import type { CalendarEvent } from "../../../types";
import { storageProvider } from "../../../storage/IndexedDBStorageProvider";
import { Slider } from "../../../components/ui/Slider";

interface EventIndicatorFieldProps {
  config: IndicatorFieldConfig;
  event: CalendarEvent;
}

export const EventIndicatorField: React.FC<EventIndicatorFieldProps> = ({
  config,
  event,
}) => {
  const [indicatorValue, setIndicatorValue] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const getIndicatorId = () => {
    return `indicator-${config.id}-event-${event.id}`;
  };

  useEffect(() => {
    const loadIndicator = async () => {
      try {
        const indicatorId = getIndicatorId();
        let indicator = await storageProvider.getIndicator(indicatorId);

        if (!indicator) {
          const defaultValue =
            config.defaultValue !== undefined
              ? config.defaultValue
              : Math.floor((config.min + config.max) / 2);

          indicator = {
            id: indicatorId,
            fieldId: config.id,
            eventId: event.id,
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
  }, [config.id, event.id, config.min, config.max, config.defaultValue]);

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
      <div className="flex items-center justify-center p-4 bg-gray-100 border-[3px] border-black rounded-lg">
        <span className="text-sm text-gray-500">Chargement...</span>
      </div>
    );
  }

  return (
    <Slider
      value={indicatorValue}
      min={config.min}
      max={config.max}
      onChange={handleChange}
    />
  );
};
