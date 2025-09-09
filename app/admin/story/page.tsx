"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { storyAPI, type StoryItem } from "@/lib/supabase";

export default function AdminStoryPage() {
  const router = useRouter();
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // 인증 체크
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    const authTime = localStorage.getItem("adminAuthTime");
    
    if (!auth || !authTime) {
      router.push("/admin");
      return;
    }
    
    const timeDiff = Date.now() - parseInt(authTime);
    if (timeDiff > 3600000) { // 1시간 초과
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("adminAuthTime");
      router.push("/admin");
      return;
    }

    loadStories();
  }, [router]);

  const loadStories = async () => {
    setLoading(true);
    const data = await storyAPI.getAll();
    setStories(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    
    await storyAPI.delete(id);
    loadStories();
  };

  const moveStory = async (story: StoryItem, direction: 'up' | 'down') => {
    const categoryStories = stories
      .filter(s => s.category === story.category)
      .sort((a, b) => a.category_order - b.category_order);
    
    const currentIndex = categoryStories.findIndex(s => s.id === story.id);
    if (currentIndex === -1) return;
    
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= categoryStories.length) return;
    
    const targetStory = categoryStories[targetIndex];
    
    // 순서 교체
    try {
      await Promise.all([
        storyAPI.update(story.id, { category_order: targetStory.category_order }),
        storyAPI.update(targetStory.id, { category_order: story.category_order })
      ]);
      
      loadStories();
    } catch (error) {
      console.error("Error updating story order:", error);
      alert("순서 변경 중 오류가 발생했습니다.");
    }
  };

  const categories = ["all", "부평 상권변천사", "평리단길/영화/음악/인물", "행사/축제/이벤트", "상권홍보/SNS/기타"];
  const filteredStories = selectedCategory === "all" 
    ? stories.sort((a, b) => {
        // 카테고리별로 먼저 정렬, 그 다음 카테고리 내 순서로 정렬
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return (a.category_order || 999) - (b.category_order || 999);
      })
    : stories
        .filter(s => s.category === selectedCategory)
        .sort((a, b) => (a.category_order || 999) - (b.category_order || 999));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/admin")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">부평 이야기 관리</h1>
            </div>
            <button
              onClick={() => router.push("/admin/story/new")}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              새 이야기 추가
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200"
              }`}
            >
              {cat === "all" ? "전체" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content List */}
      <div className="max-w-6xl mx-auto px-6 pb-8">
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-gray-500">등록된 이야기가 없습니다.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    부제목
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    순서
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    순서 조정
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStories.map(story => (
                  <tr key={story.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {story.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {story.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {story.subtitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {story.category_order || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => moveStory(story, 'up')}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="위로 이동"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => moveStory(story, 'down')}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="아래로 이동"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => router.push(`/admin/story/${story.id}`)}
                        className="text-gray-600 hover:text-gray-900 mr-4 transition-colors"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(story.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}