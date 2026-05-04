"use client";

import { useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Camera, X, ChevronDown, ChevronUp } from "lucide-react";
import keywordsData from "@/lib/keyword_dummy.json";
import placesData from "@/lib/place_dummy.json";
import { Keyword } from "@/types/keyword";
import { Place } from "@/types/place";

const KEYWORDS = keywordsData as Keyword[];
const PLACES = placesData as Place[];
const MAX_IMAGES = 5;

const RATING_LABELS: Record<number, string> = {
  1: "다신 안가요",
  2: "별로에요",
  3: "괜찮아요",
  4: "맛있어요",
  5: "최고에요",
};

const GUIDELINES = [
  "실제 방문한 식당에 대한 솔직한 리뷰를 작성해주세요.",
  "허위 사실이나 광고성 내용이 포함된 리뷰는 삭제될 수 있습니다.",
  "타인 비방, 욕설이 포함된 리뷰는 통보 없이 삭제됩니다.",
  "음식 외 개인정보(전화번호, 주소 등)는 포함하지 마세요.",
];

export default function ReviewForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const placeId = Number(searchParams.get("placeId"));
  const place = PLACES.find((p) => p.id === placeId);

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

  const canSubmit = rating !== null && content.trim().length > 0;

  const handleSubmit = () => {
    // TODO: API 연동
    router.push(place ? `/place/${placeId}` : "/");
  };

  const backHref = place ? `/place/${placeId}` : "/";

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white border-b border-zinc-100 px-4 h-14 flex items-center justify-between">
        <Link
          href={backHref}
          className="text-zinc-500 hover:text-zinc-800 transition-colors p-1 -ml-1"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <span className="font-semibold text-zinc-900">리뷰 쓰기</span>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="text-sm font-semibold px-3 py-1.5 rounded-full transition-colors disabled:text-zinc-300 enabled:text-red-700 enabled:hover:bg-red-50"
        >
          등록
        </button>
      </header>

      <main className="max-w-screen-sm mx-auto divide-y divide-zinc-100 pb-16">
        {/* 식당 정보 */}
        <div className="px-4 py-4">
          <p className="text-xs text-zinc-400 mb-0.5">리뷰 작성 중인 식당</p>
          <p className="font-semibold text-zinc-900">{place?.name ?? "알 수 없는 식당"}</p>
        </div>

        {/* 가이드라인 */}
        <div className="px-4 py-3">
          <button
            onClick={() => setGuideOpen((v) => !v)}
            className="flex items-center w-full text-sm"
          >
            <span className="font-medium text-zinc-700">리뷰 작성 가이드라인</span>
            {guideOpen ? (
              <ChevronUp className="size-4 ml-auto text-zinc-400" />
            ) : (
              <ChevronDown className="size-4 ml-auto text-zinc-400" />
            )}
          </button>
          {guideOpen && (
            <ul className="mt-3 space-y-2 bg-zinc-50 rounded-xl px-4 py-3">
              {GUIDELINES.map((g) => (
                <li key={g} className="flex gap-2 text-xs text-zinc-500 leading-relaxed">
                  <span className="text-zinc-300 shrink-0 mt-px">•</span>
                  {g}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 별점 */}
        <div className="px-4 py-5">
          <h3 className="text-sm font-semibold text-zinc-700 mb-4">
            별점 <span className="text-red-500">*</span>
          </h3>
          <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(null)}>
            {([1, 2, 3, 4, 5] as const).map((star) => {
              const filled = star <= (hoverRating ?? rating ?? 0);
              return (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  className={`text-4xl leading-none transition-colors ${
                    filled ? "text-amber-400" : "text-zinc-200"
                  }`}
                >
                  ★
                </button>
              );
            })}
          </div>
          <div className="h-6 mt-2">
            {rating && (
              <p className="text-sm font-medium text-zinc-700">
                {rating}점 · {RATING_LABELS[rating]}
              </p>
            )}
          </div>
        </div>

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
                <img src={src} alt="" className="w-20 h-20 rounded-xl object-cover" />
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
                className="w-20 h-20 rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-1 text-zinc-400 hover:border-zinc-300 hover:text-zinc-500 shrink-0 transition-colors"
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
            <span className="text-xs text-zinc-400">최대 3개 선택</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {KEYWORDS.map((kw) => {
              const isSelected = selectedKeywords.includes(kw.keyword_id);
              const isDisabled = !isSelected && selectedKeywords.length >= 3;
              return (
                <button
                  key={kw.keyword_id}
                  onClick={() => toggleKeyword(kw.keyword_id)}
                  disabled={isDisabled}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    isSelected
                      ? "bg-red-800 border-red-800 text-white"
                      : isDisabled
                      ? "border-zinc-100 text-zinc-300 cursor-not-allowed"
                      : "border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
                >
                  {kw.name}
                </button>
              );
            })}
          </div>
          {selectedKeywords.length > 0 && (
            <p className="text-xs text-zinc-400 mt-2.5">{selectedKeywords.length}/3 선택됨</p>
          )}
        </div>

        {/* 리뷰 내용 */}
        <div className="px-4 py-5">
          <h3 className="text-sm font-semibold text-zinc-700 mb-3">
            리뷰 내용 <span className="text-red-500">*</span>
          </h3>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="이 식당에 대한 솔직한 리뷰를 남겨주세요."
            rows={5}
            className="w-full resize-none rounded-xl border border-zinc-200 px-3.5 py-3 text-sm text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-400 leading-relaxed"
          />
          <p className="text-xs text-zinc-400 text-right mt-1">{content.length}자</p>
        </div>
      </main>
    </div>
  );
}
