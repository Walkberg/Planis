import { formatDate } from "../../../utils/dateUtils";

interface EventDateProps {
  start: Date;
  end: Date;
}

export const EventDate = ({ start, end }: EventDateProps) => {
  return (
    <div className="text-[10px]">
      {formatDate(start)} - {formatDate(end)}
    </div>
  );
};
