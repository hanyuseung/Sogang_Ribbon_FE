import MapSection from "@/components/MapSection";
import { getPlaces } from "@/services/place";

export default async function MapPage() {
  const places = await getPlaces();

  return (
    <>
      <section className="px-[18px] pt-6 h-full flex flex-col overflow-hidden">
        <div className="mb-4">
          <p className="text-[#d6336c] text-xs font-black tracking-[1.6px] mb-1">MAP</p>
          <h2 className="text-2xl font-bold tracking-[-0.8px]">지도에서 식당 찾기</h2>
        </div>

        <input
          className="w-full h-[46px] px-4 rounded-full border border-[#f0b6c9] bg-white mb-[14px] text-sm focus:outline-none focus:ring-2 focus:ring-[#f0b6c9]"
          type="text"
          placeholder="식당명, 메뉴, 키워드 검색"
        />

        <MapSection places={places} />
      </section>
    </>
  );
}
