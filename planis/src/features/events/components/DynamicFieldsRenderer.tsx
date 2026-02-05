import React from "react";
import type { FieldConfig } from "../../../types/FieldConfig";

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

  const renderField = (field: FieldConfig) => {
    const value = values[field.key] ?? field.defaultValue ?? "";

    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full p-3 border-[3px] border-black rounded-lg font-space text-sm"
          />
        );

      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={3}
            className="w-full p-3 border-[3px] border-black rounded-lg font-space text-sm resize-none"
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(field.key, e.target.valueAsNumber)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full p-3 border-[3px] border-black rounded-lg font-space text-sm"
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
            required={field.required}
            className="w-full p-3 border-[3px] border-black rounded-lg font-space text-sm"
          />
        );

      case "boolean":
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(field.key, e.target.checked)}
              className="w-5 h-5 cursor-pointer accent-neo-purple"
            />
            <span className="text-sm">Oui</span>
          </label>
        );

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
            required={field.required}
            className="w-full p-3 border-[3px] border-black rounded-lg font-space text-sm"
          >
            <option value="">Sélectionner...</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className=" pt-4 mt-4">
      <div className="flex flex-col gap-4">
        {fieldConfigs.map((field) => (
          <div key={field.id}>
            <label className="block font-bold mb-2 text-sm uppercase">
              {field.label}
              {field.required && (
                <span className="text-neo-orange ml-1">*</span>
              )}
            </label>
            {renderField(field)}
          </div>
        ))}
      </div>
    </div>
  );
};
