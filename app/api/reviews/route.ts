import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getReviewsByUserId } from "@/services/review";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId가 필요해요." }, { status: 400 });
  }
  const reviews = await getReviewsByUserId(userId);
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const { placeId, content, keywordIds, userId } = await req.json();

  if (!userId || !placeId) {
    return NextResponse.json({ error: "필수 항목이 누락되었어요." }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      content,
      rating: 0,
      placeId,
      userId,
      isDeleted: false,
    },
  });

  if (keywordIds && keywordIds.length > 0) {
    await prisma.reviewKeyword.createMany({
      data: (keywordIds as string[]).map((keywordId) => ({
        reviewId: review.id,
        keywordId,
      })),
    });

    for (const keywordId of keywordIds as string[]) {
      const pk = await prisma.placeKeyword.findFirst({
        where: { placeId, keywordId },
      });
      if (pk) {
        await prisma.placeKeyword.update({
          where: { id: pk.id },
          data: { count: { increment: 1 } },
        });
      } else {
        await prisma.placeKeyword.create({
          data: { placeId, keywordId, count: 1 },
        });
      }
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { reviewCnt: { increment: 1 } },
  });

  return NextResponse.json({ reviewId: review.id });
}
