"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { storyAPI, type StoryItem } from "@/lib/supabase";

export default function AdminQRPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

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

    // 현재 URL에서 base URL 추출
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.origin;
      setBaseUrl(currentUrl);
    }

    loadStories();
  }, [router]);

  const loadStories = async () => {
    try {
      const data = await storyAPI.getAll();
      setStories(data);
    } catch (error) {
      console.error("Error loading stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (story: StoryItem) => {
    setSelectedStory(story);
    
    // baseUrl이 없으면 현재 origin 사용
    const url = baseUrl || window.location.origin;
    const fullUrl = `${url}/story/${story.id}`;
    setQrCodeUrl(fullUrl);

    try {
      if (canvasRef.current) {
        // 동적 import를 사용하여 QRCode 라이브러리 로드
        const QRCode = (await import('qrcode')).default;
        
        await QRCode.toCanvas(canvasRef.current, fullUrl, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("QR 코드 생성 중 오류가 발생했습니다.");
    }
  };

  const downloadQRCode = () => {
    if (!canvasRef.current || !selectedStory) return;
    
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `qr-${selectedStory.title.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const copyUrl = () => {
    if (qrCodeUrl) {
      navigator.clipboard.writeText(qrCodeUrl);
      alert("URL이 클립보드에 복사되었습니다.");
    }
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
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin")}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">QR 코드 생성 및 관리</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 스토리 목록 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">부평 이야기 목록</h2>
            <p className="text-sm text-gray-600 mb-6">
              QR 코드를 생성할 스토리를 선택하세요. 각 스토리마다 고유한 URL이 생성됩니다.
            </p>
            
            <div className="space-y-3">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedStory?.id === story.id
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => generateQRCode(story)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{story.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{story.category}</p>
                      <p className="text-xs text-gray-400 mt-1">순서: {story.category_order}</p>
                    </div>
                    {story.image_url && (
                      <img 
                        src={story.image_url} 
                        alt={story.title}
                        className="w-12 h-12 rounded-lg object-cover ml-4 flex-shrink-0"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QR 코드 생성 영역 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">QR 코드</h2>
            
            {selectedStory ? (
              <div className="space-y-6">
                {/* 선택된 스토리 정보 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">선택된 스토리</h3>
                  <p className="text-sm text-gray-600">{selectedStory.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedStory.category}</p>
                </div>

                {/* URL 정보 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    생성된 URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={qrCodeUrl}
                      readOnly
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                    <button
                      onClick={copyUrl}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      복사
                    </button>
                  </div>
                </div>

                {/* QR 코드 캔버스 */}
                <div className="text-center">
                  <canvas
                    ref={canvasRef}
                    className="border border-gray-200 rounded-lg mx-auto"
                    style={{ maxWidth: '256px', height: 'auto' }}
                  />
                </div>

                {/* 다운로드 버튼 */}
                <button
                  onClick={downloadQRCode}
                  className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  QR 코드 다운로드
                </button>

                {/* 안내 메시지 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">사용 방법</p>
                      <p>1. QR 코드를 다운로드하여 인쇄</p>
                      <p>2. 해당 스팟에 QR 코드 배치</p>
                      <p>3. 사용자가 QR 코드를 스캔하면 자동으로 해당 스토리 페이지로 이동</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <p>왼쪽에서 스토리를 선택하여 QR 코드를 생성하세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}