import { useCalendar } from "../providers/CalendarProvider";
import { useConfig } from "../../configs/providers/ConfigProvider";
import { CalendarFilter } from "./CalendarFilter";

export const CalendarHeader = () => {
  const { currentDate } = useCalendar();
  const { filteredConfigId, setFilteredConfigId, configs } = useConfig();

  const filteredConfig = configs.find((c) => c.id === filteredConfigId);

  return (
    <div className="bg-white border-b-4 border-black p-5">
      <div className="flex justify-between items-center mb-3">
        <h1 className="m-0 text-[32px] font-bold uppercase">
          {currentDate.toLocaleDateString("fr-FR", {
            month: "long",
            year: "numeric",
          })}
        </h1>
        {filteredConfig && (
          <div className="flex items-center gap-2 bg-neo-cyan/30 border-2 border-black rounded-lg p-2 mt-2">
            <span className="text-sm font-bold">
              Filtre actif : {filteredConfig.name}
            </span>
            <button
              onClick={() => setFilteredConfigId(null)}
              className="ml-auto bg-white border-2 border-black rounded px-2 py-1 text-xs font-bold hover:bg-gray-100 transition-colors"
            >
              ✕ Retirer
            </button>
          </div>
        )}
        <CalendarFilter />
      </div>
    </div>
  );
};
