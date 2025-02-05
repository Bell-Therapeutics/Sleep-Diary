"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

import PreviousIcon from "@/assets/svg/previousIcon.svg";
import { createCalendar } from "@/hook/createCalendar";
import { splitArray } from "@/hook/splitArray";
import DayBox from "@/components/DayBox/DayBox";
import { matchingDateType } from "@/hook/matchingDateType";
import { Button } from "@/components/Button/Button";
import Tooltip from "@/components/Tooltip/Tooltip";
import { BASE_URL } from "@/constants/baseUrl";
import { createWrittenArr } from "@/hook/createWrittenArr";
import { converDate } from "@/hook/converDate";
import DateRangeContainer from "@/components/DateRangeContainer/DataRangeContainer";
import { returnTooltipCondition } from "@/hook/returnTooltipCondition";
import { redirectGoogleForm } from "@/hook/redirectGoogleForm";

type ResponseType = {
  result_code: number;
  token: string;
  name: string;
  user_id: string;
  access_start: string;
  access_end: string;
  last_session_day: string;
  access_count: number;
  touch_mode: number;
  push_yn: "Y" | "N";
  st_score: number;
  sleep_score: number;
  breathe_score: number;
  latest_avg_inhale: number;
  latest_avg_exhale: number;
  is_tutorial_completed: boolean;
};

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSelectedDate, setIsSelectedDate] = useState<Date | null>(null);
  const [isAnyDateClicked, setIsAnyDateClicked] = useState(false);
  const [userInfo, setUserInfo] = useState<ResponseType>();
  const [writtenDays, setWrittenDays] = useState<string[]>([]);
  const [isDisable, setIsDisable] = useState<boolean>(false);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const days = createCalendar({ year: currentYear, month: currentMonth });
  const splitArr = splitArray(days, 7);
  const router = useRouter();
  const yearMonth = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
  const today = new Date();

  const fetchDiaryData = async () => {
    // userInfo가 없으면 return
    if (!userInfo?.user_id) return;

    try {
      const response = await fetch(
        `/api/diary?userId=${userInfo.user_id}&yearMonth=${yearMonth}`,
      );
      const data = await response.json();

      if (response.ok) {
        const dates = data.data.dates || [];
        setWrittenDays(createWrittenArr({ writtenDays: dates, yearMonth }));
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    // 선택된 날짜가 없으면 오늘 날짜 기준으로 체크
    const dateToCheck = isSelectedDate || today;
    const dateStr = converDate({ date: dateToCheck });
    const todayStr = converDate({ date: today });

    setIsDisable(
      dateStr !== todayStr ||
        (dateStr === todayStr && writtenDays.includes(todayStr)),
    );
  }, [isSelectedDate, writtenDays, today]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const getUserInfo = async (userId: string, token: string) => {
      try {
        const { data } = await axios.get<ResponseType>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/info`,
          {
            headers: {
              "Content-Type": "application/json",
              userId: userId,
              Authorization: token,
            },
          },
        );
        if (data) {
          setUserInfo(data);
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (!userId && !token) {
      router.push("/auth/login");
    }
    if (userId && token) {
      getUserInfo(userId, token);
    }
  }, [router]);

  const handleNextMonth = () => {
    if (userInfo) {
      const endDate = new Date(userInfo.access_end);
      const endYear = endDate.getFullYear();
      const endMonth = endDate.getMonth() + 1;

      if (
        currentYear > endYear ||
        (currentYear === endYear && currentMonth >= endMonth)
      ) {
        return;
      }

      setCurrentDate(new Date(currentYear, currentMonth, 1));
    }
  };

  const handlePrevMonth = () => {
    if (userInfo) {
      const startDate = new Date(userInfo.access_start);
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth() + 1;

      if (
        currentYear < startYear ||
        (currentYear === startYear && currentMonth <= startMonth)
      ) {
        return;
      }

      setCurrentDate(new Date(currentYear, currentMonth - 2, 1));
    }
  };

  const handleDayBoxCLick = (date: Date | null) => {
    if (!date) return;
    setIsAnyDateClicked(true);
    setIsSelectedDate(date);
  };

  const recordWrittenDay = async () => {
    try {
      const data = await fetch("/api/diary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userInfo?.user_id,
          date: today,
        }),
      });

      if (data.ok) {
        console.log("기록 성공");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // useEffect 수정
  useEffect(() => {
    // userInfo가 있을 때만 fetchDiaryData 실행
    if (userInfo?.user_id) {
      fetchDiaryData();
    }
  }, [yearMonth, userInfo]); // use

  if (!userInfo) return <div>...Loading</div>;

  return (
    <div className="flex-1 pb-[44px] mobleHeight:pb-[10px] bg-white px-6 flex flex-col justify-between">
      <div>
        <div className="mt-[28px] mobleHeight:mt-[14px]">
          <h1 className="text-gray-primary text-[32px] mobleHeight:text-[26px] font-bold break-words">
            수면 일기
          </h1>
          <p className="text-gray-tertiary text-[16px] font-[500] mt-3">
            {`사용 기간: ${userInfo.access_start.split(" ")[0]} ~ ${
              userInfo.access_end.split(" ")[0]
            }`}
          </p>
        </div>
        <div className="w-full flex flex-col mt-[34px] mobleHeight:mt-[8px]">
          <div className="w-[100%] flex items-center justify-between">
            <div className="w-[7px] h-[12px]" onClick={handlePrevMonth}>
              <Image src={PreviousIcon} alt="왼쪽화살표" />
            </div>
            <p className="text-gray-primary text-[20px] mobleHeight:text-[14px] font-[600]">
              {`${currentYear}년 ${currentMonth}월`}
            </p>
            <div
              className="w-[7px] h-[12px] rotate-180"
              onClick={handleNextMonth}
            >
              <Image src={PreviousIcon} alt="오른쪽화살표" />
            </div>
          </div>
          <div className="w-full flex justify-between mt-[28px] mobleHeight:mt-[10px]">
            {weekdays.map((day) => (
              <div
                key={day}
                className="w-[32px] h-[32px] flex justify-center items-center text-calendar-primary text-[15px] font-[500]"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mobleHeight:gap-2 w-full">
            {splitArr.map((dayArr, weekIndex) => {
              // 각 날짜의 dateType 계산
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
      </div>
      <div>
        <Tooltip
          statusCode={returnTooltipCondition({
            selectedDate: isSelectedDate,
            writtenDays: writtenDays.length > 0 ? writtenDays : [],
            today,
          })}
        />
        <Button
          disabled={isDisable}
          onClick={() => {
            recordWrittenDay();
            redirectGoogleForm(userInfo?.name);
          }}
        >
          수면 일기 작성하기
        </Button>
      </div>
    </div>
  );
}
