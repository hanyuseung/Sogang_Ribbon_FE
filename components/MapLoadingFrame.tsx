export default function MapLoadingFrame() {
  return (
    <div className="animate-pulse">
      <div className="mb-[14px] h-[46px] w-full rounded-full border border-[#f0b6c9] bg-white" />
      <div className="mb-4 flex h-[300px] items-center justify-center rounded-[28px] bg-[#f8edf2] text-sm text-[#8a5165]">
        지도 불러오는 중...
      </div>
      <div className="mb-4 flex gap-2 overflow-hidden">
        {[72, 72, 64].map((width, index) => (
          <div
            key={index}
            className="h-[38px] flex-none rounded-full bg-[#f8edf2]"
            style={{ width }}
          />
        ))}
      </div>
      <div className="flex flex-col gap-3 px-4">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-[80px] rounded-[22px] bg-white" />
        ))}
      </div>
    </div>
  );
}
