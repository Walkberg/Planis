import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useEvents } from "../../events/providers/EventsProvider";
import type { CalendarEvent } from "../../../types";

interface DragState {
  day: Date;
  hour: number;
  startTime?: Date;
  endTime?: Date;
}

interface DragInteractionContextType {
  isDragging: boolean;
  isResizing: boolean | string;
  dragStart: DragState | null;
  dragEnd: DragState | null;
  handleMouseDown: (
    day: Date,
    hour: number,
    minutes: number,
    e: React.MouseEvent,
  ) => void;
  handleMouseEnterCell: (day: Date, hour: number, minutes: number) => void;
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
  const { addEvent, setSelectedEvent, removeDrafts } = useEvents();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<DragState | null>(null);
  const [dragEnd, setDragEnd] = useState<DragState | null>(null);
  const [isResizing, setIsResizing] = useState<boolean | string>(false);

  const handleMouseDown = (
    day: Date,
    hour: number,
    minutes: number,
    e: React.MouseEvent,
  ) => {
    if ((e.target as HTMLElement).closest(".event")) return;

    const startTime = new Date(day);
    startTime.setHours(hour, minutes, 0, 0);

    setIsDragging(true);
    setDragStart({ day, hour, startTime });
    setDragEnd({ day, hour, startTime });
  };

  const handleMouseEnterCell = (day: Date, hour: number, minutes: number) => {
    if (!isDragging || !dragStart) return;

    const endTime = new Date(day);
    endTime.setHours(hour, minutes, 0, 0);

    setDragEnd({ day, hour, endTime });
  };

  const handleResizeStart = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(event.id);
    setSelectedEvent(event);
  };

  const handleResizeMove = () => {
    if (!isResizing) return;
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (!isDragging || !dragStart) return;

      removeDrafts();

      let endTime: Date;

      if (dragEnd?.endTime && dragEnd.endTime > dragStart.startTime!) {
        endTime = dragEnd.endTime;
      } else {
        endTime = new Date(dragStart.startTime!);
        endTime.setMinutes(endTime.getMinutes() + 30);
      }

      const newEvent = {
        title: "",
        start: dragStart.startTime!,
        end: endTime,
        color: "#ff6b35",
        isAllDay: false,
        eventConfigId: "config-event",
        customFieldsValues: {},
        isDraft: true,
      };

      addEvent(newEvent);
      setSelectedEvent(newEvent as any);

      setIsDragging(false);
      setDragStart(null);
      setDragEnd(null);
    };

    if (isDragging) {
      window.addEventListener("mouseup", handleGlobalMouseUp);
      return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
    }
  }, [
    isDragging,
    dragStart,
    dragEnd,
    addEvent,
    setSelectedEvent,
    removeDrafts,
  ]);

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
