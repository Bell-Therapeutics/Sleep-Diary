type CreateWrittenArr = {
  writtenDays: string[];
  yearMonth: string;
};

export const createWrittenArr = ({ writtenDays = [] }: CreateWrittenArr) => {
  const sortArr = writtenDays.sort((a, b) => Number(a) - Number(b));

  return sortArr.map((num) => `2025-02-${num.padStart(2, "0")}`);
};
