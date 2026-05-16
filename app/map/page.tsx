import MapSection from "@/components/MapSection";
import { getPlaces } from "@/services/place";

export default async function MapPage() {
  const places = await getPlaces();

  return (
    <>
      <section className="px-[18px] pt-6">
        <div className="mb-4">
          <p className="text-[#d6336c] text-xs font-black tracking-[1.6px] mb-1">MAP</p>
          <h2 className="text-2xl font-bold tracking-[-0.8px]">지도에서 식당 찾기</h2>
        </div>

        <MapSection places={places} />
      </section>
    </>
  );
}
