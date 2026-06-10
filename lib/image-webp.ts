type ConvertOptions = {
  maxWidth: number;
  maxHeight?: number;
  quality: number;
  /** true면 maxWidth × maxHeight를 꽉 채우도록 중앙 크롭 (썸네일용) */
  cover?: boolean;
};

export async function convertToWebp(file: File, options: ConvertOptions): Promise<Blob> {
  const bitmap = await createImageBitmap(file);

  let targetWidth: number;
  let targetHeight: number;
  let sx = 0;
  let sy = 0;
  let sWidth = bitmap.width;
  let sHeight = bitmap.height;

  if (options.cover && options.maxHeight) {
    targetWidth = options.maxWidth;
    targetHeight = options.maxHeight;

    // 비율을 유지한 채 타깃을 덮는 최대 영역을 원본 중앙에서 잘라낸다
    const scale = Math.max(targetWidth / bitmap.width, targetHeight / bitmap.height);
    sWidth = targetWidth / scale;
    sHeight = targetHeight / scale;
    sx = (bitmap.width - sWidth) / 2;
    sy = (bitmap.height - sHeight) / 2;
  } else {
    const ratio = Math.min(options.maxWidth / bitmap.width, 1);
    targetWidth = Math.round(bitmap.width * ratio);
    targetHeight = Math.round(bitmap.height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("캔버스 컨텍스트를 생성하지 못했어요.");
  }

  ctx.drawImage(bitmap, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", options.quality)
  );
  if (!blob || blob.type !== "image/webp") {
    throw new Error("webp 변환에 실패했어요.");
  }

  return blob;
}
