import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerFlagValue } from "@/lib/serverLaunchDarkly";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

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
      options?: Array<{
        id: string;
        text: string;
      }>;
    }>;
  };
};

export const POST = async (req: NextRequest) => {
  try {
    const webhookPayload: TallyWebhookPayload = await req.json();
    const tallyFormSignatureKey = req.headers.get("tally-signature");
    const flagValue = await getServerFlagValue("tally-form-flag");
    const mySigningSecretKey =
      flagValue === "UT"
        ? process.env.NEXT_PUBLIC_TALLY_SIGNING_SECRET
        : process.env.NEXT_PUBLIC_SNUH_TALLY_SIGNING_SECRET;

    if (!mySigningSecretKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // 시그니처 검증
    const checkSignature = createHmac("sha256", mySigningSecretKey)
      .update(JSON.stringify(webhookPayload))
      .digest("base64");

    if (tallyFormSignatureKey !== checkSignature) {
      console.error("❌ Signature Verification Failed");
      return NextResponse.json(
        { message: "Webhook key가 유효하지 않습니다." },
        { status: 401 }
      );
    }

    if (webhookPayload.eventType === "FORM_RESPONSE") {
      // Convert the timestamp to Korea timezone
      const koreaTime = new Date(webhookPayload.data.createdAt);
      koreaTime.setHours(koreaTime.getHours() + 9); // Add 9 hours for KST

      const diaryDate = koreaTime.toISOString().split("T")[0];

      const year = koreaTime.getFullYear();
      const month = String(koreaTime.getMonth() + 1).padStart(2, "0");
      const day = String(koreaTime.getDate()).padStart(2, "0");
      const yearMonth = `${year}-${month}`;

      const userId = webhookPayload.data.fields.find(
        (field) => field.label === "userId"
      )?.value;

      const userName = webhookPayload.data.fields.find(
        (field) => field.label === "userName"
      )?.value;

      if (userId && typeof userId === "string") {
        try {
          // MULTIPLE_CHOICE 타입에 selectedText 필드 추가
          const processedResponses = webhookPayload.data.fields.map((field) => {
            // 기본 응답 객체
            const response = {
              key: field.key,
              label: field.label,
              type: field.type,
              value: field.value,
            };

            if (
              field.type === "MULTIPLE_CHOICE" &&
              Array.isArray(field.value) &&
              field.value.length > 0 &&
              field.options
            ) {
              const selectedId = field.value[0];
              const selectedOption = field.options.find(
                (opt) => opt.id === selectedId
              );

              return {
                ...response,
                selectedText: selectedOption?.text || null,
              };
            }

            return response;
          });

          const existingSleepDiary = await prisma.sleepDiary.findUnique({
            where: {
              userId_diaryDate: {
                userId,
                diaryDate: new Date(diaryDate),
              },
            },
          });

          if (existingSleepDiary) {
            await prisma.sleepDiary.update({
              where: {
                userId_diaryDate: {
                  userId,
                  diaryDate: new Date(diaryDate),
                },
              },
              data: {
                surveyResponses: processedResponses,
              },
            });
          } else {
            await prisma.sleepDiary.create({
              data: {
                userId,
                userName: userName as string,
                diaryDate: new Date(diaryDate),
                surveyResponses: processedResponses,
              },
            });
          }

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
            await prisma.userDiary.create({
              data: {
                userId,
                yearMonth,
                dates: [day],
              },
            });
          }

          return NextResponse.json(
            { message: "수면일기 작성이 완료되었습니다." },
            { status: 200 }
          );
        } catch (dbError) {
          console.error("❌ Database Error:", dbError);
          return NextResponse.json(
            { error: "Database error", details: dbError },
            { status: 500 }
          );
        }
      } else {
        console.warn("⚠️ Invalid User ID");
        return NextResponse.json(
          { message: "유효하지 않은 사용자 ID입니다." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { message: "Webhook이 성공적으로 연동되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Critical Webhook Error:", error);
    return NextResponse.json(
      { message: "Webhook error", details: error },
      { status: 500 }
    );
  }
};
