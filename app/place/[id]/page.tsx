import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPlaceById } from "@/services/place";
import PlaceBookmarkButton from "@/components/PlaceBookmarkButton";
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

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const place = await getPlaceById(id);
  if (!place) notFound();

  const topRibbon = getTopRibbon(place);

  return (
    <div className="min-h-full bg-[#fff8fb]">
      <header className="sticky top-0 z-20 h-16 px-5 bg-[rgba(255,248,251,0.92)] backdrop-blur-[14px] border-b border-[#f3d5df] flex items-center gap-3">
        <Link href="/map" className="text-[#7a5965] p-1 -ml-1">
          <ArrowLeft className="size-5" />
        </Link>
        <span className="font-bold text-[#2b1b22] truncate">{place.name}</span>
      </header>

      <section className="px-[18px] pt-6 pb-8">
        <div className="mb-4">
          <p className="text-[#d6336c] text-xs font-black tracking-[1.6px] mb-1">RESTAURANT</p>
          <h2 className="text-2xl font-bold tracking-[-0.8px]">식당 상세</h2>
        </div>

        {/* 이미지 */}
        <div className="h-[230px] rounded-[28px] bg-gradient-to-br from-[#ffd6e5] to-[#fff1f6] flex items-center justify-center overflow-hidden mb-4">
          {place.img_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={place.img_url} alt={place.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[#d6336c] font-black">음식 이미지 영역</span>
          )}
        </div>

        {/* 상세 카드 */}
        <div className="bg-white rounded-[24px] shadow-[0_12px_28px_rgba(80,37,54,0.08)] p-[18px]">
          {topRibbon && (
            <span
              className={`inline-block px-[9px] py-1 rounded-full text-[11px] font-black ${RIBBON_CLASS[topRibbon]}`}
            >
              {RIBBON_LABEL[topRibbon]}
            </span>
          )}

          <div className="flex items-center gap-3 my-2">
            <h2 className="text-[27px] font-bold">{place.name}</h2>
          </div>

          <p className="text-[#6f4c59] text-sm">
            {place.classification}
          </p>

          {place.desc_detail && (
            <p className="mt-4 text-[15px] leading-7 text-[#4b313b] whitespace-pre-line">
              {place.desc_detail}
            </p>
          )}

          {/* 액션 버튼 */}
          <PlaceBookmarkButton placeId={place.id} />
        </div>
      </section>
    </div>
  );
}
