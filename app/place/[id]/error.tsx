"use client";

import BackButton from "@/components/BackButton";

export default function PlaceDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-full bg-[#fff8fb]">
      <header className="sticky top-0 z-20 h-16 px-5 bg-[rgba(255,248,251,0.92)] backdrop-blur-[14px] border-b border-[#f3d5df] flex items-center gap-3">
        <BackButton fallbackHref="/map" />
        <span className="font-bold text-[#2b1b22] truncate">식당 상세</span>
      </header>

      <section className="px-[18px] pt-20 text-center">
        <div className="rounded-[24px] bg-white px-5 py-8 shadow-[0_12px_28px_rgba(80,37,54,0.08)]">
          <h2 className="text-lg font-black text-[#2b1b22]">
            식당 정보를 불러오지 못했어요
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#7a5965]">
            네트워크나 서버 연결이 잠시 불안정할 수 있어요.
            <br />
            잠시 후 다시 시도해 주세요.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#d6336c] px-6 text-sm font-black text-white"
          >
            다시 시도
          </button>
        </div>
      </section>
    </div>
  );
}
