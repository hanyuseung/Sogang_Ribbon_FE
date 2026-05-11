export default function MapPlaceholder() {
  return (
    <div
      className="relative h-[300px] rounded-[28px] border-2 border-dashed border-[#d6336c] overflow-hidden mb-4 flex items-center justify-center text-center text-[#8a5165]"
      style={{
        background:
          "linear-gradient(rgba(255,255,255,0.45), rgba(255,255,255,0.45)), repeating-linear-gradient(45deg, #f1e2e8, #f1e2e8 12px, #f8edf2 12px, #f8edf2 24px)",
      }}
    >
      <Marker className="top-[24%] left-[26%]" />
      <Marker className="top-[50%] left-[58%]" />
      <Marker className="top-[68%] left-[38%]" />

      <div>
        <h3 className="text-xl font-bold text-[#7a4256] mb-1">카카오맵 API 영역</h3>
        <p className="text-[13px]">추후 개발팀에서 지도 연결</p>
      </div>
    </div>
  );
}

function Marker({ className }: { className: string }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="w-7 h-7 rounded-[50%_50%_50%_0] bg-[#d6336c] -rotate-45 shadow-[0_8px_18px_rgba(214,51,108,0.25)] relative">
        <div className="absolute w-2.5 h-2.5 rounded-full bg-white top-[9px] left-[9px]" />
      </div>
    </div>
  );
}
