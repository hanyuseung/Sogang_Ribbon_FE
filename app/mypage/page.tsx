"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import reviewsData from "@/lib/review_dummy.json";
import emblemsData from "@/lib/emblem_dummy.json";
import userEmblemsData from "@/lib/user_emblem_dummy.json";
import placesData from "@/lib/place_dummy.json";
import keywordsData from "@/lib/keyword_dummy.json";
import bookmarksData from "@/lib/place_bookmark_dummy.json";
import { ReviewWithImages } from "@/types/review";
import { Emblem, UserEmblem } from "@/types/emblem";
import { Place } from "@/types/place";
import { Keyword } from "@/types/keyword";
import { PlaceBookmark } from "@/types/bookmark";

const EMBLEMS = emblemsData as Emblem[];
const PLACES = placesData as Place[];
const KEYWORDS = keywordsData as Keyword[];

const EMBLEM_STYLE: Record<string, { badge: string; bar: string; label: string }> = {
  bronze:   { badge: "bg-amber-50 text-amber-700 border-amber-200",  bar: "bg-amber-400",  label: "브론즈" },
  silver:   { badge: "bg-zinc-100 text-zinc-600 border-zinc-300",    bar: "bg-zinc-400",   label: "실버" },
  gold:     { badge: "bg-yellow-50 text-yellow-700 border-yellow-200", bar: "bg-yellow-400", label: "골드" },
  platinum: { badge: "bg-sky-50 text-sky-600 border-sky-200",        bar: "bg-sky-400",    label: "플래티넘" },
  diamond:  { badge: "bg-blue-50 text-blue-600 border-blue-200",     bar: "bg-blue-400",   label: "다이아몬드" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function MyPage() {
  const { user, login, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="sticky top-0 z-10 bg-white border-b border-zinc-100 px-4 h-14 flex items-center gap-3">
          <Link href="/" className="text-zinc-500 hover:text-zinc-800 p-1 -ml-1 transition-colors">
            <ArrowLeft className="size-5" />
          </Link>
          <span className="font-semibold text-zinc-900">마이페이지</span>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
          <p className="text-zinc-500 text-sm leading-relaxed">
            로그인 후 마이페이지를<br />이용할 수 있어요
          </p>
          <button
            onClick={login}
            className="px-6 py-2.5 bg-red-800 text-white text-sm font-semibold rounded-full hover:bg-red-700 transition-colors"
          >
            로그인
          </button>
        </div>
      </div>
    );
  }

  const myReviews = (reviewsData as ReviewWithImages[]).filter(
    (r) => r.userid === user.id && !r.is_del
  );

  const myEmblemIds = (userEmblemsData as UserEmblem[])
    .filter((ue) => ue.userid === user.id)
    .map((ue) => ue.emblemid);
  const currentEmblem = EMBLEMS.filter((e) => myEmblemIds.includes(e.emblem_id))
    .sort((a, b) => b.tier_order - a.tier_order)[0];
  const nextEmblem = EMBLEMS.find((e) => e.tier_order === (currentEmblem?.tier_order ?? 0) + 1);
  const progress = nextEmblem
    ? Math.min(user.review_cnt / nextEmblem.review_threshold, 1)
    : 1;

  const myBookmarks = (bookmarksData as PlaceBookmark[]).filter((b) => b.userid === user.id);
  const bookmarkedPlaces = myBookmarks
    .map((b) => PLACES.find((p) => p.id === b.place_id))
    .filter((p): p is Place => !!p);

  const emblemStyle = currentEmblem ? EMBLEM_STYLE[currentEmblem.name] : null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-10 bg-white border-b border-zinc-100 px-4 h-14 flex items-center gap-3">
        <Link href="/" className="text-zinc-500 hover:text-zinc-800 p-1 -ml-1 transition-colors">
          <ArrowLeft className="size-5" />
        </Link>
        <span className="font-semibold text-zinc-900">마이페이지</span>
      </header>

      <main className="max-w-screen-sm mx-auto pb-16">
        {/* 프로필 */}
        <div className="bg-white px-6 pt-8 pb-6 flex flex-col items-center text-center border-b border-zinc-100">
          <div className="size-20 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
            <span className="text-3xl font-bold text-zinc-300">{user.nickname[0]}</span>
          </div>
          <h1 className="text-lg font-bold text-zinc-900">{user.nickname}</h1>
          <p className="text-sm text-zinc-400 mt-0.5">{user.email}</p>
          <p className="text-sm font-semibold text-red-700 mt-2">리뷰 {user.review_cnt}개</p>
        </div>

        {/* 리본 등급 */}
        {currentEmblem && emblemStyle && (
          <div className="bg-white mt-2 px-5 py-5 border-b border-zinc-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-700">나의 리본 등급</h2>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${emblemStyle.badge}`}>
                {emblemStyle.label}
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${emblemStyle.bar}`}
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              {nextEmblem ? (
                <>
                  {EMBLEM_STYLE[nextEmblem.name]?.label ?? nextEmblem.name}까지{" "}
                  <span className="font-medium text-zinc-600">
                    {nextEmblem.review_threshold - user.review_cnt}개
                  </span>{" "}
                  남았어요
                </>
              ) : (
                "최고 등급이에요 🎉"
              )}
            </p>
          </div>
        )}

        {/* 내 리뷰 */}
        <div className="bg-white mt-2 border-b border-zinc-100">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-700">
              내 리뷰{" "}
              <span className="text-red-700">{myReviews.length}</span>
            </h2>
          </div>
          {myReviews.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-8">아직 작성한 리뷰가 없어요</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {myReviews.map((review) => {
                const place = PLACES.find((p) => p.id === review.placeid);
                const reviewKeywords = review.keyword_ids
                  .map((id) => KEYWORDS.find((k) => k.keyword_id === id)?.name)
                  .filter((n): n is string => !!n);
                const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
                return (
                  <li key={review.id}>
                    <Link
                      href={`/place/${review.placeid}`}
                      className="flex items-start gap-3 px-5 py-4 hover:bg-zinc-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-zinc-900 text-sm truncate">
                            {place?.name ?? "알 수 없는 식당"}
                          </span>
                          <span className="text-amber-400 text-xs shrink-0">{stars}</span>
                        </div>
                        {reviewKeywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-1.5">
                            {reviewKeywords.map((kw) => (
                              <span
                                key={kw}
                                className="text-xs text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-full"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-zinc-500 truncate">{review.content}</p>
                        <p className="text-xs text-zinc-400 mt-1">{formatDate(review.created_at)}</p>
                      </div>
                      <ChevronRight className="size-4 text-zinc-300 shrink-0 mt-0.5" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* 저장한 식당 */}
        {bookmarkedPlaces.length > 0 && (
          <div className="bg-white mt-2 border-b border-zinc-100">
            <div className="px-5 pt-5 pb-3">
              <h2 className="text-sm font-semibold text-zinc-700">
                저장한 식당{" "}
                <span className="text-red-700">{bookmarkedPlaces.length}</span>
              </h2>
            </div>
            <ul className="divide-y divide-zinc-100">
              {bookmarkedPlaces.map((place) => (
                <li key={place.id}>
                  <Link
                    href={`/place/${place.id}`}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-zinc-50 transition-colors"
                  >
                    <div className="size-10 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-zinc-300">{place.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">{place.name}</p>
                      <p className="text-xs text-zinc-400">{place.classification}</p>
                    </div>
                    <ChevronRight className="size-4 text-zinc-300 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 로그아웃 */}
        <div className="mt-2 bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-5 py-4 text-sm text-zinc-500 hover:bg-zinc-50 transition-colors"
          >
            <LogOut className="size-4" />
            로그아웃
          </button>
        </div>
      </main>
    </div>
  );
}
