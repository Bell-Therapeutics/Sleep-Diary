import { DateType } from "@/types/DateType";
import { DateInfo } from "@/types/DayInfo";

type DayBoxProps = {
  date: DateInfo;
  isSelected?: boolean;
  dateType?: DateType;
  isDiaryWritten?: boolean;
  onDayBoxClick: (date: Date | null) => void;
  isAnyDateClicked: boolean;
};

const DayBox = ({
  date,
  isDiaryWritten = true,
  dateType = "notIncluded",
  isSelected = false,
  onDayBoxClick,
  isAnyDateClicked,
}: DayBoxProps) => {
  const dayTypeStyles = {
    startDate: isSelected ? "" : "rounded-l-xl bg-day-primary",
    middleDate: isSelected ? "" : "rounded-[6px] bg-day-primary",
    endDate: isSelected ? "" : "rounded-r-xl bg-day-primary",
    notIncluded: "",
  } as const;

  const today = new Date();
  const isToday = date.date
    ? today.getFullYear() === date.date.getFullYear() &&
      today.getMonth() === date.date.getMonth() &&
      today.getDate() === date.date.getDate()
    : false;

  const getBoxStyles = () => {
    const styles = ["w-8 h-8 box-border rounded-[6px]"];

    if (isToday && !isAnyDateClicked) {
      styles.push("bg-day-border");
    } else if (isToday && isAnyDateClicked) {
      styles.push("bg-blue-secondary");
    } else if (isSelected && isToday) {
      styles.push("bg-day-border");
    } else if (isSelected && !isToday) {
      styles.push("bg-day-border");
    } else if (isDiaryWritten) {
      styles.push("border border-day-border overflow-hidden");
    }

    return styles.join(" ");
  };

  const getTextStyles = () => {
    const styles = [`text-[18px] font-[600]`];
    if (isToday || isSelected) {
      styles.push(`text-white`);
    } else if (isDiaryWritten) {
      styles.push(`text-day-border`);
    } else {
      styles.push(`text-calendar-primary`);
    }

    return styles.join(" ");
  };

  return (
    <div
      className={"flex flex-col gap-[3px]"}
      onClick={() => {
        onDayBoxClick(date.date || null);
      }}
    >
      <div className={getBoxStyles()}>
        <div
          className={`w-full h-full flex justify-center items-center ${!isToday && dayTypeStyles[dateType]} `}
        >
          {date.day !== "" && <p className={getTextStyles()}>{date.day}</p>}
        </div>
      </div>
      {!isToday && isDiaryWritten && (
        <p className={"text-gray-date text-[11px] font-[500] text-center"}>
          완료
        </p>
      )}
      {isToday && (
        <p className={"text-day-border text-[11px] font-[500] text-center"}>
          오늘
        </p>
      )}
    </div>
  );
};

export default DayBox;
