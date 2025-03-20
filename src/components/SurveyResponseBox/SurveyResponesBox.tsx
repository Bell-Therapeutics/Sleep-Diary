"use client";

export type SelectedTextType = keyof typeof matchingUserSelect;

type SurveyResponseBoxProps = {
  isSelectSurvey?: boolean;
  isRemark?: boolean;
  questionLabel: string;
  type?: string;
  value?: string;
  selectedText?: SelectedTextType;
};

const matchingUserSelect = {
  "매우 나쁨": 1,
  나쁨: 2,
  보통: 3,
  좋음: 4,
  "전혀 휴식을 취하지 못했다": 1,
  "약간 휴식을 취했다": 2,
  "어느정도 휴식을 취했다": 3,
  "충분히 휴식을 취했다": 4,
  "매우 충분히 휴식을 취했다": 5,
} as const;

export const SurveyResponseBox = ({
  isSelectSurvey,
  questionLabel,
  type,
  selectedText,
  value,
}: SurveyResponseBoxProps) => {
  const filterSurveyType = () => {
    switch (type) {
      case "INPUT_TIME":
      case "INPUT_NUMBER":
        return <p className="text-[15px] text-day-border font-bold">{value}</p>;
      case "MULTIPLE_CHOICE":
        return (
          <div className="w-5 h-5 border-solid rounded-[4px] bg-blue-primary flex justify-center items-center">
            <p className="text-white font-bold text-[14px]">
              {selectedText ? matchingUserSelect[selectedText] : ""}
            </p>{" "}
          </div>
        );
      case "TEXTAREA":
        return <p className="text-[15px] text-gray-555">{value}</p>;
    }
  };

  return (
    <div className="w-[100%] py-[14px] px-4 border border-solid border-gray-DDD rounded-[10px]">
      <p className="whitespace-pre-wrap font-[--font-lab-digital]">
        {questionLabel}
      </p>
      <div className="flex gap-[10px] mt-[10px]">
        {filterSurveyType()}
        <p className="text-gray-DDD">|</p>
        <div className="bg-gray-ECECEC border-solid border-gray-DDD rounded-[4px] flex items-center justify-center px-[6px]">
          <p className="text-[13px]">{`평균 : 12:34`}</p>
        </div>
      </div>
    </div>
  );
};
