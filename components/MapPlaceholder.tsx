"use client";

import { useState, useRef } from "react";
import { useKakaoLoader, Map, CustomOverlayMap } from "react-kakao-maps-sdk";
import { LocateFixed } from "lucide-react";
import { Place } from "@/types/place";

const SOGANG_CENTER = { lat: 37.551, lng: 126.9394 };
const FILTER_OPTIONS = ["한식", "일식", "양식", "아시안", "카페"];

interface Props {
  places: Place[];
  selectedPlaceId: string | null;
  onMarkerClick: (id: string) => void;
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

export default function MapPlaceholder({ places, selectedPlaceId, onMarkerClick, activeFilter, onFilterChange }: Props) {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_JS_KEY!,
  });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);

  function handleMyLocation() {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const loc = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      setUserLocation(loc);

      if (mapRef.current) {
        mapRef.current.setLevel(3);

        mapRef.current.panTo(
          new window.kakao.maps.LatLng(loc.lat, loc.lng)
        );
      }
    },
    () => {
      alert("위치 권한을 허용해주세요.");
    }
  );
}

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
        <>
          <div className="absolute top-3 left-0 right-0 z-10 flex gap-2 px-3 overflow-x-auto no-scrollbar">
            {FILTER_OPTIONS.map((filter) => (
              <button
                key={filter}
                onClick={() => onFilterChange(activeFilter === filter ? null : filter)}
                className={`flex-none px-[13px] py-[9px] rounded-full text-[13px] font-black border transition-colors ${
                  activeFilter === filter
                    ? "bg-[#d6336c] text-white border-[#d6336c]"
                    : "bg-white text-[#d6336c] border-[#f0b6c9]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button
            onClick={handleMyLocation}
            className="absolute bottom-3 right-3 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center border border-[#f0b6c9]"
          >
            <LocateFixed size={18} className="text-[#d6336c]" />
          </button>

          <Map
            center={SOGANG_CENTER}
            style={{ width: "100%", height: "100%" }}
            level={4}
            onCreate={(map) => { mapRef.current = map; }}
          >
            {places.map((place) => {
              if (place.latitude == null || place.longitude == null) return null;
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

            {userLocation && (
              <CustomOverlayMap position={userLocation}>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#2563eb",
                    border: "3px solid white",
                    boxShadow: "0 2px 8px rgba(37,99,235,0.5)",
                  }}
                />
              </CustomOverlayMap>
            )}
          </Map>
        </>
      )}
    </div>
  );
}
