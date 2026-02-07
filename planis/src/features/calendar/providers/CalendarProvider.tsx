import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface CalendarContextType {
  currentDate: Date;
  currentTime: Date;
  viewDays: number;
  headerHeight: number;
  setCurrentDate: (date: Date) => void;
  setViewDays: (days: number) => void;
  setHeaderHeight: (height: number) => void;
  changeMonth: (delta: number) => void;
  getDisplayDays: () => Date[];
  getMonthCalendar: () => Array<{ date: Date; isCurrentMonth: boolean }>;
  isSameDay: (date1: Date, date2: Date) => boolean;
  isToday: (date: Date) => boolean;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined,
);

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within CalendarProvider");
  }
  return context;
};

interface CalendarProviderProps {
  children: ReactNode;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({
  children,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewDays, setViewDays] = useState(7);
  const [headerHeight, setHeaderHeight] = useState(61);

  const getDisplayDays = () => {
    const days: Date[] = [];
    const start = new Date(currentDate);
    start.setHours(0, 0, 0, 0);

    if (viewDays === 1) {
      days.push(new Date(start));
    } else {
      const dayOfWeek = start.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      start.setDate(start.getDate() + diff);

      for (let i = 0; i < viewDays; i++) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        days.push(day);
      }
    }
    return days;
  };

  const getMonthCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({ date, isCurrentMonth: true });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const value: CalendarContextType = {
    currentDate,
    currentTime,
    viewDays,
    headerHeight,
    setCurrentDate,
    setViewDays,
    setHeaderHeight,
    changeMonth,
    getDisplayDays,
    getMonthCalendar,
    isSameDay,
    isToday,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};
