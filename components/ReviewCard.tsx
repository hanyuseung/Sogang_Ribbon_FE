import { ReviewWithRelations } from "@/services/review";

type Props = {
  review: ReviewWithRelations;
};

function formatDate(date: Date) {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export default function ReviewCard({ review }: Props) {
  const keywords = review.keywords
    .map((rk) => rk.keyword.name)
    .filter((n): n is string => !!n);

  return (
    <div className="pb-1">
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="size-8 rounded-full bg-gradient-to-br from-[#ffd6e5] to-[#fff1f6] flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-[#d6336c]">
            {review.user?.nickname?.[0] ?? "?"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#2b1b22]">
            {review.user?.nickname ?? "탈퇴한 유저"}
          </p>
          <p className="text-xs text-[#8a5165]">{formatDate(review.createdAt)}</p>
        </div>
      </div>

      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {keywords.map((kw) => (
            <span
              key={kw}
              className="text-xs text-[#d6336c] bg-[#ffe3ec] px-[9px] py-0.5 rounded-full font-black"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      {review.content && (
        <p className="text-sm text-[#4b313b] leading-relaxed">{review.content}</p>
      )}

      {review.images.length > 0 && (
        <div className="flex gap-2 mt-2.5">
          {review.images.map((img) => (
            <div key={img.id} className="w-16 h-16 rounded-lg bg-[#f3d5df] shrink-0" />
          ))}
        </div>
      )}
    </div>
  );
}
