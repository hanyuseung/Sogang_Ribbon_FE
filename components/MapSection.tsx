"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Place } from "@/types/place";
import MapPlaceholder, { MAP_TYPE_FILTERS } from "@/components/MapPlaceholder";
import PlaceListWithSort, { RibbonFilter } from "@/components/PlaceListWithSort";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

type BookmarkResponse = {
  placeId: string;
};

const VALID_RIBBON_FILTERS = new Set(["cardinal", "deepred", "pink"]);
const VALID_MAP_TYPE_FILTERS = new Set<string>(MAP_TYPE_FILTERS);

function parseRibbonFilter(value: string | null): RibbonFilter {
  return value && VALID_RIBBON_FILTERS.has(value) ? (value as RibbonFilter) : null;
}

function parseMapTypeFilter(value: string | null) {
  return value && VALID_MAP_TYPE_FILTERS.has(value) ? value : null;
}

export default function MapSection({
  places,
}: {
  places: Place[];
}) {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const userId = user?.id;
  const [bookmarkFilter, setBookmarkFilter] = useState(false);
  const [bookmarkedPlaceIds, setBookmarkedPlaceIds] = useState<Set<string>>(new Set());
  const activeFilter = parseMapTypeFilter(searchParams.get("type"));
  const searchQuery = searchParams.get("search") ?? "";
  const ribbonFilter = parseRibbonFilter(searchParams.get("ribbon"));
  const selectedPlaceParam = searchParams.get("place");
  const selectedPlaceId =
    selectedPlaceParam && places.some((place) => place.id === selectedPlaceParam)
      ? selectedPlaceParam
      : null;

  function updateMapUrl(next: {
    type?: string | null;
    ribbon?: RibbonFilter;
    search?: string;
    place?: string | null;
  }) {
    const params = new URLSearchParams(window.location.search);
    const nextType = next.type === undefined ? activeFilter : next.type;
    const nextRibbon = next.ribbon === undefined ? ribbonFilter : next.ribbon;
    const nextSearch = next.search ?? searchQuery;
    const nextPlace = next.place === undefined ? selectedPlaceId : next.place;

    if (nextType) params.set("type", nextType);
    else params.delete("type");

    if (nextRibbon) params.set("ribbon", nextRibbon);
    else params.delete("ribbon");

    if (nextSearch.trim()) params.set("search", nextSearch.trim());
    else params.delete("search");

    if (nextPlace) params.set("place", nextPlace);
    else params.delete("place");

    const query = params.toString();
    window.history.replaceState(null, "", query ? `/map?${query}` : "/map");
  }

  function handleSearchChange(value: string) {
    updateMapUrl({ search: value });
  }

  function handleRibbonFilterChange(filter: RibbonFilter) {
    updateMapUrl({ ribbon: filter });
  }

  function handlePlaceSelect(id: string) {
    updateMapUrl({ place: id });
  }

  function handleTypeFilterChange(filter: string | null) {
    updateMapUrl({ type: filter });
  }

  useEffect(() => {
    let ignore = false;

    async function fetchBookmarks() {
      if (!userId) {
        setBookmarkedPlaceIds(new Set());
        setBookmarkFilter(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch("/api/bookmarks", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok || ignore) return;

      const bookmarks = (await res.json()) as BookmarkResponse[];
      setBookmarkedPlaceIds(new Set(bookmarks.map((bookmark) => bookmark.placeId)));
    }

    fetchBookmarks();

    return () => {
      ignore = true;
    };
  }, [userId]);

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

  const bookmarkFiltered = bookmarkFilter
    ? ribbonFiltered.filter((p) => bookmarkedPlaceIds.has(p.id))
    : ribbonFiltered;

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-full h-[46px] px-4 rounded-full border border-[#f0b6c9] bg-white mb-[14px] text-sm focus:outline-none focus:ring-2 focus:ring-[#f0b6c9]"
        type="text"
        placeholder="식당명 검색"
      />
      <MapPlaceholder
        places={bookmarkFiltered}
        selectedPlaceId={selectedPlaceId}
        onMarkerClick={handlePlaceSelect}
        activeFilter={activeFilter}
        onFilterChange={handleTypeFilterChange}
      />
      <PlaceListWithSort
        places={bookmarkFiltered}
        selectedPlaceId={selectedPlaceId}
        ribbonFilter={ribbonFilter}
        onRibbonFilterChange={handleRibbonFilterChange}
        bookmarkFilter={bookmarkFilter}
        onBookmarkFilterChange={setBookmarkFilter}
        canUseBookmarkFilter={!!user}
        onPlaceSelect={handlePlaceSelect}
      />
    </div>
  );
}
