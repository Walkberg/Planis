import { useCalendar } from "../providers/CalendarProvider";
import { ConfigListSidebar } from "../../configs/components/ConfigListSidebar";

const DAY_OF_WEEK = ["L", "M", "M", "J", "V", "S", "D"];

export const CalendarPreview = () => {
  const {
    currentDate,
    setCurrentDate,
    changeMonth,
    getMonthCalendar,
    isSameDay,
    isToday,
  } = useCalendar();
  const monthCalendar = getMonthCalendar();

  return (
    <div className="w-[280px] bg-neo-yellow border-r-4 border-black p-5 overflow-y-auto">
      <div className="bg-neo-cyan border-4 border-black p-4 mb-5  rounded-xl">
        <h2 className="m-0 text-2xl font-bold uppercase">Planis</h2>
      </div>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => changeMonth(-1)}
          className="bg-neo-amber border-[3px] border-black py-1 px-2.5 cursor-pointer font-space font-bold text-base rounded-lg hover:scale-105 transition-transform"
        >
          ◀
        </button>
        <div className="font-bold text-sm">
          {currentDate.toLocaleDateString("fr-FR", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <button
          onClick={() => changeMonth(1)}
          className="bg-neo-amber border-[3px] border-black py-1 px-2.5 cursor-pointer font-space font-bold text-base rounded-lg hover:scale-105 transition-transform"
        >
          ▶
        </button>
      </div>

      <div className="bg-white border-4 border-black p-4 shadow-neo-lg rounded-xl">
        <div className="grid grid-cols-7 gap-1">
          {DAY_OF_WEEK.map((day, i) => (
            <div key={i} className="text-center font-bold text-xs py-1">
              {day}
            </div>
          ))}
          {monthCalendar.map((day, i) => (
            <div
              key={i}
              onClick={() => setCurrentDate(new Date(day.date))}
              className={`text-center px-1 py-1 text-xs cursor-pointer border-2 border-black rounded-lg transition-all duration-200 hover:bg-neo-cyan ${
                isToday(day.date)
                  ? "bg-neo-orange font-bold"
                  : isSameDay(day.date, currentDate)
                    ? "bg-neo-purple font-bold text-white"
                    : "bg-white"
              } ${day.isCurrentMonth ? "text-black" : "text-gray-400"}`}
            >
              {day.date.getDate()}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <ConfigListSidebar />
      </div>
    </div>
  );
};
