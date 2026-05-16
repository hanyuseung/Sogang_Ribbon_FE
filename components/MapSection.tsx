"use client";

import { useState, useEffect } from "react";
import { Place } from "@/types/place";
import { DbKeyword } from "@/types/keyword";
import MapPlaceholder from "@/components/MapPlaceholder";
import PlaceListWithSort from "@/components/PlaceListWithSort";

export default function MapSection({ places }: { places: Place[] }) {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [keywords, setKeywords] = useState<DbKeyword[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  }, []);

  useEffect(() => {
    fetch("/api/keywords")
      .then((r) => r.json())
      .then(setKeywords)
      .catch(() => {});
  }, []);

  const toggleKeyword = (name: string) => {
    setSelectedKeywords((prev) =>
      prev.includes(name) ? prev.filter((k) => k !== name) : [...prev, name]
    );
  };

  const classificationFiltered = activeFilter
    ? places.filter((p) => p.classification === activeFilter)
    : places;

  const keywordFiltered =
    selectedKeywords.length === 0
      ? classificationFiltered
      : classificationFiltered.filter((p) =>
          selectedKeywords.every((kw) => p.keywords?.some((pk) => pk.name === kw))
        );

  const searchFiltered =
    searchQuery.trim() === ""
      ? keywordFiltered
      : keywordFiltered.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );

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
        places={searchFiltered}
        selectedPlaceId={selectedPlaceId}
        onMarkerClick={setSelectedPlaceId}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <PlaceListWithSort
        places={searchFiltered}
        selectedPlaceId={selectedPlaceId}
        userLocation={userLocation}
        keywords={keywords}
        selectedKeywords={selectedKeywords}
        onToggleKeyword={toggleKeyword}
      />
    </div>
  );
}
