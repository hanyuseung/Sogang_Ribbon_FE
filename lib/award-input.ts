import type { AwardCategoryInput, AwardInput, AwardResultInput } from "@/types/award";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function parseAwardInput(body: unknown): { input: AwardInput; error?: never } | { error: string; input?: never } {
  if (!isRecord(body) || typeof body.name !== "string" || !body.name.trim()) {
    return { error: "어워드 이름을 입력해 주세요." };
  }
  const dateStart = body.dateStart;
  if (dateStart !== null) {
    if (typeof dateStart !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateStart)) {
      return { error: "올바른 시작일을 입력해 주세요." };
    }
    const date = new Date(`${dateStart}T00:00:00.000Z`);
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== dateStart) {
      return { error: "올바른 시작일을 입력해 주세요." };
    }
  }
  if (!Array.isArray(body.categories)) return { error: "수상 부문을 확인해 주세요." };

  const categoryIds = new Set<string>();
  const resultIds = new Set<string>();
  const categories: AwardCategoryInput[] = [];
  for (const category of body.categories) {
    if (!isRecord(category) || !Array.isArray(category.results) || (category.name !== null && typeof category.name !== "string")) {
      return { error: "수상 부문 정보를 확인해 주세요." };
    }
    if (category.id !== undefined) {
      if (typeof category.id !== "string" || !category.id.trim() || categoryIds.has(category.id)) {
        return { error: "수상 부문 정보가 중복되거나 올바르지 않아요." };
      }
      categoryIds.add(category.id);
    }
    const places = new Set<string>();
    const results: AwardResultInput[] = [];
    for (const result of category.results) {
      if (!isRecord(result) || typeof result.placeId !== "string" || !result.placeId.trim()) {
        return { error: "수상 식당을 선택해 주세요." };
      }
      const placeId = result.placeId.trim();
      if (places.has(placeId)) return { error: "같은 부문에 동일한 식당을 두 번 등록할 수 없어요." };
      places.add(placeId);
      if (result.id !== undefined) {
        if (typeof result.id !== "string" || !result.id.trim() || resultIds.has(result.id)) {
          return { error: "수상 결과 정보가 중복되거나 올바르지 않아요." };
        }
        resultIds.add(result.id);
      }
      if (result.rank !== null && (typeof result.rank !== "number" || !Number.isInteger(result.rank) || result.rank < 1 || result.rank > 2147483647)) {
        return { error: "순위는 1 이상의 정수로 입력하거나 비워 주세요." };
      }
      if (result.description !== null && typeof result.description !== "string") {
        return { error: "수상 설명을 확인해 주세요." };
      }
      results.push({ id: result.id, placeId, rank: result.rank, description: optionalText(result.description) });
    }
    categories.push({ id: category.id, name: optionalText(category.name), results });
  }
  return { input: { name: body.name.trim(), dateStart, categories } };
}
