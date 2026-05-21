"use client";

import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";
import { Place } from "@/types/place";
import PlaceCard from "@/components/PlaceCard";
import { sortByDistance, sortByRibbon, sortByName, SOGANG_CENTER } from "@/lib/sort_functions";

type SortOption = "거리순" | "리본별" | "가나다순";
export type RibbonFilter = "cardinal" | "deepred" | "pink" | null;

const SORT_OPTIONS: SortOption[] = ["거리순", "리본별", "가나다순"];

const RIBBON_FILTERS: { value: RibbonFilter; label: string }[] = [
  { value: null,       label: "전체" },
  { value: "cardinal", label: "카디널" },
  { value: "deepred",  label: "딥레드" },
  { value: "pink",     label: "핑크" },
];

interface Props {
  places: Place[];
  selectedPlaceId?: string | null;
  ribbonFilter: RibbonFilter;
  onRibbonFilterChange: (f: RibbonFilter) => void;
  bookmarkFilter: boolean;
  onBookmarkFilterChange: (active: boolean) => void;
  canUseBookmarkFilter: boolean;
}

export default function PlaceListWithSort({
  places,
  selectedPlaceId,
  ribbonFilter,
  onRibbonFilterChange,
  bookmarkFilter,
  onBookmarkFilterChange,
  canUseBookmarkFilter,
}: Props) {
  const [sort, setSort] = useState<SortOption>("거리순");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  }, []);

  useEffect(() => {
    if (selectedPlaceId == null) return;
    const el = cardRefs.current.get(selectedPlaceId);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedPlaceId]);

  const sorted =
    sort === "리본별"   ? sortByRibbon(places) :
    sort === "가나다순" ? sortByName(places) :
                         sortByDistance(places, userLocation ?? SOGANG_CENTER);

  return (
    <div className="pb-8">
      {/* 정렬 */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
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
      </div>

      {/* 리본 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-[10px] no-scrollbar">
        {RIBBON_FILTERS.map(({ value, label }) => (
          <button
            key={label}
            onClick={() => onRibbonFilterChange(value)}
            className={`flex-none px-[13px] py-[9px] rounded-full text-[13px] font-black border transition-colors ${
              ribbonFilter === value
                ? "bg-[#d6336c] text-white border-[#d6336c]"
                : "bg-white text-[#d6336c] border-[#f0b6c9]"
            }`}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onBookmarkFilterChange(!bookmarkFilter)}
          disabled={!canUseBookmarkFilter}
          className={`flex-none px-[13px] py-[9px] rounded-full text-[13px] font-black border transition-colors inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${
            bookmarkFilter
              ? "bg-[#d6336c] text-white border-[#d6336c]"
              : "bg-white text-[#d6336c] border-[#f0b6c9]"
          }`}
        >
          <Heart className="size-3.5" fill={bookmarkFilter ? "currentColor" : "none"} />
          북마크
        </button>
      </div>

      <div className="flex flex-col gap-3 w-full px-4">
        {sorted.map((place) => (
          <div
            key={place.id}
            ref={(el) => {
              if (el) cardRefs.current.set(place.id, el);
              else cardRefs.current.delete(place.id);
            }}
            className="w-full"
          >
            <PlaceCard place={place} isActive={place.id === selectedPlaceId} />
          </div>
        ))}
      </div>
    </div>
  );
}
