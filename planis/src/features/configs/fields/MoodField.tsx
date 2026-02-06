import React from "react";
import { Mood } from "../../../components/ui/Mood";
import type { MoodFieldConfig } from "../../../types/FieldConfig";
import { Field, FieldContent, FieldLabel } from "../../../components/ui/Field";

interface MoodFieldProps {
  config: MoodFieldConfig;
  value: string;
  onChange: (value: string) => void;
}

export const MoodField: React.FC<MoodFieldProps> = ({ value, onChange }) => {
  return <Mood value={value || ""} onChange={onChange} />;
};
