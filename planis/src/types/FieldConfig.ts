export type FieldType =
  | "text"
  | "number"
  | "select"
  | "date"
  | "boolean"
  | "textarea";

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  id: string;
  key: string;
  label: string;
  type: FieldType;
  defaultValue?: any;
  required?: boolean;
  options?: SelectOption[];
  placeholder?: string;
  visibilityRules?: Record<string, any>;
}
