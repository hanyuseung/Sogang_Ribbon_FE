"use client";

import { useState } from "react";
import { Place } from "@/types/place";
import PlaceCard from "@/components/PlaceCard";

type SortOption = "거리순" | "리본순" | "가나다순";

const ribbonScore = (p: Place) =>
  p.ribbon_cardinal * 3 + p.ribbon_deepred * 2 + p.ribbon_pink * 1;

export default function PlaceListWithSort({ places }: { places: Place[] }) {
  const [sort, setSort] = useState<SortOption>("거리순");

  const sorted = [...places].sort((a, b) => {
    if (sort === "리본순") return ribbonScore(b) - ribbonScore(a);
    if (sort === "가나다순") return a.name.localeCompare(b.name, "ko");
    return 0; // 거리순: 위치 권한 구현 전 원본 순서 유지
  });

  return (
    <>
      <div className="flex items-center justify-between mt-5 mb-3">
        <p className="text-sm text-zinc-500">총 {places.length}개</p>
        <div className="flex gap-1">
          {(["거리순", "리본순", "가나다순"] as SortOption[]).map((option) => (
            <button
              key={option}
              onClick={() => setSort(option)}
              className={`text-sm px-3 py-1.5 rounded-full font-medium transition-colors ${
                sort === option
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-500 hover:bg-zinc-100"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {sorted.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    </>
  );
}
