type UseConverDate = {
  date: Date;
};

export const useConverDate = ({ date }: UseConverDate) => {
  if (!date) return "";

  const convertedDate = new Date(date);
  let formattedDate = `${convertedDate.getFullYear()}-${String(convertedDate.getMonth() + 1).padStart(2, "0")}-${String(convertedDate.getDate()).padStart(2, "0")}`;

  return formattedDate; // 값을 반환하도록 추가
};
