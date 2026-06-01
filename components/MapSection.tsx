"use client";

import { useEffect, useState } from "react";
import { Place } from "@/types/place";
import MapPlaceholder from "@/components/MapPlaceholder";
import PlaceListWithSort, { RibbonFilter } from "@/components/PlaceListWithSort";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

type BookmarkResponse = {
  placeId: string;
};

export default function MapSection({
  places,
  initialRibbonFilter,
  initialSearchQuery,
  initialSelectedPlaceId,
}: {
  places: Place[];
  initialRibbonFilter?: RibbonFilter;
  initialSearchQuery?: string;
  initialSelectedPlaceId?: string | null;
}) {
  const { user } = useAuth();
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(initialSelectedPlaceId ?? null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery ?? "");
  const [ribbonFilter, setRibbonFilter] = useState<RibbonFilter>(initialRibbonFilter ?? null);
  const [bookmarkFilter, setBookmarkFilter] = useState(false);
  const [bookmarkedPlaceIds, setBookmarkedPlaceIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let ignore = false;

    async function fetchBookmarks() {
      if (!user) {
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
  }, [user]);

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
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full h-[46px] px-4 rounded-full border border-[#f0b6c9] bg-white mb-[14px] text-sm focus:outline-none focus:ring-2 focus:ring-[#f0b6c9]"
        type="text"
        placeholder="식당명 검색"
      />
      <MapPlaceholder
        places={bookmarkFiltered}
        selectedPlaceId={selectedPlaceId}
        onMarkerClick={setSelectedPlaceId}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <PlaceListWithSort
        places={bookmarkFiltered}
        selectedPlaceId={selectedPlaceId}
        ribbonFilter={ribbonFilter}
        onRibbonFilterChange={setRibbonFilter}
        bookmarkFilter={bookmarkFilter}
        onBookmarkFilterChange={setBookmarkFilter}
        canUseBookmarkFilter={!!user}
        onPlaceSelect={setSelectedPlaceId}
      />
    </div>
  );
}
