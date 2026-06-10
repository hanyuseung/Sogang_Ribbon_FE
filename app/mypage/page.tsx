"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, LogOut, Store } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function MyPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-full bg-[#fff8fb] flex items-center justify-center">
        <p className="text-sm text-[#7a5965]">로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-full bg-[#fff8fb] flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
          <p className="text-[#7a5965] text-sm leading-relaxed">
            로그인 후 마이페이지를<br />이용할 수 있어요
          </p>
          <Link
            href="/login"
            className="px-6 py-2.5 bg-[#d6336c] text-white text-sm font-bold rounded-full"
          >
            로그인
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-full bg-[#fff8fb]">
      <main className="max-w-screen-sm mx-auto pb-16">
        {/* 프로필 */}
        <div className="bg-white px-6 pt-8 pb-6 flex flex-col items-center text-center border-b border-[#f3d5df]">
          <div className="size-20 rounded-full bg-gradient-to-br from-[#ffd6e5] to-[#fff1f6] flex items-center justify-center mb-3">
            <span className="text-3xl font-bold text-[#d6336c]">{user.nickname[0]}</span>
          </div>
          <h1 className="text-lg font-bold text-[#2b1b22]">{user.nickname}</h1>
          <p className="text-sm text-[#7a5965] mt-0.5">{user.email}</p>
        </div>

        {/* 메뉴 */}
        <div className="bg-white mt-2">
          <Link
            href="/mypage/bookmarks"
            className="flex items-center justify-between px-5 py-4 border-b border-[#f3d5df] hover:bg-[#fff8fb] transition-colors"
          >
            <span className="text-sm font-bold text-[#2b1b22]">북마크</span>
            <ChevronRight className="size-4 text-[#d6336c]" />
          </Link>
          {user.role === "admin" && (
            <Link
              href="/admin/places"
              className="flex items-center justify-between px-5 py-4 border-b border-[#f3d5df] hover:bg-[#fff8fb] transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-[#2b1b22]">
                <Store className="size-4 text-[#d6336c]" />
                식당 관리
              </span>
              <ChevronRight className="size-4 text-[#d6336c]" />
            </Link>
          )}
        </div>

        {/* 로그아웃 */}
        <div className="mt-2 bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-5 py-4 text-sm text-[#7a5965] hover:bg-[#fff8fb] transition-colors"
          >
            <LogOut className="size-4" />
            로그아웃
          </button>
        </div>
      </main>
    </div>
  );
}
