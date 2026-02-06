interface CalendarTimeIndicatorProps {
  currentTime: Date;
  isTodayDisplayed: boolean;
}
export const CalendarTimeIndicator = ({
  currentTime,
  isTodayDisplayed,
}: CalendarTimeIndicatorProps) => {
  const now = currentTime;
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const topPosition = currentHour * 60 + currentMinutes + 61;

  if (!isTodayDisplayed) {
    return null;
  }

  return (
    <div
      className="absolute left-[60px] right-0 h-[3px] bg-neo-orange z-[100] pointer-events-none"
      style={{
        top: `${topPosition}px`,
        boxShadow: "0 0 8px rgba(255, 107, 53, 0.6)",
      }}
    >
      <div className="absolute -left-1.5 -top-[5px] w-3 h-3 rounded-full bg-neo-orange border-2 border-black" />
    </div>
  );
};
