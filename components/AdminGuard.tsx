"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  // role은 /api/me 응답이 도착해야 확정되므로 null인 동안은 로딩으로 취급
  if (isLoading || (user && user.role === null)) {
    return (
      <div className="min-h-full bg-[#fff8fb] flex items-center justify-center">
        <p className="text-sm text-[#7a5965]">로딩 중...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-full bg-[#fff8fb] flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
          <p className="text-[#7a5965] text-sm leading-relaxed">
            관리자만 이용할 수 있는 페이지예요
          </p>
          <Link
            href="/"
            className="px-6 py-2.5 bg-[#d6336c] text-white text-sm font-bold rounded-full"
          >
            홈으로
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
