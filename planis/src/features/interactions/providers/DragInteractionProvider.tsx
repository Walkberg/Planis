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
  handleMouseDown: (day: Date, hour: number, e: React.MouseEvent) => void;
  handleMouseEnterCell: (day: Date, hour: number) => void;
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

  const handleMouseDown = (day: Date, hour: number, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".event")) return;

    const startTime = new Date(day);
    startTime.setHours(hour, 0, 0, 0);

    setIsDragging(true);
    setDragStart({ day, hour, startTime });
    setDragEnd({ day, hour, startTime });
  };

  const handleMouseEnterCell = (day: Date, hour: number) => {
    if (!isDragging || !dragStart) return;

    const endTime = new Date(day);
    endTime.setHours(hour + 1, 0, 0, 0);

    setDragEnd({ day, hour, endTime });
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

  // Handle drag completion
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (!isDragging || !dragStart || !dragEnd) return;

      if (
        dragEnd.endTime &&
        dragStart.startTime &&
        dragEnd.endTime > dragStart.startTime
      ) {
        const newEvent: CalendarEvent = {
          id: Date.now(),
          title: "Nouvel événement",
          start: dragStart.startTime,
          end: dragEnd.endTime,
          color: "#ff6b35",
        };
        addEvent(newEvent);
        setSelectedEvent(newEvent);
      }

      setIsDragging(false);
      setDragStart(null);
      setDragEnd(null);
    };

    if (isDragging) {
      window.addEventListener("mouseup", handleGlobalMouseUp);
      return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
    }
  }, [isDragging, dragStart, dragEnd, addEvent, setSelectedEvent]);

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
    handleMouseDown,
    handleMouseEnterCell,
    handleResizeStart,
  };

  return (
    <DragInteractionContext.Provider value={value}>
      {children}
    </DragInteractionContext.Provider>
  );
};
