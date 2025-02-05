"use client";

import "./globals.css";
import localFont from "next/font/local";

const pretendard = localFont({
  src: "../assets/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} w-full h-full`}>
      <body
        className={`${pretendard.className} w-[100vw] h-[100%]  bg-gray-tertiary flex justify-center`}
      >
        {children}
      </body>
    </html>
  );
}
