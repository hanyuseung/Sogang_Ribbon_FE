"use client";

import { useId, useState } from "react";
import { Search } from "lucide-react";
import { filterPlaces } from "@/lib/place-search";
import type { Place } from "@/types/place";

type PlaceOption = Pick<Place, "id" | "name" | "address" | "classification">;

function placeLabel(place: PlaceOption) {
  return [place.name, place.classification, place.address].filter(Boolean).join(" · ");
}

const inputClass = "w-full min-w-0 rounded-xl border border-[#f3d5df] bg-[#fff8fb] px-3 py-2.5 text-sm text-[#2b1b22] placeholder-[#c4a0b0] focus:outline-none focus:border-[#d6336c]";

export default function AdminPlaceSelect({ places, value, onChange, excludedIds }: {
  places: PlaceOption[];
  value: string;
  onChange: (id: string) => void;
  excludedIds: string[];
}) {
  const id = useId();
  const [query, setQuery] = useState("");
  const matches = filterPlaces(places, query);
  const selectedPlace = places.find((place) => place.id === value);
  const selectedOutsideResults = selectedPlace && !matches.some((place) => place.id === value);

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={`${id}-select`} className="text-xs font-bold text-[#2b1b22]">식당 *</label>
      <label htmlFor={`${id}-search`} className="sr-only">수상 식당 검색</label>
      <div className="relative">
        <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7a5965]" />
        <input
          id={`${id}-search`}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.nativeEvent.isComposing) event.preventDefault();
          }}
          placeholder="식당 이름, 주소, 분류 검색"
          aria-describedby={`${id}-status`}
          className={`${inputClass} pl-10`}
        />
      </div>
      <select
        id={`${id}-select`}
        required
        value={value}
        onChange={(event) => { onChange(event.target.value); setQuery(""); }}
        aria-describedby={`${id}-status`}
        className={inputClass}
      >
        <option value="">식당을 선택해 주세요</option>
        {value && !selectedPlace && <option value={value}>찾을 수 없는 식당 — 다시 선택해 주세요</option>}
        {selectedOutsideResults && <option value={selectedPlace.id}>{placeLabel(selectedPlace)} (현재 선택)</option>}
        {matches.map((place) => (
          <option key={place.id} value={place.id} disabled={excludedIds.includes(place.id)}>
            {placeLabel(place)}{excludedIds.includes(place.id) ? " (이미 등록됨)" : ""}
          </option>
        ))}
      </select>
      <p id={`${id}-status`} role="status" className="text-[11px] leading-relaxed text-[#7a5965]">
        {query.trim()
          ? matches.length === 0 ? "검색 결과가 없어요. 다른 검색어를 입력해 주세요." : `검색 결과 ${matches.length}개 · 위 목록에서 선택해 주세요.`
          : "검색하면 식당 목록을 좁힐 수 있어요. 같은 부문에 등록된 식당은 다시 선택할 수 없어요."}
      </p>
    </div>
  );
}
