"use client";

import { useState } from "react";
import { Place } from "@/types/place";
import MapPlaceholder from "@/components/MapPlaceholder";
import PlaceListWithSort, { RibbonFilter } from "@/components/PlaceListWithSort";

export default function MapSection({
  places,
  initialRibbonFilter,
}: {
  places: Place[];
  initialRibbonFilter?: RibbonFilter;
}) {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [ribbonFilter, setRibbonFilter] = useState<RibbonFilter>(initialRibbonFilter ?? null);

  const classificationFiltered = activeFilter
    ? places.filter((p) => p.classification === activeFilter)
    : places;

  const searchFiltered =
    searchQuery.trim() === ""
      ? classificationFiltered
      : classificationFiltered.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );

  const ribbonFiltered =
    ribbonFilter === "cardinal" ? searchFiltered.filter((p) => (p.ribbon_cardinal ?? 0) > 0) :
    ribbonFilter === "deepred"  ? searchFiltered.filter((p) => (p.ribbon_deepred  ?? 0) > 0) :
    ribbonFilter === "pink"     ? searchFiltered.filter((p) => (p.ribbon_pink     ?? 0) > 0) :
    searchFiltered;

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full h-[46px] px-4 rounded-full border border-[#f0b6c9] bg-white mb-[14px] text-sm focus:outline-none focus:ring-2 focus:ring-[#f0b6c9]"
        type="text"
        placeholder="식당명 검색"
      />
      <MapPlaceholder
        places={ribbonFiltered}
        selectedPlaceId={selectedPlaceId}
        onMarkerClick={setSelectedPlaceId}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <PlaceListWithSort
        places={ribbonFiltered}
        selectedPlaceId={selectedPlaceId}
        ribbonFilter={ribbonFilter}
        onRibbonFilterChange={setRibbonFilter}
      />
    </div>
  );
}
