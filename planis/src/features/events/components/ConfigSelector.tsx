import React from 'react';
import { useConfig } from '../../configs/providers/ConfigProvider';

interface ConfigSelectorProps {
  selectedConfigId: string;
  onChange: (configId: string) => void;
}

export const ConfigSelector: React.FC<ConfigSelectorProps> = ({
  selectedConfigId,
  onChange,
}) => {
  const { configs, loading } = useConfig();

  if (loading) {
    return <div className="text-sm">Chargement...</div>;
  }

  return (
    <div>
      <label className="block font-bold mb-2 text-sm uppercase">
        Type d'événement
      </label>
      <div className="grid grid-cols-2 gap-2">
        {configs.map((config) => (
          <button
            key={config.id}
            type="button"
            onClick={() => onChange(config.id)}
            className={`p-3 border-[3px] border-black rounded-lg transition-all ${
              selectedConfigId === config.id
                ? 'bg-neo-cyan shadow-neo-md scale-105'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded border-2 border-black flex-shrink-0"
                style={{ backgroundColor: config.color }}
              />
              <span className="font-bold text-sm">{config.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
