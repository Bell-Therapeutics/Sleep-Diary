export const redirectGoogleForm = (userId: string | null) => {
  const GOOGLE_FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSfINyucYt81Edo0zLJt54jWzKIIDA4N3HydtGwMhzVKEHopnQ/viewform?usp=dialog";
  const NAME_FIELD_ID = "entry.164312056";

  if (!userId) {
    alert("사용자 이름을 찾을 수 없습니다.");
    return;
  }

  try {
    const formURL = new URL(GOOGLE_FORM_URL);
    formURL.searchParams.append(NAME_FIELD_ID, userId);
    formURL.searchParams.append("usp", "pp_url");
    formURL.searchParams.append("reset", "true");

    const link = document.createElement("a");
    link.href = formURL.toString();
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.display = "none"; // 보이지 않게 처리

    // body 대신 현재 스크립트를 실행하는 엘리먼트 바로 다음에 추가
    document.currentScript?.parentNode?.insertBefore(
      link,
      document.currentScript.nextSibling,
    );
    link.click();
    link.remove(); // 더 현대적인 방식으로 요소 제거
  } catch (error) {
    console.error("폼 리다이렉트 중 오류 발생:", error);
    alert("구글 폼으로 이동하는 중 오류가 발생했습니다.");
  }
};
