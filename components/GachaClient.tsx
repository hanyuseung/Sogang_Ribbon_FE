"use client";

import { useState, useEffect } from "react";
import { Place } from "@/types/place";

const CATEGORIES = ["전체", "한식", "중식", "일식", "양식"];
const FOOD_ICONS = ["🍜", "🍱", "🍣", "🥩", "🍛", "🍝"];

export default function GachaClient({ places }: { places: Place[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
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
    const pool =
      activeCategory === "전체"
        ? places
        : places.filter((p) => p.classification === activeCategory);
    const timeout = setTimeout(() => {
      const random = pool[Math.floor(Math.random() * pool.length)];
      setResult(random ?? null);
      setPicked(true);
      setSpinning(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [spinning, activeCategory, places]);

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
      : "해당 카테고리에 식당이 없어요"
    : "오늘은 파스타 어떠세요?";

  const resultDesc = spinning
    ? ""
    : picked && result
    ? (result.keywords ?? [])
        .slice(0, 2)
        .map((k) => k.name)
        .join(" · ") || result.classification
    : "분위기도 챙기고 싶고, 밥약도 망치고 싶지 않은 날에 추천.";

  return (
    <div className="p-5 bg-white rounded-[24px] shadow-[0_12px_28px_rgba(80,37,54,0.08)] text-center">
      <p className="text-sm text-[#6f4c59] mb-4">
        카테고리를 고르면 랜덤으로 메뉴를 추천해요.
      </p>

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

      <div className="p-5 rounded-[22px] bg-gradient-to-br from-[#ffd6e5] to-[#fff8fb]">
        {spinning ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <span className="text-5xl animate-bounce">{displayIcon}</span>
            <p className="text-sm font-black text-[#d6336c]">뽑는 중...</p>
          </div>
        ) : (
          <>
            <h3 className="text-[22px] font-bold mb-2">{resultTitle}</h3>
            <p className="text-sm text-[#765260]">{resultDesc}</p>
          </>
        )}
      </div>
    </div>
  );
}
