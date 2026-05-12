"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

const SIMPLE_TITLE: Record<string, string> = {
  "/gacha": "메뉴 뽑기",
  "/community": "커뮤니티",
  "/mypage": "마이페이지",
};

export default function AppHeader() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/map") {
    return <Header />;
  }

  const title = SIMPLE_TITLE[pathname];
  if (title) {
    return (
      <header className="h-16 px-5 bg-[rgba(255,248,251,0.92)] backdrop-blur-[14px] border-b border-[#f3d5df] flex items-center shrink-0">
        <span className="font-bold text-[#2b1b22]">{title}</span>
      </header>
    );
  }

  return null;
}
