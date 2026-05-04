import { ReviewWithImages } from "@/types/review";
import { User } from "@/types/user";

type Props = {
  review: ReviewWithImages;
  user: User | undefined;
  keywords: string[];
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function ReviewCard({ review, user, keywords }: Props) {
  const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

  return (
    <div className="pb-5 border-b border-zinc-100 last:border-0">
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="size-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-zinc-400">
            {user?.nickname?.[0] ?? "?"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-800">{user?.nickname ?? "탈퇴한 유저"}</p>
          <p className="text-xs text-zinc-400">{formatDate(review.created_at)}</p>
        </div>
        <span className="text-sm text-amber-400 tracking-tight shrink-0">{stars}</span>
      </div>

      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {keywords.map((kw) => (
            <span
              key={kw}
              className="text-xs text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      {review.content && (
        <p className="text-sm text-zinc-700 leading-relaxed">{review.content}</p>
      )}

      {review.images.length > 0 && (
        <div className="flex gap-2 mt-2.5">
          {review.images.map((img) => (
            <div key={img.id} className="w-16 h-16 rounded-lg bg-zinc-100 shrink-0" />
          ))}
        </div>
      )}
    </div>
  );
}
