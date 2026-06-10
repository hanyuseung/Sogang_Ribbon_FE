"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminGuard from "@/components/AdminGuard";
import AdminPlaceForm from "@/components/AdminPlaceForm";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Place } from "@/types/place";

function EditPlaceContent({ id }: { id: string }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [place, setPlace] = useState<Place | null>(null);
  const [isPlaceLoading, setIsPlaceLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchPlace() {
      if (!userId) return;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        if (!ignore) setIsPlaceLoading(false);
        return;
      }

      const res = await fetch(`/api/admin/places/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!ignore) {
        if (res.ok) setPlace((await res.json()) as Place);
        setIsPlaceLoading(false);
      }
    }

    fetchPlace();

    return () => {
      ignore = true;
    };
  }, [id, userId]);

  return (
    <div className="min-h-full bg-[#fff8fb]">
      <header className="sticky top-0 z-20 h-16 px-5 bg-[rgba(255,248,251,0.92)] backdrop-blur-[14px] border-b border-[#f3d5df] flex items-center gap-3">
        <Link href="/admin/places" className="text-[#7a5965] p-1 -ml-1">
          <ArrowLeft className="size-5" />
        </Link>
        <span className="font-bold text-[#2b1b22] truncate">
          {place ? `${place.name} 수정` : "식당 수정"}
        </span>
      </header>

      <main className="max-w-screen-sm mx-auto px-5 py-6 pb-16">
        {isPlaceLoading ? (
          <p className="text-sm text-[#7a5965] text-center py-12">로딩 중...</p>
        ) : place ? (
          <AdminPlaceForm place={place} />
        ) : (
          <p className="text-sm text-[#d6336c] text-center py-12">
            식당 정보를 불러오지 못했어요.
          </p>
        )}
      </main>
    </div>
  );
}

export default function EditPlacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <AdminGuard>
      <EditPlaceContent id={id} />
    </AdminGuard>
  );
}
