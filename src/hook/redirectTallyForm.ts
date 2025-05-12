import { getClientFlagValue } from "@/lib/clientLaunchDarkly";

type RedirectTallyFormFormProps = {
  userId: string | null;
  userName: string | null;
};

export const redirectTallyForm = async ({
  userId,
  userName,
}: RedirectTallyFormFormProps) => {
  const flagValue = await getClientFlagValue("tally-form-flag");
  console.log("flagValue", flagValue);
  const TALLY_FORM_URL =
    flagValue === "UT"
      ? process.env.NEXT_PUBLIC_TALLY_FORM_URL
      : process.env.NEXT_PUBLIC_SNUH_TALLY_FORM_URL;

  if (!TALLY_FORM_URL) {
    console.error("환경 변수가 설정되지 않았습니다.");
    alert("환경 변수가 누락되었습니다.");
    return;
  }

  if (!userId || !userName) {
    alert("사용자 이름을 찾을 수 없습니다.");
    return;
  }

  try {
    const formURL = new URL(TALLY_FORM_URL);
    formURL.searchParams.append("userName", userName);
    formURL.searchParams.append("userId", userId);

    // PWA 환경을 고려하여 window.location.href 사용
    // 모바일 PWA 환경에서는 새 창 열기가 제한될 수 있으므로
    // 현재 창에서 이동하도록 수정
    window.location.href = formURL.toString();
  } catch (error) {
    console.error("폼 리다이렉트 중 오류 발생:", error);
    alert("탤리 폼으로 이동하는 중 오류가 발생했습니다.");
  }
};
