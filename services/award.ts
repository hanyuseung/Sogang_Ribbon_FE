import { prisma } from "@/lib/prisma"
import { AwardData } from "@/types/award"

export async function getAwards(): Promise<AwardData[]> {
  const awards = await prisma.award.findMany({
    orderBy: { dateStart: "desc" },
    include: {
      categories: {
        include: {
          results: {
            orderBy: { rank: "asc" },
            include: {
              place: {
                select: { id: true, name: true, classification: true, imgUrl: true },
              },
            },
          },
        },
      },
    },
  })

  return awards.map((award) => ({
    id: award.id,
    name: award.name,
    year: award.dateStart ? award.dateStart.getFullYear() : 0,
    categories: award.categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      results: cat.results.map((res) => ({
        id: res.id,
        rank: res.rank,
        count: Number(res.count),
        place: {
          id: res.place.id,
          name: res.place.name,
          classification: res.place.classification,
          img_url: res.place.imgUrl,
        },
      })),
    })),
  }))
}
