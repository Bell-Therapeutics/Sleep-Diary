export const redirectGoogleForm = (userId: string) => {
  // 구글 폼 URL과 필드 ID는 실제 값으로 변경해주세요
  const GOOGLE_FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSfMwlhAgp9wUkpB9O1cNAYkt4PJtfUDg3Hylq0emKSmPbaBvQ/viewform?usp=dialog";
  const NAME_FIELD_ID = "entry.783639710"; // 구글 폼의 이름 필드 ID

  // 버튼 클릭 핸들러

  // 로컬 스토리지에서 사용자 이름 가져오기

  if (!userId) {
    alert("사용자 이름을 찾을 수 없습니다.");
    return;
  }

  try {
    // 구글 폼 URL에 미리 채울 데이터와 초안 방지 파라미터 추가
    const formURL = new URL(GOOGLE_FORM_URL);
    formURL.searchParams.append(NAME_FIELD_ID, userId);
    formURL.searchParams.append("usp", "pp_url"); // 사전 입력 URL 파라미터
    formURL.searchParams.append("reset", "true"); // 초안 초기화 파라미터

    // 새 창에서 폼 열기 또는 현재 창에서 리다이렉트
    window.location.href = formURL.toString();
  } catch (error) {
    console.error("폼 리다이렉트 중 오류 발생:", error);
    alert("구글 폼으로 이동하는 중 오류가 발생했습니다.");
  }
};
