import MapLoadingFrame from "@/components/MapLoadingFrame";

export default function Loading() {
  return (
    <section className="px-[18px] pt-6">
      <div className="mb-4">
        <p className="mb-1 text-xs font-black tracking-[1.6px] text-[#d6336c]">MAP</p>
        <h2 className="text-2xl font-bold tracking-[-0.8px]">지도에서 식당 찾기</h2>
      </div>

      <MapLoadingFrame />
    </section>
  );
}
