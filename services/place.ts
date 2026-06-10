import { prisma } from "@/lib/prisma"
import { unstable_cache } from "next/cache"
import { Place, PlaceInput } from "@/types/place"

type PrismaPlace = Awaited<ReturnType<typeof prisma.place.findUniqueOrThrow>>
const PLACE_CACHE_SECONDS = 300

function mapToPlace(p: PrismaPlace): Place {
  return {
    id: p.id,
    latitude: p.latitude,
    longitude: p.longitude,
    name: p.name,
    address: p.address ?? null,
    classification: p.classification,
    img_url: p.imgUrl ?? null,
    thumbnail_url: p.thumbnailUrl ?? null,
    ribbon_cardinal: p.ribbonCardinal,
    ribbon_deepred: p.ribbonDeeped,
    ribbon_pink: p.ribbonPink,
    desc_thumbnail: p.descThumbnail ?? null,
    desc_detail: p.descDetail ?? null,
  }
}

export const getPlaces = unstable_cache(
  async (): Promise<Place[]> => {
    const places = await prisma.place.findMany()
    return places.map(mapToPlace)
  },
  ["places"],
  { revalidate: PLACE_CACHE_SECONDS, tags: ["places"] }
)

export const getPlaceById = unstable_cache(
  async (id: string): Promise<Place | null> => {
    const place = await prisma.place.findUnique({ where: { id } })
    if (!place) return null
    return mapToPlace(place)
  },
  ["place-by-id"],
  { revalidate: PLACE_CACHE_SECONDS, tags: ["places"] }
)

export const getPlacesByNames = unstable_cache(
  async (names: string[]): Promise<Place[]> => {
    const places = await prisma.place.findMany({
      where: {
        name: {
          in: names,
        },
      },
    })

    return places.map(mapToPlace)
  },
  ["places-by-names"],
  { revalidate: PLACE_CACHE_SECONDS, tags: ["places"] }
)

function toPrismaData(input: PlaceInput) {
  return {
    name: input.name,
    address: input.address,
    classification: input.classification,
    latitude: input.latitude,
    longitude: input.longitude,
    imgUrl: input.img_url,
    thumbnailUrl: input.thumbnail_url,
    ribbonCardinal: input.ribbon_cardinal,
    ribbonDeeped: input.ribbon_deepred,
    ribbonPink: input.ribbon_pink,
    descThumbnail: input.desc_thumbnail,
    descDetail: input.desc_detail,
  }
}

// 관리자 화면용 — 수정 직후의 데이터가 바로 보여야 하므로 캐시를 거치지 않는다.
export async function getPlacesFresh(): Promise<Place[]> {
  const places = await prisma.place.findMany({ orderBy: { name: "asc" } })
  return places.map(mapToPlace)
}

export async function getPlaceByIdFresh(id: string): Promise<Place | null> {
  const place = await prisma.place.findUnique({ where: { id } })
  if (!place) return null
  return mapToPlace(place)
}

export async function createPlace(input: PlaceInput): Promise<Place> {
  const place = await prisma.place.create({ data: toPrismaData(input) })
  return mapToPlace(place)
}

export async function deletePlace(id: string): Promise<boolean> {
  const exists = await prisma.place.findUnique({ where: { id }, select: { id: true } })
  if (!exists) return false

  // 북마크·어워드 결과가 FK로 참조하므로 함께 지운다
  await prisma.$transaction([
    prisma.placeBookmark.deleteMany({ where: { placeId: id } }),
    prisma.awardRes.deleteMany({ where: { placeId: id } }),
    prisma.place.delete({ where: { id } }),
  ])
  return true
}

export async function updatePlace(id: string, input: PlaceInput): Promise<Place | null> {
  const exists = await prisma.place.findUnique({ where: { id }, select: { id: true } })
  if (!exists) return null
  const place = await prisma.place.update({ where: { id }, data: toPrismaData(input) })
  return mapToPlace(place)
}
