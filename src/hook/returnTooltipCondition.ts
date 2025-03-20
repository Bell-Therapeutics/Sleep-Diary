interface TooltipConditionProps {
  selectedDate: Date | null;
  today: Date;
  writtenDays: string[];
}

type TooltipStatusCode = 0 | 1 | 2 | 3 | 4 | 5;

export const returnTooltipCondition = ({
  selectedDate,
  today,
  writtenDays,
}: TooltipConditionProps): TooltipStatusCode => {
  // 날짜 비교를 위해 시간을 00:00:00으로 설정
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  // 오늘 날짜를 YYYY-MM-DD 형식의 문자열로 변환
  const todayString = `${startOfToday.getFullYear()}-${String(
    startOfToday.getMonth() + 1
  ).padStart(2, "0")}-${String(startOfToday.getDate()).padStart(2, "0")}`;

  if (!selectedDate) {
    // 오늘이고 작성되어 있는 경우
    if (writtenDays.includes(todayString)) {
      return 5;
    }
    // 오늘이지만 작성되어 있지 않은 경우
    return 4;
  }

  // 미래 날짜 체크를 먼저 수행
  if (selectedDate.getTime() > startOfToday.getTime()) {
    return 1;
  }

  // 선택된 날짜를 YYYY-MM-DD 형식의 문자열로 변환
  const selectedDateString = `${selectedDate.getFullYear()}-${String(
    selectedDate.getMonth() + 1
  ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

  // writtenDays 체크를 과거 날짜 체크보다 먼저 수행
  if (writtenDays.includes(selectedDateString)) {
    return 5;
  }

  // 과거 날짜 체크를 마지막으로 수행
  if (selectedDate.getTime() < startOfToday.getTime()) {
    return 2;
  }

  return 4; // 오늘이지만 작성되지 않은 경우
};
