"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// 카카오맵을 동적으로 import (SSR 비활성화)
const KakaoMapWithSearch = dynamic(() => import("@/components/KakaoMapWithSearch"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
      <p className="text-gray-500">지도를 불러오는 중...</p>
    </div>
  ),
});

// 카테고리 데이터
const categories = [
  {
    id: "toilet",
    name: "화장실",
    icon: "/images/toilet_icon.png",
    description: "공중화장실"
  },
  {
    id: "parking",
    name: "주차장",
    icon: "/images/parking_icon.png",
    description: "공영주차장"
  },
  {
    id: "bus",
    name: "버스",
    icon: "/images/bus_icon.png",
    description: "버스정류장"
  },
  {
    id: "subway",
    name: "지하철",
    icon: "/images/subway_icon_final.svg",
    description: "지하철역"
  }
];

interface LocationInfo {
  place_name: string;
  address_name: string;
  road_address_name?: string;
  phone?: string;
  distance?: string;
}

export default function FacilitiesPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(null);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    setSelectedLocation(null);
  };

  const handleLocationSelect = (location: LocationInfo) => {
    setSelectedLocation(location);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden">
      {/* Kakao Map with Search */}
      <div className="absolute inset-0">
        <KakaoMapWithSearch 
          latitude={37.4907} 
          longitude={126.7246} 
          level={4}
          selectedCategory={selectedCategory}
          onLocationSelect={handleLocationSelect}
        />
      </div>

      {/* 마커는 카카오맵에서 직접 표시하도록 수정 예정 */}

      {/* Back Button - Figma 디자인 적용 */}
      <div className={`absolute left-[30px] top-[53px] z-[1000] transition-all duration-700 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <button
          onClick={() => router.push('/main')}
          className="w-10 h-10 bg-white/90 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center hover:scale-110 transition-all"
        >
          <img src="/images/back_arrow.svg" alt="뒤로가기" className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Category Bar - Figma 디자인 적용 */}
      <div className={`absolute bottom-[100px] left-4 right-4 z-[1000] transition-all duration-700 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="flex gap-3 justify-center">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`relative aspect-square w-[22vw] max-w-[88.689px] rounded-xl transition-all duration-300 hover:scale-105 ${
                selectedCategory === category.id 
                  ? 'bg-white ring-2 ring-blue-500 shadow-lg' 
                  : 'bg-white/90 shadow-md hover:shadow-lg'
              }`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
                animationDelay: `${index * 100}ms`
              }}
            >
              <img 
                src={category.icon}
                alt={category.name}
                className="w-[60px] h-[60px] object-contain absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className={`absolute top-24 left-4 right-4 z-[1000] bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg transition-all duration-500 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <button
            onClick={() => setSelectedLocation(null)}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
          >
            <span className="text-gray-600">×</span>
          </button>
          <h2 className="text-lg font-bold mb-2 pr-6">
            {selectedLocation.place_name}
          </h2>
          <p className="text-sm text-gray-600 mb-1">
            {selectedLocation.road_address_name || selectedLocation.address_name}
          </p>
          {selectedLocation.phone && (
            <p className="text-sm text-gray-600 mb-1">
              📞 {selectedLocation.phone}
            </p>
          )}
          {selectedLocation.distance && (
            <p className="text-sm text-gray-600">
              📍 현재 위치에서 {selectedLocation.distance}m
            </p>
          )}
        </div>
      )}
    </div>
  );
}