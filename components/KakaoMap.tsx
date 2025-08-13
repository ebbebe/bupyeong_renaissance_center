"use client";

import { useEffect, useRef } from "react";

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
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    const initializeMap = () => {
      if (!mapContainer.current || !window.kakao || !window.kakao.maps) {
        return;
      }

      const options = {
        center: new window.kakao.maps.LatLng(latitude, longitude),
        level: level,
      };

      const map = new window.kakao.maps.Map(mapContainer.current, options);
      mapInstance.current = map;

      // 지도 중심 마커 추가
      const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition
      });
      marker.setMap(map);
    };

    // 카카오맵 스크립트가 로드되었는지 확인
    if (window.kakao && window.kakao.maps) {
      initializeMap();
    } else {
      // 스크립트 로드를 기다림
      const loadKakaoMap = () => {
        window.kakao.maps.load(() => {
          initializeMap();
        });
      };

      // 스크립트가 아직 로드되지 않았다면 대기
      const checkKakao = setInterval(() => {
        if (window.kakao) {
          clearInterval(checkKakao);
          loadKakaoMap();
        }
      }, 100);
    }
  }, [latitude, longitude, level]);

  return (
    <div 
      ref={mapContainer}
      className="w-full h-full"
      style={{ minHeight: "400px" }}
    />
  );
}