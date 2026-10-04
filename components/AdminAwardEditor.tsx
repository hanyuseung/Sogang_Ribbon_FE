"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminAwardForm, { type AwardPlaceOption } from "@/components/AdminAwardForm";
import { adminRequest } from "@/lib/admin-request";
import { useAuth } from "@/contexts/AuthContext";
import type { AdminAward } from "@/types/award";

export default function AdminAwardEditor({ awardId }: { awardId?: string }) {
  const { user } = useAuth();
  const [data, setData] = useState<{ award?: AdminAward; places: AwardPlaceOption[] } | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const [places, award] = await Promise.all([
          adminRequest<AwardPlaceOption[]>("/api/admin/places", { signal: controller.signal }),
          awardId ? adminRequest<AdminAward>(`/api/admin/awards/${encodeURIComponent(awardId)}`, { signal: controller.signal }) : Promise.resolve(undefined),
        ]);
        if (!controller.signal.aborted) setData({ places, award });
      } catch (error) {
        if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "어워드 정보를 불러오지 못했어요.");
      }
    }
    load();
    return () => controller.abort();
  }, [awardId, user?.id, attempt]);

  return (
    <div className="min-h-full bg-[#fff8fb]">
      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[#f3d5df] bg-[#fff8fb]/95 px-5 backdrop-blur">
        <Link href="/admin/awards" aria-label="어워드 관리로 돌아가기" className="p-1 text-[#7a5965]"><ArrowLeft className="size-5" /></Link>
        <h1 className="truncate font-bold text-[#2b1b22]">{awardId ? "어워드 수정" : "어워드 추가"}</h1>
      </header>
      <main className="px-5 py-6 pb-16">
        {error ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <p role="alert" className="text-sm text-red-500">{error}</p>
            <button type="button" className="text-sm font-bold text-[#d6336c]" onClick={() => { setError(""); setData(null); setAttempt((value) => value + 1); }}>다시 불러오기</button>
          </div>
        ) : data ? (
          <AdminAwardForm key={awardId ?? "new"} award={data.award} places={data.places} />
        ) : <p className="py-12 text-center text-sm text-[#7a5965]">로딩 중...</p>}
      </main>
    </div>
  );
}
