import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
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

interface MousePosition {
  x: number;
  y: number;
}

interface TargetDropPosition {
  day: Date;
  startTime: Date;
  endTime: Date;
}

interface DragInteractionContextType {
  isDragging: boolean;
  isResizing: boolean | string;
  isDraggingEvent: boolean;
  draggedEvent: CalendarEvent | null;
  mousePosition: MousePosition | null;
  targetDropPosition: TargetDropPosition | null;
  dragStart: DragState | null;
  dragEnd: DragState | null;
  tempResizeEnd: Date | null;
  handleMouseDown: (
    day: Date,
    hour: number,
    minutes: number,
    e: React.MouseEvent,
  ) => void;
  handleMouseEnterCell: (day: Date, hour: number, minutes: number) => void;
  handleResizeStart: (event: CalendarEvent, e: React.MouseEvent) => void;
  handleEventDragStart: (event: CalendarEvent, e: React.MouseEvent) => void;
  handleEventDragMove: (day: Date, hour: number, minutes: number) => void;
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
  const { addEvent, setSelectedEvent, removeDrafts, updateEvent } = useEvents();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<DragState | null>(null);
  const [dragEnd, setDragEnd] = useState<DragState | null>(null);
  const [isResizing, setIsResizing] = useState<boolean | string>(false);
  const [tempResizeEnd, setTempResizeEnd] = useState<Date | null>(null);

  const [isDraggingEvent, setIsDraggingEvent] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [mousePosition, setMousePosition] = useState<MousePosition | null>(
    null,
  );
  const [targetDropPosition, setTargetDropPosition] =
    useState<TargetDropPosition | null>(null);

  const resizeStateRef = useRef<{
    event: CalendarEvent;
    startY: number;
    originalEndTime: Date;
  } | null>(null);

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

  const handleEventDragStart = (event: CalendarEvent, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".resize-handle")) return;
    e.stopPropagation();

    setIsDraggingEvent(true);
    setDraggedEvent(event);
    setMousePosition({ x: e.clientX, y: e.clientY });
    setSelectedEvent(event);
  };

  const handleEventDragMove = (day: Date, hour: number, minutes: number) => {
    if (!isDraggingEvent || !draggedEvent) return;

    const startTime = new Date(day);
    startTime.setHours(hour, minutes, 0, 0);

    const duration = draggedEvent.end.getTime() - draggedEvent.start.getTime();
    const endTime = new Date(startTime.getTime() + duration);

    setTargetDropPosition({ day, startTime, endTime });
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
    setTempResizeEnd(null);
    resizeStateRef.current = {
      event,
      startY: e.clientY,
      originalEndTime: new Date(event.end),
    };
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleResizeMove = (e: MouseEvent) => {
      if (!resizeStateRef.current) return;

      const deltaY = e.clientY - resizeStateRef.current.startY;
      const deltaMinutes = Math.round(((deltaY / 60) * 60) / 15) * 15;

      const newEndTime = new Date(resizeStateRef.current.originalEndTime);
      newEndTime.setMinutes(newEndTime.getMinutes() + deltaMinutes);

      const minEndTime = new Date(resizeStateRef.current.event.start);
      minEndTime.setMinutes(minEndTime.getMinutes() + 15);

      if (newEndTime < minEndTime) {
        newEndTime.setTime(minEndTime.getTime());
      }

      setTempResizeEnd(newEndTime);
    };

    const handleResizeEnd = async () => {
      if (!resizeStateRef.current || !tempResizeEnd) {
        setIsResizing(false);
        setTempResizeEnd(null);
        resizeStateRef.current = null;
        return;
      }

      await updateEvent({ end: tempResizeEnd });

      setIsResizing(false);
      setTempResizeEnd(null);
      resizeStateRef.current = null;
    };

    window.addEventListener("mousemove", handleResizeMove);
    window.addEventListener("mouseup", handleResizeEnd);

    return () => {
      window.removeEventListener("mousemove", handleResizeMove);
      window.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [isResizing, tempResizeEnd, updateEvent]);

  useEffect(() => {
    if (!isDraggingEvent) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = async () => {
      if (!draggedEvent || !targetDropPosition) {
        setIsDraggingEvent(false);
        setDraggedEvent(null);
        setMousePosition(null);
        setTargetDropPosition(null);
        return;
      }

      await updateEvent({
        ...draggedEvent,
        start: targetDropPosition.startTime,
        end: targetDropPosition.endTime,
      });

      setIsDraggingEvent(false);
      setDraggedEvent(null);
      setMousePosition(null);
      setTargetDropPosition(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingEvent, draggedEvent, targetDropPosition, updateEvent]);

  useEffect(() => {
    const handleGlobalMouseUp = async () => {
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

      const createdEvent = await addEvent(newEvent);
      setSelectedEvent(createdEvent);

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

  const value: DragInteractionContextType = {
    isDragging,
    isResizing,
    isDraggingEvent,
    draggedEvent,
    mousePosition,
    targetDropPosition,
    dragStart,
    dragEnd,
    tempResizeEnd,
    handleMouseDown,
    handleMouseEnterCell,
    handleResizeStart,
    handleEventDragStart,
    handleEventDragMove,
  };

  return (
    <DragInteractionContext.Provider value={value}>
      {children}
    </DragInteractionContext.Provider>
  );
};
