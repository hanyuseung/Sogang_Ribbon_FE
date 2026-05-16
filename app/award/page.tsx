import { getAwards } from "@/services/award"
import AwardClient from "@/components/AwardClient"

export default async function AwardPage() {
  const awards = await getAwards()

  return (
    <section className="px-[18px] pt-6 pb-8">
      <div className="mb-4">
        <p className="text-[#d6336c] text-xs font-black tracking-[1.6px] mb-1">AWARD</p>
        <h2 className="text-2xl font-bold tracking-[-0.8px]">서강리본 어워드</h2>
      </div>
      <AwardClient awards={awards} />
    </section>
  )
}
