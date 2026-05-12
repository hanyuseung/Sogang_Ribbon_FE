export default function CommunityPage() {
  return (
    <div className="min-h-full bg-[#fff8fb] flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-8 text-center">
        <div className="size-24 rounded-3xl bg-gradient-to-br from-[#ffd6e5] to-[#fff1f6] flex items-center justify-center shadow-[0_8px_24px_rgba(214,51,108,0.15)]">
          <span className="text-5xl">💬</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#2b1b22] mb-2">함께 나누는 맛집 이야기</h1>
          <p className="text-sm text-[#7a5965] leading-relaxed">
            서강 구성원들과 맛집 정보를<br />자유롭게 공유하는 공간이에요
          </p>
        </div>
        <span className="px-4 py-1.5 bg-[#ffe3ec] text-[#d6336c] text-xs font-bold rounded-full">
          준비 중
        </span>
      </main>
    </div>
  );
}
