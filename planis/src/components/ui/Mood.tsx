import React from "react";
import { MOOD_OPTIONS } from "../../types/MoodConstants";

interface MoodProps {
  value: string;
  onChange: (value: string) => void;
  size?: "default" | "small";
}

export const Mood: React.FC<MoodProps> = ({
  value,
  onChange,
  size = "default",
}) => {
  const isSmall = size === "small";
  const selectedMood = MOOD_OPTIONS.find((mood) => mood.value === value);

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${isSmall ? "p-2 text-sm" : "p-3 text-base"} ${isSmall ? "border-2" : "border-[3px]"} border-black rounded-lg font-bold shadow-neo-sm appearance-none cursor-pointer transition-all hover:shadow-neo-md`}
        style={{
          backgroundColor: selectedMood?.color || "#FFFFFF",
        }}
      >
        <option value="">Sélectionner une humeur</option>
        {MOOD_OPTIONS.map((mood) => (
          <option key={mood.value} value={mood.value}>
            {mood.emoji} {mood.label}
          </option>
        ))}
      </select>
      {selectedMood && (
        <div
          className={`absolute ${isSmall ? "right-2 top-2 text-base" : "right-3 top-3 text-xl"} pointer-events-none`}
        >
          {selectedMood.emoji}
        </div>
      )}
    </div>
  );
};
