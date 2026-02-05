import React from "react";
import { useConfig } from "../providers/ConfigProvider";

export const ConfigListSidebar: React.FC = () => {
  const { configs, setSelectedConfig, loading } = useConfig();

  if (loading) {
    return (
      <div className="bg-white border-4 border-black p-3 rounded-xl shadow-neo-lg">
        <p className="text-xs text-gray-500 text-center">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="mt-16 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm uppercase m-0">Configurations</h3>
        <button
          onClick={() =>
            setSelectedConfig({
              id: "",
              name: "",
              color: "#00D9FF",
              isAllDay: false,
              isSystemConfig: false,
              fieldConfigs: [],
            })
          }
          className="bg-neo-green border-2 border-black rounded-lg w-7 h-7 flex items-center justify-center font-bold text-lg shadow-neo-sm transition-all hover:bg-[#2ecc71] hover:scale-105 cursor-pointer"
          title="Ajouter une configuration"
        >
          +
        </button>
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
        {configs.map((config) => (
          <button
            key={config.id}
            onClick={() => setSelectedConfig(config)}
            className="flex items-center gap-2 p-2 border-2 border-black rounded-lg bg-white hover:bg-gray-50 transition-all text-left cursor-pointer hover:scale-105"
          >
            <div
              className="w-5 h-5 rounded border-2 border-black flex-shrink-0"
              style={{ backgroundColor: config.color }}
            />
            <span className="font-bold text-xs truncate">{config.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
