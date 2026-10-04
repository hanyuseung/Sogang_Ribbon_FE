import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminUserId } from "@/lib/admin-auth";
import { parseAwardInput } from "@/lib/award-input";
import { awardApiError } from "@/lib/award-api-error";
import { getAdminAward, saveAward } from "@/services/admin-award";

type Context = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Context) {
  try {
    if (!await getAdminUserId(req)) return NextResponse.json({ error: "관리자 권한이 필요해요." }, { status: 403 });
    const { id } = await params;
    const award = await getAdminAward(id);
    if (!award) return NextResponse.json({ error: "어워드를 찾을 수 없어요." }, { status: 404 });
    return NextResponse.json(award);
  } catch (error) {
    return awardApiError(error);
  }
}

export async function PUT(req: Request, { params }: Context) {
  try {
    if (!await getAdminUserId(req)) return NextResponse.json({ error: "관리자 권한이 필요해요." }, { status: 403 });
    const parsed = parseAwardInput(await req.json().catch(() => null));
    if (parsed.error !== undefined) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const { id } = await params;
    const award = await saveAward(parsed.input, id);
    revalidatePath("/award");
    return NextResponse.json(award);
  } catch (error) {
    return awardApiError(error);
  }
}
