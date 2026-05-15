import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const keywords = await prisma.keyword.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(keywords);
}
