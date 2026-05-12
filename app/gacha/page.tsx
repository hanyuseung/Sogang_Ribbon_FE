export default function GachaPage() {
  return (
    <div className="min-h-full bg-[#fff8fb] flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-8 text-center">
        <div className="size-24 rounded-3xl bg-gradient-to-br from-[#ffd6e5] to-[#fff1f6] flex items-center justify-center shadow-[0_8px_24px_rgba(214,51,108,0.15)]">
          <span className="text-5xl">🎰</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#2b1b22] mb-2">오늘 뭐 먹지?</h1>
          <p className="text-sm text-[#7a5965] leading-relaxed">
            서강 맛집 중에서<br />오늘의 메뉴를 랜덤으로 추천해드려요
          </p>
        </div>
        <button
          disabled
          className="px-8 py-3.5 bg-[#f0b6c9] text-white text-sm font-bold rounded-full cursor-not-allowed"
        >
          뽑기 (준비 중)
        </button>
      </main>
    </div>
  );
}
