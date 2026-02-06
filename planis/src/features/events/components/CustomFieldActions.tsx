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

interface CustomFieldActionProps {
  configId: string;
  fieldConfig: FieldConfig;
}

export const CustomFieldAction = ({
  configId,
  fieldConfig,
}: CustomFieldActionProps) => {
  const { openManagementWithField } = useConfig();

  const handleEditField = (fieldId: string) => {
    openManagementWithField(configId, fieldId);
  };

  return (
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
          <PopoverItem
            onClick={() => handleEditField(fieldConfig.id)}
            className="w-full text-left px-4 py-3 hover:bg-neo-cyan transition-colors font-bold text-sm border-b-2 border-black"
          >
            Éditer le champ
          </PopoverItem>
        </PopoverList>
      </PopoverContent>
    </Popover>
  );
};
