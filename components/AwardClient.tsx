"use client"

import { useState } from "react"
import Link from "next/link"
import { AwardData, AwardCategory, AwardResult } from "@/types/award"

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
  const gold = category.results.find((r) => r.rank === 1)
  const silver = category.results.find((r) => r.rank === 2)
  const bronze = category.results.find((r) => r.rank === 3)

  return (
    <div className="bg-white rounded-[24px] shadow-[0_12px_28px_rgba(80,37,54,0.08)] p-[18px]">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">🏆</span>
        <h3 className="text-[18px] font-bold text-[#2b1b22]">
          {category.name ?? "카테고리"}
        </h3>
      </div>

      {gold && <GoldCard result={gold} />}

      {(silver || bronze) && (
        <div className="grid grid-cols-2 gap-3 mt-3">
          {silver && <SilverBronzeCard result={silver} medal="silver" />}
          {bronze && <SilverBronzeCard result={bronze} medal="bronze" />}
        </div>
      )}
    </div>
  )
}

function GoldCard({ result }: { result: AwardResult }) {
  return (
    <Link href={`/place/${result.place.id}`}>
      <div className="rounded-[20px] overflow-hidden bg-gradient-to-br from-[#fff3cd] to-[#ffe8a3] border border-[#f5d060] relative">
        <div className="h-[160px] w-full bg-gradient-to-br from-[#ffd6e5] to-[#fff1f6] flex items-center justify-center overflow-hidden">
          {result.place.img_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={result.place.img_url}
              alt={result.place.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl">🍽️</span>
          )}
        </div>

        <div className="absolute bottom-[72px] left-3">
          <span className="inline-flex items-center gap-1 px-[10px] py-1 rounded-full bg-[#d4a017] text-white text-[11px] font-black shadow-sm">
            🥇 1위
          </span>
        </div>

        <div className="px-4 py-3">
          <h4 className="text-[17px] font-bold text-[#2b1b22] truncate">
            {result.place.name}
          </h4>
          <div className="flex items-center justify-between mt-1">
            {result.place.classification && (
              <span className="text-[12px] text-[#6f4c59] bg-[#fff8fb] px-[9px] py-0.5 rounded-full border border-[#f0b6c9] font-black">
                {result.place.classification}
              </span>
            )}
            {result.description && (
              <span className="text-[12px] text-[#a08030] font-black ml-auto">
                {result.description}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

const MEDAL_CONFIG = {
  silver: {
    label: "🥈 2위",
    gradient: "from-[#f0f0f0] to-[#e0e0e0]",
    border: "border-[#c0c0c0]",
    badgeBg: "bg-[#a0a0a0]",
    countColor: "text-[#6a6a6a]",
  },
  bronze: {
    label: "🥉 3위",
    gradient: "from-[#f5e6d3] to-[#ead5bb]",
    border: "border-[#c49a6c]",
    badgeBg: "bg-[#a0522d]",
    countColor: "text-[#7a4a20]",
  },
} as const

function SilverBronzeCard({
  result,
  medal,
}: {
  result: AwardResult
  medal: "silver" | "bronze"
}) {
  const config = MEDAL_CONFIG[medal]

  return (
    <Link href={`/place/${result.place.id}`}>
      <div
        className={`rounded-[18px] overflow-hidden bg-gradient-to-br ${config.gradient} border ${config.border}`}
      >
        <div className="h-[100px] w-full bg-gradient-to-br from-[#ffd6e5] to-[#fff1f6] flex items-center justify-center overflow-hidden relative">
          {result.place.img_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={result.place.img_url}
              alt={result.place.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl">🍽️</span>
          )}
          <span
            className={`absolute top-2 left-2 inline-flex items-center gap-0.5 px-[8px] py-0.5 rounded-full ${config.badgeBg} text-white text-[10px] font-black`}
          >
            {config.label}
          </span>
        </div>

        <div className="px-3 py-2.5">
          <h4 className="text-[14px] font-bold text-[#2b1b22] truncate">
            {result.place.name}
          </h4>
          {result.place.classification && (
            <p className="text-[11px] text-[#6f4c59] truncate mt-0.5">
              {result.place.classification}
            </p>
          )}
          {result.description && (
            <p className={`text-[11px] font-black mt-1 ${config.countColor}`}>
              {result.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
