import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient(); // 오타 수정: prisam -> prisma

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const yearMonthDay = searchParams.get("yearMonthDay");

    if (!userId || !yearMonthDay) {
      return NextResponse.json(
        { error: "userId와 yearMonthDay 쿼리 매개변수가 필요합니다." },
        { status: 400 },
      );
    }

    // yearMonthDay가 YYYY-MM-DD 형식인지 확인하고, 완전한 ISO 문자열로 변환
    // 예: "2025-03-18" -> "2025-03-18T00:00:00.000Z"
    const isoDateString = new Date(
      `${yearMonthDay}T00:00:00.000Z`,
    ).toISOString();

    const data = await prisma.sleepDiary.findUnique({
      where: {
        userId_diaryDate: {
          userId,
          diaryDate: new Date(isoDateString),
        },
      },
    });

    if (!data) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching sleep diary:", error);
    return NextResponse.json(
      { error: "오류가 발생했습니다.", details: String(error) },
      { status: 500 },
    );
  }
};
