import type { Place } from "@/types/place";

type SearchablePlace = Pick<Place, "name" | "address" | "classification">;

function normalize(value: string) {
  return value.normalize("NFKC").toLowerCase().replace(/\s+/g, "");
}

export function filterPlaces<T extends SearchablePlace>(places: T[], query: string): T[] {
  const search = normalize(query);
  if (!search) return places;
  return places.filter((place) =>
    [place.name, place.address, place.classification].some((value) => value && normalize(value).includes(search))
  );
}
