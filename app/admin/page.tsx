"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ADMIN_KEY = "bupyeong2024"; // 실제 운영 시 환경변수로 이동

export default function AdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // URL 파라미터 확인
    const key = searchParams.get("key");
    if (key === ADMIN_KEY) {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuth", "true");
      localStorage.setItem("adminAuthTime", Date.now().toString());
    }
    
    // localStorage 확인 (1시간 유효)
    const savedAuth = localStorage.getItem("adminAuth");
    const authTime = localStorage.getItem("adminAuthTime");
    if (savedAuth === "true" && authTime) {
      const timeDiff = Date.now() - parseInt(authTime);
      if (timeDiff < 3600000) { // 1시간
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminAuthTime");
      }
    }
  }, [searchParams]);

  const handleLogin = () => {
    if (password === ADMIN_KEY) {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuth", "true");
      localStorage.setItem("adminAuthTime", Date.now().toString());
      setError("");
    } else {
      setError("비밀번호가 올바르지 않습니다.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminAuthTime");
    setIsAuthenticated(false);
    router.push("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-sm w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              관리자 로그인
            </h1>
            <p className="text-sm text-gray-500">부평 르네상스센터</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
            
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            
            <button
              onClick={handleLogin}
              className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      id: "story",
      title: "부평 이야기",
      description: "콘텐츠 관리",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      id: "events",
      title: "행사 정보",
      description: "이벤트 관리",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: "event-info",
      title: "행사 안내",
      description: "안내 정보 관리",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: "qr",
      title: "QR 코드",
      description: "QR 생성 및 관리",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      )
    },
 
  
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              부평 르네상스센터 관리자
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(`/admin/${item.id === 'event-info' ? 'event-info' : item.id}`)}
              className="bg-white border border-gray-200 rounded-lg p-6 text-left hover:border-gray-400 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-gray-700 group-hover:text-gray-900 transition-colors">
                  {item.icon}
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </button>
          ))}
        </div>

        {/* Migration Alert */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-blue-800 font-medium mb-1">데이터베이스 마이그레이션</p>
              <p className="text-sm text-blue-700 mb-2">로컬 데이터를 Supabase로 이전할 수 있습니다.</p>
              <button
                onClick={() => router.push('/admin/migrate')}
                className="text-sm font-medium text-blue-700 hover:text-blue-800 underline"
              >
                마이그레이션 페이지로 이동 →
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}