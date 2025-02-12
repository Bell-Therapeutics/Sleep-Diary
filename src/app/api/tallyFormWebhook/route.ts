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
    const mySigningSecretKey = process.env.TALLY_SIGNING_SECRET;
    const prisma = new PrismaClient();
    if (!mySigningSecretKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const checkSignature = createHmac("sha256", mySigningSecretKey)
      .update(JSON.stringify(webhookPayload))
      .digest("base64");

    if (tallyFormSignatureKey === checkSignature) {
      if (webhookPayload.eventType === "FORM_RESPONSE") {
        const date = new Date(webhookPayload.createdAt);
        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const day = String(date.getDate());
        const userId = webhookPayload.data.fields.find(
          (field) => field.label === "userId",
        )?.value;

        if (userId && typeof userId === "string") {
          // 여기서 직접 Prisma로 DB 처리
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
            { status: 200 },
          );
        }
      }

      return NextResponse.json(
        { message: "Webhook이 성공적으로 연동되었습니다." },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { message: "Webhook key가 유효하지 않습니다." },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Webhook error" }, { status: 500 });
  }
};
