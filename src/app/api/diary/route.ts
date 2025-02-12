import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

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
      return NextResponse.json({ data: [] }, { status: 200 });
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
