import React from 'react';
import type { FieldConfig } from '../../../types/FieldConfig';
import { FieldFactory } from './fields/FieldFactory';

interface DynamicFieldsRendererProps {
  fieldConfigs: FieldConfig[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
}

export const DynamicFieldsRenderer: React.FC<DynamicFieldsRendererProps> = ({
  fieldConfigs,
  values,
  onChange,
}) => {
  if (fieldConfigs.length === 0) {
    return null;
  }

  return (
    <div className="pt-4 mt-4">
      <div className="flex flex-col gap-4">
        {fieldConfigs.map((field) => (
          <FieldFactory
            key={field.id}
            field={field}
            value={values[field.key] ?? field.defaultValue ?? ''}
            onChange={(value) => onChange(field.key, value)}
          />
        ))}
      </div>
    </div>
  );
};

