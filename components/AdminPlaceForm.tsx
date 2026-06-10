"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { convertToWebp } from "@/lib/image-webp";
import { Place, PlaceInput } from "@/types/place";

type FormState = {
  name: string;
  classification: string;
  address: string;
  latitude: string;
  longitude: string;
  img_url: string;
  thumbnail_url: string;
  ribbon_cardinal: string;
  ribbon_deepred: string;
  ribbon_pink: string;
  desc_thumbnail: string;
  desc_detail: string;
};

function toFormState(place?: Place): FormState {
  return {
    name: place?.name ?? "",
    classification: place?.classification ?? "",
    address: place?.address ?? "",
    latitude: place?.latitude?.toString() ?? "",
    longitude: place?.longitude?.toString() ?? "",
    img_url: place?.img_url ?? "",
    thumbnail_url: place?.thumbnail_url ?? "",
    ribbon_cardinal: place?.ribbon_cardinal?.toString() ?? "",
    ribbon_deepred: place?.ribbon_deepred?.toString() ?? "",
    ribbon_pink: place?.ribbon_pink?.toString() ?? "",
    desc_thumbnail: place?.desc_thumbnail ?? "",
    desc_detail: place?.desc_detail ?? "",
  };
}

function toStringOrNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function toNumberOrNull(value: string): number | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-[#f3d5df] bg-[#fff8fb] text-sm text-[#2b1b22] placeholder-[#c4a0b0] focus:outline-none focus:border-[#d6336c] transition-colors";
const labelClass = "text-xs font-bold text-[#2b1b22]";

export default function AdminPlaceForm({ place }: { place?: Place }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toFormState(place));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isEdit = !!place;

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  const setField =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.name.trim() === "") {
      setError("식당 이름을 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setIsSubmitting(false);
      router.push("/login?redirect=/admin/places");
      return;
    }

    let imgUrl = toStringOrNull(form.img_url);
    let thumbnailUrl = toStringOrNull(form.thumbnail_url);

    if (imageFile) {
      setIsUploading(true);
      try {
        const [imageBlob, thumbnailBlob] = await Promise.all([
          convertToWebp(imageFile, { maxWidth: 1200, quality: 0.8 }),
          convertToWebp(imageFile, {
            maxWidth: 160,
            maxHeight: 160,
            quality: 0.75,
            cover: true,
          }),
        ]);

        const uploadBody = new FormData();
        uploadBody.append("image", imageBlob, "image.webp");
        uploadBody.append("thumbnail", thumbnailBlob, "thumbnail.webp");

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${session.access_token}` },
          body: uploadBody,
        });
        if (!uploadRes.ok) throw new Error("upload failed");

        const uploaded = (await uploadRes.json()) as {
          img_url: string;
          thumbnail_url: string;
        };
        imgUrl = uploaded.img_url;
        thumbnailUrl = uploaded.thumbnail_url;
      } catch {
        setIsUploading(false);
        setIsSubmitting(false);
        setError("이미지 업로드에 실패했어요. 잠시 후 다시 시도해 주세요.");
        return;
      }
      setIsUploading(false);
    }

    const input: PlaceInput = {
      name: form.name.trim(),
      classification: toStringOrNull(form.classification),
      address: toStringOrNull(form.address),
      latitude: toNumberOrNull(form.latitude),
      longitude: toNumberOrNull(form.longitude),
      img_url: imgUrl,
      thumbnail_url: thumbnailUrl,
      ribbon_cardinal: toNumberOrNull(form.ribbon_cardinal),
      ribbon_deepred: toNumberOrNull(form.ribbon_deepred),
      ribbon_pink: toNumberOrNull(form.ribbon_pink),
      desc_thumbnail: toStringOrNull(form.desc_thumbnail),
      desc_detail: toStringOrNull(form.desc_detail),
    };

    const res = await fetch(
      isEdit ? `/api/admin/places/${place.id}` : "/api/admin/places",
      {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(input),
      }
    );

    setIsSubmitting(false);

    if (!res.ok) {
      setError(
        res.status === 403
          ? "관리자 권한이 없어요."
          : "저장에 실패했어요. 잠시 후 다시 시도해 주세요."
      );
      return;
    }

    router.push("/admin/places");
  };

  const handleDelete = async () => {
    if (!place) return;

    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setError("");
    setIsDeleting(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setIsDeleting(false);
      router.push("/login?redirect=/admin/places");
      return;
    }

    const res = await fetch(`/api/admin/places/${place.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    setIsDeleting(false);

    if (!res.ok) {
      setConfirmDelete(false);
      setError(
        res.status === 403
          ? "관리자 권한이 없어요."
          : "삭제에 실패했어요. 잠시 후 다시 시도해 주세요."
      );
      return;
    }

    router.push("/admin/places");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 shadow-sm border border-[#f3d5df] flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>
          식당 이름 <span className="text-[#d6336c]">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={setField("name")}
          placeholder="예) 서강식당"
          required
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>분류</label>
          <input
            type="text"
            value={form.classification}
            onChange={setField("classification")}
            placeholder="예) 한식"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>주소</label>
          <input
            type="text"
            value={form.address}
            onChange={setField("address")}
            placeholder="예) 서울 마포구 ..."
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>위도</label>
          <input
            type="number"
            step="any"
            value={form.latitude}
            onChange={setField("latitude")}
            placeholder="37.551"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>경도</label>
          <input
            type="number"
            step="any"
            value={form.longitude}
            onChange={setField("longitude")}
            placeholder="126.941"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>카디널리본</label>
          <input
            type="number"
            min={0}
            value={form.ribbon_cardinal}
            onChange={setField("ribbon_cardinal")}
            placeholder="0"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>딥레드리본</label>
          <input
            type="number"
            min={0}
            value={form.ribbon_deepred}
            onChange={setField("ribbon_deepred")}
            placeholder="0"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>핑크리본</label>
          <input
            type="number"
            min={0}
            value={form.ribbon_pink}
            onChange={setField("ribbon_pink")}
            placeholder="0"
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>이미지 업로드</label>
        {(imagePreview ?? toStringOrNull(form.img_url)) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagePreview ?? form.img_url}
            alt="이미지 미리보기"
            className="w-full h-[160px] object-cover rounded-xl border border-[#f3d5df] bg-[#fff8fb]"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="text-xs text-[#7a5965] file:mr-3 file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-[#fff1f6] file:text-[#d6336c] file:text-xs file:font-bold file:cursor-pointer"
        />
        <p className="text-[11px] text-[#7a5965]">
          이미지를 선택하면 webp로 변환해 업로드되고, 썸네일도 자동으로 만들어져요.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>이미지 URL</label>
        <input
          type="text"
          value={form.img_url}
          onChange={setField("img_url")}
          placeholder="Supabase Storage 경로 또는 URL"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>썸네일 URL</label>
        <input
          type="text"
          value={form.thumbnail_url}
          onChange={setField("thumbnail_url")}
          placeholder="목록용 썸네일 경로 또는 URL"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>한 줄 소개</label>
        <input
          type="text"
          value={form.desc_thumbnail}
          onChange={setField("desc_thumbnail")}
          placeholder="목록 카드에 보이는 짧은 소개"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>상세 설명</label>
        <textarea
          value={form.desc_detail}
          onChange={setField("desc_detail")}
          placeholder="상세 페이지에 보이는 설명"
          rows={5}
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && <p className="text-xs text-red-500 text-center">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting || isDeleting}
        className="w-full py-3 bg-[#d6336c] text-white text-sm font-bold rounded-xl disabled:opacity-60 transition-opacity"
      >
        {isUploading
          ? "이미지 업로드 중..."
          : isSubmitting
            ? "저장 중..."
            : isEdit
              ? "수정 저장"
              : "식당 추가"}
      </button>

      {isEdit && (
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isSubmitting || isDeleting}
            className={`w-full py-3 text-sm font-bold rounded-xl disabled:opacity-60 transition-colors ${
              confirmDelete
                ? "bg-red-500 text-white"
                : "bg-white text-red-500 border border-red-200"
            }`}
          >
            {isDeleting
              ? "삭제 중..."
              : confirmDelete
                ? "정말 삭제할까요? 한 번 더 누르면 삭제돼요"
                : "식당 삭제"}
          </button>
          {confirmDelete && !isDeleting && (
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="w-full py-2 text-xs text-[#7a5965]"
            >
              취소
            </button>
          )}
        </div>
      )}
    </form>
  );
}
