import { NextResponse } from "next/server"
import { getPlaces } from "@/services/place"

export async function GET() {
  const places = await getPlaces()
  return NextResponse.json(places)
}
