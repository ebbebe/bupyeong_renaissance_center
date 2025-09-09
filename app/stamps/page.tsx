"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ServicePrepModal from "@/components/stamps/ServicePrepModal";

export default function StampsPage() {
  const [activeTab, setActiveTab] = useState<"status" | "history">("status");
  const [isLoaded, setIsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
    // 페이지 로드 시 모달을 표시
    setTimeout(() => setShowModal(true), 300);
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
    router.push('/main');
  };

  const stampHistory = [
    { id: 1, date: "25.07.08", description: "상권홍보/SNS/기타 완료 스탬프 지급" },
    { id: 2, date: "25.07.07", description: "평리단길/영화/음악/인물 완료 스탬프 지급" },
    { id: 3, date: "25.07.06", description: "부평 상권변천사 역사보기 스탬프 지급" },
    { id: 4, date: "25.07.01", description: "앱런 스탬프 지급" }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] relative overflow-hidden">
      {/* Background stamp decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute w-[407px] h-[283px] -right-[90px] top-[50px] transition-all duration-1000 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <img
            src="/images/stamp_decoration.png"
            alt=""
            className="w-full h-full object-cover"
            style={{
              maskImage: `url('/images/stamp_mask.svg')`,
              maskSize: '211px 211px',
              maskPosition: '87px 65px',
              maskRepeat: 'no-repeat',
              WebkitMaskImage: `url('/images/stamp_mask.svg')`,
              WebkitMaskSize: '211px 211px',
              WebkitMaskPosition: '87px 65px',
              WebkitMaskRepeat: 'no-repeat'
            }}
          />
        </div>
      </div>

      {/* Header */}
      <div className={`absolute left-0 right-0 top-0 z-50 bg-transparent transition-all duration-700 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <div className="relative flex items-center justify-center h-24">
          <button
            onClick={() => router.push('/main')}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <svg width="14" height="24" viewBox="0 0 14 24" fill="none">
              <path d="M12 2L2 12L12 22" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-[24px] font-bold text-black">스탬프 현황</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="pt-32 px-4 pb-8">
        {/* Title section */}
        <div className={`mb-12 transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
        }`} style={{ transitionDelay: '200ms' }}>
          <h2 className="text-[36px] leading-[50px] text-black">
            <span className="font-bold">스탬프</span>
            <span className="font-extralight">를</span><br/>
            <span className="font-extralight">채우면 </span><br/>
            <span className="font-bold">할인</span>
            <span className="font-extralight">은 기본</span>
          </h2>
        </div>

        {/* Tab container with glass effect */}
        <div className={`bg-white/60 backdrop-blur-md rounded-xl p-4 mb-2 border-[2.67px] border-white/80 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)] transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`} style={{ transitionDelay: '400ms' }}>
          <div className="flex gap-8 justify-center">
            <button
              onClick={() => setActiveTab("status")}
              className={`text-[20px] font-medium transition-all ${
                activeTab === "status"
                  ? "text-black"
                  : "text-black/40"
              }`}
            >
              스탬프 현황
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`text-[20px] font-medium transition-all ${
                activeTab === "history"
                  ? "text-black"
                  : "text-black/40"
              }`}
            >
              스탬프 내역
            </button>
          </div>
          
          {/* Tab indicator */}
          <div className="relative mt-3">
            <div className="h-[3px] bg-[#d4d3d3] rounded-lg"/>
            <div 
              className="absolute top-0 h-[3px] bg-[#16cb73] rounded-lg transition-all duration-300"
              style={{
                width: '50%',
                left: activeTab === "status" ? '0' : '50%'
              }}
            />
          </div>
        </div>

        {/* Content container with glass effect */}
        <div className={`bg-white/60 backdrop-blur-md rounded-b-xl px-4 pt-4 pb-8 border-[2.67px] border-white/80 border-t-0 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)] transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`} style={{ transitionDelay: '500ms' }}>
          {/* Tab content */}
          <div className="relative min-h-[400px]">
            {/* Stamp Status Tab */}
            {activeTab === "status" && (
              <div className="flex flex-col items-center">
                <p className="text-black text-[14px] font-bold mb-8 text-center">
                  9개의 스탬프를 모으면 할인 쿠폰을 드립니다.
                </p>
                
                {/* Using the actual stamp grid image from Figma */}
                <div className="transition-all duration-700">
                  <img 
                    src="/images/stamp_grid.png" 
                    alt="Stamp Grid" 
                    className="w-[267px] h-[268px] mb-8"
                  />
                </div>
                
                <button
                  className="px-12 py-4 bg-[#16cb73] text-white font-bold text-[14px] rounded-full"
                  disabled={true}
                >
                  쿠폰 발급
                </button>
              </div>
            )}

            {/* Stamp History Tab */}
            {activeTab === "history" && (
              <div className="space-y-3 mt-6">
                {stampHistory.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 bg-white/50 rounded-lg transition-all duration-500 ${
                      activeTab === "history" ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <span className="text-gray-600 text-[14px] font-medium">{item.date}</span>
                    <span className="text-black text-[15px]">{item.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Service Prep Modal */}
      <ServicePrepModal 
        isOpen={showModal} 
        onClose={handleModalClose} 
      />
    </div>
  );
}