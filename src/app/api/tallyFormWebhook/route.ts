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
      value: string | number | boolean | Array<any>;
    }>;
  };
};

export const POST = async (req: NextRequest) => {
  // 초기 요청 로깅
  console.log("🚨 Vercel Webhook Received");
  console.log(
    "🔍 Full Headers:",
    JSON.stringify(Object.fromEntries(req.headers), null, 2),
  );

  try {
    // 페이로드 로깅
    const webhookPayload: TallyWebhookPayload = await req.json();
    console.log("📦 Full Payload:", JSON.stringify(webhookPayload, null, 2));

    // 시그니처 관련 로깅
    const tallyFormSignatureKey = req.headers.get("tally-signature");
    console.log("🔑 Tally-Signature:", tallyFormSignatureKey);

    // 환경 변수 로깅
    const mySigningSecretKey = process.env.NEXT_PUBLIC_TALLY_SIGNING_SECRET;
    console.log("🔐 Signing Secret Exists:", !!mySigningSecretKey);
    console.log("🔐 Signing Secret Value Length:", mySigningSecretKey?.length);

    const prisma = new PrismaClient();
    if (!mySigningSecretKey) {
      console.error("❌ No Signing Secret Found");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // 시그니처 생성 로깅
    const checkSignature = createHmac("sha256", mySigningSecretKey)
      .update(JSON.stringify(webhookPayload))
      .digest("base64");

    console.log("🔢 Generated Signature:", checkSignature);
    console.log("🔢 Received Signature:", tallyFormSignatureKey);
    console.log(
      "🟢 Signature Match:",
      tallyFormSignatureKey === checkSignature,
    );

    if (tallyFormSignatureKey === checkSignature) {
      if (webhookPayload.eventType === "FORM_RESPONSE") {
        // 날짜 관련 로깅
        const date = new Date(webhookPayload.createdAt);
        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const day = String(date.getDate());

        // 사용자 ID 로깅
        const userId = webhookPayload.data.fields.find(
          (field) => field.label === "userId",
        )?.value;

        console.log("👤 Extracted User ID:", userId);
        console.log("📅 Year-Month:", yearMonth);
        console.log("📆 Day:", day);

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

            console.log(
              "📚 Existing Data:",
              JSON.stringify(existingData, null, 2),
            );

            if (existingData) {
              const currentDates = Array.isArray(existingData.dates)
                ? existingData.dates
                : [];

              const updatedDates = currentDates.includes(day)
                ? currentDates
                : [...currentDates, day];

              console.log("📝 Current Dates:", currentDates);
              console.log("📝 Updated Dates:", updatedDates);

              // 업데이트 로깅
              const updateResult = await prisma.userDiary.update({
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

              console.log(
                "✅ Update Result:",
                JSON.stringify(updateResult, null, 2),
              );
            } else {
              // 생성 로깅
              console.log("🆕 Creating New Entry");
              const createResult = await prisma.userDiary.create({
                data: {
                  userId,
                  yearMonth,
                  dates: [day],
                },
              });

              console.log(
                "✅ Create Result:",
                JSON.stringify(createResult, null, 2),
              );
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
