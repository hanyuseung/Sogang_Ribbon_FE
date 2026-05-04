import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import placesData from "@/lib/place_dummy.json";
import reviewsData from "@/lib/review_dummy.json";
import usersData from "@/lib/user_dummy.json";
import keywordsData from "@/lib/keyword_dummy.json";
import placeKeywordsData from "@/lib/place_keyword_dummy.json";
import { Place } from "@/types/place";
import { ReviewWithImages } from "@/types/review";
import { User } from "@/types/user";
import { Keyword, PlaceKeyword } from "@/types/keyword";
import ReviewCard from "@/components/ReviewCard";

const RIBBON_CONFIG = [
  { key: "ribbon_cardinal" as const, label: "***", className: "text-red-800 bg-red-50 border-red-200" },
  { key: "ribbon_deepred" as const, label: "**", className: "text-rose-600 bg-rose-50 border-rose-200" },
  { key: "ribbon_pink" as const, label: "*", className: "text-pink-500 bg-pink-50 border-pink-200" },
];

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const placeId = Number(id);

  const place = (placesData as Place[]).find((p) => p.id === placeId);
  if (!place) notFound();

  const reviews = (reviewsData as ReviewWithImages[]).filter(
    (r) => r.placeid === placeId && !r.is_del
  );
  const users = usersData as User[];
  const keywords = keywordsData as Keyword[];
  const placeKeywords = (placeKeywordsData as PlaceKeyword[])
    .filter((pk) => pk.place_id === placeId)
    .sort((a, b) => b.count - a.count);

  const maxCount = placeKeywords[0]?.count ?? 1;
  const ribbons = RIBBON_CONFIG.filter((r) => place[r.key] > 0);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white border-b border-zinc-100 px-4 h-14 flex items-center gap-3">
        <Link href="/" className="text-zinc-500 hover:text-zinc-800 transition-colors p-1 -ml-1">
          <ArrowLeft className="size-5" />
        </Link>
        <span className="font-semibold text-zinc-900 truncate">{place.name}</span>
      </header>

      <main className="max-w-screen-sm mx-auto pb-16">
        {/* 이미지 */}
        <div className="w-full h-52 bg-zinc-100 flex items-center justify-center overflow-hidden">
          {place.img_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={place.img_url} alt={place.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl font-bold text-zinc-200">{place.name[0]}</span>
          )}
        </div>

        {/* 식당 기본 정보 */}
        <div className="px-4 pt-5 pb-4 border-b border-zinc-100">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-xl font-bold text-zinc-900">{place.name}</h1>
            <span className="text-sm text-zinc-400 shrink-0 mt-0.5">{place.classification}</span>
          </div>
          {ribbons.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {ribbons.map((r) => (
                <span
                  key={r.key}
                  className={`text-xs px-2 py-0.5 rounded-full border font-medium ${r.className}`}
                >
                  {r.label} {place[r.key]}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 키워드 */}
        {placeKeywords.length > 0 && (
          <div className="px-4 py-4 border-b border-zinc-100">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              이런 점이 좋아요
            </h2>
            <div className="flex flex-wrap gap-2">
              {placeKeywords.map((pk) => {
                const keyword = keywords.find((k) => k.keyword_id === pk.keyword_id);
                if (!keyword) return null;
                const ratio = pk.count / maxCount;
                const cls =
                  ratio >= 0.9
                    ? "text-sm font-semibold text-zinc-800 bg-zinc-100 border-zinc-300"
                    : ratio >= 0.6
                    ? "text-sm font-medium text-zinc-600 bg-zinc-50 border-zinc-200"
                    : "text-xs text-zinc-400 bg-white border-zinc-100";
                return (
                  <span key={pk.keyword_id} className={`${cls} border px-3 py-1 rounded-full`}>
                    {keyword.name}
                    <span className="ml-1.5 text-zinc-300 font-normal">{pk.count}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* 리뷰 */}
        <div className="px-4 pt-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-zinc-900">
              리뷰{" "}
              <span className="text-red-700">{reviews.length}</span>
            </h2>
            <Link
              href={`/review/new?placeId=${placeId}`}
              className="flex items-center gap-1.5 text-sm font-medium text-white bg-red-800 hover:bg-red-700 px-3 py-1.5 rounded-full transition-colors"
            >
              <Pencil className="size-3.5" />
              리뷰 쓰기
            </Link>
          </div>

          {reviews.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-12">아직 리뷰가 없어요</p>
          ) : (
            <div className="space-y-1">
              {reviews.map((review) => {
                const user = users.find((u) => u.id === review.userid);
                const reviewKeywords = review.keyword_ids
                  .map((kid) => keywords.find((k) => k.keyword_id === kid)?.name)
                  .filter((n): n is string => !!n);
                return (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    user={user}
                    keywords={reviewKeywords}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
