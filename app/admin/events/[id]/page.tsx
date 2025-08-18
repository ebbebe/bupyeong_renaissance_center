"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { eventAPI, type EventItem } from "@/lib/supabase";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminEventEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const isNew = resolvedParams.id === "new";
  
  const [event, setEvent] = useState<Partial<EventItem>>({
    title: "",
    description: "",
    url: "",
    image_url: "",
    is_active: true
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // 인증 체크
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

    // 기존 데이터 로드
    if (!isNew) {
      loadEvent();
    }
  }, [isNew, router, resolvedParams.id]);

  const loadEvent = async () => {
    const data = await eventAPI.getById(resolvedParams.id);
    if (data) {
      setEvent(data);
    } else {
      alert("해당 행사를 찾을 수 없습니다.");
      router.push("/admin/events");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!event.title) {
      alert("제목은 필수 입력 항목입니다.");
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        await eventAPI.create(event as Omit<EventItem, 'id' | 'created_at' | 'updated_at'>);
        alert("행사가 성공적으로 추가되었습니다.");
      } else {
        await eventAPI.update(resolvedParams.id, event);
        alert("행사가 성공적으로 수정되었습니다.");
      }
      router.push("/admin/events");
    } catch (error) {
      console.error("Error saving event:", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof EventItem, value: string | boolean) => {
    setEvent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin/events")}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {isNew ? "새 행사 추가" : "행사 수정"}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="space-y-6">
            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 *
              </label>
              <input
                type="text"
                value={event.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="행사 제목을 입력하세요"
              />
            </div>

            {/* 설명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명
              </label>
              <textarea
                value={event.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="행사에 대한 자세한 설명을 입력하세요"
              />
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                링크 URL
              </label>
              <input
                type="url"
                value={event.url || ""}
                onChange={(e) => handleInputChange("url", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="행사 배너 클릭 시 이동할 URL을 입력하세요 (예: https://example.com)"
              />
            </div>

            {/* 이미지 업로드 */}
            <ImageUpload
              currentImageUrl={event.image_url}
              onImageChange={(url) => handleInputChange("image_url", url)}
              folder="events"
              label="행사 이미지"
            />

            {/* 활성 상태 */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={event.is_active}
                  onChange={(e) => handleInputChange("is_active", e.target.checked)}
                  className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span className="ml-2 text-sm text-gray-700">활성 상태</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                활성 상태인 행사만 사용자에게 표시됩니다.
              </p>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-4 pt-8 border-t border-gray-200 mt-8">
            <button
              onClick={() => router.push("/admin/events")}
              className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}