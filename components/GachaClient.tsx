"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Place } from "@/types/place";
import { RibbonFilter } from "@/components/PlaceListWithSort";
import { getSupabaseImageUrl } from "@/lib/supabase-image";

const CATEGORIES = ["전체", "한식", "일식", "양식", "아시안", "카페"];
const FOOD_ICONS = ["🍜", "🍱", "🍣", "🥩", "🍛", "🍝"];

const RIBBON_FILTERS: { value: RibbonFilter; label: string }[] = [
  { value: null,       label: "전체" },
  { value: "cardinal", label: "카디널" },
  { value: "deepred",  label: "딥레드" },
  { value: "pink",     label: "핑크" },
];

export default function GachaClient({ places }: { places: Place[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [ribbonFilter, setRibbonFilter] = useState<RibbonFilter>(null);
  const [result, setResult] = useState<Place | null>(null);
  const [picked, setPicked] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [displayIcon, setDisplayIcon] = useState(FOOD_ICONS[0]);

  useEffect(() => {
    if (!spinning) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayIcon(FOOD_ICONS[i % FOOD_ICONS.length]);
    }, 300);
    return () => clearInterval(id);
  }, [spinning]);

  useEffect(() => {
    if (!spinning || !activeCategory) return;

    const byRibbon =
      ribbonFilter === "cardinal" ? places.filter((p) => (p.ribbon_cardinal ?? 0) > 0) :
      ribbonFilter === "deepred"  ? places.filter((p) => (p.ribbon_deepred  ?? 0) > 0) :
      ribbonFilter === "pink"     ? places.filter((p) => (p.ribbon_pink     ?? 0) > 0) :
      places;

    const pool =
      activeCategory === "전체"
        ? byRibbon
        : byRibbon.filter((p) => p.classification === activeCategory);

    const timeout = setTimeout(() => {
      const random = pool[Math.floor(Math.random() * pool.length)];
setResult(random ?? null);
      setPicked(true);
      setSpinning(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [spinning, activeCategory, ribbonFilter, places]);

  function pick(category: string) {
    if (spinning) return;
    setActiveCategory(category);
    setPicked(false);
    setSpinning(true);
  }

  const resultTitle = spinning
    ? ""
    : picked
    ? result
      ? result.name
      : "해당 조건에 맞는 식당이 없어요"
    : "오늘 당신을 위한 추천 메뉴!";

  const resultDesc = spinning
    ? ""
    : picked && result
    ? result.classification ?? ""
    : "어디로 갈지 고민되나요?\n서강 리본이 엄선한 실패없는 맛집을 확인해 보세요.";
  const resultImageUrl = getSupabaseImageUrl(result?.img_url, {
    width: 720,
    height: 320,
    quality: 65,
  });

  return (
    <div className="p-5 bg-white rounded-[24px] shadow-[0_12px_28px_rgba(80,37,54,0.08)] text-center">
      <p className="text-sm text-[#6f4c59] mb-4">
        카테고리를 고르면 랜덤으로 메뉴를 추천해요.
      </p>

      {/* 리본 필터 */}
      <div className="flex flex-wrap justify-center gap-2 mb-3">
        {RIBBON_FILTERS.map(({ value, label }) => (
          <button
            key={label}
            onClick={() => setRibbonFilter(value)}
            disabled={spinning}
            className={`px-[14px] py-[10px] rounded-full text-[13px] font-black border transition-colors ${
              ribbonFilter === value
                ? "bg-[#d6336c] text-white border-[#d6336c]"
                : "bg-white text-[#d6336c] border-[#f0b6c9]"
            } ${spinning ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 카테고리 */}
      <div className="flex flex-wrap justify-center gap-2 mb-[18px]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => pick(cat)}
            disabled={spinning}
            className={`px-[14px] py-[10px] rounded-full text-[13px] font-black transition-colors ${
              activeCategory === cat
                ? "bg-[#d6336c] text-white"
                : "bg-[#fff1f6] text-[#d6336c]"
            } ${spinning ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {spinning ? (
        <div className="p-5 rounded-[22px] bg-gradient-to-br from-[#ffd6e5] to-[#fff8fb] flex flex-col items-center gap-2 py-2">
          <span className="text-5xl animate-bounce">{displayIcon}</span>
          <p className="text-sm font-black text-[#d6336c]">뽑는 중...</p>
        </div>
      ) : picked && result ? (
        <Link
            href={`/place/${result.id}`}
            className="block rounded-[22px] overflow-hidden bg-gradient-to-br from-[#ffd6e5] to-[#fff8fb] active:opacity-80 transition-opacity"
          >
            <div className="relative w-full h-[160px] bg-gradient-to-br from-[#ffd6e5] to-[#fff1f6] flex items-center justify-center overflow-hidden">
              {resultImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resultImageUrl}
                  alt={result.name}
                  className="block w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">🍽️</span>
              )}
            </div>

            <div className="relative z-10 p-5 text-center">
              <h3 className="text-[22px] font-bold mb-2">{result.name}</h3>
              <p className="text-sm text-[#765260]">
                {result.classification ?? ""}
              </p>
              <p className="text-xs text-[#d6336c] font-black mt-3">
                자세히 보기 →
              </p>
            </div>
          </Link>
      ) : (
        <div className="p-5 rounded-[22px] bg-gradient-to-br from-[#ffd6e5] to-[#fff8fb]">
          <h3 className="text-[22px] font-bold mb-2">{resultTitle}</h3>
          <p className="whitespace-pre-line text-sm text-[#765260]">{resultDesc}</p>
        </div>
      )}
    </div>
  );
}
