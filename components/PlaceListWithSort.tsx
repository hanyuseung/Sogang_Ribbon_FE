"use client";

import { useState } from "react";
import { Place } from "@/types/place";
import PlaceCard from "@/components/PlaceCard";

type SortOption = "거리순" | "리본별" | "가나다순";

const SORT_OPTIONS: SortOption[] = ["거리순", "리본별", "가나다순"];
const KEYWORD_CHIPS = ["밥약하기 좋아요", "혼밥 가능", "가성비 좋아요", "분위기 좋아요"];

const ribbonScore = (p: Place) =>
  p.ribbon_cardinal * 3 + p.ribbon_deepred * 2 + p.ribbon_pink * 1;

export default function PlaceListWithSort({ places }: { places: Place[] }) {
  const [sort, setSort] = useState<SortOption>("거리순");

  const sorted = [...places].sort((a, b) => {
    if (sort === "리본별") return ribbonScore(b) - ribbonScore(a);
    if (sort === "가나다순") return a.name.localeCompare(b.name, "ko");
    return 0;
  });

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-[10px] no-scrollbar">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => setSort(option)}
            className={`flex-none px-[13px] py-[9px] rounded-full text-[13px] font-black border transition-colors ${
              sort === option
                ? "bg-[#d6336c] text-white border-[#d6336c]"
                : "bg-white text-[#d6336c] border-[#f0b6c9]"
            }`}
          >
            {option}
          </button>
        ))}
        {KEYWORD_CHIPS.map((kw) => (
          <button
            key={kw}
            className="flex-none px-[13px] py-[9px] rounded-full text-[13px] font-black bg-white text-[#d6336c] border border-[#f0b6c9]"
          >
            {kw}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {sorted.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    </>
  );
}
