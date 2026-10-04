import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminUserId } from "@/lib/admin-auth";
import { parseAwardInput } from "@/lib/award-input";
import { awardApiError } from "@/lib/award-api-error";
import { getAdminAwards, saveAward } from "@/services/admin-award";

export async function GET(req: Request) {
  try {
    if (!await getAdminUserId(req)) return NextResponse.json({ error: "관리자 권한이 필요해요." }, { status: 403 });
    return NextResponse.json(await getAdminAwards());
  } catch (error) {
    return awardApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    if (!await getAdminUserId(req)) return NextResponse.json({ error: "관리자 권한이 필요해요." }, { status: 403 });
    const parsed = parseAwardInput(await req.json().catch(() => null));
    if (parsed.error !== undefined) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const award = await saveAward(parsed.input);
    revalidatePath("/award");
    return NextResponse.json(award, { status: 201 });
  } catch (error) {
    return awardApiError(error);
  }
}
