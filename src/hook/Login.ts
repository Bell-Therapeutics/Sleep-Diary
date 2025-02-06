import axios from "axios";

type UseLoginProps = {
  loginForm: {
    id: string;
    password: string;
  };
  onLoginSuccess: () => void; // 콜백 추가
};

type LoginResponse = {
  result_code: number;
  token: string;
  name: string;
  user_id: string;
  access_start: string;
  access_end: string;
  access_count: number;
  touch_mode: number;
  push_yn: "Y" | "N";
  remark?: string;
};

export const Login = async ({ loginForm, onLoginSuccess }: UseLoginProps) => {
  if (!loginForm.id || !loginForm.password) return;

  try {
    const { data } = await axios.post<LoginResponse>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
      {
        password: loginForm.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          userId: loginForm.id,
        },
      },
    );

    if (data.user_id && data.token && data.access_end && data.access_start) {
      localStorage.setItem("userId", data.user_id);
      localStorage.setItem("valid_from", data.access_start);
      localStorage.setItem("valid_to", data.access_end);
      localStorage.setItem("token", data.token);

      onLoginSuccess();
    } else {
      alert("아이디와 비번을 확인해주세요.");
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
