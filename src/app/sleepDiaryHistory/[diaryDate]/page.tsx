"use client";

import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import CloseSvg from "@/assets/svg/close.svg";
import PreviousIcon from "@/assets/svg/previousIcon.svg";
import { SurveyResponseBox } from "@/components/SurveyResponseBox/SurveyResponesBox";
import { useEffect, useState } from "react";
import { SelectedTextType } from "@/components/SurveyResponseBox/SurveyResponesBox";

type DiaryHistoryArrType = {
  key: string;
  label: string;
  type: string;
  value?: string;
  selectedText?: SelectedTextType;
};

type DiaryHistoryDataType = {
  createdAt: string;
  diaryDate: string;
  id: string;
  surveyResponses: DiaryHistoryArrType[];
  userId: string;
  userName: string;
};

const DiaryHistory = () => {
  const param = useParams();
  const surveyDay = param.diaryDate;
  const userId = localStorage.getItem("userId");

  const questionLabel = [
    `잠들기 전 최종적으로\n침대에 들어간 시간은 몇 시였나요?`,
    `잠들기를 시도한 시간을 몇 시였나요?`,
    `잠드는 데까지 몇 시간 몇 분이 걸렸나요?`,
    `잠든 순간 부터 마지막으로 깨어난 순간 사이,\n몇 번 잠에서 깼나요?`,
    `수면 도중 깨어있던 시간의 총합은\n몇 시간 몇 분 인가요?`,
    `최종적으로 잠에서 깬 시간은 몇 시 였나요?`,
    `아침에 침대에서 나온 시간은 몇 시였나요?`,
    `오늘의 수면의 질은 어떻게 평가하시겠습니까?`,
    `오늘 아침 깨어났을 때\n얼마나 상쾌하고 충분히 휴식을 취했다고 느꼈나요?`,
    `기타 의견`,
  ];
  const [data, setData] = useState<DiaryHistoryDataType | null>(null);

  useEffect(() => {
    const getDiaryHistory = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/diaryHistory?userId=${userId}&yearMonthDay=${param.diaryDate}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (data) {
          setData(data.data);
        }
      } catch (error) {
        console.error("Error fetching diary history:", error);
      }
    };

    getDiaryHistory();
  }, []);

  if (!data) {
    return <div>loading...</div>;
  }

  return (
    <div className="flex-1 pb-[44px] mobleHeight:pb-[25px] bg-white px-6 flex flex-col">
      <div className="w-[100%] h-[44px] flex justify-center items-center relative mt-[20px]">
        <h1 className="text-[22px] text-gray-primary font-bold">수면 일기</h1>
        <div className="absolute right-0">
          <Image src={CloseSvg} alt={"닫기 버튼"} />
        </div>
      </div>
      <div className="w-full flex flex-col mt-[24px]">
        <div className="w-[100%] flex items-center justify-between">
          <div className="w-[20px] h-[12px]">
            <Image src={PreviousIcon} alt="왼쪽화살표" />
          </div>
          <p className="text-gray-primary text-[16px] mobleHeight:text-[14px] font-[500]">
            {`2024년 5월`}
          </p>
          <div className="w-[20px] h-[12px] rotate-180">
            <Image src={PreviousIcon} alt="오른쪽화살표" />
          </div>
        </div>
      </div>
      <div
        className="mt-[20px] flex flex-col gap-[14px] overflow-scroll"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {questionLabel.map((question, index) => {
          // Make sure we don't go beyond the array bounds
          if (index + 2 >= data.surveyResponses.length) {
            return null;
          }

          const response = data.surveyResponses[index + 2];
          const displayValue = response.value || response.selectedText || "";

          return (
            <SurveyResponseBox
              key={index}
              questionLabel={question}
              type={response.type}
              selectedText={response.selectedText}
              value={displayValue}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DiaryHistory;
