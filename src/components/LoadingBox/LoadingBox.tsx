import Image from "next/image";
import LoadingIcon from "@/assets/svg/loadingIcon.svg";

const LoadingBox = () => {
  return (
    <div
      className={
        "w-full h-[300px] flex justify-center items-center bg-day-primary mt-[14px] border border-day-border border-opacity-[30%] rounded-[4px]"
      }
    >
      <div className={"animate-spin"}>
        <Image src={LoadingIcon} width={55} height={55} alt={"로딩아이콘"} />
      </div>
    </div>
  );
};

export default LoadingBox;
