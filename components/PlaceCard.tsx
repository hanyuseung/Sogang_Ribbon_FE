import Link from "next/link";
import { Place } from "@/types/place";

const RIBBON_CONFIG = [
  { key: "ribbon_cardinal" as const, label: "***", className: "text-red-800 bg-red-50 border-red-200" },
  { key: "ribbon_deepred" as const, label: "**", className: "text-rose-600 bg-rose-50 border-rose-200" },
  { key: "ribbon_pink" as const, label: "*", className: "text-pink-500 bg-pink-50 border-pink-200" },
];

export default function PlaceCard({ place }: { place: Place }) {
  const ribbons = RIBBON_CONFIG.filter((r) => place[r.key] > 0);
  const maxCount = place.keywords?.length
    ? Math.max(...place.keywords.map((k) => k.count))
    : 1;

  return (
    <Link href={`/place/${place.id}`} className="flex gap-4 p-4 rounded-2xl border border-zinc-100 bg-white hover:border-zinc-200 transition-colors block">
      <div className="w-[72px] h-[72px] rounded-xl bg-zinc-100 shrink-0 flex items-center justify-center overflow-hidden">
        {place.img_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={place.img_url} alt={place.name} className="object-cover w-full h-full" />
        ) : (
          <span className="text-2xl font-bold text-zinc-300">{place.name[0]}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-900 truncate">{place.name}</span>
          <span className="text-xs text-zinc-400 shrink-0">{place.classification}</span>
        </div>

        {ribbons.length > 0 && (
          <div className="flex flex-wrap gap-1">
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

        {place.keywords && place.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {place.keywords.slice(0, 3).map((kw) => {
              const ratio = kw.count / maxCount;
              const cls =
                ratio >= 0.9
                  ? "text-sm font-medium text-zinc-700 bg-zinc-100 border-zinc-200"
                  : ratio >= 0.7
                  ? "text-xs text-zinc-600 bg-zinc-50 border-zinc-100"
                  : "text-xs text-zinc-400 bg-zinc-50 border-zinc-100";
              return (
                <span key={kw.name} className={`${cls} border px-2 py-0.5 rounded-full`}>
                  {kw.name}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </Link>
  );
}
