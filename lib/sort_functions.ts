import { Place } from "@/types/place";

export const SOGANG_CENTER = { lat: 37.551, lng: 126.9394 };

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function sortByDistance(
  places: Place[],
  origin: { lat: number; lng: number }
): Place[] {
  return [...places].sort((a, b) => {
    const da =
      a.latitude != null && a.longitude != null
        ? haversine(origin.lat, origin.lng, a.latitude, a.longitude)
        : Infinity;
    const db =
      b.latitude != null && b.longitude != null
        ? haversine(origin.lat, origin.lng, b.latitude, b.longitude)
        : Infinity;
    return da - db;
  });
}

export function sortByRibbon(places: Place[]): Place[] {
  return [...places].sort(
    (a, b) =>
      ((b.ribbon_cardinal ?? 0) * 3 + (b.ribbon_deepred ?? 0) * 2 + (b.ribbon_pink ?? 0)) -
      ((a.ribbon_cardinal ?? 0) * 3 + (a.ribbon_deepred ?? 0) * 2 + (a.ribbon_pink ?? 0))
  );
}

export function sortByName(places: Place[]): Place[] {
  return [...places].sort((a, b) => a.name.localeCompare(b.name, "ko"));
}
