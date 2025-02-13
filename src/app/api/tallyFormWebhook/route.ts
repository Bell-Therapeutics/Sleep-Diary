import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

type TallyWebhookPayload = {
  eventId: string;
  eventType: "FORM_RESPONSE";
  createdAt: string;
  data: {
    responseId: string;
    submissionId: string;
    respondentId: string;
    formId: string;
    formName: string;
    createdAt: string;
    fields: Array<{
      key: string;
      label: string;
      type: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: string | number | boolean | Array<any>;
    }>;
  };
};

export const POST = async (req: NextRequest) => {
  try {
    const webhookPayload: TallyWebhookPayload = await req.json();
    const tallyFormSignatureKey = req.headers.get("tally-signature");
    const mySigningSecretKey = process.env.NEXT_PUBLIC_TALLY_SIGNING_SECRET;

    const prisma = new PrismaClient();
    if (!mySigningSecretKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // 시그니처 생성 로깅
    const checkSignature = createHmac("sha256", mySigningSecretKey)
      .update(JSON.stringify(webhookPayload))
      .digest("base64");

    if (tallyFormSignatureKey === checkSignature) {
      if (webhookPayload.eventType === "FORM_RESPONSE") {
        // 날짜 관련 로깅
        const localDate = new Date(
          new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }),
        );
        const yearMonth = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, "0")}`;
        const day = String(localDate.getDate());

        // 사용자 ID 로깅
        const userId = webhookPayload.data.fields.find(
          (field) => field.label === "userId",
        )?.value;

        if (userId && typeof userId === "string") {
          try {
            // 기존 데이터 조회 로깅
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
              // 생성 로깅
              await prisma.userDiary.create({
                data: {
                  userId,
                  yearMonth,
                  dates: [day],
                },
              });
            }
          } catch (dbError) {
            console.error("❌ Database Error:", dbError);
            throw dbError;
          } finally {
            await prisma.$disconnect();
          }

          return NextResponse.json(
            { message: "수면일기 작성이 완료되었습니다." },
            { status: 200 },
          );
        } else {
          console.warn("⚠️ Invalid User ID");
        }
      }

      return NextResponse.json(
        { message: "Webhook이 성공적으로 연동되었습니다." },
        { status: 200 },
      );
    } else {
      console.error("❌ Signature Verification Failed");
      return NextResponse.json(
        { message: "Webhook key가 유효하지 않습니다." },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("❌ Critical Webhook Error:", error);
    return NextResponse.json({ message: "Webhook error" }, { status: 500 });
  }
};
