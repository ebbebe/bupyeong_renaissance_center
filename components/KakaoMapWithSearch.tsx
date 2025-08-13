"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    kakao: any;
  }
}

interface Location {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name?: string;
  x: string; // longitude
  y: string; // latitude
  distance?: string;
  phone?: string;
  category_name?: string;
  place_url?: string;
}

interface MapProps {
  latitude?: number;
  longitude?: number;
  level?: number;
  selectedCategory?: string | null;
  onLocationSelect?: (location: Location) => void;
}

// 카테고리별 검색 키워드 및 마커 색상
const CATEGORY_CONFIG = {
  toilet: {
    keyword: "화장실",
    markerImage: "/images/marker_toilet.svg",
    fallbackColor: "#4B5563", // gray-600
    zIndex: 1
  },
  parking: {
    keyword: "공영주차장",
    markerImage: "/images/marker_parking.svg", 
    fallbackColor: "#3B82F6", // blue-500
    zIndex: 2
  },
  bus: {
    keyword: "버스정류장",
    markerImage: "/images/marker_bus.svg",
    fallbackColor: "#10B981", // green-500
    zIndex: 3
  },
  subway: {
    keyword: "지하철역",
    markerImage: "/images/marker_subway.svg",
    fallbackColor: "#8B5CF6", // purple-500
    zIndex: 4
  }
};

