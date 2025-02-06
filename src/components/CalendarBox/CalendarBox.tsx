import { DateInfo } from "@/types/DayInfo";
import { matchingDateType } from "@/hook/matchingDateType";
import DateRangeContainer from "@/components/DateRangeContainer/DataRangeContainer";
import DayBox from "@/components/DayBox/DayBox";
import { converDate } from "@/hook/converDate";
import { UserInfoType } from "@/types/UserInfo";

type CalendarProps = {
  dateArr: DateInfo[][];
  userInfo: UserInfoType;
  isSelectedDate: Date | null;
  writtenDays: string[];
  currentDate: Date;
  handleDayBoxCLick: (date: Date | null) => void; // 추가된 부분
  isAnyDateClicked: boolean;
};

const CalendarBox = ({
  dateArr,
  userInfo,
  isSelectedDate,
  writtenDays,
  currentDate,
  handleDayBoxCLick,
  isAnyDateClicked,
}: CalendarProps) => {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <>
      <div className="w-full flex justify-between mt-[26px] mobleHeight:mt-[10px]">
        {weekdays.map((day) => (
          <div
            key={day}
            className="w-[32px] h-[32px] flex justify-center items-center text-calendar-primary text-[15px] font-[500]"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="flex-1 mobleHeight:pb-[25px] bg-white  flex flex-col justify-between">
        <div className="flex flex-wrap gap-4 mobleHeight:gap-2 w-full mt-[14px]">
          {dateArr.map((dayArr, weekIndex) => {
            const daysWithType = dayArr.map((day) => ({
              ...day,
              dateType: matchingDateType({
                date: day.date,
                validFrom: userInfo?.access_start || "",
                validTo: userInfo?.access_end || "",
              }),
            }));

            return (
              <DateRangeContainer
                key={`${currentYear}-${weekIndex}`}
                weekDays={daysWithType}
              >
                {dayArr.map((day, dayIndex) => {
                  return (
                    <div
                      key={`${currentYear}-${currentMonth}-${day}-${dayIndex}`}
                      className="flex flex-col"
                    >
                      <DayBox
                        date={day}
                        isAnyDateClicked={isAnyDateClicked}
                        isDiaryWritten={
                          day.date !== null
                            ? writtenDays.includes(
                                converDate({ date: day.date }),
                              )
                            : false
                        }
                        dateType={matchingDateType({
                          date: day.date,
                          validTo: userInfo?.access_end,
                          validFrom: userInfo?.access_start,
                        })}
                        onDayBoxClick={() => handleDayBoxCLick(day.date)}
                        isSelected={
                          day.date
                            ? day.date.getTime() === isSelectedDate?.getTime()
                            : false
                        }
                      />
                    </div>
                  );
                })}
              </DateRangeContainer>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CalendarBox;
