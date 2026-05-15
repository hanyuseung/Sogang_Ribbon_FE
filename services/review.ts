import { prisma } from "@/lib/prisma";

export async function getReviewsByUserId(userId: string) {
  return prisma.review.findMany({
    where: { userId, isDeleted: false },
    include: {
      place: { select: { id: true, name: true } },
      keywords: {
        include: { keyword: { select: { id: true, name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export type UserReview = Awaited<
  ReturnType<typeof getReviewsByUserId>
>[number];

export async function getReviewsByPlaceId(placeId: string) {
  return prisma.review.findMany({
    where: { placeId, isDeleted: false },
    include: {
      user: { select: { id: true, nickname: true, profileUrl: true } },
      keywords: {
        include: { keyword: { select: { id: true, name: true } } },
      },
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export type ReviewWithRelations = Awaited<
  ReturnType<typeof getReviewsByPlaceId>
>[number];
