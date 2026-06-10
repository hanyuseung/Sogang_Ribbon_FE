import { PlaceInput } from "@/types/place";

function optionalString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function optionalNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/** API 요청 본문을 검증해 PlaceInput으로 변환한다. name이 없으면 null. */
export function parsePlaceInput(body: unknown): PlaceInput | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;

  const name = optionalString(b.name);
  if (!name) return null;

  return {
    name,
    address: optionalString(b.address),
    classification: optionalString(b.classification),
    latitude: optionalNumber(b.latitude),
    longitude: optionalNumber(b.longitude),
    img_url: optionalString(b.img_url),
    thumbnail_url: optionalString(b.thumbnail_url),
    ribbon_cardinal: optionalNumber(b.ribbon_cardinal),
    ribbon_deepred: optionalNumber(b.ribbon_deepred),
    ribbon_pink: optionalNumber(b.ribbon_pink),
    desc_thumbnail: optionalString(b.desc_thumbnail),
    desc_detail: optionalString(b.desc_detail),
  };
}
