import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPlaceById } from "@/services/place";
import reviewsData from "@/lib/review_dummy.json";
import usersData from "@/lib/user_dummy.json";
import keywordsData from "@/lib/keyword_dummy.json";
import { ReviewWithImages } from "@/types/review";
import { User } from "@/types/user";
import { Keyword } from "@/types/keyword";
import ReviewCard from "@/components/ReviewCard";

export default async function PlaceReviewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const placeId = id;

  const place = await getPlaceById(id);
  if (!place) notFound();

  const reviews = (reviewsData as ReviewWithImages[]).filter(
    (r) => String(r.placeid) === placeId && !r.is_del
  );
  const users = usersData as User[];
  const keywords = keywordsData as Keyword[];

  return (
    <div className="min-h-full bg-[#fff8fb]">
      <header className="sticky top-0 z-20 h-16 px-5 bg-[rgba(255,248,251,0.92)] backdrop-blur-[14px] border-b border-[#f3d5df] flex items-center gap-3">
        <Link href={`/place/${placeId}`} className="text-[#7a5965] p-1 -ml-1">
          <ArrowLeft className="size-5" />
        </Link>
        <span className="font-bold text-[#2b1b22] truncate">{place.name}</span>
      </header>

      <section className="px-[18px] pt-6 pb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[#d6336c] text-xs font-black tracking-[1.6px] mb-1">REVIEWS</p>
            <h2 className="text-2xl font-bold tracking-[-0.8px]">
              {place.name} 리뷰
            </h2>
          </div>
          <Link
            href={`/review/new?placeId=${placeId}`}
            className="inline-flex items-center justify-center h-[40px] px-4 rounded-full bg-[#d6336c] text-white text-sm font-black shrink-0 mt-1"
          >
            리뷰 쓰기
          </Link>
        </div>

        {reviews.length === 0 ? (
          <p className="text-sm text-[#7a5965] text-center py-16">아직 리뷰가 없어요</p>
        ) : (
          <div className="grid gap-[10px]">
            {reviews.map((review) => {
              const user = users.find((u) => u.id === review.userid);
              const reviewKeywords = review.keyword_ids
                .map((kid) => keywords.find((k) => k.keyword_id === kid)?.name)
                .filter((n): n is string => !!n);
              return (
                <div
                  key={review.id}
                  className="p-4 rounded-[20px] bg-white shadow-[0_8px_22px_rgba(80,37,54,0.06)]"
                >
                  <ReviewCard review={review} user={user} keywords={reviewKeywords} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
