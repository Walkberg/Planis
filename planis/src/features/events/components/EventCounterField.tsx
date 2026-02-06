import React, { useEffect, useState } from "react";
import { Counter } from "../../../components/ui/Counter";
import type { CounterFieldConfig } from "../../../types/FieldConfig";
import type { CalendarEvent } from "../../../types";
import { storageProvider } from "../../../storage/IndexedDBStorageProvider";

interface EventCounterFieldProps {
  config: CounterFieldConfig;
  event: CalendarEvent;
}

export const EventCounterField: React.FC<EventCounterFieldProps> = ({
  config,
  event,
}) => {
  const [counterValue, setCounterValue] = useState<number>(0);

  const getCounterId = () => {
    if (config.scope === "config") {
      return `counter-${config.id}-config-${event.eventConfigId}`;
    } else {
      return `counter-${config.id}-event-${event.id}`;
    }
  };

  useEffect(() => {
    const loadCounter = async () => {
      try {
        const counterId = getCounterId();
        let counter = await storageProvider.getCounter(counterId);

        if (!counter) {
          counter = {
            id: counterId,
            fieldId: config.id,
            configId: config.scope === "config" ? config.id : undefined,
            eventId: config.scope === "event" ? event.id : undefined,
            value: 0,
          };
          await storageProvider.saveCounter(counter);
        }

        setCounterValue(counter.value);
      } catch (error) {
        console.error("Error loading counter:", error);
      }
    };

    loadCounter();
  }, [config.id, config.scope, event.id, counterValue]);

  const handleIncrement = async () => {
    try {
      const counterId = getCounterId();
      const newValue = await storageProvider.incrementCounter(counterId);
      setCounterValue(newValue);
    } catch (error) {
      console.error("Error incrementing counter:", error);
    }
  };

  const handleDecrement = async () => {
    try {
      const counterId = getCounterId();
      const newValue = await storageProvider.decrementCounter(counterId);
      setCounterValue(newValue);
    } catch (error) {
      console.error("Error decrementing counter:", error);
    }
  };

  return (
    <Counter
      value={counterValue}
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
      size="small"
    />
  );
};
