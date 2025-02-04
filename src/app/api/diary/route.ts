import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export const POST = async (req: Request) => {
  try {
    const { userId, date } = await req.json();

    const targetDate = new Date(date);

    const yearMonth = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, "0")}`;

    const day = String(targetDate.getDate());

    const existingData = await prisma.userDiary.findUnique({
      where: {
        userId_yearMonth: {
          userId,
          yearMonth,
        },
      },
    });

    if (existingData) {
      const currentDates = Array.isArray(existingData.dates)
        ? existingData.dates
        : [];

      // 중복 확인 및 새 날짜 추가
      const updatedDates = currentDates.includes(day)
        ? currentDates
        : [...currentDates, day];

      await prisma.userDiary.update({
        where: {
          userId_yearMonth: {
            userId,
            yearMonth,
          },
        },
        data: {
          dates: updatedDates,
        },
      });
    } else {
      await prisma.userDiary.create({
        data: {
          userId, // 사용자 ID
          yearMonth, // 연월
          dates: [day], // 첫 번째 날짜를 배열로 생성
        },
      });
    }

    // 성공 응답 반환
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // 오류 발생 시 콘솔에 로깅
    console.error(error);

    // 500 상태 코드와 함께 오류 응답 반환
    return NextResponse.json({ error: "오류가 발생했습니다" }, { status: 500 });
  }
};

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const yearMonth = searchParams.get("yearMonth");

    if (!userId || !yearMonth) {
      return NextResponse.json(
        { error: "userId와 yearMonth 쿼리 매개변수가 필요합니다." },
        { status: 400 },
      );
    }

    const data = await prisma.userDiary.findUnique({
      where: {
        userId_yearMonth: {
          userId,
          yearMonth,
        },
      },
    });

    if (!data) {
      return NextResponse.json(
        { error: "해당 userId와 yearMonth에 대한 데이터가 없습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "오류가 발생했습니다." },
      { status: 500 },
    );
  }
};
