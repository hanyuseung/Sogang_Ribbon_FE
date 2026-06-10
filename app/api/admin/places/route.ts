import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getAdminUserId } from "@/lib/admin-auth";
import { parsePlaceInput } from "@/lib/place-input";
import { createPlace, getPlacesFresh } from "@/services/place";

export async function GET(req: Request) {
  const adminId = await getAdminUserId(req);
  if (!adminId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const places = await getPlacesFresh();
  return NextResponse.json(places);
}

export async function POST(req: Request) {
  const adminId = await getAdminUserId(req);
  if (!adminId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body: unknown = await req.json().catch(() => null);
  const input = parsePlaceInput(body);
  if (!input) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const place = await createPlace(input);
  revalidateTag("places", { expire: 0 });

  return NextResponse.json(place, { status: 201 });
}
