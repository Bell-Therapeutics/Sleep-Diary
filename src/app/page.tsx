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
import { redirectTallyForm } from "@/hook/redirectTallyForm";
import LoadingBox from "@/components/LoadingBox/LoadingBox";
import { UserInfoType } from "@/types/UserInfo";
import CalendarBox from "@/components/CalendarBox/CalendarBox";
import LoadingIcon from "@/assets/svg/loadingIconGray.svg";
import { getDiaryButtonStatus } from "@/hook/getDiaryButtonStatus";

const Home = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSelectedDate, setIsSelectedDate] = useState<Date | null>(null);
  const [isAnyDateClicked, setIsAnyDateClicked] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfoType>();
  const [writtenDays, setWrittenDays] = useState<string[]>([]);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const [isSubmittedPolling, setIsSubmittedPolling] = useState(false);
  const [buttonStatus, setButtonStatus] = useState("");

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
    today.getDate()
  );
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const handleDayBoxCLick = (date: Date | null) => {
    if (!date) return;

    // 클릭한 날짜가 오늘이면 isAnyDateClicked를 false로
    if (date.getTime() === startOfToday.getTime()) {
      setIsAnyDateClicked(false);
    } else {
      setIsAnyDateClicked(true);
    }

    setIsSelectedDate(date);
  };
  const fetchDiaryData = async (userId: string) => {
    try {
      const diaryResponse = await fetch(
        `/api/diary?userId=${userId}&yearMonth=${yearMonth}`
      );
      const diaryData = await diaryResponse.json();

      if (diaryResponse.ok) {
        setWrittenDays(
          createWrittenArr({
            writtenDays: diaryData.data.dates || [],
            yearMonth,
          })
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
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("submitted") === "true") {
      setIsSubmittedPolling(true);
      router.replace("/");
    }
  }, []);

  useEffect(() => {
    let pollingCount = 0;
    const maxPollingCount = 5;
    const interval = 750;
    let isMounted = true; // 컴포넌트 마운트 상태 추적

    const pollingData = async () => {
      try {
        while (pollingCount < maxPollingCount && isMounted) {
          await fetchingInitialData();
          pollingCount++;

          if (pollingCount < maxPollingCount && isMounted) {
            await new Promise((resolve) => setTimeout(resolve, interval));
          }
        }

        if (isMounted) {
          setIsSubmittedPolling(false);
        }
      } catch (error) {
        console.error("폴링 중 오류 발생:", error);
        if (isMounted) {
          setIsSubmittedPolling(false);
        }
      }
    };

    // 폴링 시작
    pollingData();

    // visibilitychange 이벤트 핸들러 추가
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isMounted) {
        fetchingInitialData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 클린업 함수
    return () => {
      isMounted = false; // 컴포넌트가 언마운트되면 플래그 설정
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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

    if (userInfo) {
      const accessEndDate = new Date(userInfo.access_end);
      if (dateToCheck > accessEndDate) {
        setIsDisable(true);
        return;
      }
    }

    setIsDisable(dateStr !== todayStr && !writtenDays.includes(dateStr));

    setButtonStatus(
      getDiaryButtonStatus({
        writtenDays,
        isSelectedDate,
        startOfToday,
        today,
      })
    );
  }, [isSelectedDate, writtenDays, today, userInfo, isSubmittedPolling]);

  useEffect(() => {}, [isSelectedDate]);

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
            <div className="w-[20px] h-[12px] " onClick={handlePrevMonth}>
              <Image src={PreviousIcon} alt="왼쪽화살표" />
            </div>
            <p className="text-gray-primary text-[20px] mobleHeight:text-[14px] font-[600]">
              {`${currentYear}년 ${currentMonth}월`}
            </p>
            <div
              className="w-[20px] h-[12px] rotate-180 "
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
          <LoadingBox isSpinAnimation={true} />
        )}
      </div>
      <div>
        <Tooltip
          statusCode={returnTooltipCondition({
            selectedDate: isSelectedDate,
            today,
            writtenDays,
          })}
        />
        <Button
          disabled={
            (isDataReady && userInfo ? isDisable : true) || isSubmittedPolling
          }
          onClick={() => {
            if (buttonStatus === "수면 일기 보기") {
              router.push(
                `/sleepDiaryHistory/${converDate({
                  date: isSelectedDate ? isSelectedDate : today,
                })}`
              );
            } else {
              redirectTallyForm({
                userId: userInfo?.user_id || null,
                userName: userInfo?.name || null,
              });
            }
          }}
        >
          {isDataReady && userInfo ? (
            getDiaryButtonStatus({
              writtenDays,
              isSelectedDate,
              startOfToday,
              today,
            })
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
};

export default Home;
