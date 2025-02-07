type RedirectGoogleForm = {
  userId: string | null;
  userName: string | null;
};

export const redirectGoogleForm = ({
  userId,
  userName,
}: RedirectGoogleForm) => {
  const GOOGLE_FORM_URL = process.env.NEXT_PUBLIC_GOOGLE_FORM_URL;
  const NAME_FIELD_ID = process.env.NEXT_PUBLIC_NAME_FIELD_ID;
  const USER_ID_FIELD_ID = process.env.NEXT_PUBLIC_USER_ID_FIELD_ID;

  if (!GOOGLE_FORM_URL || !NAME_FIELD_ID || !USER_ID_FIELD_ID) {
    console.error("환경 변수가 설정되지 않았습니다.");
    alert("환경 변수가 누락되었습니다.");
    return;
  }

  if (!userId || !userName) {
    alert("사용자 이름을 찾을 수 없습니다.");
    return;
  }

  try {
    const formURL = new URL(GOOGLE_FORM_URL);
    formURL.searchParams.append(NAME_FIELD_ID, userName);
    formURL.searchParams.append(USER_ID_FIELD_ID, userId);
    formURL.searchParams.append("usp", "pp_url");
    formURL.searchParams.append("reset", "true");

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
    alert("구글 폼으로 이동하는 중 오류가 발생했습니다.");
  }
};
