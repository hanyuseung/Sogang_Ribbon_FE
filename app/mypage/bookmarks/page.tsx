"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

type BookmarkPlace = {
  id: string;
  name: string;
  classification: string | null;
};

type BookmarkResponse = {
  id: string;
  place: BookmarkPlace;
};

export default function BookmarksPage() {
  const { user, isLoading } = useAuth();
  const userId = user?.id;
  const [bookmarkedPlaces, setBookmarkedPlaces] = useState<BookmarkPlace[]>([]);
  const [isBookmarksLoading, setIsBookmarksLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function fetchBookmarks() {
      if (!userId) {
        setBookmarkedPlaces([]);
        return;
      }

      setIsBookmarksLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        if (!ignore) {
          setBookmarkedPlaces([]);
          setIsBookmarksLoading(false);
        }
        return;
      }

      const res = await fetch("/api/bookmarks", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!ignore) {
        if (res.ok) {
          const bookmarks = (await res.json()) as BookmarkResponse[];
          setBookmarkedPlaces(bookmarks.map((bookmark) => bookmark.place));
        } else {
          setBookmarkedPlaces([]);
        }
        setIsBookmarksLoading(false);
      }
    }

    fetchBookmarks();

    return () => {
      ignore = true;
    };
  }, [userId]);

  if (isLoading || isBookmarksLoading) {
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
            로그인 후 이용할 수 있어요
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

  return (
    <div className="min-h-full bg-[#fff8fb]">
      <header className="sticky top-0 z-20 h-16 px-5 bg-[rgba(255,248,251,0.92)] backdrop-blur-[14px] border-b border-[#f3d5df] flex items-center gap-3">
        <Link href="/mypage" className="text-[#7a5965] p-1 -ml-1">
          <ArrowLeft className="size-5" />
        </Link>
        <span className="font-bold text-[#2b1b22]">북마크</span>
      </header>

      <main className="max-w-screen-sm mx-auto pb-16">
        <div className="bg-white mt-2">
          {bookmarkedPlaces.length === 0 ? (
            <p className="text-sm text-[#7a5965] text-center py-12">저장한 식당이 없어요</p>
          ) : (
            <ul className="divide-y divide-[#f3d5df]">
              {bookmarkedPlaces.map((place) => (
                <li key={place.id}>
                  <Link
                    href={`/place/${place.id}`}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-[#fff8fb] transition-colors"
                  >
                    <div className="size-10 rounded-[14px] bg-gradient-to-br from-[#ffd6e5] to-[#fff1f6] flex items-center justify-center shrink-0">
                      <span className="text-sm font-black text-[#d6336c]">{place.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#2b1b22] truncate">{place.name}</p>
                      <p className="text-xs text-[#7a5965]">{place.classification}</p>
                    </div>
                    <ChevronRight className="size-4 text-[#d6336c] shrink-0" />
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
