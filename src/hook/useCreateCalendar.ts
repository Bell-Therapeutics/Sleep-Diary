import { DateInfo } from "@/types/DayInfo";

type UseCreateCalendarProps = {
  year: number;
  month: number;
};

const getMonthFirstDay = ({ year, month }: UseCreateCalendarProps) => {
  return new Date(year, month - 1, 1).getDay();
};

const getMonthLastDay = ({ year, month }: UseCreateCalendarProps) => {
  return new Date(year, month, 0).getDate();
};

export const useCreateCalendar = ({ year, month }: UseCreateCalendarProps) => {
  const firstDay = getMonthFirstDay({ year, month });
  const lastDay = getMonthLastDay({ year, month });
  const days: DateInfo[] = [];

  for (let prevDay = 0; prevDay < firstDay; prevDay++) {
    days.push({
      day: "",
      date: null,
    });
  }

  for (let day = 1; day <= lastDay; day++) {
    days.push({
      day: String(day),
      date: new Date(year, month - 1, day),
    });
  }

  while (days.length < 42) {
    days.push({
      day: "",
      date: null,
    });
  }

  return days;
};
