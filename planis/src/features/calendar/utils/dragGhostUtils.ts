export interface DayBlockPosition {
  top: number;
  height: number;
  left: number;
  width: number;
  dayIndex: number;
  isFirstDay: boolean;
  isLastDay: boolean;
}

export const isMultiDay = (start: Date, end: Date): boolean => {
  return (
    start.getDate() !== end.getDate() ||
    start.getMonth() !== end.getMonth() ||
    start.getFullYear() !== end.getFullYear()
  );
};

export const calculateDayBlockPosition = (
  start: Date,
  end: Date,
  dayIndex: number,
  headerHeight: number,
  columnWidth: number,
  isFirstDay: boolean,
  isLastDay: boolean,
): DayBlockPosition => {
  let topPosition: number;
  let height: number;

  if (isFirstDay && !isLastDay) {
    const startHour = start.getHours() + start.getMinutes() / 60;
    topPosition = startHour * 60 + headerHeight;
    height = (24 - startHour) * 60;
  } else if (isLastDay && !isFirstDay) {
    const endHour = end.getHours() + end.getMinutes() / 60;
    topPosition = headerHeight;
    height = endHour * 60;
  } else if (isFirstDay && isLastDay) {
    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    topPosition = startHour * 60 + headerHeight;
    height = (endHour - startHour) * 60;
  } else {
    topPosition = headerHeight;
    height = 24 * 60;
  }

  const leftPosition = 60 + dayIndex * columnWidth;

  return {
    top: topPosition,
    height,
    left: leftPosition,
    width: columnWidth,
    dayIndex,
    isFirstDay,
    isLastDay,
  };
};

export const calculateSingleDayPosition = (
  start: Date,
  end: Date,
  dayIndex: number,
  headerHeight: number,
  columnWidth: number,
) => {
  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = end.getHours() + end.getMinutes() / 60;
  const duration = endHour - startHour;

  const topPosition = startHour * 60 + headerHeight;
  const height = duration * 60;
  const leftPosition = 60 + dayIndex * columnWidth;

  return {
    top: topPosition,
    height,
    left: leftPosition,
    width: columnWidth,
  };
};
