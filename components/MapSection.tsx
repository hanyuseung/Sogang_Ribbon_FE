"use client";

import { useState } from "react";
import { Place } from "@/types/place";
import MapPlaceholder from "@/components/MapPlaceholder";
import PlaceListWithSort from "@/components/PlaceListWithSort";

export default function MapSection({ places }: { places: Place[] }) {
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <MapPlaceholder
        places={places}
        selectedPlaceId={selectedPlaceId}
        onMarkerClick={setSelectedPlaceId}
      />
      <PlaceListWithSort
        places={places}
        selectedPlaceId={selectedPlaceId}
      />
    </div>
  );
}
