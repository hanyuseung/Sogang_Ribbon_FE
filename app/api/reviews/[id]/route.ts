import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      place: { select: { id: true, name: true } },
      keywords: { include: { keyword: { select: { id: true, name: true } } } },
    },
  });

  if (!review) {
    return NextResponse.json({ error: "리뷰를 찾을 수 없어요." }, { status: 404 });
  }

  return NextResponse.json(review);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { content, keywordIds } = await req.json();

  const review = await prisma.review.findUnique({
    where: { id },
    include: { keywords: true },
  });

  if (!review) {
    return NextResponse.json({ error: "리뷰를 찾을 수 없어요." }, { status: 404 });
  }

  const oldKeywordIds = review.keywords.map((rk) => rk.keywordId);
  const newKeywordIds: string[] = keywordIds ?? [];

  const removed = oldKeywordIds.filter((k) => !newKeywordIds.includes(k));
  const added = newKeywordIds.filter((k) => !oldKeywordIds.includes(k));

  await prisma.review.update({ where: { id }, data: { content } });

  await prisma.reviewKeyword.deleteMany({ where: { reviewId: id } });
  if (newKeywordIds.length > 0) {
    await prisma.reviewKeyword.createMany({
      data: newKeywordIds.map((keywordId) => ({ reviewId: id, keywordId })),
    });
  }

  if (review.placeId) {
    for (const keywordId of removed) {
      const pk = await prisma.placeKeyword.findFirst({
        where: { placeId: review.placeId, keywordId },
      });
      if (pk && pk.count > 0) {
        await prisma.placeKeyword.update({
          where: { id: pk.id },
          data: { count: { decrement: 1 } },
        });
      }
    }
    for (const keywordId of added) {
      const pk = await prisma.placeKeyword.findFirst({
        where: { placeId: review.placeId, keywordId },
      });
      if (pk) {
        await prisma.placeKeyword.update({
          where: { id: pk.id },
          data: { count: { increment: 1 } },
        });
      } else {
        await prisma.placeKeyword.create({
          data: { placeId: review.placeId, keywordId, count: 1 },
        });
      }
    }
  }

  return NextResponse.json({ reviewId: id });
}
