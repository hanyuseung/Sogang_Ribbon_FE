"use client";

import { useEffect, useRef, useState } from "react";
import { Place } from "@/types/place";
import PlaceCard from "@/components/PlaceCard";

type SortOption = "거리순" | "리본별" | "가나다순";

const SORT_OPTIONS: SortOption[] = ["거리순", "리본별", "가나다순"];
const KEYWORD_CHIPS = ["밥약하기 좋아요", "혼밥 가능", "가성비 좋아요", "분위기 좋아요"];

const ribbonScore = (p: Place) =>
  p.ribbon_cardinal * 3 + p.ribbon_deepred * 2 + p.ribbon_pink * 1;

interface Props {
  places: Place[];
  selectedPlaceId?: number | null;
}

export default function PlaceListWithSort({ places, selectedPlaceId }: Props) {
  const [sort, setSort] = useState<SortOption>("거리순");
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const sorted = [...places].sort((a, b) => {
    if (sort === "리본별") return ribbonScore(b) - ribbonScore(a);
    if (sort === "가나다순") return a.name.localeCompare(b.name, "ko");
    return 0;
  });

  useEffect(() => {
    if (selectedPlaceId == null) return;
    const el = cardRefs.current.get(selectedPlaceId);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedPlaceId]);

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
          <div
            key={place.id}
            ref={(el) => {
              if (el) cardRefs.current.set(place.id, el);
              else cardRefs.current.delete(place.id);
            }}
          >
            <PlaceCard place={place} isActive={place.id === selectedPlaceId} />
          </div>
        ))}
      </div>
    </>
  );
}
