"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 카테고리 데이터
const categories = [
  {
    id: "toilet",
    name: "화장실",
    icon: "/images/toilet_icon.png",
    locations: [
      { id: 1, name: "부평역 1번 출구", lat: 37.4907, lng: 126.7246 },
      { id: 2, name: "부평문화의거리 공중화장실", lat: 37.4915, lng: 126.7235 }
    ]
  },
  {
    id: "parking",
    name: "주차장",
    icon: "/images/parking_icon.png",
    locations: [
      { id: 1, name: "부평역 공영주차장", lat: 37.4910, lng: 126.7250 },
      { id: 2, name: "문화의거리 주차장", lat: 37.4920, lng: 126.7240 }
    ]
  },
  {
    id: "charging",
    name: "전기차 충전",
    icon: "/images/charging_icon.png",
    locations: [
      { id: 1, name: "부평구청 충전소", lat: 37.4925, lng: 126.7255 }
    ]
  },
  {
    id: "transport",
    name: "대중교통",
    icon: "/images/bus_icon.png",
    locations: [
      { id: 1, name: "부평역", lat: 37.4907, lng: 126.7246 },
      { id: 2, name: "부평시장역", lat: 37.4989, lng: 126.7222 }
    ]
  }
];

export default function FacilitiesPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden">
      {/* Map Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/images/map_bg.png')`,
          backgroundPosition: '55% 50%',
          backgroundSize: '200%'
        }}
      />

      {/* Location Markers (현재 선택된 카테고리의 마커만 표시) */}
      {selectedCategory && (
        <div className="absolute inset-0 pointer-events-none">
          {categories
            .find(cat => cat.id === selectedCategory)
            ?.locations.map((location) => (
              <div
                key={location.id}
                className={`absolute w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg transition-all duration-500 ${
                  isLoaded ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}
                style={{
                  top: `${(location.lat - 37.489) * 5000}px`,
                  left: `${(location.lng - 126.722) * 5000}px`,
                  transitionDelay: `${location.id * 100}ms`
                }}
              >
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap bg-white px-2 py-1 rounded shadow">
                  {location.name}
                </span>
              </div>
            ))}
        </div>
      )}

      {/* Back Button */}
      <div className={`absolute left-6 top-12 z-50 transition-all duration-700 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <button
          onClick={() => router.push('/main')}
          className="w-10 h-10 rounded-xl bg-white/70 backdrop-blur-md border-[1.6px] border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          <svg width="14" height="24" viewBox="0 0 14 24" fill="none">
            <path d="M12 2L2 12L12 22" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Bottom Category Bar */}
      <div className={`absolute bottom-8 left-4 right-4 transition-all duration-700 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="flex gap-3 justify-center">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`relative w-[88px] h-[88px] rounded-xl backdrop-blur-md border-[1.6px] border-white shadow-lg transition-all duration-300 hover:scale-105 ${
                selectedCategory === category.id 
                  ? 'bg-blue-500/80' 
                  : 'bg-white/70'
              }`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center p-3">
                <img 
                  src={category.icon}
                  alt={category.name}
                  className={`w-full h-full object-contain ${
                    selectedCategory === category.id ? 'opacity-100' : 'opacity-80'
                  }`}
                />
              </div>
              {/* Category name tooltip */}
              <span className={`absolute -top-8 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap bg-black/80 text-white px-2 py-1 rounded transition-opacity ${
                selectedCategory === category.id ? 'opacity-100' : 'opacity-0'
              }`}>
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Category Info */}
      {selectedCategory && (
        <div className={`absolute top-24 left-4 right-4 bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg transition-all duration-500 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <h2 className="text-lg font-bold mb-2">
            {categories.find(cat => cat.id === selectedCategory)?.name}
          </h2>
          <p className="text-sm text-gray-600">
            {categories.find(cat => cat.id === selectedCategory)?.locations.length}개 위치
          </p>
        </div>
      )}
    </div>
  );
}