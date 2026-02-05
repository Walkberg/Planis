import React from "react";
import type { FieldConfig } from "../../../../types/FieldConfig";
import { Input } from "../../../../components/ui/Input";
import { Textarea } from "../../../../components/ui/Textarea";
import { Select } from "../../../../components/ui/Select";
import { Checkbox } from "../../../../components/ui/Checkbox";
import { ColorPicker } from "../../../../components/ui/ColorPicker";
import { Checklist } from "../../../../components/ui/Checklist";
import { CounterField } from "./CounterField";

interface FieldFactoryProps {
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  eventId: string;
  configId: string;
}

export const FieldFactory: React.FC<FieldFactoryProps> = ({
  field,
  value,
  onChange,
  eventId,
  configId,
}) => {
  const commonProps = {
    label: field.label,
    placeholder: field.placeholder,
    required: field.required,
  };

  switch (field.type) {
    case "text":
      return (
        <Input
          {...commonProps}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "number":
      return (
        <Input
          {...commonProps}
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.valueAsNumber)}
        />
      );

    case "date":
      return (
        <Input
          {...commonProps}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "textarea":
      return (
        <Textarea
          {...commonProps}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
        />
      );

    case "boolean":
      return (
        <Checkbox
          label={field.label}
          checked={value || false}
          onChange={(e) => onChange(e.target.checked)}
          required={field.required}
        />
      );

    case "select":
      return (
        <Select
          {...commonProps}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          options={field.options || []}
        />
      );

    case "color":
      return (
        <ColorPicker
          {...commonProps}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "checklist":
      return (
        <Checklist
          {...commonProps}
          options={field.options || []}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
        />
      );

    case "counter":
      return (
        <CounterField field={field} eventId={eventId} configId={configId} />
      );

    default:
      console.warn(`Unsupported field type: ${(field as any).type}`);
      return null;
  }
};
