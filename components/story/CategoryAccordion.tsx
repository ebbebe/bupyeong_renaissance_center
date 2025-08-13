"use client";

import { useState } from "react";

interface CategoryItem {
  id: string;
  zone: string;
  color: string;
  title: string;
  subItems?: string[];
}

const categories: CategoryItem[] = [
  {
    id: "a",
    zone: "A",
    color: "#FF9A00",
    title: "거리의 탄생",
    subItems: ["문화의 거리와 역사", "부평 캐릭터 소개", "상점 안내지도"]
  },
  {
    id: "b",
    zone: "B",
    color: "#16CB73",
    title: "부평의 인물",
    subItems: ["역사적 인물", "현대 인물", "문화예술인"]
  },
  {
    id: "c",
    zone: "C",
    color: "#16CB73",
    title: "행사와 축제",
    subItems: ["연례 행사", "계절별 축제", "문화 이벤트"]
  },
  {
    id: "d",
    zone: "D",
    color: "#16CB73",
    title: "부평의 역사",
    subItems: ["조선시대", "일제강점기", "현대사"]
  }
];

export default function CategoryAccordion() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleCategory = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {categories.map((category, index) => (
        <div
          key={category.id}
          className={`relative transition-all duration-500 ${
            expandedId === category.id ? 'mb-4' : ''
          }`}
          style={{
            animation: `slideUp ${0.5 + index * 0.1}s ease-out`
          }}
        >
          <div
            onClick={() => toggleCategory(category.id)}
            className={`relative h-20 backdrop-blur-md bg-white/70 rounded-xl border-[2.67px] border-white shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl ${
              expandedId === category.id ? 'rounded-b-none' : ''
            }`}
          >
            <div className="absolute inset-0 flex items-center justify-between px-6">
              {/* Zone label */}
              <div className="flex items-center gap-4">
                <span className="text-[30px] font-bold">
                  <span style={{ color: category.color }}>{category.zone}</span>
                  <span className="text-black"> ZONE</span>
                </span>
              </div>

              {/* Title */}
              <span className="text-[24px] font-medium text-black">
                {category.title}
              </span>

              {/* Arrow icon */}
              <div className={`transition-transform duration-300 ${
                expandedId === category.id ? 'rotate-180' : ''
              }`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 10L12 15L17 10" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Expanded content */}
          {expandedId === category.id && (
            <div className="bg-white/90 backdrop-blur-sm rounded-b-xl border-x-[2.67px] border-b-[2.67px] border-white shadow-lg overflow-hidden animate-slideDown">
              <div className="p-6 space-y-3">
                {category.subItems?.map((item, idx) => (
                  <div
                    key={idx}
                    className="text-[20px] text-gray-700 py-2 hover:text-black cursor-pointer transition-colors"
                    style={{
                      animation: `fadeIn ${0.3 + idx * 0.1}s ease-out`
                    }}
                  >
                    {idx + 1}. {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Custom animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 300px;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}