"use client";

import { useEffect, useRef, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    kakao: any;
  }
}

interface MapProps {
  latitude?: number;
  longitude?: number;
  level?: number;
}

export default function KakaoMap({ 
  latitude = 37.4907, 
  longitude = 126.7246,
  level = 3 
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY || "28477889edc216bfc45127f2cb90ecc0";
    console.log("카카오맵 API 키:", apiKey ? "설정됨" : "없음");
    
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (!mapContainer.current) return;

        try {
          const options = {
            center: new window.kakao.maps.LatLng(latitude, longitude),
            level: level,
          };

          const map = new window.kakao.maps.Map(mapContainer.current, options);

          // 부평역 마커 추가
          const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            title: "부평역"
          });
          marker.setMap(map);

          // 지도 컨트롤 추가
          const mapTypeControl = new window.kakao.maps.MapTypeControl();
          map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

          const zoomControl = new window.kakao.maps.ZoomControl();
          map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

          setMapLoaded(true);
        } catch (err) {
          console.error("카카오맵 초기화 오류:", err);
          setError("지도를 불러오는 중 오류가 발생했습니다.");
        }
      });
    };

    script.onerror = () => {
      setError("카카오맵 스크립트를 불러올 수 없습니다.");
    };

    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        `script[src*="dapi.kakao.com"]`
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [latitude, longitude, level]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer}
        className="w-full h-full"
        style={{ minHeight: "100vh" }}
      />
      {!mapLoaded && !error && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-gray-600">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>지도를 불러오는 중...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-red-600 text-center">
            <p className="mb-2">{error}</p>
            <p className="text-sm text-gray-600">API 키를 확인해주세요.</p>
          </div>
        </div>
      )}
    </div>
  );
}