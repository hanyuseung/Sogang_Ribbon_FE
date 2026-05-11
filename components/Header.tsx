"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, login, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 h-16 px-5 bg-[rgba(255,248,251,0.92)] backdrop-blur-[14px] border-b border-[#f3d5df] flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-xl font-black text-[#d6336c]">
        🎀 서강리본
      </div>
      {user ? (
        <button
          onClick={logout}
          className="px-[13px] py-2 rounded-full bg-[#2b1b22] text-white text-[13px] font-bold"
        >
          <Link href="/mypage">{user.nickname}</Link>
        </button>
      ) : (
        <button
          onClick={login}
          className="px-[13px] py-2 rounded-full bg-[#2b1b22] text-white text-[13px] font-bold"
        >
          로그인
        </button>
      )}
    </header>
  );
}
