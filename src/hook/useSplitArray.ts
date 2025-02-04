import { DateInfo } from "@/types/DayInfo";

export const useSplitArray = (arr: DateInfo[], splitSize: number) => {
  const splitArray = [];
  for (let i = 0; i < arr.length; i += splitSize) {
    splitArray.push(arr.slice(i, i + splitSize));
  }

  if (
    splitArray.length > 0 &&
    splitArray[splitArray.length - 1].every((day) => day.date === null)
  ) {
    splitArray.pop();
  }

  return splitArray;
};
