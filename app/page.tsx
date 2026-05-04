import Header from "@/components/Header";
import MapPlaceholder from "@/components/MapPlaceholder";
import PlaceListWithSort from "@/components/PlaceListWithSort";
import placesData from "@/lib/place_dummy.json";
import { Place } from "@/types/place";

export default function HomePage() {
  const places = placesData as Place[];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-screen-sm mx-auto px-4 pt-5 pb-16">
        <MapPlaceholder />
        <PlaceListWithSort places={places} />
      </main>
    </div>
  );
}
