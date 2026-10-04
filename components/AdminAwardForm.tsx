"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { adminRequest } from "@/lib/admin-request";
import { parseAwardInput } from "@/lib/award-input";
import AdminPlaceSelect from "@/components/AdminPlaceSelect";
import type { AdminAward, AwardInput } from "@/types/award";
import type { Place } from "@/types/place";

type ResultForm = { key: string; id?: string; placeId: string; rank: string; description: string };
type CategoryForm = { key: string; id?: string; name: string; results: ResultForm[] };
export type AwardPlaceOption = Pick<Place, "id" | "name" | "address" | "classification">;

const inputClass = "w-full min-w-0 rounded-xl border border-[#f3d5df] bg-[#fff8fb] px-3 py-2.5 text-sm text-[#2b1b22] placeholder-[#c4a0b0] focus:outline-none focus:border-[#d6336c]";
const labelClass = "flex min-w-0 flex-col gap-1.5 text-xs font-bold text-[#2b1b22]";
const addClass = "inline-flex items-center justify-center gap-1.5 rounded-full border border-[#f0b6c9] px-4 py-2 text-xs font-bold text-[#d6336c] disabled:opacity-50";

export default function AdminAwardForm({ award, places }: { award?: AdminAward; places: AwardPlaceOption[] }) {
  const router = useRouter();
  const [name, setName] = useState(award?.name ?? "");
  const [dateStart, setDateStart] = useState(award?.dateStart ?? "");
  const [categories, setCategories] = useState<CategoryForm[]>(() => award
    ? award.categories.map((category, index) => ({
      key: category.id ?? `category-${index}`,
      id: category.id,
      name: category.name ?? "",
      results: category.results.map((result, resultIndex) => ({
        key: result.id ?? `result-${index}-${resultIndex}`,
        id: result.id,
        placeId: result.placeId,
        rank: result.rank?.toString() ?? "",
        description: result.description ?? "",
      })),
    }))
    : [{ key: "new-category", name: "", results: [] }]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateCategory(key: string, patch: Partial<CategoryForm>) {
    setCategories((current) => current.map((category) => category.key === key ? { ...category, ...patch } : category));
  }

  function updateResult(categoryKey: string, resultKey: string, patch: Partial<ResultForm>) {
    setCategories((current) => current.map((category) => category.key === categoryKey ? {
      ...category,
      results: category.results.map((result) => result.key === resultKey ? { ...result, ...patch } : result),
    } : category));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;
    setError("");
    const input: AwardInput = {
      name,
      dateStart: dateStart || null,
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name.trim() || null,
        results: category.results.map((result) => ({
          id: result.id,
          placeId: result.placeId,
          rank: result.rank.trim() === "" ? null : Number(result.rank),
          description: result.description.trim() || null,
        })),
      })),
    };
    const parsed = parseAwardInput(input);
    if (parsed.error !== undefined) {
      setError(parsed.error);
      return;
    }
    setSaving(true);
    try {
      await adminRequest<{ id: string }>(award ? `/api/admin/awards/${encodeURIComponent(award.id)}` : "/api/admin/awards", {
        method: award ? "PUT" : "POST",
        body: JSON.stringify(parsed.input),
      });
      router.push("/admin/awards");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "저장에 실패했어요. 다시 시도해 주세요.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <fieldset disabled={saving} className="flex min-w-0 flex-col gap-5 disabled:opacity-70">
        <div className="flex flex-col gap-4 rounded-2xl border border-[#f3d5df] bg-white p-4">
          <label className={labelClass}>
            어워드 이름 *
            <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="예) 2026 서강리본 어워드" className={inputClass} />
          </label>
          <label className={labelClass}>
            시작일 (선택)
            <input type="date" value={dateStart} onChange={(event) => setDateStart(event.target.value)} className={inputClass} />
          </label>
        </div>

        <div className="flex items-center justify-between gap-2">
          <h2 className="font-bold text-[#2b1b22]">수상 부문</h2>
          <button type="button" className={addClass} onClick={() => setCategories((current) => [...current, { key: crypto.randomUUID(), name: "", results: [] }])}>
            <Plus className="size-3.5" /> 부문 추가
          </button>
        </div>
        {categories.length === 0 && <p className="text-sm text-[#7a5965]">부문 추가를 눌러 수상 식당을 등록해 주세요.</p>}
        {categories.map((category, categoryIndex) => (
          <section key={category.key} aria-label={`수상 부문 ${categoryIndex + 1}`} className="flex flex-col gap-4 rounded-2xl border border-[#f3d5df] bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#d6336c]">부문 {categoryIndex + 1}</h3>
              <button type="button" aria-label={`부문 ${categoryIndex + 1} 삭제`} className="rounded-lg p-2 text-xs text-red-500" onClick={() => {
                if (category.results.length > 0 && !window.confirm("이 부문의 수상 식당도 함께 제외돼요. 부문을 삭제할까요?")) return;
                setCategories((current) => current.filter((item) => item.key !== category.key));
              }}>
                부문 삭제
              </button>
            </div>
            <label className={labelClass}>
              부문 이름 (선택)
              <input value={category.name} onChange={(event) => updateCategory(category.key, { name: event.target.value })} placeholder="예) 최고의 한식" className={inputClass} />
            </label>
            {category.results.map((result, resultIndex) => (
              <div key={result.key} className="flex flex-col gap-3 rounded-xl border border-[#f3d5df] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7a5965]">수상 식당 {resultIndex + 1}</span>
                  <button type="button" aria-label={`수상 식당 ${resultIndex + 1} 삭제`} className="rounded-lg p-2 text-red-500" onClick={() => updateCategory(category.key, { results: category.results.filter((item) => item.key !== result.key) })}>
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <AdminPlaceSelect
                  places={places}
                  value={result.placeId}
                  onChange={(placeId) => updateResult(category.key, result.key, { placeId })}
                  excludedIds={category.results.filter((item) => item.key !== result.key).map((item) => item.placeId)}
                />
                <label className={labelClass}>
                  순위 (선택)
                  <input type="number" min={1} max={2147483647} step={1} value={result.rank} onChange={(event) => updateResult(category.key, result.key, { rank: event.target.value })} placeholder="예) 1" className={inputClass} />
                </label>
                <label className={labelClass}>
                  수상 설명 (선택)
                  <textarea rows={3} value={result.description} onChange={(event) => updateResult(category.key, result.key, { description: event.target.value })} placeholder="비워 두면 식당의 상세 설명이 표시돼요." className={`${inputClass} resize-y`} />
                </label>
              </div>
            ))}
            <button type="button" className={addClass} disabled={places.length === 0} onClick={() => updateCategory(category.key, {
              results: [...category.results, { key: crypto.randomUUID(), placeId: "", rank: "", description: "" }],
            })}>
              <Plus className="size-3.5" /> 수상 식당 추가
            </button>
            {places.length === 0 && <p className="text-xs text-[#7a5965]">식당 관리에서 식당을 먼저 등록해 주세요.</p>}
          </section>
        ))}
        <p className="text-xs leading-relaxed text-[#7a5965]">추가·수정·삭제한 내용은 저장하면 어워드 페이지에 반영돼요.</p>
        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        <button type="submit" className="w-full rounded-xl bg-[#d6336c] py-3 text-sm font-bold text-white">
          {saving ? "저장 중..." : award ? "수정 저장" : "어워드 추가"}
        </button>
      </fieldset>
    </form>
  );
}
