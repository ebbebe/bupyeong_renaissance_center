"use client";

import { useState, useEffect } from "react";
import EventsHeader from "@/components/events/EventsHeader";
import TabMenu from "@/components/events/TabMenu";
import EventCard from "@/components/events/EventCard";

// Sample event data (나중에 DB에서 가져올 데이터)
const ongoingEvents = [
  {
    id: 1,
    title: "SUMMER FESTIVAL",
    imageSrc: "/images/summer_festival.png",
    link: "https://example.com/summer-festival"
  },
  {
    id: 2,
    title: "MUSIC Festival",
    imageSrc: "/images/music_festival.png",
    link: "https://example.com/music-festival"
  },
  {
    id: 3,
    title: "ELECTRO PARTY",
    imageSrc: "/images/electro_festival.png",
    link: "https://example.com/electro-party"
  }
];

const infoData = [
  {
    id: 1,
    title: "행사 참가 안내",
    content: "모든 행사는 사전 등록이 필요합니다."
  },
  {
    id: 2,
    title: "주차 안내",
    content: "행사장 인근 공영주차장을 이용해주세요."
  },
  {
    id: 3,
    title: "문의처",
    content: "부평구청 문화관광과 032-509-6000"
  }
];

export default function EventsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'ongoing' | 'info'>('ongoing');

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#fcfcfc] overflow-hidden">
      {/* Background decoration */}
      <div 
        className={`absolute right-[50px] top-[140px] w-[370px] h-[260px] transition-all duration-1000 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url('/images/events_decoration.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            maskImage: `url('/images/events_mask.svg')`,
            maskSize: '240px 260px',
            maskPosition: 'center',
            maskRepeat: 'no-repeat'
          }}
        />
      </div>

      {/* Header */}
      <EventsHeader />

      {/* Main content */}
      <div className={`relative z-10 pt-24 px-4 transition-all duration-700 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Title section */}
        <div className={`mt-10 mb-8 transition-all duration-700 delay-200 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-[36px] leading-[50px]">
            <span className="font-bold text-black">행사</span>
            <span className="font-extralight text-black">와</span>
            <br />
            <span className="font-bold text-black">축제</span>
            <span className="font-extralight text-black"> 정보를</span>
            <br />
            <span className="font-extralight text-black">한눈에</span>
          </h2>
        </div>

        {/* Tab menu */}
        <div className={`mb-6 transition-all duration-700 delay-300 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <TabMenu activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Content area */}
        <div className="backdrop-blur-md bg-white/70 rounded-xl border-[2.67px] border-white shadow-lg p-4 min-h-[400px]">
          {activeTab === 'ongoing' ? (
            <div className="space-y-4">
              {ongoingEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  imageSrc={event.imageSrc}
                  link={event.link}
                  delay={400 + index * 100}
                  isVisible={isLoaded}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {infoData.map((info, index) => (
                <div
                  key={info.id}
                  className={`p-4 bg-white/50 rounded-lg transition-all duration-500 ${
                    isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                  }`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <h3 className="text-lg font-bold text-black mb-2">{info.title}</h3>
                  <p className="text-gray-700">{info.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-32" />

      {/* Animation styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(5deg); }
          50% { transform: translateY(-20px) rotate(-5deg); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}