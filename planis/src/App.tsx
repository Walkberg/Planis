import { CalendarPreview } from "./features/calendar/components/CalendarPreview";
import { CalendarHeader } from "./features/calendar/components/CalendarHeader";
import { CalendarView } from "./features/calendar/components/CalendarView";
import { CalendarEdit } from "./features/events/components/CalendarEdit";
import { ConfigManagement } from "./features/configs/components/ConfigManagement";
import { ConfigModal } from "./features/configs/components/ConfigModal";

export const CalendarApp = () => {
  return (
    <div className="font-space h-screen bg-neo-yellow flex overflow-hidden">
      <CalendarPreview />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CalendarHeader />
        <CalendarView />
      </div>
      <CalendarEdit />
      <ConfigManagement />
      <ConfigModal />
    </div>
  );
};
