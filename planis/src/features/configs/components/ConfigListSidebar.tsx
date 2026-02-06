import React, { useState } from "react";
import { useConfig } from "../providers/ConfigProvider";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverItem,
  PopoverList,
} from "../../../components/ui/Popover";
import { MenuIcon } from "../../../components/ui/MenuIcon";
import { DeleteConfigModal } from "./DeleteConfigModal";
import { StatsModal } from "./StatsModal";
import { FieldStatsSelector } from "./FieldStatsSelector";
import type { FieldConfig } from "../../../types/FieldConfig";
import type { EventConfig } from "../../../types/EventConfig";
import { statsConfig } from "../StatsConfig";

export const ConfigListSidebar: React.FC = () => {
  const {
    configs,
    setSelectedConfig,
    loading,
    filteredConfigId,
    setFilteredConfigId,
    deleteConfigWithConversion,
    getConfigEventCount,
  } = useConfig();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<{
    id: string;
    name: string;
    eventCount: number;
  } | null>(null);
  const [statsModalField, setStatsModalField] = useState<FieldConfig | null>(
    null,
  );
  const [selectedEventConfigForStats, setSelectedEventConfigForStats] =
    useState<EventConfig | null>(null);

  const handleDeleteClick = async (
    e: React.MouseEvent,
    config: { id: string; name: string; isSystemConfig?: boolean },
  ) => {
    e.stopPropagation();

    if (config.isSystemConfig) {
      alert("Les configurations système ne peuvent pas être supprimées");
      return;
    }

    const eventCount = await getConfigEventCount(config.id);
    setConfigToDelete({
      id: config.id,
      name: config.name,
      eventCount,
    });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (configToDelete) {
      try {
        await deleteConfigWithConversion(configToDelete.id);
      } catch (error: any) {
        alert(error.message || "Erreur lors de la suppression");
      }
    }
  };

  const handleFilterClick = (e: React.MouseEvent, configId: string) => {
    e.stopPropagation();
    setFilteredConfigId(filteredConfigId === configId ? null : configId);
  };

  const handleStatsClick = (e: React.MouseEvent, config: EventConfig) => {
    e.stopPropagation();
    const statsEligibleFields = config.fieldConfigs.filter(
      (field) => statsConfig[field.type] !== undefined,
    );

    if (statsEligibleFields.length === 1) {
      setStatsModalField(statsEligibleFields[0]);
    } else if (statsEligibleFields.length > 1) {
      setSelectedEventConfigForStats(config);
    }
  };

  const handleFieldSelect = (field: FieldConfig) => {
    setSelectedEventConfigForStats(null);
    setStatsModalField(field);
  };

  const hasStatsSupport = (config: EventConfig) => {
    return config.fieldConfigs?.some(
      (field) => statsConfig[field.type] !== undefined,
    );
  };

  if (loading) {
    return (
      <div className="bg-white border-4 border-black p-3 rounded-xl shadow-neo-lg">
        <p className="text-xs text-gray-500 text-center">Chargement...</p>
      </div>
    );
  }

  return (
    <>
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
            <Popover>
              <div key={config.id} className="flex items-center gap-1">
                <button
                  onClick={() => setSelectedConfig(config)}
                  className={`flex-1 flex items-center gap-2 p-2 border-2 justify-between border-black rounded-lg bg-white transition-all text-left cursor-pointer ${
                    filteredConfigId === config.id
                      ? "bg-neo-cyan"
                      : "hover:bg-gray-50 hover:scale-105"
                  }`}
                >
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div
                      className="w-5 h-5 rounded border-2 border-black flex-shrink-0"
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="font-bold text-xs truncate">
                      {config.name}
                    </span>
                  </div>
                  <PopoverTrigger asChild>
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Options"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MenuIcon />
                    </button>
                  </PopoverTrigger>
                </button>

                <PopoverContent align="end" className="p-0 w-56">
                  <PopoverList>
                    {hasStatsSupport(config) && (
                      <PopoverItem onClick={(e) => handleStatsClick(e, config)}>
                        📊 Voir les statistiques
                      </PopoverItem>
                    )}
                    <PopoverItem
                      onClick={(e) => handleFilterClick(e, config.id)}
                    >
                      {filteredConfigId === config.id
                        ? "🔍 Retirer le filtre"
                        : "🔍 Filtrer par cette config"}
                    </PopoverItem>
                    {!config.isSystemConfig && (
                      <PopoverItem
                        onClick={(e) => handleDeleteClick(e, config)}
                        variant="danger"
                      >
                        🗑️ Supprimer
                      </PopoverItem>
                    )}
                  </PopoverList>
                </PopoverContent>
              </div>
            </Popover>
          ))}
        </div>
      </div>

      {configToDelete && (
        <DeleteConfigModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setConfigToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          configName={configToDelete.name}
          eventCount={configToDelete.eventCount}
        />
      )}

      {selectedEventConfigForStats && (
        <FieldStatsSelector
          config={selectedEventConfigForStats}
          onSelectField={handleFieldSelect}
          onClose={() => setSelectedEventConfigForStats(null)}
        />
      )}

      {statsModalField && (
        <StatsModal
          config={statsModalField}
          onClose={() => setStatsModalField(null)}
        />
      )}
    </>
  );
};
