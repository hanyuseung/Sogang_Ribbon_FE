type SupabaseImageOptions = {
  width: number;
  height?: number;
  quality?: number;
  resize?: "cover" | "contain" | "fill";
};

export function getSupabaseImageUrl(
  src: string | null | undefined,
  options: SupabaseImageOptions
) {
  void options;

  if (!src) return null;

  // Supabase image transformation is intentionally disabled for now.
  // Re-enable this by converting `/storage/v1/object/public/...` URLs to
  // `/storage/v1/render/image/public/...` and appending width/height/quality.
  return src;
}
