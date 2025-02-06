interface TooltipConditionProps {
  selectedDate: Date | null;
  writtenDays: string[];
  today: Date;
}

type TooltipStatusCode = 0 | 1 | 2 | 3 | 4;

export const returnTooltipCondition = ({
  selectedDate,
  writtenDays,
  today,
}: TooltipConditionProps): TooltipStatusCode => {
  // 날짜 비교를 위해 시간을 00:00:00으로 설정
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const todayStr = `${startOfToday.getFullYear()}-${String(startOfToday.getMonth() + 1).padStart(2, "0")}-${String(startOfToday.getDate()).padStart(2, "0")}`;

  if (!selectedDate) {
    return 1;
  }

  const selectedDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

  if (selectedDate.getTime() > startOfToday.getTime()) {
    return 4;
  }

  if (
    selectedDate.getTime() < startOfToday.getTime() &&
    !writtenDays.includes(selectedDateStr)
  ) {
    return 2;
  }

  if (
    writtenDays.includes(selectedDateStr) ||
    (selectedDateStr === todayStr && writtenDays.includes(todayStr))
  ) {
    return 3;
  }

  if (selectedDateStr === todayStr && !writtenDays.includes(todayStr)) {
    return 1;
  }

  return 0;
};
