import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

function convertTimeToMinutes(timeStr: string): number {
  const parts = timeStr.split(":");
  if (parts.length === 2) {
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    return hours * 60 + minutes;
  }

  return parseFloat(timeStr);
}

function convertMinutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMins = mins.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMins}`;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate"); // YYYY-MM-DD 형식
    const endDate = searchParams.get("endDate"); // YYYY-MM-DD 형식

    if (!userId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "userId, startDate, endDate 모두 필요합니다." },
        { status: 400 }
      );
    }

    // 날짜 범위에 해당하는 SleepDiary 데이터 조회
    const sleepDiaries = await prisma.sleepDiary.findMany({
      where: {
        userId: userId,
        diaryDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      select: {
        diaryDate: true,
        surveyResponses: true,
      },
    });

    if (sleepDiaries.length === 0) {
      return NextResponse.json(
        { message: "해당 기간에 데이터가 없습니다." },
        { status: 404 }
      );
    }

    // 필드별 합계와 카운트를 저장할 객체
    interface FieldStats {
      sum: number;
      count: number;
      type: string;
      label: string;
    }

    const fieldStats: Record<string, FieldStats> = {};

    // 모든 diary를 순회하면서 INPUT_TIME 및 INPUT_NUMBER 필드의 값을 수집
    sleepDiaries.forEach((diary) => {
      const responses = diary.surveyResponses as Array<{
        key: string;
        label: string;
        type: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: any;
      }>;

      responses.forEach((response) => {
        if (
          (response.type === "INPUT_TIME" ||
            response.type === "INPUT_NUMBER") &&
          response.value !== null &&
          response.value !== undefined &&
          response.value !== ""
        ) {
          let numericValue: number;

          // 시간 형식인 경우 분 단위로 변환
          if (response.type === "INPUT_TIME") {
            numericValue = convertTimeToMinutes(response.value.toString());
          } else {
            // 숫자 형식인 경우 그대로 사용
            numericValue = parseFloat(response.value.toString());
          }

          // NaN 체크
          if (!isNaN(numericValue)) {
            if (!fieldStats[response.key]) {
              fieldStats[response.key] = {
                sum: 0,
                count: 0,
                type: response.type,
                label: response.label,
              };
            }

            fieldStats[response.key].sum += numericValue;
            fieldStats[response.key].count += 1;
          }
        }
      });
    });

    // 평균값 계산
    const averages = Object.entries(fieldStats).map(([key, stats]) => {
      const average = stats.count > 0 ? stats.sum / stats.count : 0;

      return {
        key,
        label: stats.label,
        type: stats.type,
        average:
          stats.type === "INPUT_TIME" ? convertMinutesToTime(average) : average,
        averageRaw: average, // 원시 평균값 (숫자)
        samplesCount: stats.count,
      };
    });

    // 응답 데이터 구성
    const responseData = {
      userId,
      period: {
        startDate,
        endDate,
      },
      totalDiaries: sleepDiaries.length,
      averages,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다.", details: error },
      { status: 500 }
    );
  }
}
