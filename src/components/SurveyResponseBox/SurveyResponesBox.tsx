"use client";

import localFont from "next/font/local";
export type SelectedTextType = keyof typeof matchingUserSelect;

type SurveyResponseBoxProps = {
  isRemark?: boolean;
  questionLabel: string;
  type?: string;
  value?: string;
  selectedText?: SelectedTextType;
  surveyAvg?: string | number | undefined;
  isFirstSuyvey: boolean;
};

const matchingUserSelect = {
  "매우 나쁨": 1,
  나쁨: 2,
  보통: 3,
  좋음: 4,
  "매우 좋음": 5,
  "전혀 휴식을 취하지 못했다": 1,
  "약간 휴식을 취했다": 2,
  "어느정도 휴식을 취했다": 3,
  "충분히 휴식을 취했다": 4,
  "매우 충분히 휴식을 취했다": 5,
} as const;

const digitalFont = localFont({
  src: "../../assets/fonts/LABDigital.ttf",
});

export const SurveyResponseBox = ({
  questionLabel,
  type,
  selectedText,
  value,
  surveyAvg,
  isFirstSuyvey,
}: SurveyResponseBoxProps) => {
  const filterSurveyType = () => {
    switch (type) {
      case "INPUT_TIME":
        return (
          <p className="text-[15px] text-day-border font-bold">
            {value?.replace(":", " : ")}
          </p>
        );
      case "INPUT_NUMBER":
        return (
          <p className="text-[15px] text-day-border font-bold">{`${
            !value ? 0 : value
          }번`}</p>
        );
      case "MULTIPLE_CHOICE":
        return (
          <div className="w-5 h-5 border-solid rounded-[4px] bg-blue-primary flex justify-center items-center">
            <p className="text-white font-bold text-[14px]">
              {selectedText ? matchingUserSelect[selectedText] : ""}
            </p>{" "}
          </div>
        );
      case "TEXTAREA":
        return (
          <p className="text-[15px] text-gray-555">
            {value && value.length > 0 ? value : "없음"}
          </p>
        );
    }
  };

  return (
    <div className="w-[100%] py-[14px] px-4 border border-solid border-gray-DDD rounded-[10px]">
      <p className="whitespace-pre-wrap font-[--font-lab-digital]">
        {questionLabel}
      </p>
      <div className="flex gap-[10px] mt-[10px]">
        {filterSurveyType()}
        {(isFirstSuyvey && type === "INPUT_TIME") ||
        (isFirstSuyvey && type === "INPUT_NUMBER") ? (
          <>
            <p className="text-gray-DDD">|</p>
            <div className="bg-gray-ECECEC border-solid border-gray-DDD rounded-[4px] flex items-center justify-center px-[6px]">
              <p className={`text-[13px] ${digitalFont.className}`}>
                {"평균 : "}
                {typeof surveyAvg === "number"
                  ? Math.round(surveyAvg)
                  : surveyAvg}
                {typeof surveyAvg === "number" && "번"}
              </p>
            </div>
          </>
        ) : (
          <p className="text-[14px] font-500 text-gray-555">{selectedText}</p>
        )}
      </div>
    </div>
  );
};
