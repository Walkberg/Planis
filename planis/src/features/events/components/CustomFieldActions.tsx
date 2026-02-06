import {
  Popover,
  PopoverContent,
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
          className="mt-7 p-2 hover:bg-gray-100 rounded-lg border-2 border-black bg-white transition-colors"
          title="Options du champ"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="3" cy="8" r="1.5" fill="currentColor" />
            <circle cx="8" cy="8" r="1.5" fill="currentColor" />
            <circle cx="13" cy="8" r="1.5" fill="currentColor" />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0 w-56">
        <div className="flex flex-col">
          <button
            onClick={() => handleEditField(fieldConfig.id)}
            className="w-full text-left px-4 py-3 hover:bg-neo-cyan transition-colors font-bold text-sm border-b-2 border-black"
          >
            Éditer le champ
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
