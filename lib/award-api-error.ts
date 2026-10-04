import { NextResponse } from "next/server";
import { AwardSaveError } from "@/services/admin-award";

export function awardApiError(error: unknown) {
  if (error instanceof AwardSaveError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (typeof error === "object" && error !== null && "code" in error && (error.code === "P2003" || error.code === "P2025")) {
    return NextResponse.json({ error: "어워드 또는 식당 정보가 변경됐어요. 새로고침 후 다시 시도해 주세요." }, { status: 409 });
  }
  return NextResponse.json({ error: "어워드를 처리하지 못했어요. 잠시 후 다시 시도해 주세요." }, { status: 500 });
}
