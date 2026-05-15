import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPlaceById } from "@/services/place";
import { getReviewsByPlaceId } from "@/services/review";
import ReviewCard from "@/components/ReviewCard";

export default async function PlaceReviewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [place, reviews] = await Promise.all([
    getPlaceById(id),
    getReviewsByPlaceId(id),
  ]);

  if (!place) notFound();

  return (
    <div className="min-h-full bg-[#fff8fb]">
      <header className="sticky top-0 z-20 h-16 px-5 bg-[rgba(255,248,251,0.92)] backdrop-blur-[14px] border-b border-[#f3d5df] flex items-center gap-3">
        <Link href={`/place/${id}`} className="text-[#7a5965] p-1 -ml-1">
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
            href={`/review/new?placeId=${id}`}
            className="inline-flex items-center justify-center h-[40px] px-4 rounded-full bg-[#d6336c] text-white text-sm font-black shrink-0 mt-1"
          >
            리뷰 쓰기
          </Link>
        </div>

        {reviews.length === 0 ? (
          <p className="text-sm text-[#7a5965] text-center py-16">아직 리뷰가 없어요</p>
        ) : (
          <div className="grid gap-[10px]">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 rounded-[20px] bg-white shadow-[0_8px_22px_rgba(80,37,54,0.06)]"
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
