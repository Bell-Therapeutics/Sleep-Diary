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
  // 이 주에 범위에 포함되는 날짜가 있는지 확인 (middleDate, startDate, endDate)
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

  // 범위의 시작과 끝 인덱스 찾기
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

  // 배경색이 있는 구간의 너비 계산 (7은 전체 칸 수)
  const leftOffset = `${(startIndex / 7) * 100}%`;
  const width = `${((endIndex - startIndex + 1) / 7) * 100}%`;

  return (
    <div className="w-full flex justify-between relative">
      {/* 배경색 컨테이너 */}
      <div
        className="absolute bg-day-primary rounded-lg"
        style={{
          left: leftOffset,
          width: width,
          height: "32px",
          zIndex: 0,
        }}
      />
      {/* 날짜 컴포넌트들 */}
      <div className="w-full flex justify-between relative z-10">
        {children}
      </div>
    </div>
  );
};

export default DateRangeContainer;
