import React, { ReactNode } from "react";
import { CalendarProvider } from "../calendar/providers/CalendarProvider";
import { EventsProvider } from "../events/providers/EventsProvider";
import { DragInteractionProvider } from "../interactions/providers/DragInteractionProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <CalendarProvider>
      <EventsProvider>
        <DragInteractionProvider>{children}</DragInteractionProvider>
      </EventsProvider>
    </CalendarProvider>
  );
};
