"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, login, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-zinc-100 px-4 h-14 flex items-center justify-between">
      <span className="text-lg font-bold tracking-tight text-red-800">서강리본</span>
      {user ? (
        <Link href="/mypage" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
          {user.nickname}
        </Link>
      ) : (
        <button
          onClick={login}
          className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
        >
          로그인
        </button>
      )}
    </header>
  );
}
