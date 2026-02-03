import { CalendarPreview } from "./components/CalendarPreview";
import { CalendarHeader } from "./components/CalendarHeader";
import { CalendarView } from "./components/CalendarView";
import { CalendarEdit } from "./components/CalendarEdit";

export const CalendarApp = () => {
  return (
    <div className="font-space h-screen bg-neo-yellow flex overflow-hidden">
      <CalendarPreview />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CalendarHeader />
        <CalendarView />
      </div>
      <CalendarEdit />
    </div>
  );
};
