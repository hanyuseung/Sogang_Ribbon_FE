"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Camera, X } from "lucide-react";
import keywordsData from "@/lib/keyword_dummy.json";
import { Keyword } from "@/types/keyword";
import { Place } from "@/types/place";

const KEYWORDS = keywordsData as Keyword[];
const MAX_IMAGES = 5;

const GUIDELINES = [
  "실제 방문한 식당에 대한 솔직한 리뷰를 작성해주세요.",
  "허위 사실이나 광고성 리뷰는 삭제될 수 있습니다.",
  "타인 비방, 욕설이 포함된 리뷰는 통보 없이 삭제됩니다.",
  "음식 외 개인정보는 포함하지 마세요.",
];

export default function ReviewForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const placeId = searchParams.get("placeId") ?? "";
  const [place, setPlace] = useState<Place | null>(null);

  useEffect(() => {
    if (!placeId) return;
    fetch(`/api/places/${placeId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setPlace)
      .catch(() => {});
  }, [placeId]);

  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<number[]>([]);
  const [content, setContent] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [guideOpen, setGuideOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleKeyword = (id: number) => {
    setSelectedKeywords((prev) => {
      if (prev.includes(id)) return prev.filter((k) => k !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...urls].slice(0, MAX_IMAGES));
    e.target.value = "";
  };

  const removeImage = (i: number) =>
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));

  const canSubmit =
  selectedKeywords.length > 0 && content.trim().length > 0;

  const handleSubmit = () => {
    // TODO: API 연동
    router.push(place ? `/place/${placeId}` : "/");
  };

  const backHref = place ? `/place/${placeId}` : "/";

  return (
    <div className="min-h-screen bg-[#fff8fb]">
      

      <main className="max-w-screen-sm mx-auto pb-28">
        {/* 타이틀 추가 */}
        <div className="px-4 pt-6 pb-2">
          <div className="mb-4">
            <p className="text-[#d6336c] text-xs font-black tracking-[1.6px] mb-1">
              WRITE
            </p>

            <div className="flex items-end gap-2">
              <h2 className="text-2xl font-bold tracking-[-0.8px]">
                리뷰 작성
              </h2>

              <span className="text-lg font-bold tracking-[-0.6px] text-zinc-400">
                {place?.name}
              </span>
            </div>
          </div>
        </div>

      <div className="px-4">
        <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden">
          
          {/* 사진 */}
          <div className="px-4 py-5">
            <h3 className="text-sm font-semibold text-zinc-700 mb-3">
              사진{" "}
              <span className="text-zinc-400 font-normal text-xs">
                {previews.length}/{MAX_IMAGES}
              </span>
            </h3>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {previews.map((src, i) => (
                <div key={src} className="relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className="w-20 h-20 rounded-xl object-cover"
                  />

                  <button
                    onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-zinc-800 text-white flex items-center justify-center"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}

              {previews.length < MAX_IMAGES && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-1 text-zinc-400 hover:border-[#d6336c] hover:text-[#d6336c] shrink-0 transition-colors"
                >
                  <Camera className="size-5" />
                  <span className="text-xs">사진 추가</span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFiles}
            />
          </div>

          {/* 키워드 */}
          <div className="px-4 py-5">
            <div className="flex items-baseline gap-2 mb-3">
              <h3 className="text-sm font-semibold text-zinc-700">키워드</h3>
              <span className="text-xs text-zinc-400">
                최대 3개 선택
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {KEYWORDS.map((kw) => {
                const isSelected = selectedKeywords.includes(kw.keyword_id);
                const isDisabled =
                  !isSelected && selectedKeywords.length >= 3;

                return (
                  <button
                    key={kw.keyword_id}
                    onClick={() => toggleKeyword(kw.keyword_id)}
                    disabled={isDisabled}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      isSelected
                        ? "bg-[#d6336c] border-[#d6336c] text-white"
                        : isDisabled
                        ? "border-zinc-100 text-zinc-300 cursor-not-allowed"
                        : "border-zinc-200 text-zinc-600 hover:border-[#d6336c] hover:text-[#d6336c] hover:bg-[#fff0f5]"
                    }`}
                  >
                    {kw.name}
                  </button>
                );
              })}
            </div>

            {selectedKeywords.length > 0 && (
              <p className="text-xs text-zinc-400 mt-2.5">
                {selectedKeywords.length}/3 선택됨
              </p>
            )}
          </div>

          {/* 리뷰 내용 */}
          <div className="px-4 py-5">
            <h3 className="text-sm font-semibold text-zinc-700 mb-3">
              리뷰 내용 <span className="text-[#d6336c]">*</span>
            </h3>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={GUIDELINES.map(
                (line) => `• ${line}`
              ).join("\n")}
              rows={6}
              className="w-full resize-none rounded-xl border border-zinc-200 px-3.5 py-3 text-sm text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:border-[#d6336c] leading-relaxed"
            />

            <p className="text-xs text-zinc-400 text-right mt-1">
              {content.length}자
            </p>
          </div>
          {/* 하단 등록 버튼 */}
          <div className="max-w-screen-sm mx-auto p-4">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full h-12 rounded-2xl font-semibold text-sm transition-colors
              disabled:bg-zinc-100 disabled:text-zinc-400
              enabled:bg-[#d6336c] enabled:text-white enabled:hover:opacity-90"
            >
              리뷰 등록하기
            </button>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}