type RedirectTallyFormFormProps = {
  userId: string | null;
  userName: string | null;
};

export const redirectTallyForm = ({
  userId,
  userName,
}: RedirectTallyFormFormProps) => {
  const TALLY_FORM_URL = process.env.NEXT_PUBLIC_TALLY_FORM_URL;

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

    const link = document.createElement("a");
    link.href = formURL.toString();
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("폼 리다이렉트 중 오류 발생:", error);
    alert("탤리 폼으로 이동하는 중 오류가 발생했습니다.");
  }
};
