import { prisma } from "@/lib/prisma"
import { Place } from "@/types/place"

type PrismaPlace = Awaited<ReturnType<typeof prisma.place.findUniqueOrThrow>> & {
  keywords: Array<{
    count: bigint
    keyword: { name: string | null }
  }>
}

function mapToPlace(p: PrismaPlace): Place {
  return {
    id: p.id,
    latitude: p.latitude,
    longitude: p.longitude,
    name: p.name,
    classification: p.classification,
    img_url: p.imgUrl ?? null,
    ribbon_cardinal: p.ribbonCardinal,
    ribbon_deepred: p.ribbonDeeped,
    ribbon_pink: p.ribbonPink,
    keywords: p.keywords
      .filter((pk) => pk.keyword.name)
      .map((pk) => ({ name: pk.keyword.name!, count: Number(pk.count) })),
  }
}

const keywordsInclude = {
  include: { keyword: true },
  orderBy: { count: "desc" as const },
}

export async function getPlaces(): Promise<Place[]> {
  const places = await prisma.place.findMany({
    include: { keywords: keywordsInclude },
  })
  return places.map(mapToPlace)
}

export async function getPlaceById(id: string): Promise<Place | null> {
  const place = await prisma.place.findUnique({
    where: { id },
    include: { keywords: keywordsInclude },
  })
  if (!place) return null
  return mapToPlace(place)
}
