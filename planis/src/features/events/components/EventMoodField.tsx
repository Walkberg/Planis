import React, { useEffect, useState } from "react";
import { Mood } from "../../../components/ui/Mood";
import type { MoodFieldConfig } from "../../../types/FieldConfig";
import type { CalendarEvent } from "../../../types";
import { storageProvider } from "../../../storage/IndexedDBStorageProvider";

interface EventMoodFieldProps {
  config: MoodFieldConfig;
  event: CalendarEvent;
}

export const EventMoodField: React.FC<EventMoodFieldProps> = ({
  config,
  event,
}) => {
  const [moodValue, setMoodValue] = useState<string>("");

  const getMoodId = () => {
    return `mood-${config.id}-event-${event.id}`;
  };

  useEffect(() => {
    const loadMood = async () => {
      try {
        const moodId = getMoodId();
        let mood = await storageProvider.getMood(moodId);

        if (!mood) {
          const defaultValue =
            config.defaultValue !== undefined ? config.defaultValue : "";

          mood = {
            id: moodId,
            fieldId: config.id,
            eventId: event.id,
            value: defaultValue,
          };
          await storageProvider.saveMood(mood);
        }

        setMoodValue(mood.value);
      } catch (error) {
        console.error("Error loading mood:", error);
      }
    };

    loadMood();
  }, [config.id, event.id, config.defaultValue]);

  const handleChange = async (newValue: string) => {
    try {
      const moodId = getMoodId();
      await storageProvider.updateMoodValue(moodId, newValue);
      setMoodValue(newValue);
    } catch (error) {
      console.error("Error updating mood:", error);
    }
  };

  return <Mood value={moodValue} onChange={handleChange} size="small" />;
};
