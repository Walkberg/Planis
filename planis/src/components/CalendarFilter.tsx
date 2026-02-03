import { useCalendar } from "../features/calendar/providers/CalendarProvider";

export const CalendarFilter = () => {
  const { viewDays, setViewDays } = useCalendar();

  return (
    <div className="flex gap-2.5">
      {[1, 3, 7].map((days) => (
        <button
          key={days}
          onClick={() => setViewDays(days)}
          className={`border-[3px] border-black py-3 px-6 cursor-pointer font-space font-bold text-base rounded-[10px] transition-all duration-200 hover:bg-neo-cyan ${
            viewDays === days
              ? "bg-neo-orange shadow-neo-md -translate-x-0.5 -translate-y-0.5"
              : "bg-white"
          }`}
        >
          {days} jour{days > 1 ? "s" : ""}
        </button>
      ))}
    </div>
  );
};
