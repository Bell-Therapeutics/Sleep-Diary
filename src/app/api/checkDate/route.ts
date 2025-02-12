import { NextResponse, NextRequest } from "next/server";

export function GET(req: NextRequest) {
  // 명시적으로 한국 시간대 Date 객체 생성
  const localDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }),
  );

  const yearMonth = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, "0")}`;
  const day = String(localDate.getDate());

  console.log("📅 Local Date:", localDate);
  console.log("📅 Local Year-Month:", yearMonth);
  console.log("📆 Local Day:", day);

  return NextResponse.json(
    { yearMonth, day, dlwjddn: "이장으" },
    { status: 200 },
  );
}
