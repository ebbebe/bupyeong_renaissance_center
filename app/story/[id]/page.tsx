"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { storyAPI, StoryItem } from "@/lib/supabase";

export default function StoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [story, setStory] = useState<StoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);

  useEffect(() => {
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
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#fcfcfc] overflow-hidden">
      {/* Header */}
      <div className={`absolute left-0 right-0 top-0 z-50 bg-transparent transition-all duration-700 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <div className="relative flex items-center justify-center h-24">
          <button
            onClick={() => router.back()}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <svg width="14" height="24" viewBox="0 0 14 24" fill="none">
              <path d="M12 2L2 12L12 22" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-[24px] font-bold text-black px-12 text-center">{story.title}</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="pt-28">
        {/* Image section with mask */}
        <div className={`relative h-[320px] mb-8 transition-all duration-700 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`} style={{ transitionDelay: '200ms' }}>
          <div 
            className="absolute inset-0"
            style={story.image_mask ? {
              backgroundImage: `url('${story.image_url}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              maskImage: `url('${story.image_mask}')`,
              maskSize: '383px 309px',
              maskPosition: 'center',
              maskRepeat: 'no-repeat',
              WebkitMaskImage: `url('${story.image_mask}')`,
              WebkitMaskSize: '383px 309px',
              WebkitMaskPosition: 'center',
              WebkitMaskRepeat: 'no-repeat'
            } : {}}
          >
            {!story.image_mask && story.image_url && (
              <img 
                src={story.image_url} 
                alt={story.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Circle decoration */}
          <div className="absolute right-8 bottom-8 w-10 h-10">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="19" stroke="#16CB73" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        {/* Subtitle */}
        <div className={`px-6 mb-6 transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
        }`} style={{ transitionDelay: '400ms' }}>
          <p className="text-[18px] font-medium text-[#666] leading-[28px]">
            {story.subtitle}
          </p>
        </div>

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
    </div>
  );
}