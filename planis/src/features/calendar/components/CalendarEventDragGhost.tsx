import { formatDate } from "../../../utils/dateUtils";
import { useDragInteraction } from "../../interactions/providers/DragInteractionProvider";

export const CalendarEventDragGhost = () => {
  const { isDraggingEvent, draggedEvent, mousePosition } = useDragInteraction();

  if (!isDraggingEvent || !draggedEvent || !mousePosition) return null;

  const startHour =
    draggedEvent.start.getHours() + draggedEvent.start.getMinutes() / 60;
  const endHour =
    draggedEvent.end.getHours() + draggedEvent.end.getMinutes() / 60;
  const duration = endHour - startHour;
  const height = duration * 60;

  return (
    <div
      className="fixed border-[3px] border-black rounded-[10px] p-2 pointer-events-none z-9999 opacity-60 shadow-neo-md"
      style={{
        top: `${mousePosition.y - height / 2}px`,
        left: `${mousePosition.x - 100}px`,
        width: `200px`,
        height: `${height}px`,
        background: draggedEvent.color,
      }}
    >
      <div className="font-bold text-xs mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
        {draggedEvent.title || "Sans titre"}
      </div>
      <div className="text-[10px] mb-2">
        {formatDate(draggedEvent.start)} - {formatDate(draggedEvent.end)}
      </div>
    </div>
  );
};
