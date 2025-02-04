type UseCreateWrittenArr = {
  writtenDays: string[];
  yearMonth: string;
};

export const useCreateWrittenArr = ({
  writtenDays,
  yearMonth,
}: UseCreateWrittenArr) => {
  const sortArr = writtenDays.sort((a, b) => Number(a) - Number(b));

  return sortArr.map((num) => `2025-02-${num.padStart(2, "0")}`);
};
