"use client"

import { useState } from "react"
import Link from "next/link"
import { AwardData, AwardCategory, AwardResult } from "@/types/award"
import { getSupabaseImageUrl } from "@/lib/supabase-image"

interface Props {
  awards: AwardData[]
}

export default function AwardClient({ awards }: Props) {
  const [selectedAwardId, setSelectedAwardId] = useState<string>(
    awards[0]?.id ?? ""
  )

  const selectedAward = awards.find((a) => a.id === selectedAwardId)

  if (awards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
        <span className="text-4xl">🏆</span>
        <p className="text-sm text-[#7a5965]">아직 어워드 결과가 없어요</p>
      </div>
    )
  }

  return (
    <div>
      <YearTabs
        awards={awards}
        selectedId={selectedAwardId}
        onSelect={setSelectedAwardId}
      />

      {selectedAward && (
        <div className="flex flex-col gap-6 mt-5">
          {selectedAward.categories.map((category) => (
            <CategorySection key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  )
}

function YearTabs({
  awards,
  selectedId,
  onSelect,
}: {
  awards: AwardData[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
      {awards.map((award) => (
        <button
          key={award.id}
          onClick={() => onSelect(award.id)}
          className={`flex-none px-[13px] py-[9px] rounded-full text-[13px] font-black border transition-colors ${
            selectedId === award.id
              ? "bg-[#d6336c] text-white border-[#d6336c]"
              : "bg-white text-[#d6336c] border-[#f0b6c9]"
          }`}
        >
          {award.dateStart ? `${award.dateStart.getFullYear()}년` : award.name}
        </button>
      ))}
    </div>
  )
}

function CategorySection({ category }: { category: AwardCategory }) {
  const rankedResults = [...category.results].sort(
    (a, b) => (a.rank ?? Number.MAX_SAFE_INTEGER) - (b.rank ?? Number.MAX_SAFE_INTEGER)
  )

  return (
    <section className="flex flex-col items-start gap-3 rounded-[24px] bg-white p-[18px] shadow-[0_12px_28px_rgba(80,37,54,0.08)]">
      <div className="flex items-center gap-2 px-1">
        <span className="text-base">🏆</span>
        <h3 className="text-[18px] font-bold text-[#2b1b22]">
          {category.name ?? "카테고리"}
        </h3>
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        {rankedResults.map((result) => (
          <AwardPlaceCard key={result.id} result={result} />
        ))}
      </div>
    </section>
  )
}

function AwardPlaceCard({ result }: { result: AwardResult }) {
  const imageUrl = getSupabaseImageUrl(result.place.img_url, {
    width: 720,
    height: 320,
    quality: 65,
  })

  return (
    <Link
      href={`/place/${result.place.id}`}
      className="relative flex h-[340px] w-full max-w-[356px] flex-none flex-col items-start overflow-hidden rounded-[20px] border border-[#d6336c] bg-gradient-to-br from-[#ffd6e5] to-[#fff6fa] pt-1 transition-opacity active:opacity-80"
    >
      <div className="h-[160px] w-full flex-none bg-gradient-to-br from-[#ffd6e5] to-[#fff1f6] flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={result.place.name}
            className="block h-full w-full object-cover"
          />
        ) : (
          <span className="text-4xl">🍽️</span>
        )}
      </div>

      {result.place.classification && (
        <span className="absolute left-4 top-[148px] inline-flex h-[25px] items-center justify-center rounded-full bg-[#d6336c] px-[10px] py-1 text-[11px] font-black leading-4 text-white shadow-sm">
          {result.place.classification}
        </span>
      )}

      {result.rank && (
        <span className="absolute right-4 top-[148px] inline-flex h-[25px] items-center justify-center rounded-full bg-white px-[10px] py-1 text-[11px] font-black leading-4 text-[#d6336c] shadow-sm">
          {result.rank}위
        </span>
      )}

      <div className="flex w-full flex-col items-start gap-1 px-4 py-3">
        <h4 className="w-full truncate text-[15.9px] font-bold leading-[26px] text-[#2b1b22]">
          {result.place.name}
        </h4>

        {result.place.desc_thumbnail && (
          <span className="w-full truncate text-[11.4px] font-black leading-[18px] text-black">
            {result.place.desc_thumbnail}
          </span>
        )}
      </div>

      {result.place.desc_detail && (
        <div className="mx-[15px] h-[89px] w-[calc(100%-30px)] overflow-hidden rounded-[20px] bg-white px-4 py-3">
          <p className="line-clamp-4 text-[11.4px] font-light leading-[18px] text-black">
            {result.place.desc_detail}
          </p>
        </div>
      )}
    </Link>
  )
}
