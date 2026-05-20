import GachaClient from "@/components/GachaClient";
import { getPlaces } from "@/services/place";

export default async function GachaPage() {
  const places = await getPlaces();

  return (
    <>
      <section className="px-[18px] pt-6 pb-8">
        <div className="mb-4">
          <p className="text-[#d6336c] text-xs font-black tracking-[1.6px] mb-1">
            TODAY...
          </p>
          <h2 className="text-2xl font-bold tracking-[-0.8px]">
            오늘 뭐먹지
          </h2>
        </div>

        <GachaClient places={places} />
      </section>
    </>
  );
}
