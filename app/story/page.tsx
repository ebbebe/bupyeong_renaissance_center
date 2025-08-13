"use client";

import { useState, useEffect } from "react";
import StoryHeader from "@/components/story/StoryHeader";
import CategoryAccordion from "@/components/story/CategoryAccordion";

export default function StoryPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#fcfcfc] overflow-hidden">
      {/* Background books image */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute w-[960px] h-[670px] -left-[250px] top-[235px] transition-all duration-1000 ${
            isLoaded ? 'opacity-30 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{
            backgroundImage: `url('/images/books_bg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            maskImage: `url('/images/books_mask.svg')`,
            maskSize: '670px 670px',
            maskPosition: '220px 0',
            maskRepeat: 'no-repeat'
          }}
        />
      </div>

      {/* Header */}
      <StoryHeader />

      {/* Main content */}
      <div className={`relative z-10 pt-24 px-4 transition-all duration-700 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Title section */}
        <div className={`mt-10 mb-12 transition-all duration-700 delay-200 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-[36px] leading-[50px]">
            <span className="font-bold text-black">부평 이야기</span>
            <span className="font-extralight text-black">를</span>
            <br />
            <span className="font-extralight text-black">하나씩</span>
            <br />
            <span className="font-extralight text-black">열어보세요</span>
          </h2>
        </div>

        {/* Category accordion */}
        <div className={`transition-all duration-700 delay-400 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <CategoryAccordion />
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-32" />
    </div>
  );
}