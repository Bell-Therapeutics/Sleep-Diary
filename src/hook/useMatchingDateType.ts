import { DateType } from "@/types/DateType";

type UseMatchingDateTypeProps = {
  validFrom?: string;
  validTo?: string;
  date: Date | null;
};

export const useMatchingDateType = ({
  validFrom = "2025 01 03",
  validTo = "2025 02 10",
  date,
}: UseMatchingDateTypeProps): DateType => {
  const startDate = new Date(validFrom).getTime();
  const endDate = new Date(validTo).getTime();
  const targetDate = date ? date.getTime() : null;

  if (!targetDate) return "notIncluded";
  if (targetDate < startDate || targetDate > endDate) return "notIncluded";
  if (targetDate > startDate && targetDate < endDate) return "middleDate";
  if (targetDate === startDate) return "startDate";
  if (targetDate === endDate) return "endDate";

  return "notIncluded";
};
