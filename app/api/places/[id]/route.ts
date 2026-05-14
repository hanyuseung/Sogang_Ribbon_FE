import { NextResponse } from "next/server"
import { getPlaceById } from "@/services/place"

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const place = await getPlaceById(id)
  if (!place) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(place)
}
