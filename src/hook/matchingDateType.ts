import { DateType } from "@/types/DateType";

type UseMatchingDateTypeProps = {
  validFrom: string;
  validTo: string;
  date: Date | null;
  weekIndex?: number;
};

export const matchingDateType = ({
  validFrom,
  validTo,
  date,
  weekIndex,
}: UseMatchingDateTypeProps): DateType => {
  const valid_from = new Date(validFrom);
  const valid_to = new Date(validTo);

  const startDate = new Date(valid_from);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(valid_to);
  endDate.setHours(0, 0, 0, 0);

  const targetDateObj = date ? new Date(date) : null;

  if (targetDateObj) {
    targetDateObj.setHours(0, 0, 0, 0);
  }

  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  const targetTime = targetDateObj ? targetDateObj.getTime() : null;

  if (!targetTime) return "notIncluded";
  if (targetTime < startTime || targetTime > endTime) return "notIncluded";
  if (targetTime > startTime && targetTime < endTime) return "middleDate";
  if (targetTime === startTime) return "startDate";
  if (targetTime === endTime) return "endDate";

  return "notIncluded";
};
