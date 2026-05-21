"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

type PlaceBookmarkButtonProps = {
  placeId: string;
};

export default function PlaceBookmarkButton({ placeId }: PlaceBookmarkButtonProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchBookmarkStatus() {
      if (!user) return;

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(`/api/bookmarks?placeId=${placeId}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) return;

      const data = (await res.json()) as { bookmarked?: boolean };
      if (!ignore) setIsBookmarked(!!data.bookmarked);
    }

    fetchBookmarkStatus();

    return () => {
      ignore = true;
    };
  }, [placeId, user]);

  async function handleBookmark() {
    setErrorMessage("");

    if (!user) {
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setIsSubmitting(false);
      router.push("/login");
      return;
    }

    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ placeId }),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      setErrorMessage("북마크 저장에 실패했어요. 잠시 후 다시 시도해 주세요.");
      return;
    }

    setIsBookmarked(true);
  }

  return (
    <div className="mb-[18px] mt-6">
      <button
        type="button"
        onClick={handleBookmark}
        disabled={isLoading || isSubmitting || isBookmarked}
        className="w-full min-h-[46px] rounded-full bg-[#fff1f6] text-[#d6336c] text-sm font-black disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Heart className="size-4" fill={isBookmarked ? "currentColor" : "none"} />
        {isSubmitting ? "저장 중..." : isBookmarked ? "북마크 완료" : "북마크"}
      </button>
      {errorMessage && (
        <p className="mt-2 text-center text-xs font-bold text-[#d6336c]">{errorMessage}</p>
      )}
    </div>
  );
}
