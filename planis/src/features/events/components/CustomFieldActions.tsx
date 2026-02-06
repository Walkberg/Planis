import { useState } from "react";
import { MenuIcon } from "../../../components/ui/MenuIcon";
import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverList,
  PopoverTrigger,
} from "../../../components/ui/Popover";
import type { FieldConfig } from "../../../types/FieldConfig";
import { useConfig } from "../../configs/providers/ConfigProvider";
import { StatsModal } from "../../configs/components/StatsModal";
import { statsConfig } from "../../configs/StatsConfig";

interface CustomFieldActionProps {
  configId: string;
  fieldConfig: FieldConfig;
}

export const CustomFieldAction = ({
  configId,
  fieldConfig,
}: CustomFieldActionProps) => {
  const { openManagementWithField } = useConfig();
  const [showStatsModal, setShowStatsModal] = useState(false);

  const handleEditField = (fieldId: string) => {
    openManagementWithField(configId, fieldId);
  };

  const hasStatsSupport = () => {
    return statsConfig[fieldConfig.type] !== undefined;
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Options du champ"
          >
            <MenuIcon />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="p-0 w-56">
          <PopoverList>
            {hasStatsSupport() && (
              <PopoverItem
                onClick={() => setShowStatsModal(true)}
                className="w-full text-left px-4 py-3 hover:bg-neo-cyan transition-colors font-bold text-sm border-b-2 border-black"
              >
                📊 Voir les statistiques
              </PopoverItem>
            )}
            <PopoverItem
              onClick={() => handleEditField(fieldConfig.id)}
              className="w-full text-left px-4 py-3 hover:bg-neo-cyan transition-colors font-bold text-sm border-b-2 border-black"
            >
              ✏️ Éditer le champ
            </PopoverItem>
          </PopoverList>
        </PopoverContent>
      </Popover>

      {showStatsModal && (
        <StatsModal
          config={fieldConfig}
          onClose={() => setShowStatsModal(false)}
        />
      )}
    </>
  );
};
