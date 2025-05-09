"use client";

import { useEffect, useState } from "react";
import { Login } from "@/hook/Login";
import { useRouter } from "next/navigation";

import { LoginInput } from "@/components/LoginInput/LoginInput";
import { Button } from "@/components/Button/Button";

const LoginPage = () => {
  const router = useRouter();
  const [loginForm, setLoginForm] = useState({
    id: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/");
    }
  }, []);

  const handleInputChange = (type: "id" | "password", value: string) => {
    setLoginForm((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

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
            {"Sleep Diary"}
          </h1>
          <p
            className={
              "text-gray-secondary text-[15px] font-[400] leading-[22.5px] break-word mt-2"
            }
          >
            부여받은 아이디로 로그인이 가능합니다.
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
          Login({ loginForm, onLoginSuccess: () => router.push("/") })
        }
      >
        로그인
      </Button>
    </div>
  );
};

export default LoginPage;
