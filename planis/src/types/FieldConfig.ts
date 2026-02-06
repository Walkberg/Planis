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
  | "indicator";

export interface SelectOption {
  value: string;
  label: string;
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
  | IndicatorFieldConfig;

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
