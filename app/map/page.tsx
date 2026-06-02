import { Suspense } from "react";
import MapSection from "@/components/MapSection";
import MapLoadingFrame from "@/components/MapLoadingFrame";
import { getPlaces } from "@/services/place";
import { RibbonFilter } from "@/components/PlaceListWithSort";

const VALID_RIBBON = new Set<string>(["cardinal", "deepred", "pink"]);

type MapSearchParams = Promise<{ ribbon?: string; search?: string; place?: string }>;

async function MapContent({ searchParams }: { searchParams: MapSearchParams }) {
  const { ribbon, search, place } = await searchParams;
  const places = await getPlaces();
  const initialRibbonFilter =
    ribbon && VALID_RIBBON.has(ribbon) ? (ribbon as RibbonFilter) : null;
  const initialSelectedPlaceId =
    place && places.some((p) => p.id === place) ? place : null;

  return (
    <MapSection
      places={places}
      initialRibbonFilter={initialRibbonFilter}
      initialSearchQuery={search}
      initialSelectedPlaceId={initialSelectedPlaceId}
    />
  );
}

export default function MapPage({
  searchParams,
}: {
  searchParams: MapSearchParams;
}) {
  return (
    <section className="px-[18px] pt-6">
      <div className="mb-4">
        <p className="text-[#d6336c] text-xs font-black tracking-[1.6px] mb-1">MAP</p>
        <h2 className="text-2xl font-bold tracking-[-0.8px]">지도에서 식당 찾기</h2>
      </div>

      <Suspense fallback={<MapLoadingFrame />}>
        <MapContent searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
