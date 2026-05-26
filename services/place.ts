import { prisma } from "@/lib/prisma"
import { Place } from "@/types/place"

type PrismaPlace = Awaited<ReturnType<typeof prisma.place.findUniqueOrThrow>>

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

export async function getPlaces(): Promise<Place[]> {
  const places = await prisma.place.findMany()
  return places.map(mapToPlace)
}

export async function getPlaceById(id: string): Promise<Place | null> {
  const place = await prisma.place.findUnique({ where: { id } })
  if (!place) return null
  return mapToPlace(place)
}

export async function getPlacesByNames(names: string[]): Promise<Place[]> {
  const places = await prisma.place.findMany({
    where: {
      name: {
        in: names,
      },
    },
  })

  return places.map(mapToPlace)
}
