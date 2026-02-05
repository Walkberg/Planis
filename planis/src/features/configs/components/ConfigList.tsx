import React from "react";
import { useConfig } from "../providers/ConfigProvider";

export const ConfigList: React.FC = () => {
  const { configs, selectedConfig, setSelectedConfig, loading } = useConfig();

  if (loading) {
    return <div className="p-4">Chargement des configurations...</div>;
  }

  const systemConfigs = configs.filter((c) => c.isSystemConfig);
  const userConfigs = configs.filter((c) => !c.isSystemConfig);

  return (
    <div className="flex flex-col h-full">
      <div className="bg-neo-purple border-4 border-black p-4 shadow-neo-lg rounded-xl text-white mb-4">
        <h2 className="text-xl font-bold uppercase m-0">Configurations</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {systemConfigs.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-sm uppercase mb-3 px-2">
              Par défaut
            </h3>
            <div className="flex flex-col gap-2">
              {systemConfigs.map((config) => (
                <button
                  key={config.id}
                  onClick={() => setSelectedConfig(config)}
                  className={`p-3 border-[3px] border-black rounded-lg transition-all ${
                    selectedConfig?.id === config.id
                      ? "bg-neo-cyan shadow-neo-md scale-105"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded border-2 border-black"
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="font-bold">{config.name}</span>
                    {config.fieldConfigs.length > 0 && (
                      <span className="ml-auto text-xs bg-neo-purple text-white px-2 py-1 rounded">
                        {config.fieldConfigs.length} champ
                        {config.fieldConfigs.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        {userConfigs.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-sm uppercase mb-3 px-2">
              Personnalisées
            </h3>
            <div className="flex flex-col gap-2">
              {userConfigs.map((config) => (
                <button
                  key={config.id}
                  onClick={() => setSelectedConfig(config)}
                  className={`p-3 border-[3px] border-black rounded-lg transition-all ${
                    selectedConfig?.id === config.id
                      ? "bg-neo-cyan shadow-neo-md scale-105"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded border-2 border-black"
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="font-bold">{config.name}</span>
                    {config.fieldConfigs.length > 0 && (
                      <span className="ml-auto text-xs bg-neo-purple text-white px-2 py-1 rounded">
                        {config.fieldConfigs.length} champ
                        {config.fieldConfigs.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

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
        className="bg-neo-green border-[3px] border-black rounded-lg p-4 font-bold uppercase shadow-neo-md transition-all hover:bg-[#2ecc71] mt-4"
      >
        + Nouvelle configuration
      </button>
    </div>
  );
};
