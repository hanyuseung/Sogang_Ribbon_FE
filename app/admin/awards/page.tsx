"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
import AdminGuard from "@/components/AdminGuard";
import { useAuth } from "@/contexts/AuthContext";
import { adminRequest } from "@/lib/admin-request";
import type { AdminAwardSummary } from "@/types/award";

function AwardList() {
  const { user } = useAuth();
  const [awards, setAwards] = useState<AdminAwardSummary[] | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    adminRequest<AdminAwardSummary[]>("/api/admin/awards", { signal: controller.signal })
      .then((data) => { if (!controller.signal.aborted) setAwards(data); })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "어워드 목록을 불러오지 못했어요.");
      });
    return () => controller.abort();
  }, [user?.id, attempt]);

  return (
    <div className="min-h-full bg-[#fff8fb]">
      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[#f3d5df] bg-[#fff8fb]/95 px-5 backdrop-blur">
        <Link href="/mypage" aria-label="마이페이지로 돌아가기" className="p-1 text-[#7a5965]"><ArrowLeft className="size-5" /></Link>
        <h1 className="flex-1 font-bold text-[#2b1b22]">어워드 관리</h1>
        <Link href="/admin/awards/new" className="flex items-center gap-1 rounded-full bg-[#d6336c] px-3 py-2 text-xs font-bold text-white"><Plus className="size-3.5" /> 어워드 추가</Link>
      </header>
      <main className="mt-2 bg-white pb-16">
        {error ? (
          <div className="flex flex-col items-center gap-3 px-5 py-12">
            <p role="alert" className="text-sm text-red-500">{error}</p>
            <button type="button" className="text-sm font-bold text-[#d6336c]" onClick={() => { setError(""); setAwards(null); setAttempt((value) => value + 1); }}>다시 불러오기</button>
          </div>
        ) : awards === null ? <p className="py-12 text-center text-sm text-[#7a5965]">로딩 중...</p>
          : awards.length === 0 ? <p className="py-12 text-center text-sm text-[#7a5965]">등록된 어워드가 없어요</p>
          : (
            <ul className="divide-y divide-[#f3d5df]">
              {awards.map((award) => (
                <li key={award.id}>
                  <Link href={`/admin/awards/${encodeURIComponent(award.id)}/edit`} className="flex items-center gap-3 px-5 py-4 hover:bg-[#fff8fb]">
                    <span aria-hidden="true" className="text-2xl">🏆</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[#2b1b22]">{award.name}</p>
                      <p className="mt-1 text-xs text-[#7a5965]">{award.dateStart ?? "시작일 미정"} · {award.categoryCount}개 부문 · 수상 {award.resultCount}건</p>
                    </div>
                    <Pencil className="size-4 shrink-0 text-[#d6336c]" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
      </main>
    </div>
  );
}

export default function AdminAwardsPage() {
  return <AdminGuard><AwardList /></AdminGuard>;
}
