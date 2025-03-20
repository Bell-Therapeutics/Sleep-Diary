type CreateWrittenArr = {
  writtenDays: string[];
  yearMonth: string;
};

export const createWrittenArr = ({
  writtenDays = [],
  yearMonth,
}: CreateWrittenArr) => {
  const sortArr = writtenDays.sort((a, b) => Number(a) - Number(b));

  return sortArr.map((num) => `${yearMonth}-${num.padStart(2, "0")}`);
};
