import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getAdminUserId } from "@/lib/admin-auth";
import { parsePlaceInput } from "@/lib/place-input";
import { deletePlace, getPlaceByIdFresh, updatePlace } from "@/services/place";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminUserId(req);
  if (!adminId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const place = await getPlaceByIdFresh(id);
  if (!place) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(place);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminUserId(req);
  if (!adminId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body: unknown = await req.json().catch(() => null);
  const input = parsePlaceInput(body);
  if (!input) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const { id } = await params;
  const place = await updatePlace(id, input);
  if (!place) return NextResponse.json({ error: "Not found" }, { status: 404 });

  revalidateTag("places", { expire: 0 });

  return NextResponse.json(place);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminUserId(req);
  if (!adminId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const deleted = await deletePlace(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

  revalidateTag("places", { expire: 0 });

  return NextResponse.json({ deleted: true });
}
