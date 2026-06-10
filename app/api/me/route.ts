import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json(null, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { nickname: true, profileUrl: true, role: true },
  });
  if (!user) return NextResponse.json(null, { status: 404 });

  return NextResponse.json({
    nickname: user.nickname,
    profile_url: user.profileUrl,
    role: user.role,
  });
}
