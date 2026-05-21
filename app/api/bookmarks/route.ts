import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

function getBearerToken(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice("Bearer ".length);
}

async function getAuthedUserId(req: Request) {
  const token = getBearerToken(req);
  if (!token || !supabaseUrl || !supabaseKey) return null;

  const supabase = createClient(supabaseUrl, supabaseKey);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) return null;
  return user.id;
}

export async function GET(req: Request) {
  const userId = await getAuthedUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get("placeId");

  if (placeId) {
    const bookmark = await prisma.placeBookmark.findUnique({
      where: { userId_placeId: { userId, placeId } },
    });
    return NextResponse.json({ bookmarked: !!bookmark });
  }

  const bookmarks = await prisma.placeBookmark.findMany({
    where: { userId },
    include: { place: true },
  });

  return NextResponse.json(bookmarks);
}

export async function POST(req: Request) {
  const userId = await getAuthedUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as { placeId?: unknown } | null;
  const placeId = typeof body?.placeId === "string" ? body.placeId : null;
  if (!placeId) return NextResponse.json({ error: "placeId is required" }, { status: 400 });

  const place = await prisma.place.findUnique({ where: { id: placeId }, select: { id: true } });
  if (!place) return NextResponse.json({ error: "Place not found" }, { status: 404 });

  const bookmark = await prisma.placeBookmark.upsert({
    where: { userId_placeId: { userId, placeId } },
    update: {},
    create: { userId, placeId },
  });

  return NextResponse.json({ bookmarked: true, bookmark });
}
