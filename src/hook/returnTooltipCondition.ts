interface TooltipConditionProps {
  selectedDate: Date | null;
  today: Date;
}

type TooltipStatusCode = 0 | 1 | 2;

export const returnTooltipCondition = ({
  selectedDate,
  today,
}: TooltipConditionProps): TooltipStatusCode => {
  // 날짜 비교를 위해 시간을 00:00:00으로 설정
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  if (!selectedDate) {
    return 0;
  }

  if (selectedDate.getTime() > startOfToday.getTime()) {
    return 1;
  }

  if (selectedDate.getTime() < startOfToday.getTime()) {
    return 2;
  }

  return 0;
};
