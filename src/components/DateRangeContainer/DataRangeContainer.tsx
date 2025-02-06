import React from "react";
import { DateType } from "@/types/DateType";

interface DayInfo {
  date: Date | null;
  dateType: DateType;
}

interface DateRangeContainerProps {
  children: React.ReactNode;
  weekDays: DayInfo[];
}

const DateRangeContainer: React.FC<DateRangeContainerProps> = ({
  children,
  weekDays,
}) => {
  const hasValidDate = weekDays.some(
    (day) =>
      day.date &&
      (day.dateType === "middleDate" ||
        day.dateType === "startDate" ||
        day.dateType === "endDate"),
  );

  if (!hasValidDate) {
    return <div className="w-full flex justify-between">{children}</div>;
  }

  const startIndex = weekDays.findIndex(
    (day) =>
      day.date &&
      (day.dateType === "middleDate" ||
        day.dateType === "startDate" ||
        day.dateType === "endDate"),
  );

  const endIndex = weekDays.findLastIndex(
    (day) =>
      day.date &&
      (day.dateType === "middleDate" ||
        day.dateType === "startDate" ||
        day.dateType === "endDate"),
  );

  const box = 32;
  const containerWidth = 100;
  const boxPercent = box / containerWidth;
  const nearby = (100 - boxPercent * 7) / 6;

  return (
    <div className="w-full flex justify-between relative">
      <div
        style={{
          position: "absolute",
          left: `calc(${startIndex * (boxPercent + nearby)}%)`,
          width: `calc(${(endIndex - startIndex + 1) * boxPercent + (endIndex - startIndex) * nearby}%)`,
          height: "32px",
          backgroundColor: "#EDF2FD",
          borderRadius: "10px",
        }}
      />
      <div className="w-full flex justify-between relative z-10">
        {children}
      </div>
    </div>
  );
};

export default DateRangeContainer;
