"use client";

import { useState } from "react";

import Image from "next/image";
import UserIcon from "@/assets/svg/userIcon.svg";
import LockIcon from "@/assets/svg/lockIcon.svg";
import OpenEyeIcon from "@/assets/svg/openEyeIcon.svg";
import CloseEyeIcon from "@/assets/svg/closeEyeIcon.svg";

type LoginInputProps = {
  inputType: "id" | "password";
};

export const LoginInput = ({ inputType }: LoginInputProps) => {
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
  const inputTypeCondition = inputType === "id";
  return (
    <div
      className={
        "w-[100%] px-[20px] py-[10px] bg-gray-loginInput rounded-[10px]  border border-gray-loginInputBorder flex items-center"
      }
    >
      <div className={"w-6 h-6 relative"}>
        <Image
          src={inputTypeCondition ? UserIcon : LockIcon}
          alt={"inputIcon"}
          fill
        />
      </div>
      <input
        type={
          inputTypeCondition ? "text" : visiblePassword ? "text" : "password"
        }
        className={
          "w-[100%] ml-[16px] bg-gray-loginInput outline-none text-gray-inputTextColor"
        }
        placeholder={
          inputTypeCondition ? "아이디 / 이름 / 전화번호" : "비밀번호"
        }
      />
      {!inputTypeCondition && (
        <div
          className={"w-[24px] h-[24px] relative"}
          onClick={() => setVisiblePassword(!visiblePassword)}
        >
          <Image
            src={visiblePassword ? OpenEyeIcon : CloseEyeIcon}
            alt={"eyeIcon"}
            fill
          />
        </div>
      )}
    </div>
  );
};
