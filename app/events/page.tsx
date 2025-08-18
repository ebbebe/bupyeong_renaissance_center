"use client";

import { useState, useEffect } from "react";
import EventsHeader from "@/components/events/EventsHeader";
import TabMenu from "@/components/events/TabMenu";
import EventCard from "@/components/events/EventCard";
import { eventAPI, EventItem, eventInfoAPI, EventInfo } from "@/lib/supabase";

export default function EventsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'ongoing' | 'info'>('ongoing');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [infoData, setInfoData] = useState<EventInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsData, infoDataResults] = await Promise.all([
          eventAPI.getAll(),
          eventInfoAPI.getAll()
        ]);
        setEvents(eventsData.filter(event => event.is_active));
        setInfoData(infoDataResults);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        setTimeout(() => setIsLoaded(true), 100);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#fcfcfc] overflow-hidden">
        <EventsHeader />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">이벤트를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#fcfcfc] overflow-hidden">
      {/* Background decoration - positioned on the right side */}
      <div 
        className={`absolute right-[-20px] top-[140px] w-[280px] h-[200px] transition-all duration-1000 ${
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
            maskSize: '180px 200px',
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
              {events.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>현재 진행 중인 이벤트가 없습니다.</p>
                  <p className="text-sm mt-2">관리자 페이지에서 이벤트를 추가해보세요.</p>
                </div>
              ) : (
                events.map((event, index) => (
                  <EventCard
                    key={event.id}
                    title={event.title}
                    imageSrc={event.image_url || "/images/default_event.png"}
                    link={event.url || "#"}
                    delay={400 + index * 100}
                    isVisible={isLoaded}
                  />
                ))
              )}
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