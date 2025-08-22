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
          "A ZONE": "#FF9A00",
          "B ZONE": "#16CB73", 
          "C ZONE": "#16CB73",
          "D ZONE": "#16CB73"
        };

        // 카테고리 제목 매핑
        const categoryTitleMap: Record<string, string> = {
          "A ZONE": "거리의 탄생",
          "B ZONE": "부평의 인물", 
          "C ZONE": "행사와 축제",
          "D ZONE": "부평의 역사"
        };

        // CategoryItem 형태로 변환
        const categoryItems: CategoryItem[] = Object.entries(groupedStories).map(([category, categoryStories]) => {
          const zone = category.replace(" ZONE", "");
          
          // category_order로 정렬하여 UUID 사용
          const subItems = categoryStories
            .sort((a, b) => (a.category_order || 999) - (b.category_order || 999))
            .map(story => ({
              title: story.title,
              href: `/story/${story.id}`  // UUID 사용
            }));

          return {
            id: zone.toLowerCase(),
            zone: zone,
            color: colorMap[category] || "#16CB73",
            title: categoryTitleMap[category] || category,
            subItems
          };
        });

        setCategories(categoryItems.sort((a, b) => a.zone.localeCompare(b.zone)));
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