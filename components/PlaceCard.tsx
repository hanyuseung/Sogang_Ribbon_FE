import Link from "next/link";
import { Place } from "@/types/place";

type RibbonTier = "cardinal" | "deepred" | "pink" | null;

const RIBBON_LABEL: Record<NonNullable<RibbonTier>, string> = {
  cardinal: "카디널리본",
  deepred: "딥레드리본",
  pink: "핑크리본",
};

const RIBBON_CLASS: Record<NonNullable<RibbonTier>, string> = {
  cardinal: "bg-[#f8d7da] text-[#9b1c31]",
  deepred: "bg-[#ffe2e2] text-[#d9480f]",
  pink: "bg-[#ffe3ec] text-[#d6336c]",
};

function getTopRibbon(place: Place): RibbonTier {
  if ((place.ribbon_cardinal ?? 0) > 0) return "cardinal";
  if ((place.ribbon_deepred ?? 0) > 0) return "deepred";
  if ((place.ribbon_pink ?? 0) > 0) return "pink";
  return null;
}

export default function PlaceCard({ place, isActive }: { place: Place; isActive?: boolean }) {
  const topRibbon = getTopRibbon(place);

  return (
    <Link
      href={`/place/${place.id}`}
      className={`flex gap-3 items-center py-2 px-4 rounded-[22px] shadow-[0_10px_24px_rgba(80,37,54,0.07)] transition-colors ${
        isActive ? "bg-[#fff0f5] ring-2 ring-[#d6336c]" : "bg-white"
      }`}
    >
      <div className="w-[64px] h-[64px] flex-none rounded-[18px] bg-gradient-to-br from-[#ffd6e5] to-[#fff1f6] flex items-center justify-center overflow-hidden">
        {place.img_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={place.img_url} alt={place.name} className="object-cover w-full h-full" />
        ) : (
          <span className="text-xs font-black text-[#d6336c]">IMG</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        {topRibbon && (
          <span
            className={`inline-block px-[9px] py-1 rounded-full text-[11px] font-black ${RIBBON_CLASS[topRibbon]}`}
          >
            {RIBBON_LABEL[topRibbon]}
          </span>
        )}
        <h3 className="text-[17px] font-semibold mt-[5px] mb-0.5 truncate">{place.name}</h3>
        <span className="inline-block mt-1.5 text-[13px] font-black text-[#d6336c]">
          자세히 보기
        </span>
      </div>
    </Link>
  );
}
