import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  useEvents,
  type CalendarEvent,
} from "../../events/providers/EventsProvider";

interface DragState {
  day: Date;
  hour: number;
  startTime?: Date;
  endTime?: Date;
}

interface DragInteractionContextType {
  isDragging: boolean;
  isResizing: boolean | number;
  dragStart: DragState | null;
  dragEnd: DragState | null;
  handleCellClick: (day: Date, hour: number, minutes: number) => void;
  handleResizeStart: (event: CalendarEvent, e: React.MouseEvent) => void;
}

const DragInteractionContext = createContext<
  DragInteractionContextType | undefined
>(undefined);

export const useDragInteraction = () => {
  const context = useContext(DragInteractionContext);
  if (!context) {
    throw new Error(
      "useDragInteraction must be used within DragInteractionProvider",
    );
  }
  return context;
};

interface DragInteractionProviderProps {
  children: ReactNode;
}

export const DragInteractionProvider: React.FC<
  DragInteractionProviderProps
> = ({ children }) => {
  const { addEvent, setSelectedEvent } = useEvents();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<DragState | null>(null);
  const [dragEnd, setDragEnd] = useState<DragState | null>(null);
  const [isResizing, setIsResizing] = useState<boolean | number>(false);

  const handleCellClick = (day: Date, hour: number, minutes: number) => {
    const startTime = new Date(day);
    startTime.setHours(hour, minutes, 0, 0);

    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + 30); // Événement de 30 minutes

    const newEvent: CalendarEvent = {
      id: Date.now(),
      title: "",
      start: startTime,
      end: endTime,
      color: "#ff6b35",
    };

    addEvent(newEvent);
    setSelectedEvent(newEvent);
  };

  const handleResizeStart = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(event.id);
    setSelectedEvent(event);
  };

  const handleResizeMove = () => {
    if (!isResizing) return;
    // TODO: Implement resize logic
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  // Pas besoin de handle drag completion avec le système de clic

  // Handle resize events
  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleResizeMove);
      window.addEventListener("mouseup", handleResizeEnd);
      return () => {
        window.removeEventListener("mousemove", handleResizeMove);
        window.removeEventListener("mouseup", handleResizeEnd);
      };
    }
  }, [isResizing]);

  const value: DragInteractionContextType = {
    isDragging,
    isResizing,
    dragStart,
    dragEnd,
    handleCellClick,
    handleResizeStart,
  };

  return (
    <DragInteractionContext.Provider value={value}>
      {children}
    </DragInteractionContext.Provider>
  );
};
