"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { storyAPI, type StoryItem } from "@/lib/supabase";

interface SubItem {
  title: string;
  href: string;
}

interface CategoryItem {
  id: string;
  zone: string;
  color: string;
  title: string;
  subItems?: SubItem[];
}

export default function CategoryAccordion() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const stories = await storyAPI.getAll();
        
        // 카테고리별로 스토리 그룹화
        const groupedStories: Record<string, StoryItem[]> = {};
        stories.forEach(story => {
          if (!groupedStories[story.category]) {
            groupedStories[story.category] = [];
          }
          groupedStories[story.category].push(story);
        });

        // 카테고리 색상 매핑
        const colorMap: Record<string, string> = {
          "부평 상권변천사": "#FF9A00",
          "평리단길/영화/음악/인물": "#9460A4", 
          "행사/축제/이벤트": "#96C346",
          "상권홍보/SNS/기타": "#87CDD8"
        };

        // 카테고리 순서 정의
        const categoryOrder = [
          "부평 상권변천사",
          "평리단길/영화/음악/인물",
          "행사/축제/이벤트",
          "상권홍보/SNS/기타"
        ];

        // CategoryItem 형태로 변환
        const categoryItems: CategoryItem[] = Object.entries(groupedStories).map(([category, categoryStories], index) => {
          
          // category_order로 정렬하여 UUID 사용
          const subItems = categoryStories
            .sort((a, b) => (a.category_order || 999) - (b.category_order || 999))
            .map(story => ({
              title: story.title,
              href: `/story/${story.id}`  // UUID 사용
            }));

          return {
            id: `category-${index}`,
            zone: category, // 카테고리명 자체를 zone으로 사용
            color: colorMap[category] || "#16CB73",
            title: category, // 카테고리명을 제목으로 사용
            subItems
          };
        });

        // 정의된 순서대로 정렬
        const sortedCategories = categoryItems.sort((a, b) => {
          const orderA = categoryOrder.indexOf(a.zone);
          const orderB = categoryOrder.indexOf(b.zone);
          return orderA - orderB;
        });

        setCategories(sortedCategories);
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const toggleCategory = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-white/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

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
              {/* Category name */}
              <div className="flex items-center gap-4">
                <span className="text-[24px] font-bold" style={{ color: category.color }}>
                  {category.zone}
                </span>
              </div>

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
              <div className="p-6 space-y-3 max-h-[400px] overflow-y-auto">
                {category.subItems?.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="block text-[20px] text-gray-700 py-2 hover:text-black cursor-pointer transition-colors"
                    style={{
                      animation: `fadeIn ${0.3 + idx * 0.1}s ease-out`
                    }}
                  >
                    {idx + 1}. {item.title}
                  </Link>
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
            max-height: 500px;
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