import { prisma } from "@/lib/prisma";
import type { AdminAward, AdminAwardSummary, AwardInput } from "@/types/award";

export class AwardSaveError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function getAdminAwards(): Promise<AdminAwardSummary[]> {
  const awards = await prisma.award.findMany({
    orderBy: [{ dateStart: "desc" }, { name: "asc" }],
    include: { categories: { select: { _count: { select: { results: true } } } } },
  });
  return awards.map((award) => ({
    id: award.id,
    name: award.name,
    dateStart: award.dateStart?.toISOString().slice(0, 10) ?? null,
    categoryCount: award.categories.length,
    resultCount: award.categories.reduce((sum, category) => sum + category._count.results, 0),
  }));
}

export async function getAdminAward(id: string): Promise<AdminAward | null> {
  const award = await prisma.award.findUnique({
    where: { id },
    include: { categories: { orderBy: { id: "asc" }, include: { results: { orderBy: [{ rank: "asc" }, { id: "asc" }] } } } },
  });
  if (!award) return null;
  return {
    id: award.id,
    name: award.name,
    dateStart: award.dateStart?.toISOString().slice(0, 10) ?? null,
    categories: award.categories.map((category) => ({
      id: category.id,
      name: category.name,
      results: category.results.map((result) => ({
        id: result.id,
        placeId: result.placeId,
        rank: result.rank,
        description: result.description,
      })),
    })),
  };
}

export async function saveAward(input: AwardInput, id?: string): Promise<{ id: string }> {
  return prisma.$transaction(async (tx) => {
    const existing = id ? await tx.award.findUnique({
      where: { id },
      include: { categories: { include: { results: true } } },
    }) : null;
    if (id && !existing) throw new AwardSaveError("어워드를 찾을 수 없어요.", 404);

    // 기존 부문과 결과가 이 어워드에 속하는지 먼저 확인한다.
    for (const category of input.categories) {
      const current = existing?.categories.find((item) => item.id === category.id);
      if (category.id && !current) throw new AwardSaveError("수상 부문 정보가 변경됐어요. 새로고침 후 다시 시도해 주세요.", 409);
      for (const result of category.results) {
        if (result.id && !current?.results.some((item) => item.id === result.id)) {
          throw new AwardSaveError("수상 결과 정보가 변경됐어요. 새로고침 후 다시 시도해 주세요.", 409);
        }
      }
    }

    const placeIds = [...new Set(input.categories.flatMap((category) => category.results.map((result) => result.placeId)))];
    const placeCount = await tx.place.count({ where: { id: { in: placeIds } } });
    if (placeCount !== placeIds.length) throw new AwardSaveError("선택한 식당 중 삭제된 식당이 있어요. 목록을 새로 불러와 주세요.", 400);

    const data = { name: input.name, dateStart: input.dateStart ? new Date(`${input.dateStart}T00:00:00.000Z`) : null };
    const award = existing
      ? await tx.award.update({ where: { id: existing.id }, data })
      : await tx.award.create({ data });

    const keptCategoryIds = input.categories.flatMap((category) => category.id ? [category.id] : []);
    const removedCategoryIds = existing?.categories.filter((category) => !keptCategoryIds.includes(category.id)).map((category) => category.id) ?? [];
    await tx.awardRes.deleteMany({ where: { awardCategoryId: { in: removedCategoryIds } } });
    await tx.awardCategory.deleteMany({ where: { awardId: award.id, id: { in: removedCategoryIds } } });

    for (const category of input.categories) {
      const savedCategory = category.id
        ? await tx.awardCategory.update({ where: { id: category.id }, data: { name: category.name } })
        : await tx.awardCategory.create({ data: { awardId: award.id, name: category.name } });
      const keptResultIds = category.results.flatMap((result) => result.id ? [result.id] : []);
      await tx.awardRes.deleteMany({ where: { awardCategoryId: savedCategory.id, id: { notIn: keptResultIds } } });
      for (const result of category.results) {
        const resultData = { placeId: result.placeId, rank: result.rank, description: result.description };
        if (result.id) {
          await tx.awardRes.update({ where: { id: result.id }, data: resultData });
        } else {
          await tx.awardRes.create({ data: { ...resultData, awardCategoryId: savedCategory.id } });
        }
      }
    }
    return { id: award.id };
  }, { timeout: 20000 });
}
