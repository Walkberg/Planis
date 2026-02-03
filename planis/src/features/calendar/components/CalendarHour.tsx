import { useDragInteraction } from "../../interactions/providers/DragInteractionProvider";

interface CalendarHourProps {
  hour: number;
  day: Date;
  dayIndex: number;
  isLastDay: boolean;
}

export const CalendarHour = ({
  hour,
  day,
  dayIndex,
  isLastDay,
}: CalendarHourProps) => {
  const { handleCellClick } = useDragInteraction();

  const formatTime = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  const quarters = [0, 15, 30, 45];

  return (
    <>
      {dayIndex === 0 && (
        <div className="border-r-[3px] border-b border-black border-b-gray-300 p-1 text-right text-xs font-bold bg-neo-yellow sticky left-0 z-[1]">
          {formatTime(hour)}
        </div>
      )}

      <div
        className={`border-b border-b-gray-300 min-h-[60px] relative grid grid-rows-4 ${
          isLastDay
            ? "border-r-[3px] border-r-black"
            : "border-r border-r-gray-200"
        }`}
      >
        {quarters.map((minutes, idx) => (
          <div
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              if (!(e.target as HTMLElement).closest(".event")) {
                handleCellClick(day, hour, minutes);
              }
            }}
            className={`cursor-pointer transition-colors duration-100 hover:bg-gray-100 ${
              idx < 3 ? "border-b border-b-gray-200" : ""
            }`}
          />
        ))}
      </div>
    </>
  );
};
