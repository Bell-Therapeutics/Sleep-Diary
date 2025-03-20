import Image from "next/image";
import LoadingIcon from "@/assets/svg/loadingIcon.svg";
type LoadingBoxProps = {
  isSpinAnimation?: boolean;
};

const LoadingBox = ({ isSpinAnimation }: LoadingBoxProps) => {
  return (
    <div
      className={
        "w-full h-full flex justify-center items-center bg-day-primary mt-[14px] border border-day-border border-opacity-[30%] rounded-[4px]"
      }
    >
      {isSpinAnimation ? (
        <div className={"animate-spin"}>
          <Image src={LoadingIcon} width={55} height={55} alt={"로딩아이콘"} />
        </div>
      ) : (
        <p className="text-4">수면 일기를 작성 하지 않았어요 😭</p>
      )}
    </div>
  );
};

export default LoadingBox;
