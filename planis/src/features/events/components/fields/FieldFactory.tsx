import React from "react";
import type { FieldConfig } from "../../../../types/FieldConfig";
import { Input } from "../../../../components/ui/Input";
import { Textarea } from "../../../../components/ui/Textarea";
import { Select } from "../../../../components/ui/Select";
import { Checkbox } from "../../../../components/ui/Checkbox";
import { ColorPicker } from "../../../../components/ui/ColorPicker";
import { Checklist } from "../../../../components/ui/Checklist";
import { CounterField } from "./CounterField";
import { IndicatorField } from "./IndicatorField";
import { MoodField } from "../../../configs/fields/MoodField";
import { StatusField } from "../../../configs/fields/StatusField";

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
  switch (field.type) {
    case "text":
      return (
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
        />
      );

    case "number":
      return (
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.valueAsNumber)}
          placeholder={field.placeholder}
          required={field.required}
        />
      );

    case "date":
      return (
        <Input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
        />
      );

    case "textarea":
      return (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          options={field.options || []}
          placeholder={field.placeholder}
          required={field.required}
        />
      );

    case "color":
      return (
        <ColorPicker
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      );

    case "checklist":
      return (
        <Checklist
          options={field.options || []}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
        />
      );

    case "counter":
      return (
        <CounterField field={field} eventId={eventId} configId={configId} />
      );

    case "indicator":
      return <IndicatorField field={field} eventId={eventId} />;

    case "mood":
      return <MoodField config={field} value={value} onChange={onChange} />;

    case "status":
      return <StatusField config={field} value={value} onChange={onChange} />;

    default:
      console.warn(`Unsupported field type: ${(field as any).type}`);
      return null;
  }
};
