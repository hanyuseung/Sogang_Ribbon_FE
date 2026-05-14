"use client";

import { useState } from "react";
import { Place } from "@/types/place";
import MapPlaceholder from "@/components/MapPlaceholder";
import PlaceListWithSort from "@/components/PlaceListWithSort";

export default function MapSection({ places }: { places: Place[] }) {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredPlaces = activeFilter
    ? places.filter((p) => p.classification === activeFilter)
    : places;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <MapPlaceholder
        places={filteredPlaces}
        selectedPlaceId={selectedPlaceId}
        onMarkerClick={setSelectedPlaceId}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <PlaceListWithSort
        places={filteredPlaces}
        selectedPlaceId={selectedPlaceId}
      />
    </div>
  );
}
