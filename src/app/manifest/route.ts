// app/manifest/route.ts
import { NextResponse } from "next/server";
import { getFlagValue } from "@/lib/launchdarkly"; // 런치다클리에서 플래그 가져오는 함수

export async function GET() {
  let isNewAppName = false;
  try {
    isNewAppName = await getFlagValue("permitted-flag");
  } catch (error) {
    console.error("Failed to get LaunchDarkly flag:", error);
    // Default to false if flag check fails
  }

  const manifest = {
    name: isNewAppName ? "Belltx 수면일기" : "뮤지토닌 수면일기",
    short_name: isNewAppName ? "Belltx 수면일기" : "뮤지토닌 수면일기",
    description: isNewAppName ? "Belltx 수면일기" : "뮤지토닌 수면일기",
    icons: [
      {
        src: "/icons/sleepDiaryLogo-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/sleepDiaryLogo-256.png",
        sizes: "256x256",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/sleepDiaryLogo-384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/sleepDiaryLogo-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
    orientation: "portrait",
    scope: "/",
    start_url: "/",
  };

  return NextResponse.json(manifest);
}
