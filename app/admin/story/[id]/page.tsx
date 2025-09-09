"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { storyAPI, type StoryItem } from "@/lib/supabase";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminStoryEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const isNew = resolvedParams.id === "new";
  
  const [story, setStory] = useState<Partial<StoryItem>>({
    category: "부평 상권변천사",
    title: "",
    subtitle: "",
    content: [""],
    image_url: "",
    category_order: 1
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // 인증 체크
    const auth = localStorage.getItem("adminAuth");
    if (!auth) {
      router.push("/admin");
      return;
    }

    // 기존 데이터 로드
    if (!isNew) {
      loadStory();
    }
  }, [isNew]);

  const loadStory = async () => {
    const data = await storyAPI.getById(resolvedParams.id);
    if (data) {
      setStory(data);
    } else {
      alert("해당 이야기를 찾을 수 없습니다.");
      router.push("/admin/story");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!story.title || !story.subtitle) {
      alert("제목과 부제목은 필수입니다.");
      return;
    }

    setSaving(true);
    
    try {
      if (isNew) {
        // 새 스토리 생성 시 해당 카테고리의 마지막 순서 + 1로 설정
        const existingStories = await storyAPI.getAll();
        const categoryStories = existingStories.filter(s => s.category === story.category);
        const maxCategoryOrder = categoryStories.length > 0 
          ? Math.max(...categoryStories.map(s => s.category_order || 0))
          : 0;
        
        await storyAPI.create({
          category: story.category!,
          title: story.title,
          subtitle: story.subtitle,
          content: story.content || [""],
          image_url: story.image_url,
          category_order: maxCategoryOrder + 1
        });
      } else {
        await storyAPI.update(resolvedParams.id, story);
      }
      
      alert("저장되었습니다.");
      router.push("/admin/story");
    } catch (error) {
      alert("저장 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (index: number, value: string) => {
    const newContent = [...(story.content || [])];
    newContent[index] = value;
    setStory({ ...story, content: newContent });
  };

  const addContentParagraph = () => {
    setStory({ ...story, content: [...(story.content || []), ""] });
  };

  const removeContentParagraph = (index: number) => {
    const newContent = story.content?.filter((_, i) => i !== index) || [];
    setStory({ ...story, content: newContent });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/admin/story")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {isNew ? "새 이야기 추가" : "이야기 수정"}
              </h1>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리
            </label>
            <select
              value={story.category}
              onChange={(e) => setStory({ ...story, category: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            >
              <option value="부평 상권변천사">부평 상권변천사</option>
              <option value="평리단길/영화/음악/인물">평리단길/영화/음악/인물</option>
              <option value="행사/축제/이벤트">행사/축제/이벤트</option>
              <option value="상권홍보/SNS/기타">상권홍보/SNS/기타</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={story.title}
              onChange={(e) => setStory({ ...story, title: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              placeholder="예: 문화의 거리와 역사"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              부제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={story.subtitle}
              onChange={(e) => setStory({ ...story, subtitle: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              placeholder="예: 상인이 만든 거리, 지켜가는 문화"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용 (문단별로 구분)
            </label>
            <div className="space-y-3">
              {story.content?.map((paragraph, index) => (
                <div key={index} className="flex gap-2">
                  <textarea
                    value={paragraph}
                    onChange={(e) => handleContentChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
                    rows={4}
                    placeholder={`${index + 1}번째 문단`}
                  />
                  {story.content!.length > 1 && (
                    <button
                      onClick={() => removeContentParagraph(index)}
                      className="px-3 py-1 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addContentParagraph}
              className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              문단 추가
            </button>
          </div>

          {/* 이미지 업로드 */}
          <ImageUpload
            currentImageUrl={story.image_url}
            onImageChange={(url) => setStory({ ...story, image_url: url })}
            folder="stories"
            label="스토리 이미지"
          />


          {/* Order Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">순서 관리</p>
                <p>스토리 순서는 목록 페이지에서 위/아래 버튼으로 조정할 수 있습니다.</p>
                <p>새로 추가되는 스토리는 해당 카테고리의 맨 마지막에 배치됩니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}