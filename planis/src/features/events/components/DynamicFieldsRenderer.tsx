import React from "react";
import type { FieldConfig } from "../../../types/FieldConfig";
import { FieldFactory } from "./fields/FieldFactory";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../../components/ui/Popover";
import { useConfig } from "../../configs/providers/ConfigProvider";
import { CustomFieldAction } from "./CustomFieldActions";

interface DynamicFieldsRendererProps {
  fieldConfigs: FieldConfig[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  eventId: string;
  configId: string;
}

export const DynamicFieldsRenderer: React.FC<DynamicFieldsRendererProps> = ({
  fieldConfigs,
  values,
  onChange,
  eventId,
  configId,
}) => {
  if (fieldConfigs.length === 0) {
    return null;
  }

  return (
    <div className="pt-4 mt-4">
      <div className="flex flex-col gap-4">
        {fieldConfigs.map((field) => (
          <div key={field.id} className="relative">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <FieldFactory
                  field={field}
                  value={values[field.key] ?? field.defaultValue ?? ""}
                  onChange={(value) => onChange(field.key, value)}
                  eventId={eventId}
                  configId={configId}
                />
              </div>
              <CustomFieldAction configId={configId} fieldConfig={field} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
