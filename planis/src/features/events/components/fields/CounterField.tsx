import React, { useEffect, useState } from "react";
import type { CounterFieldConfig } from "../../../../types/FieldConfig";
import { Counter } from "../../../../components/ui/Counter";
import { storageProvider } from "../../../../storage/IndexedDBStorageProvider";

interface CounterFieldProps {
  field: CounterFieldConfig;
  eventId: string;
  configId: string;
}

export const CounterField: React.FC<CounterFieldProps> = ({
  field,
  eventId,
  configId,
}) => {
  const [counterValue, setCounterValue] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const getCounterId = () => {
    if (field.scope === "config") {
      return `counter-${field.id}-config-${configId}`;
    } else {
      return `counter-${field.id}-event-${eventId}`;
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
            fieldId: field.id,
            configId: field.scope === "config" ? configId : undefined,
            eventId: field.scope === "event" ? eventId : undefined,
            value: 0,
          };
          await storageProvider.saveCounter(counter);
        }

        setCounterValue(counter.value);
      } catch (error) {
        console.error("Error loading counter:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCounter();
  }, [field.id, field.scope, eventId, configId]);

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
    <Counter
      label={field.label}
      value={counterValue}
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
      required={field.required}
    />
  );
};
