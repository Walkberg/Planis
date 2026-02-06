import React from "react";
import type { FieldConfig } from "../../../types/FieldConfig";
import { FieldFactory } from "./fields/FieldFactory";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldAction,
  FieldError,
} from "../../../components/ui/Field";
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
        {fieldConfigs.map((field) => {
          const isCheckbox = field.type === "boolean";
          const shouldDisplayLabel =
            field.displayLabel !== false && !isCheckbox;

          return (
            <Field key={field.id} required={field.required}>
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className=" flex justify-between items-center">
                    {shouldDisplayLabel && (
                      <FieldLabel>{field.label}</FieldLabel>
                    )}
                    <FieldAction>
                      <CustomFieldAction
                        configId={configId}
                        fieldConfig={field}
                      />
                    </FieldAction>
                  </div>
                  <FieldContent>
                    <FieldFactory
                      field={field}
                      value={values[field.key] ?? field.defaultValue ?? ""}
                      onChange={(value) => onChange(field.key, value)}
                      eventId={eventId}
                      configId={configId}
                    />
                  </FieldContent>
                  <FieldError />
                </div>
              </div>
            </Field>
          );
        })}
      </div>
    </div>
  );
};
