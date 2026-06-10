import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAdminUserId } from "@/lib/admin-auth";

const BUCKET = "place_img";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_THUMBNAIL_BYTES = 1 * 1024 * 1024;

function getFile(form: FormData, key: string): File | null {
  const value = form.get(key);
  return value instanceof File ? value : null;
}

export async function POST(req: Request) {
  const adminId = await getAdminUserId(req);
  if (!adminId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !secretKey) {
    return NextResponse.json({ error: "Storage is not configured" }, { status: 500 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const image = getFile(form, "image");
  const thumbnail = getFile(form, "thumbnail");
  if (!image || !thumbnail) {
    return NextResponse.json({ error: "image and thumbnail are required" }, { status: 400 });
  }
  if (image.type !== "image/webp" || thumbnail.type !== "image/webp") {
    return NextResponse.json({ error: "Only webp is allowed" }, { status: 400 });
  }
  if (image.size > MAX_IMAGE_BYTES || thumbnail.size > MAX_THUMBNAIL_BYTES) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, secretKey);
  const id = crypto.randomUUID();
  const imagePath = `places/${id}.webp`;
  const thumbnailPath = `thumbnail/${id}.webp`;

  const { error: imageError } = await supabase.storage
    .from(BUCKET)
    .upload(imagePath, image, { contentType: "image/webp" });
  if (imageError) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const { error: thumbnailError } = await supabase.storage
    .from(BUCKET)
    .upload(thumbnailPath, thumbnail, { contentType: "image/webp" });
  if (thumbnailError) {
    // 본문만 올라간 채로 남지 않도록 정리
    await supabase.storage.from(BUCKET).remove([imagePath]);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  return NextResponse.json({
    img_url: supabase.storage.from(BUCKET).getPublicUrl(imagePath).data.publicUrl,
    thumbnail_url: supabase.storage.from(BUCKET).getPublicUrl(thumbnailPath).data.publicUrl,
  });
}