export default function KakaoMapWithSearch({ 
  latitude = 37.4907, 
  longitude = 126.7246,
  level = 3,
  selectedCategory,
  onLocationSelect
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string>("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [searchResults, setSearchResults] = useState<Location[]>([]);

  // 마커 모두 제거
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
  }, []);

  // 마커 생성 함수
  const createMarker = useCallback((location: Location, map: any, category?: string) => {
    const position = new window.kakao.maps.LatLng(
      parseFloat(location.y),
      parseFloat(location.x)
    );

    // 커스텀 마커 이미지 설정
    let markerImage = null;
    if (category && CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG]) {
      const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
      const imageSize = new window.kakao.maps.Size(36, 36);
      const imageOption = { offset: new window.kakao.maps.Point(18, 36) };
      
      // 이미지가 있으면 사용, 없으면 기본 마커 색상 사용
      markerImage = new window.kakao.maps.MarkerImage(
        config.markerImage,
        imageSize,
        imageOption
      );
    }

    const marker = new window.kakao.maps.Marker({
      position: position,
      map: map,
      image: markerImage,
      clickable: true,
      zIndex: category ? CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG].zIndex : 0
    });

    // 마커 클릭 이벤트
    window.kakao.maps.event.addListener(marker, 'click', () => {
      const content = `
        <div style="padding: 10px; min-width: 200px;">
          <h4 style="margin: 0 0 5px 0; font-weight: bold;">${location.place_name}</h4>
          <p style="margin: 0; font-size: 12px; color: #666;">
            ${location.road_address_name || location.address_name}
          </p>
          ${location.phone ? `<p style="margin: 5px 0 0 0; font-size: 12px;">📞 ${location.phone}</p>` : ''}
          ${location.distance ? `<p style="margin: 5px 0 0 0; font-size: 12px;">📍 ${location.distance}m</p>` : ''}
          ${location.place_url ? `
            <a href="${location.place_url}" target="_blank" 
               style="display: inline-block; margin-top: 8px; padding: 4px 8px; 
                      background: #3B82F6; color: white; text-decoration: none; 
                      border-radius: 4px; font-size: 12px;">
              자세히 보기
            </a>
          ` : ''}
        </div>
      `;

      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }

      infoWindowRef.current = new window.kakao.maps.InfoWindow({
        content: content,
        removable: true
      });

      infoWindowRef.current.open(map, marker);

      if (onLocationSelect) {
        onLocationSelect(location);
      }
    });

    markersRef.current.push(marker);
    return marker;
  }, [onLocationSelect]);

  // 카카오 로컬 API로 장소 검색
  const searchPlaces = useCallback((map: any, category: string) => {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      console.error("카카오맵 서비스를 사용할 수 없습니다.");
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
    
    if (!config) {
      console.error("지원하지 않는 카테고리입니다:", category);
      return;
    }

    // 검색 옵션
    const searchOptions = {
      location: new window.kakao.maps.LatLng(
        userLocation?.lat || latitude,
        userLocation?.lng || longitude
      ),
      radius: 2000, // 2km 반경
      sort: window.kakao.maps.services.SortBy.DISTANCE
    };

    // 키워드로 검색
    ps.keywordSearch(
      config.keyword,
      (data: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          clearMarkers();
          const results: Location[] = [];

          data.forEach((place: any) => {
            const location: Location = {
              id: place.id,
              place_name: place.place_name,
              address_name: place.address_name,
              road_address_name: place.road_address_name,
              x: place.x,
              y: place.y,
              distance: place.distance,
              phone: place.phone,
              category_name: place.category_name,
              place_url: place.place_url
            };

            results.push(location);
            createMarker(location, map, category);
          });

          setSearchResults(results);

          // 검색 결과가 있으면 첫 번째 결과로 지도 중심 이동
          if (results.length > 0) {
            const bounds = new window.kakao.maps.LatLngBounds();
            results.forEach(location => {
              bounds.extend(new window.kakao.maps.LatLng(
                parseFloat(location.y),
                parseFloat(location.x)
              ));
            });
            map.setBounds(bounds);
          }
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          clearMarkers();
          setSearchResults([]);
          alert('검색 결과가 없습니다.');
        } else {
          console.error('검색 중 오류가 발생했습니다.');
        }
      },
      searchOptions
    );
  }, [latitude, longitude, userLocation, clearMarkers, createMarker]);

  // 사용자 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("위치 정보를 가져올 수 없습니다:", error);
        }
      );
    }
  }, []);

  // 카카오맵 초기화
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    
    if (!apiKey) {
      setError("카카오맵 API 키가 설정되지 않았습니다.");
      return;
    }
    
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,clusterer,drawing&autoload=false`;
    script.async = true;

    script.onload = () => {
      if (!window.kakao || !window.kakao.maps) {
        setError("카카오맵 객체를 찾을 수 없습니다.");
        return;
      }

      window.kakao.maps.load(() => {
        if (!mapContainer.current) return;

        try {
          const options = {
            center: new window.kakao.maps.LatLng(
              userLocation?.lat || latitude,
              userLocation?.lng || longitude
            ),
            level: level,
          };

          const map = new window.kakao.maps.Map(mapContainer.current, options);
          mapInstance.current = map;

          // 현재 위치 마커 (사용자 위치가 있을 경우)
          if (userLocation) {
            const userMarker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng),
              map: map,
              title: "현재 위치"
            });

            // 현재 위치를 표시하는 원
            const circle = new window.kakao.maps.Circle({
              center: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng),
              radius: 50,
              strokeWeight: 2,
              strokeColor: '#3B82F6',
              strokeOpacity: 0.8,
              strokeStyle: 'solid',
              fillColor: '#3B82F6',
              fillOpacity: 0.3
            });
            circle.setMap(map);
          }

          // 지도 컨트롤 추가
          const mapTypeControl = new window.kakao.maps.MapTypeControl();
          map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

          const zoomControl = new window.kakao.maps.ZoomControl();
          map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

          setMapLoaded(true);
        } catch (err) {
          console.error("맵 초기화 중 오류:", err);
          setError("지도 초기화 중 오류가 발생했습니다.");
        }
      });
    };

    script.onerror = () => {
      setError("카카오맵을 불러올 수 없습니다. API 키와 도메인 등록을 확인하세요.");
    };

    document.head.appendChild(script);

    return () => {
      clearMarkers();
      const existingScript = document.querySelector(
        `script[src*="dapi.kakao.com"]`
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [latitude, longitude, level, userLocation, clearMarkers]);

  // 카테고리 선택 시 검색 실행
  useEffect(() => {
    if (mapLoaded && mapInstance.current && selectedCategory) {
      searchPlaces(mapInstance.current, selectedCategory);
    } else if (mapLoaded && mapInstance.current && !selectedCategory) {
      clearMarkers();
      setSearchResults([]);
    }
  }, [selectedCategory, mapLoaded, searchPlaces, clearMarkers]);

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