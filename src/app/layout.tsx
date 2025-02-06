import "./globals.css";
import localFont from "next/font/local";
import { Metadata } from "next";

const pretendard = localFont({
  src: "../assets/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "뮤지토닌 수면일기",
  description: "뮤지토닌 전자수면일기 앱입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} w-full h-full`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="sleepDiaryLogo"
          sizes="192x192"
          href="/icons/sleepDiaryLogo-192.png"
        />
        <link
          rel="sleepDiaryLogo"
          sizes="256x256"
          href="/icons/sleepDiaryLogo-256.png"
        />
        <link
          rel="sleepDiaryLogo"
          sizes="384x384"
          href="/icons/sleepDiaryLogo-384.png"
        />
        <link
          rel="sleepDiaryLogo"
          sizes="512x512"
          href="/icons/sleepDiaryLogo-512.png"
        />
      </head>
      <body
        className={`${pretendard.className} w-[100vw] h-[100%]  bg-gray-tertiary flex justify-center`}
      >
        {children}
      </body>
    </html>
  );
}
