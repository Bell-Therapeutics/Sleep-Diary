"use client";
import { useState } from "react";
import Image from "next/image";

import PreviousIcon from "@/assets/svg/previousIcon.svg";
import { useCreateCalendar } from "@/hook/useCreateCalendar";
import { useSplitArray } from "@/hook/useSplitArray";
import DayBox from "@/components/DayBox/DayBox";
import { useMatchingDateType } from "@/hook/useMatchingDateType";
import { Button } from "@/components/Button/Button";
import Tooltip from "@/components/Tooltip/Tooltip";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSelectedDate, setIsSelectedDate] = useState<Date | null>(null);
  const [isAnyDateClicked, setIsAnyDateClicked] = useState(false);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const days = useCreateCalendar({ year: currentYear, month: currentMonth });
  const splitArray = useSplitArray(days, 7);

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth, 1));
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 2, 1));
  };

  const handleDayBoxCLick = (date: Date | null) => {
    if (!date) return;

    setIsAnyDateClicked(true);
    setIsSelectedDate(date);
  };

  return (
    <div
      className={
        "w-[480px] h-[100%] pb-[44px] mobleHeight:pb-[10px] bg-white px-6 flex flex-col justify-between"
      }
    >
      <div>
        <div className={"mt-[28px] mobleHeight:mt-[14px] "}>
          <h1
            className={
              "text-gray-primary text-[32px] mobleHeight:text-[26px]  font-bold break-words"
            }
          >
            수면 일
          </h1>
          <p className={"text-gray-tertiary text-[16px] font-[500] mt-3"}>
            사용 기간: 01.03 - 02.03
          </p>
        </div>
        <div className={"w-full flex flex-col mt-[34px] mobleHeight:mt-[8px]"}>
          <div className={"w-[100%] flex items-center justify-between"}>
            <div className={"w-[7px] h-[12px]"} onClick={handlePrevMonth}>
              <Image src={PreviousIcon} alt={"왼쪽화살표"} />
            </div>
            <p
              className={
                "text-gray-primary text-[20px] mobleHeight:text-[14px] font-[600] "
              }
            >
              {`${currentYear}년 ${currentMonth}월`}
            </p>
            <div
              className={"w-[7px] h-[12px] rotate-180"}
              onClick={handleNextMonth}
            >
              <Image src={PreviousIcon} alt={"오른쪽화살표"} />
            </div>
          </div>
          <div
            className={
              "w-full flex justify-between mt-[28px] mobleHeight:mt-[10px]"
            }
          >
            {weekdays.map((day) => (
              <div
                key={day}
                className={
                  "w-[32px] h-[32px] flex justify-center items-center text-calendar-primary text-[15px] font-[500]"
                }
              >
                {day}
              </div>
            ))}
          </div>
          <div className={"flex flex-wrap gap-4 mobleHeight:gap-2 w-full"}>
            {splitArray.map((dayArr, weekIndex) => (
              <div
                key={`${currentYear}-${weekIndex}`}
                className={"w-full flex justify-between"}
              >
                {dayArr.map((day, dayIndex) => (
                  <div
                    key={`${currentYear}-${currentMonth}-${day}-${dayIndex}`}
                    className={"flex flex-col "}
                  >
                    <DayBox
                      date={day}
                      isAnyDateClicked={isAnyDateClicked}
                      dateType={useMatchingDateType({ date: day.date })}
                      onDayBoxClick={() => handleDayBoxCLick(day.date)}
                      isSelected={
                        day.date
                          ? day.date.getTime() === isSelectedDate?.getTime()
                          : false
                      }
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Tooltip />
        <Button disabled={true}>수면 일기 작성하기</Button>
      </div>
    </div>
  );
}
