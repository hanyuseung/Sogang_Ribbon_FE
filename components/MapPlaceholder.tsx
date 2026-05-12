"use client";

import { useKakaoLoader, Map, CustomOverlayMap } from "react-kakao-maps-sdk";
import { Place } from "@/types/place";

const SOGANG_CENTER = { lat: 37.551, lng: 126.9394 };

interface Props {
  places: Place[];
  selectedPlaceId: number | null;
  onMarkerClick: (id: number) => void;
}

export default function MapPlaceholder({ places, selectedPlaceId, onMarkerClick }: Props) {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_JS_KEY!,
  });

  return (
    <div className="relative h-[300px] rounded-[28px] overflow-hidden mb-4">
      {loading && (
        <div className="flex h-full items-center justify-center bg-[#f8edf2] text-[#8a5165] text-sm">
          지도 로딩 중...
        </div>
      )}
      {error && (
        <div className="flex h-full items-center justify-center bg-[#f8edf2] text-[#d6336c] text-sm">
          지도를 불러올 수 없습니다
        </div>
      )}
      {!loading && !error && (
        <Map
          center={SOGANG_CENTER}
          style={{ width: "100%", height: "100%" }}
          level={4}
        >
          {places.map((place) => {
            const isSelected = place.id === selectedPlaceId;
            return (
              <CustomOverlayMap
                key={place.id}
                position={{ lat: place.latitude, lng: place.longitude }}
                yAnchor={1}
              >
                <div
                  onClick={() => onMarkerClick(place.id)}
                  style={{
                    width: isSelected ? "36px" : "28px",
                    height: isSelected ? "36px" : "28px",
                    borderRadius: "50% 50% 50% 0",
                    backgroundColor: isSelected ? "#9b1c31" : "#d6336c",
                    transform: "rotate(-45deg)",
                    boxShadow: "0 8px 18px rgba(214,51,108,0.35)",
                    cursor: "pointer",
                    position: "relative",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: isSelected ? "14px" : "10px",
                      height: isSelected ? "14px" : "10px",
                      borderRadius: "50%",
                      backgroundColor: "white",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </div>
              </CustomOverlayMap>
            );
          })}
        </Map>
      )}
    </div>
  );
}
