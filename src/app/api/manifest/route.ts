import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const manifest = {
    name: "Sleep Diary",
    short_name: "Sleep Diary",
    description: "Sleep Diary",
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

  const response = NextResponse.json(manifest);

  // Vercel CDN 캐싱 우회를 위한 헤더 추가
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("Surrogate-Control", "no-store");
  response.headers.set("Vercel-CDN-Cache-Control", "no-cache");
  response.headers.set("CDN-Cache-Control", "no-cache");
  response.headers.set("Cloudflare-CDN-Cache-Control", "no-cache");

  return response;
}
