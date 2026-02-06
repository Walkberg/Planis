export type FieldType =
  | "text"
  | "number"
  | "select"
  | "date"
  | "boolean"
  | "textarea"
  | "color"
  | "checklist"
  | "counter"
  | "indicator"
  | "mood"
  | "status";

export interface SelectOption {
  value: string;
  label: string;
}

export interface MoodOption {
  value: string;
  label: string;
  emoji: string;
  color: string;
}

export interface StatusOption {
  value: number;
  label: string;
  emoji: string;
}

export type FieldConfig =
  | NumberFieldConfig
  | TextFieldConfig
  | SelectFieldConfig
  | DateFieldConfig
  | BooleanFieldConfig
  | ColorFieldConfig
  | ChecklistFieldConfig
  | CounterFieldConfig
  | IndicatorFieldConfig
  | MoodFieldConfig
  | StatusFieldConfig;

export interface BaseFieldConfig {
  id: string;
  key: string;
  label: string;
  type: FieldType;
  defaultValue?: any;
  required?: boolean;
  placeholder?: string;
  displayLabel?: boolean;
  displayOnEvent?: boolean;
  visibilityRules?: Record<string, any>;
}

export type NumberFieldConfig = BaseFieldConfig & {
  type: "number";
};

export type TextFieldConfig = BaseFieldConfig & {
  type: "text" | "textarea";
};

export type SelectFieldConfig = BaseFieldConfig & {
  type: "select";
  options: SelectOption[];
};

export type DateFieldConfig = BaseFieldConfig & {
  type: "date";
};

export type BooleanFieldConfig = BaseFieldConfig & {
  type: "boolean";
};

export type ColorFieldConfig = BaseFieldConfig & {
  type: "color";
};

export type ChecklistFieldConfig = BaseFieldConfig & {
  type: "checklist";
  options: SelectOption[];
};

export type CounterFieldConfig = BaseFieldConfig & {
  type: "counter";
  scope: "config" | "event";
};

export type IndicatorFieldConfig = BaseFieldConfig & {
  type: "indicator";
  min: number;
  max: number;
};

export type MoodFieldConfig = BaseFieldConfig & {
  type: "mood";
};

export type StatusFieldConfig = BaseFieldConfig & {
  type: "status";
};
