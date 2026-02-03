import { useCalendar } from "../features/calendar/providers/CalendarProvider";
import { CalendarFilter } from "./CalendarFilter";

export const CalendarHeader = () => {
  const { currentDate } = useCalendar();

  return (
    <div className="bg-white border-b-4 border-black p-5 flex justify-between items-center">
      <h1 className="m-0 text-[32px] font-bold uppercase">
        {currentDate.toLocaleDateString("fr-FR", {
          month: "long",
          year: "numeric",
        })}
      </h1>
      <CalendarFilter />
    </div>
  );
};
