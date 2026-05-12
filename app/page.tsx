import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="px-[18px] pt-7 pb-8">

        <span className="inline-block px-[10px] py-[6px] rounded-full bg-[#ffe3ec] text-[#d6336c] text-xs font-black mb-[14px]">
          SOGANG RIBBON
        </span>

        <h1 className="text-[34px] font-bold leading-[1.14] tracking-[-1.6px] mb-[14px]">
          서강인의<br />
          맛집 기억을<br />
          리본처럼 묶다
        </h1>

        <p className="text-[15px] text-[#6f4c59] mb-5">
          서강대 주변 맛집을 지도에서 찾고, 리뷰와 키워드로
          기록하는 모바일 퍼스트 맛집 아카이브입니다.
        </p>

        <div className="grid grid-cols-2 gap-[10px] mb-5">
          <Link
            href="/map"
            className="inline-flex items-center justify-center min-h-[46px] px-[18px] rounded-full bg-[#d6336c] text-white text-sm font-black"
          >
            지도 보기
          </Link>
          <button className="inline-flex items-center justify-center min-h-[46px] px-[18px] rounded-full bg-white text-[#d6336c] border border-[#f0b6c9] text-sm font-black">
            오늘 뭐 먹지?
          </button>
        </div>

        <div className="p-[22px] rounded-[28px] bg-gradient-to-br from-[#ffd6e5] to-white shadow-[0_18px_40px_rgba(214,51,108,0.16)]">
          <span className="inline-block text-[#d6336c] text-[13px] font-black mb-2">오늘의 추천</span>
          <h3 className="text-2xl font-bold mb-2">밥약하기 좋은 곳</h3>
          <p className="text-[#765260] text-sm">분위기 좋아요 · 가성비 좋아요 · 친절해요</p>
        </div>

      </section>
    </>
  );
}
