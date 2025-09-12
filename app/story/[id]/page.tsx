"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { storyAPI, StoryItem } from "@/lib/supabase";

export default function StoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [story, setStory] = useState<StoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFromQR, setIsFromQR] = useState(false);
  const resolvedParams = use(params);

  useEffect(() => {
    // QR 코드로 접속했는지 확인 (히스토리가 1개 이하이거나 referrer가 없으면 QR로 판단)
    if (typeof window !== 'undefined') {
      const fromQR = window.history.length <= 2 || !document.referrer || !document.referrer.includes(window.location.origin);
      setIsFromQR(fromQR);
    }

    const fetchStory = async () => {
      try {
        setLoading(true);
        const stories = await storyAPI.getAll();
        
        // UUID로 스토리 찾기
        const foundStory = stories.find(s => s.id === resolvedParams.id);
        
        setStory(foundStory || null);
      } catch (error) {
        console.error("Error fetching story:", error);
      } finally {
        setLoading(false);
        setTimeout(() => setIsLoaded(true), 100);
      }
    };

    fetchStory();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">스토리를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">스토리를 찾을 수 없습니다.</p>
          <button
            onClick={() => isFromQR ? router.push('/') : router.back()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            {isFromQR ? '메인으로' : '돌아가기'}
          </button>
        </div>
      </div>
    );
  }

  const formatTitle = (title: string) => {
    const replacements: Record<string, string> = {
      '상인들에 의해 주도된 부평문화의 거리': '상인들에 의해 주도된\n부평문화의 거리',
      '문화의 거리 공식채널 인스타그램': '부평문화의거리\n공식채널 인스타그램'
    };
    return replacements[title] || title;
  };

  return (
    <div className="relative min-h-screen bg-[#fcfcfc] overflow-hidden">
      {/* Header */}
      <div className={`absolute left-0 right-0 top-0 z-50 bg-transparent transition-all duration-700 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <div className="relative flex items-center justify-center h-24">
          <button
            onClick={() => isFromQR ? router.push('/') : router.back()}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <svg width="14" height="24" viewBox="0 0 14 24" fill="none">
              <path d="M12 2L2 12L12 22" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-[24px] font-bold text-black px-12 text-center whitespace-pre-line">{formatTitle(story.title)}</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="pt-28">
        {/* Image section */}
        <div className={`relative mx-6 h-[280px] mb-8 transition-all duration-700 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`} style={{ transitionDelay: '200ms' }}>
          {story.image_url && (
            <img 
              src={story.image_url} 
              alt={story.title}
              className="w-full h-full object-cover rounded-2xl shadow-lg"
            />
          )}

        </div>

        {/* Subtitle */}
        <div className={`px-6 mb-6 transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
        }`} style={{ transitionDelay: '400ms' }}>
          <p className="text-[18px] font-medium text-[#666] leading-[28px]">
            {story.subtitle}
          </p>
        </div>

        {/* Additional Images Gallery */}
        {story.additional_images && story.additional_images.length > 0 && (
          <div className={`px-6 mb-8 transition-all duration-700 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`} style={{ transitionDelay: '500ms' }}>
            <div className={`${
              story.additional_images.length === 1 
                ? 'flex justify-center' 
                : story.additional_images.length === 2
                  ? 'grid grid-cols-2 gap-3'
                  : 'grid grid-cols-2 gap-3'
            }`}>
              {story.additional_images.map((imageUrl, index) => (
                <div 
                  key={index}
                  className={`${
                    story.additional_images!.length === 1 
                      ? 'w-full max-w-md' 
                      : ''
                  } overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl`}
                  style={{ 
                    animation: `fadeInUp ${0.6 + index * 0.1}s ease-out`,
                    animationFillMode: 'both'
                  }}
                >
                  <img 
                    src={imageUrl} 
                    alt={`${story.title} 이미지 ${index + 1}`}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-6 mb-12">
          {story.content.map((paragraph, index) => (
            <div 
              key={index}
              className={`mb-6 transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${600 + index * 100}ms` }}
            >
              <p className="text-[16px] text-[#333] leading-[28px] font-normal">
                {paragraph}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom spacing */}
        <div className="h-20"></div>
      </div>

      {/* Animation styles for additional images */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}