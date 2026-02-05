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

export type FieldConfig =
  | NumberFieldConfig
  | TextFieldConfig
  | SelectFieldConfig
  | DateFieldConfig
  | BooleanFieldConfig;

export interface BaseFieldConfig {
  id: string;
  key: string;
  label: string;
  type: FieldType;
  defaultValue?: any;
  required?: boolean;
  placeholder?: string;
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
