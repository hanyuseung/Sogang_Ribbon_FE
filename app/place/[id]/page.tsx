import { notFound } from "next/navigation";
import { getPlaceById } from "@/services/place";
import PlaceBookmarkButton from "@/components/PlaceBookmarkButton";
import BackButton from "@/components/BackButton";
import { Place } from "@/types/place";
import { getSupabaseImageUrl } from "@/lib/supabase-image";

type RibbonTier = "cardinal" | "deepred" | "pink" | null;

const RIBBON_LABEL: Record<NonNullable<RibbonTier>, string> = {
  cardinal: "카디널리본",
  deepred: "딥레드리본",
  pink: "핑크리본",
};

const RIBBON_CLASS: Record<NonNullable<RibbonTier>, string> = {
  cardinal: "bg-[#ffe2e2] text-[#d9480f]",
  deepred: "bg-[#ffe2e2] text-[#d9480f]",
  pink: "bg-[#ffe2e2] text-[#d9480f]",
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
  const imageUrl = getSupabaseImageUrl(place.img_url, {
    width: 860,
    height: 460,
    quality: 70,
  });

  return (
    <div className="min-h-full bg-[#fff8fb]">
      <header className="sticky top-0 z-20 h-16 px-5 bg-[rgba(255,248,251,0.92)] backdrop-blur-[14px] border-b border-[#f3d5df] flex items-center gap-3">
        <BackButton fallbackHref="/map" />
        <span className="font-bold text-[#2b1b22] truncate">{place.name}</span>
      </header>

      <section className="px-[18px] pt-6 pb-8">
        <div className="mb-4">
          <p className="text-[#d6336c] text-xs font-black tracking-[1.6px] mb-1">RESTAURANT</p>
          <h2 className="text-2xl font-bold tracking-[-0.8px]">식당 상세</h2>
        </div>

        {/* 이미지 */}
        <div className="h-[230px] rounded-[28px] bg-gradient-to-br from-[#ffd6e5] to-[#fff1f6] flex items-center justify-center overflow-hidden mb-4">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={place.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[#d6336c] font-black">음식 이미지 영역</span>
          )}
        </div>

        {/* 상세 카드 */}
        <div className="relative flex min-h-[345px] flex-col items-start gap-2 rounded-[24px] bg-white px-[18px] pb-9 pt-5 shadow-[0_12px_28px_rgba(80,37,54,0.08)]">
          <div className="flex items-center gap-2">
            {topRibbon && (
              <span
                className={`inline-flex h-[25px] items-center px-[9px] py-1 rounded-full text-[10.7px] leading-4 font-black ${RIBBON_CLASS[topRibbon]}`}
              >
                {RIBBON_LABEL[topRibbon]}
              </span>
            )}

            {place.classification && (
              <span className="inline-flex h-[25px] items-center justify-center rounded-full bg-[#d6336c] px-[10px] py-1 text-[11px] font-black leading-4 text-white shadow-sm">
                {place.classification}
              </span>
            )}
          </div>

          <div className="flex w-full items-center pb-px">
            <h2 className="w-full truncate text-[25.4px] font-bold leading-10 text-[#2b1b22]">
              {place.name}
            </h2>
          </div>

          {place.desc_thumbnail && (
            <p className="w-full pb-4 text-[14px] font-bold leading-5 text-[#6f4c59]">
              {place.desc_thumbnail}
            </p>
          )}

          {place.desc_detail && (
            <p className="w-full text-justify text-[13.2px] leading-5 text-[#6f4c59] whitespace-pre-line">
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
