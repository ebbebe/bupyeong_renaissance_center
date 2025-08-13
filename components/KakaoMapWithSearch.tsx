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
    zIndex: 1,
    useCategory: false,
    categoryCode: null
  },
  parking: {
    keyword: "주차장",  // "공영주차장" → "주차장"으로 변경 (더 많은 결과)
    markerImage: "/images/marker_parking.svg", 
    fallbackColor: "#3B82F6", // blue-500
    zIndex: 2,
    useCategory: true,
    categoryCode: "PK6"  // 주차장 카테고리 코드
  },
  bus: {
    keyword: "버스",  // 버스 키워드로 먼저 시도
    markerImage: "/images/marker_bus.svg",
    fallbackColor: "#10B981", // green-500
    zIndex: 3,
    useCategory: false,
    categoryCode: null  // 버스는 카테고리 코드가 없음
  },
  subway: {
    keyword: "지하철역",
    markerImage: "/images/marker_subway.svg",
    fallbackColor: "#8B5CF6", // purple-500
    zIndex: 4,
    useCategory: true,
    categoryCode: "SW8"  // 지하철역 카테고리 코드
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

    // 검색 콜백 함수
    const searchCallback = (data: any, status: any) => {
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

          // 지도 중심은 그대로 유지하고 줌 레벨만 조정
          // 검색 결과가 많으면 약간 줌아웃
          if (results.length > 5) {
            map.setLevel(5);
          } else if (results.length > 0) {
            map.setLevel(4);
          }
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          clearMarkers();
          setSearchResults([]);
          console.log(`${config.keyword} 검색 결과가 없습니다.`);
          // 버스의 경우 다른 키워드로 재시도
          if (category === 'bus') {
            console.log("'정류장' 키워드로 재검색 시도...");
            ps.keywordSearch("정류장", searchCallback, searchOptions);
            return;
          }
          alert('검색 결과가 없습니다.');
        } else {
          console.error('검색 중 오류가 발생했습니다.');
        }
      };

    // 카테고리 코드가 있으면 카테고리 검색, 없으면 키워드 검색
    if (config.useCategory && config.categoryCode) {
      console.log(`카테고리 검색: ${config.categoryCode}`);
      ps.categorySearch(config.categoryCode, searchCallback, searchOptions);
    } else {
      console.log(`키워드 검색: ${config.keyword}`);
      ps.keywordSearch(config.keyword, searchCallback, searchOptions);
    }
  }, [latitude, longitude, userLocation, clearMarkers, createMarker]);

  // 사용자 위치 가져오기 (컴포넌트 마운트 시 한 번만)
  useEffect(() => {
    console.log("위치 정보 요청 시작...");
    if (navigator.geolocation) {
      // 먼저 캐시된 위치가 있으면 빠르게 사용
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log("현재 위치 획득 성공:", newLocation);
          console.log("정확도:", position.coords.accuracy, "m");
          setUserLocation(newLocation);
        },
        (error) => {
          console.error("위치 정보 에러:", error.code, error.message);
          // 위치 정보를 가져올 수 없으면 부평역을 기본 위치로 사용
          alert("위치 정보를 가져올 수 없습니다. 부평역을 기준으로 표시합니다.");
          setUserLocation({
            lat: latitude,
            lng: longitude
          });
        },
        {
          enableHighAccuracy: false, // 빠른 응답을 위해 false로 변경
          timeout: 10000, // 10초로 증가
          maximumAge: 30000 // 30초 캐시 허용
        }
      );
    } else {
      console.log("Geolocation API를 지원하지 않는 브라우저입니다.");
    }
  }, []); // 빈 배열로 한 번만 실행

  // 카카오맵 초기화 (한 번만 실행)
  useEffect(() => {
    if (mapInstance.current) return; // 이미 맵이 있으면 재생성하지 않음
    
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    
    if (!apiKey) {
      setError("카카오맵 API 키가 설정되지 않았습니다.");
      return;
    }
    
    // initializeMap 함수를 먼저 정의
    const initializeMap = () => {
      window.kakao.maps.load(() => {
        if (!mapContainer.current || mapInstance.current) return;

        try {
          const options = {
            center: new window.kakao.maps.LatLng(latitude, longitude), // 일단 부평역으로 초기화
            level: level,
          };

          const map = new window.kakao.maps.Map(mapContainer.current, options);
          mapInstance.current = map;

          // 지도 스타일 설정 - 기본 로드맵 사용
          map.setMapTypeId(window.kakao.maps.MapTypeId.ROADMAP);
          
          // 카카오맵은 커스텀 스타일을 지원하지 않아 CSS 필터 제거
          // Figma의 심플한 디자인은 별도 맵 서비스(Mapbox, Google Maps) 사용 필요

          setMapLoaded(true);
        } catch (err) {
          console.error("맵 초기화 중 오류:", err);
          setError("지도 초기화 중 오류가 발생했습니다.");
        }
      });
    };
    
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existingScript && window.kakao && window.kakao.maps) {
      // 스크립트가 이미 로드되어 있으면 바로 맵 생성
      initializeMap();
      return;
    }
    
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,clusterer,drawing&autoload=false`;
    script.async = true;

    script.onload = initializeMap;
    script.onerror = () => {
      setError("카카오맵을 불러올 수 없습니다. API 키와 도메인 등록을 확인하세요.");
    };

    document.head.appendChild(script);
  }, []); // 빈 배열로 한 번만 실행

  // 사용자 위치가 업데이트되면 지도 중심 이동
  useEffect(() => {
    if (mapInstance.current && userLocation) {
      console.log("지도 중심 이동:", userLocation);
      const position = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng);
      
      // 지도 중심과 레벨 동시 설정
      mapInstance.current.setCenter(position);
      mapInstance.current.setLevel(4);
      
      // 기존 현재 위치 마커 제거 (있다면)
      // 현재 위치 마커 추가
      const userMarker = new window.kakao.maps.Marker({
        position: position,
        map: mapInstance.current,
        title: "현재 위치",
        zIndex: 999
      });

      // 현재 위치를 표시하는 원
      const circle = new window.kakao.maps.Circle({
        center: position,
        radius: 100,
        strokeWeight: 2,
        strokeColor: '#3B82F6',
        strokeOpacity: 0.8,
        strokeStyle: 'solid',
        fillColor: '#3B82F6',
        fillOpacity: 0.2,
        map: mapInstance.current
      });
      
      // 부드럽게 이동
      setTimeout(() => {
        if (mapInstance.current) {
          mapInstance.current.panTo(position);
        }
      }, 500);
    }
  }, [userLocation]);

  // 카테고리 선택 시 검색 실행
  useEffect(() => {
    if (mapLoaded && mapInstance.current && selectedCategory) {
      // 현재 지도 중심 저장
      const currentCenter = mapInstance.current.getCenter();
      searchPlaces(mapInstance.current, selectedCategory);
      // 검색 후 지도 중심 복원
      setTimeout(() => {
        if (mapInstance.current) {
          mapInstance.current.setCenter(currentCenter);
        }
      }, 100);
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