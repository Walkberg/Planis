import React from "react";
import type { FieldConfig } from "../../../types/FieldConfig";
import { FieldFactory } from "./fields/FieldFactory";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../../components/ui/Popover";
import { useConfig } from "../../configs/providers/ConfigProvider";

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
  const { openManagementWithField } = useConfig();

  if (fieldConfigs.length === 0) {
    return null;
  }

  const handleEditField = (fieldId: string) => {
    openManagementWithField(configId, fieldId);
  };

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
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="mt-7 p-2 hover:bg-gray-100 rounded-lg border-2 border-black bg-white transition-colors"
                    title="Options du champ"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="3" cy="8" r="1.5" fill="currentColor" />
                      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                      <circle cx="13" cy="8" r="1.5" fill="currentColor" />
                    </svg>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="p-0 w-56">
                  <div className="flex flex-col">
                    <button
                      onClick={() => handleEditField(field.id)}
                      className="w-full text-left px-4 py-3 hover:bg-neo-cyan transition-colors font-bold text-sm border-b-2 border-black"
                    >
                      Éditer le champ
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
