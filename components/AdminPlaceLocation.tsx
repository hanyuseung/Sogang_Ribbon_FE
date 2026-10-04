"use client";

import { useEffect, useRef, useState } from "react";
import { useKakaoLoader } from "react-kakao-maps-sdk";
import { kakaoLoaderOptions } from "@/lib/kakao-loader";

type LocationValue = {
  address: string;
  latitude: string;
  longitude: string;
};

type AddressResult = { address_name: string; x: string; y: string };

const inputClass =
  "w-full min-w-0 px-4 py-3 rounded-xl border border-[#f3d5df] bg-[#fff8fb] text-sm text-[#2b1b22] placeholder-[#c4a0b0] focus:outline-none focus:border-[#d6336c]";

export default function AdminPlaceLocation({
  value,
  onChange,
  disabled,
}: {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
  disabled: boolean;
}) {
  const [loading, loadError] = useKakaoLoader(kakaoLoaderOptions);
  const [results, setResults] = useState<AddressResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState("");
  const requestId = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    requestId.current += 1;
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function cancelSearch() {
    requestId.current += 1;
    if (timer.current) clearTimeout(timer.current);
    setSearching(false);
    setResults([]);
  }

  function searchAddress() {
    const query = value.address.trim();
    if (disabled || searching || !query) return;
    if (loading || loadError || !window.kakao?.maps?.services) {
      setMessage("주소 검색을 사용할 수 없어요. 잠시 후 다시 시도하거나 위치를 직접 입력해 주세요.");
      return;
    }

    cancelSearch();
    const currentRequest = requestId.current;
    setSearching(true);
    setMessage("");
    timer.current = setTimeout(() => {
      if (currentRequest !== requestId.current) return;
      cancelSearch();
      setMessage("주소 검색이 지연되고 있어요. 다시 검색하거나 위치를 직접 입력해 주세요.");
    }, 10000);

    try {
      new window.kakao.maps.services.Geocoder().addressSearch(query, (data, status) => {
        if (currentRequest !== requestId.current) return;
        if (timer.current) clearTimeout(timer.current);
        setSearching(false);
        if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
          setResults(data);
          setMessage("아래에서 식당 주소를 선택해 주세요.");
        } else {
          setMessage(status === window.kakao.maps.services.Status.ZERO_RESULT
            ? "주소를 찾지 못했어요. 도로명·건물번호 또는 지번으로 다시 검색해 주세요."
            : "주소 검색에 실패했어요. 다시 시도하거나 위치를 직접 입력해 주세요.");
        }
      });
    } catch {
      cancelSearch();
      setMessage("주소 검색에 실패했어요. 다시 시도하거나 위치를 직접 입력해 주세요.");
    }
  }

  function selectAddress(result: AddressResult) {
    cancelSearch();
    onChange({ address: result.address_name, latitude: result.y, longitude: result.x });
    setMessage("지도 위치가 설정됐어요. 위치가 다르면 아래에서 직접 수정할 수 있어요.");
  }

  return (
    <fieldset disabled={disabled} className="flex min-w-0 flex-col gap-2">
      <label htmlFor="place-address" className="text-xs font-bold text-[#2b1b22]">주소</label>
      <div className="flex gap-2">
        <input
          id="place-address"
          type="text"
          value={value.address}
          onChange={(event) => {
            cancelSearch();
            onChange({ address: event.target.value, latitude: "", longitude: "" });
            setMessage("주소를 검색해 지도 위치를 다시 설정해 주세요.");
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.nativeEvent.isComposing) {
              event.preventDefault();
              searchAddress();
            }
          }}
          placeholder="예) 서울 마포구 백범로 35"
          className={inputClass}
        />
        <button
          type="button"
          onClick={searchAddress}
          disabled={loading || !!loadError || searching || !value.address.trim()}
          className="shrink-0 rounded-xl bg-[#d6336c] px-3 text-xs font-bold text-white disabled:opacity-50"
        >
          {searching ? "검색 중..." : "주소 검색"}
        </button>
      </div>
      <p role="status" className="text-xs leading-relaxed text-[#7a5965]">
        {loadError || !kakaoLoaderOptions.appkey
          ? "주소 검색을 사용할 수 없어요. 아래에서 위치를 직접 입력할 수 있어요."
          : message || "주소를 검색하고 결과를 선택하면 지도 위치가 자동으로 설정돼요."}
      </p>
      {results.length > 0 && (
        <ul aria-label="주소 검색 결과" className="max-h-52 overflow-y-auto rounded-xl border border-[#f3d5df] divide-y divide-[#f3d5df]">
          {results.map((result) => (
            <li key={`${result.address_name}-${result.x}-${result.y}`}>
              <button
                type="button"
                onClick={() => selectAddress(result)}
                className="w-full px-4 py-3 text-left text-sm text-[#2b1b22] hover:bg-[#fff8fb] focus-visible:bg-[#fff1f6]"
              >
                {result.address_name}
              </button>
            </li>
          ))}
        </ul>
      )}
      <details className="mt-1 rounded-xl border border-[#f3d5df] p-3">
        <summary className="cursor-pointer text-xs font-bold text-[#7a5965]">위도 경도 수동 설정</summary>
        <p className="mt-3 text-xs leading-relaxed text-[#7a5965]">검색된 위치가 잘못됐거나 주소 검색이 어려우면 직접 입력해 주세요.</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {([
            { key: "latitude", label: "위도", min: -90, max: 90, placeholder: "37.551" },
            { key: "longitude", label: "경도", min: -180, max: 180, placeholder: "126.941" },
          ] as const).map(({ key, label, min, max, placeholder }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label htmlFor={`place-${key}`} className="text-xs font-bold text-[#2b1b22]">{label}</label>
              <input
                id={`place-${key}`}
                type="number"
                step="any"
                min={min}
                max={max}
                value={value[key]}
                onChange={(event) => {
                  cancelSearch();
                  onChange({ ...value, [key]: event.target.value });
                  setMessage("직접 입력한 위치로 저장돼요.");
                }}
                placeholder={placeholder}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </details>
    </fieldset>
  );
}
