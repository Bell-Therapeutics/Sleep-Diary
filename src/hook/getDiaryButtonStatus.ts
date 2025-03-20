import { converDate } from "@/hook/converDate";
import { DiaryButtonStatusType } from "@/types/DiaryButtonStatusType";

type GetDiaryButtonStatusProps = {
  writtenDays: string[];
  isSelectedDate: Date | null;
  startOfToday: Date;
  today: Date;
};

export const getDiaryButtonStatus = ({
  writtenDays,
  isSelectedDate,
  startOfToday,
  today,
}: GetDiaryButtonStatusProps) => {
  const todayStr = converDate({ date: today });

  if (!isSelectedDate) {
    if (writtenDays.includes(todayStr)) {
      return getDiaryButtonText("CANREADING");
    }

    return getDiaryButtonText("WRITABLE");
  }

  const selectedDateStr = converDate({ date: isSelectedDate });

  if (writtenDays.includes(selectedDateStr)) {
    return getDiaryButtonText("CANREADING");
  }

  if (isSelectedDate.getTime() !== startOfToday.getTime()) {
    return getDiaryButtonText("UNAVAILABLE");
  }

  return getDiaryButtonText("WRITABLE");
};
export const getDiaryButtonText = (status: DiaryButtonStatusType) => {
  const textByStatus = {
    WRITABLE: "수면일기 작성하기",
    COMPLETED: "수면일기 작성완료",
    UNAVAILABLE: "수면일기 작성불가",
    CANREADING: "수면 일기 보기",
  };

  return textByStatus[status];
};
