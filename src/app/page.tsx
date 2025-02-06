"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

import PreviousIcon from "@/assets/svg/previousIcon.svg";
import { createCalendar } from "@/hook/createCalendar";
import { splitArray } from "@/hook/splitArray";
import { Button } from "@/components/Button/Button";
import Tooltip from "@/components/Tooltip/Tooltip";
import { createWrittenArr } from "@/hook/createWrittenArr";
import { converDate } from "@/hook/converDate";
import { returnTooltipCondition } from "@/hook/returnTooltipCondition";
import { redirectGoogleForm } from "@/hook/redirectGoogleForm";
import LoadingBox from "@/components/LoadingBox/LoadingBox";
import { UserInfoType } from "@/types/UserInfo";
import CalendarBox from "@/components/CalendarBox/CalendarBox";
import LoadingIcon from "@/assets/svg/loadingIconGray.svg";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSelectedDate, setIsSelectedDate] = useState<Date | null>(null);
  const [isAnyDateClicked, setIsAnyDateClicked] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfoType>();
  const [writtenDays, setWrittenDays] = useState<string[]>([]);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [isDataReady, setIsDataReady] = useState(false);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const days = createCalendar({ year: currentYear, month: currentMonth });
  const splitArr = splitArray(days, 7);
  const router = useRouter();
  const yearMonth = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const handleDayBoxCLick = (date: Date | null) => {
    if (!date) return;
    setIsAnyDateClicked(true);
    setIsSelectedDate(date);
  };

  const fetchDiaryData = async (userId: string) => {
    try {
      const diaryResponse = await fetch(
        `/api/diary?userId=${userId}&yearMonth=${yearMonth}`,
      );
      const diaryData = await diaryResponse.json();

      if (diaryResponse.ok) {
        setWrittenDays(
          createWrittenArr({
            writtenDays: diaryData.data.dates || [],
            yearMonth,
          }),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchingInitialData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        router.push("/auth/login");
        return;
      }

      const userInfoResponse = await api.get<UserInfoType>("/user/info", {
        headers: { userId, Authorization: token },
      });

      setUserInfo(userInfoResponse.data);
      await fetchDiaryData(userInfoResponse.data.user_id);
      setIsDataReady(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchingInitialData();
  }, []);

  // 월이 변경될 때마다 데이터 다시 fetch
  useEffect(() => {
    if (userInfo?.user_id) {
      setIsDataReady(false);
      fetchDiaryData(userInfo.user_id).then(() => {
        setIsDataReady(true);
      });
    }
  }, [yearMonth]);

  useEffect(() => {
    const dateToCheck = isSelectedDate || today;
    const dateStr = converDate({ date: dateToCheck });
    const todayStr = converDate({ date: today });

    setIsDisable(
      dateStr !== todayStr ||
        (dateStr === todayStr && writtenDays.includes(todayStr)),
    );
  }, [isSelectedDate, writtenDays, today]);

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

  const recordWrittenDay = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;
    try {
      const data = await fetch(`/api/diary`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userInfo?.user_id,
          date: today,
        }),
      });

      if (data.ok) {
        await fetchDiaryData(userInfo!.user_id);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex-1 pb-[44px] mobleHeight:pb-[25px] bg-white px-6 flex flex-col justify-between">
      <div>
        <div className="mt-[28px] mobleHeight:mt-[14px]">
          <h1 className="text-gray-primary text-[32px] mobleHeight:text-[26px] font-bold break-words">
            수면 일기
          </h1>
          <p className="text-gray-tertiary text-[16px] font-[500] mt-3">
            {userInfo
              ? `사용 기간: ${userInfo.access_start.split(" ")[0]} ~ ${
                  userInfo.access_end.split(" ")[0]
                }`
              : "데이터를 불러오고 있습니다."}
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
        </div>
        {isDataReady && userInfo ? (
          <CalendarBox
            dateArr={splitArr}
            userInfo={userInfo}
            isSelectedDate={isSelectedDate}
            writtenDays={writtenDays}
            currentDate={currentDate}
            handleDayBoxCLick={handleDayBoxCLick}
            isAnyDateClicked={isAnyDateClicked}
          />
        ) : (
          <LoadingBox />
        )}
      </div>
      <div>
        {isSelectedDate &&
          isSelectedDate.getTime() !== startOfToday.getTime() && (
            <Tooltip
              statusCode={returnTooltipCondition({
                selectedDate: isSelectedDate,
                today,
              })}
            />
          )}
        <Button
          disabled={isDisable}
          onClick={() => {
            recordWrittenDay();
            redirectGoogleForm(userInfo?.name || null);
          }}
        >
          {userInfo ? (
            isSelectedDate ? (
              isSelectedDate.getTime() !== startOfToday.getTime() ? (
                "수면일기 작성불가"
              ) : writtenDays.includes(converDate({ date: today })) ? (
                "수면일기 작성완료"
              ) : (
                "수면일기 작성하기"
              )
            ) : writtenDays.includes(converDate({ date: today })) ? (
              "수면일기 작성완료"
            ) : (
              "수면일기 작성하기"
            )
          ) : (
            <div className={"animate-spin"}>
              <Image
                src={LoadingIcon}
                alt={"로딩아이콘"}
                width={40}
                height={40}
              />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
