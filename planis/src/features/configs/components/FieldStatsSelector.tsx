import React from "react";
import type { EventConfig } from "../../../types/EventConfig";
import type { FieldConfig } from "../../../types/FieldConfig";
import { statsConfig } from "../StatsConfig";

interface FieldStatsSelectorProps {
  config: EventConfig;
  onSelectField: (field: FieldConfig) => void;
  onClose: () => void;
}

export const FieldStatsSelector: React.FC<FieldStatsSelectorProps> = ({
  config,
  onSelectField,
  onClose,
}) => {
  const statsEligibleFields = config.fieldConfigs.filter(
    (field) => statsConfig[field.type] !== undefined,
  );

  if (statsEligibleFields.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border-4 border-black rounded-2xl shadow-neo-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-neo-yellow border-b-4 border-black p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">Choisir un champ</h2>
              <p className="font-bold text-gray-600">{config.name}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white border-2 border-black rounded-lg font-black text-xl hover:bg-neo-orange transition-colors shadow-neo-sm"
            >
              ×
            </button>
          </div>
        </div>
        <div className="p-6 space-y-2 max-h-96 overflow-y-auto">
          {statsEligibleFields.map((field) => (
            <button
              key={field.id}
              onClick={() => onSelectField(field)}
              className="w-full p-4 bg-white border-2 border-black rounded-lg font-bold hover:bg-neo-cyan transition-colors shadow-neo-sm text-left flex items-center justify-between"
            >
              <div>
                <div className="font-black">{field.label}</div>
                <div className="text-sm text-gray-600 capitalize">
                  {statsConfig[field.type]?.name}
                </div>
              </div>
              <div className="text-2xl">📊</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
