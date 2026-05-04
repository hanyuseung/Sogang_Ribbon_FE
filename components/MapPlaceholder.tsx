import { MapPin } from "lucide-react";

export default function MapPlaceholder() {
  return (
    <div className="w-full h-64 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col items-center justify-center gap-2 text-zinc-400">
      <MapPin className="size-10 stroke-[1.5]" />
      <span className="text-sm font-medium">지도 영역</span>
    </div>
  );
}
