import React, { useEffect, useState } from "react";
import type { MoodFieldConfig } from "../../../../types/FieldConfig";
import { Mood } from "../../../../components/ui/Mood";
import { storageProvider } from "../../../../storage/IndexedDBStorageProvider";

interface MoodFieldProps {
  field: MoodFieldConfig;
  eventId: string;
}

export const MoodField: React.FC<MoodFieldProps> = ({ field, eventId }) => {
  const [moodValue, setMoodValue] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const getMoodId = () => {
    return `mood-${field.id}-event-${eventId}`;
  };

  useEffect(() => {
    const loadMood = async () => {
      try {
        const moodId = getMoodId();
        let mood = await storageProvider.getMood(moodId);

        if (!mood) {
          const defaultValue =
            field.defaultValue !== undefined ? field.defaultValue : "";

          mood = {
            id: moodId,
            fieldId: field.id,
            eventId: eventId,
            value: defaultValue,
          };
          await storageProvider.saveMood(mood);
        }

        setMoodValue(mood.value);
      } catch (error) {
        console.error("Error loading mood:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMood();
  }, [field.id, eventId, field.defaultValue]);

  const handleChange = async (newValue: string) => {
    try {
      const moodId = getMoodId();
      await storageProvider.updateMoodValue(moodId, newValue);
      setMoodValue(newValue);
    } catch (error) {
      console.error("Error updating mood:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-100 border-[3px] border-black rounded-lg">
        <span className="text-sm text-gray-500">Chargement...</span>
      </div>
    );
  }

  return <Mood value={moodValue} onChange={handleChange} />;
};
