"use client";

import { useRouter } from "next/navigation";

export default function StoryHeader() {
  const router = useRouter();

  return (
    <div className="absolute left-0 right-0 top-0 z-10 bg-white/80 backdrop-blur-sm">
      <div className="relative flex items-center justify-center h-24">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
        >
          <svg width="14" height="24" viewBox="0 0 14 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 12L12 22" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {/* Title */}
        <h1 className="text-[24px] font-bold text-black">부평 이야기</h1>
      </div>
    </div>
  );
}