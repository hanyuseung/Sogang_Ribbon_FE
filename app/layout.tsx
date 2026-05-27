import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/app/providers";
import BottomNav from "@/components/BottomNav";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import { CANONICAL_SITE_URL } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_SITE_URL),
  title: "서강리본",
  description: "서강대학교 주변 맛집 리뷰 서비스",
  // 💡 아래 icons 부분을 추가합니다.
  icons: {
    icon: "/app_icon.svg", // /public 폴더는 기본 루트(/)로 매핑됩니다.
    // 만약 애플 기기용 아이콘(홈 화면 추가 시)도 함께 쓰고 싶다면 아래도 추가 가능합니다.
    apple: "/app_icon.svg", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-full">
        <div className="w-full max-w-[430px] min-h-screen mx-auto bg-[#fff8fb] flex flex-col relative pb-[92px] shadow-[0_0_40px_rgba(43,27,34,0.12)]">
          <Providers>
            <Header />
            <PageTransition>{children}</PageTransition>
          </Providers>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
