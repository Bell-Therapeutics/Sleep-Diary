"use client";

import { useState } from "react";
import { useLogin } from "@/hook/useLogin";
import { useRouter } from "next/navigation";

import { LoginInput } from "@/components/LoginInput/LoginInput";
import { Button } from "@/components/Button/Button";

const LoginPage = () => {
  const [loginForm, setLoginForm] = useState({
    id: "",
    password: "",
  });
  console.log();

  const handleInputChange = (type: "id" | "password", value: string) => {
    setLoginForm((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const router = useRouter();

  return (
    <div
      className={
        "w-[480px] h-[100%] pt-[7.9%] pb-[44px] bg-white px-6 flex flex-col justify-between"
      }
    >
      <div className={"flex flex-col gap-[34px]"}>
        <div>
          <h1
            className={
              "text-gray-primary text-2xl font-bold leading-9 break-word whitespace-pre-line"
            }
          >
            {"안녕하세요\n 뮤지토닌 수면일기입니다."}
          </h1>
          <p
            className={
              "text-gray-secondary text-[15px] font-[400] leading-[22.5px] break-word mt-2"
            }
          >
            부여받은 아이디, 이름, 전화번호로 로그인 가능합니다.
          </p>
        </div>
        <div className={"flex gap-[20px] flex-col"}>
          <LoginInput
            inputType={"id"}
            onChange={(value) => handleInputChange("id", value)}
          />
          <LoginInput
            inputType={"password"}
            onChange={(value) => handleInputChange("password", value)}
          />
        </div>
      </div>

      <Button
        onClick={() =>
          useLogin({ loginForm, onLoginSuccess: () => router.push("/") })
        }
      >
        로그인
      </Button>
    </div>
  );
};

export default LoginPage;
