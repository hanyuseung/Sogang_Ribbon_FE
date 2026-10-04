"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { convertToWebp } from "@/lib/image-webp";
import { Place, PlaceInput } from "@/types/place";
import AdminPlaceLocation from "@/components/AdminPlaceLocation";

type FormState = {
  name: string;
  classification: string;
  address: string;
  latitude: string;
  longitude: string;
  ribbon_cardinal: boolean;
  ribbon_deepred: boolean;
  ribbon_pink: boolean;
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
    ribbon_cardinal: (place?.ribbon_cardinal ?? 0) > 0,
    ribbon_deepred: (place?.ribbon_deepred ?? 0) > 0,
    ribbon_pink: (place?.ribbon_pink ?? 0) > 0,
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

const ribbonOptions = [
  { key: "ribbon_cardinal", label: "카디널리본", selectedClass: "bg-[#f8d7da] text-[#9b1c31]" },
  { key: "ribbon_deepred", label: "딥레드리본", selectedClass: "bg-[#ffe2e2] text-[#d9480f]" },
  { key: "ribbon_pink", label: "핑크리본", selectedClass: "bg-[#ffe3ec] text-[#d6336c]" },
] as const;

type TextField = {
  [Key in keyof FormState]: FormState[Key] extends string ? Key : never;
}[keyof FormState];

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
    (key: TextField) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.name.trim() === "") {
      setError("식당 이름을 입력해 주세요.");
      return;
    }

    const latitude = toNumberOrNull(form.latitude);
    const longitude = toNumberOrNull(form.longitude);
    if (
      (form.address.trim() !== "" && (latitude === null || longitude === null)) ||
      (latitude === null) !== (longitude === null) ||
      (latitude !== null && (latitude < -90 || latitude > 90)) ||
      (longitude !== null && (longitude < -180 || longitude > 180))
    ) {
      setError("주소 검색 결과를 선택하거나 ‘위도 경도 수동 설정’에서 올바른 위치를 입력해 주세요.");
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

    let imgUrl = place?.img_url ?? null;
    let thumbnailUrl = place?.thumbnail_url ?? null;

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
      latitude,
      longitude,
      img_url: imgUrl,
      thumbnail_url: thumbnailUrl,
      ribbon_cardinal: form.ribbon_cardinal ? 1 : 0,
      ribbon_deepred: form.ribbon_deepred ? 1 : 0,
      ribbon_pink: form.ribbon_pink ? 1 : 0,
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

      <AdminPlaceLocation
        value={form}
        onChange={(location) => setForm((prev) => ({ ...prev, ...location }))}
        disabled={isSubmitting || isDeleting}
      />

      <fieldset disabled={isSubmitting || isDeleting}>
        <legend className={`${labelClass} mb-2`}>리본</legend>
        <div className="grid grid-cols-3 gap-2">
          {ribbonOptions.map(({ key, label, selectedClass }) => (
            <button
              key={key}
              type="button"
              aria-pressed={form[key]}
              onClick={() => setForm((prev) => ({ ...prev, [key]: !prev[key] }))}
              className={`min-h-11 whitespace-nowrap rounded-full px-[9px] py-1 text-[11px] font-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d6336c] disabled:opacity-60 ${
                form[key] ? selectedClass : "bg-[#eeeeee] text-[#757575]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-[#7a5965]">리본을 누르면 선택되고, 다시 누르면 해제돼요.</p>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="place-image" className={labelClass}>식당 사진</label>
        {(imagePreview ?? place?.img_url) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagePreview ?? place?.img_url ?? undefined}
            alt="이미지 미리보기"
            className="w-full h-[160px] object-cover rounded-xl border border-[#f3d5df] bg-[#fff8fb]"
          />
        )}
        <input
          id="place-image"
          type="file"
          accept="image/*"
          disabled={isSubmitting || isDeleting}
          onChange={handleImageChange}
          className="text-xs text-[#7a5965] file:mr-3 file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-[#fff1f6] file:text-[#d6336c] file:text-xs file:font-bold file:cursor-pointer"
        />
        <p className="text-[11px] text-[#7a5965]">
          사진을 선택하면 카드와 상세 페이지에 맞게 자동으로 준비돼요.
        </p>
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
