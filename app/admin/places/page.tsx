"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
import AdminGuard from "@/components/AdminGuard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Place } from "@/types/place";

function AdminPlaceList() {
  const { user } = useAuth();
  const userId = user?.id;
  const [places, setPlaces] = useState<Place[]>([]);
  const [isListLoading, setIsListLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchPlaces() {
      if (!userId) return;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        if (!ignore) setIsListLoading(false);
        return;
      }

      const res = await fetch("/api/admin/places", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!ignore) {
        if (res.ok) {
          setPlaces((await res.json()) as Place[]);
        } else {
          setErrorMessage("식당 목록을 불러오지 못했어요.");
        }
        setIsListLoading(false);
      }
    }

    fetchPlaces();

    return () => {
      ignore = true;
    };
  }, [userId]);

  return (
    <div className="min-h-full bg-[#fff8fb]">
      <header className="sticky top-0 z-20 h-16 px-5 bg-[rgba(255,248,251,0.92)] backdrop-blur-[14px] border-b border-[#f3d5df] flex items-center gap-3">
        <Link href="/mypage" className="text-[#7a5965] p-1 -ml-1">
          <ArrowLeft className="size-5" />
        </Link>
        <span className="font-bold text-[#2b1b22] flex-1">식당 관리</span>
        <Link
          href="/admin/places/new"
          className="flex items-center gap-1 px-3.5 py-2 bg-[#d6336c] text-white text-xs font-bold rounded-full"
        >
          <Plus className="size-3.5" />
          식당 추가
        </Link>
      </header>

      <main className="max-w-screen-sm mx-auto pb-16">
        <div className="bg-white mt-2">
          {isListLoading ? (
            <p className="text-sm text-[#7a5965] text-center py-12">로딩 중...</p>
          ) : errorMessage ? (
            <p className="text-sm text-[#d6336c] text-center py-12">{errorMessage}</p>
          ) : places.length === 0 ? (
            <p className="text-sm text-[#7a5965] text-center py-12">등록된 식당이 없어요</p>
          ) : (
            <ul className="divide-y divide-[#f3d5df]">
              {places.map((place) => (
                <li key={place.id}>
                  <Link
                    href={`/admin/places/${place.id}/edit`}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-[#fff8fb] transition-colors"
                  >
                    <div className="size-10 rounded-[14px] bg-gradient-to-br from-[#ffd6e5] to-[#fff1f6] flex items-center justify-center shrink-0">
                      <span className="text-sm font-black text-[#d6336c]">{place.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#2b1b22] truncate">{place.name}</p>
                      <p className="text-xs text-[#7a5965] truncate">
                        {place.classification ?? "미분류"}
                        {place.address ? ` · ${place.address}` : ""}
                      </p>
                    </div>
                    <Pencil className="size-4 text-[#d6336c] shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AdminPlacesPage() {
  return (
    <AdminGuard>
      <AdminPlaceList />
    </AdminGuard>
  );
}
