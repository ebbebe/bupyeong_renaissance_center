"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// QR Scanner를 dynamic import로 불러오기 (SSR 비활성화)
const Scanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((mod) => mod.Scanner),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white">카메라 로딩 중...</div>
      </div>
    )
  }
);

export default function QRScanPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleScan = (detectedCodes: Array<{ rawValue: string }>) => {
    if (detectedCodes && detectedCodes.length > 0 && isScanning) {
      const result = detectedCodes[0].rawValue;
      console.log("QR 코드 스캔됨:", result);
      setScanResult(result);
      setIsScanning(false);
      setShowSuccess(true);

      // 진동 피드백 (모바일)
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }

      // QR 코드 내용에 따른 처리
      handleQRCodeContent(result);
    }
  };

  const handleQRCodeContent = (content: string) => {
    // URL인 경우
    if (content.startsWith("http://") || content.startsWith("https://")) {
      // 부평 르네상스 센터 관련 URL인지 확인
      if (content.includes("bupyeong") || content.includes("renaissance")) {
        // 스탬프 적립 처리
        setTimeout(() => {
          alert("스탬프가 적립되었습니다!");
          router.push("/stamps");
        }, 1500);
      } else {
        // 외부 URL로 이동
        setTimeout(() => {
          window.location.href = content;
        }, 1500);
      }
    } 
    // 스탬프 코드인 경우
    else if (content.startsWith("STAMP:")) {
      const stampCode = content.replace("STAMP:", "");
      setTimeout(() => {
        alert(`스탬프 코드 ${stampCode}가 적립되었습니다!`);
        router.push("/stamps");
      }, 1500);
    }
    // 쿠폰 코드인 경우
    else if (content.startsWith("COUPON:")) {
      const couponCode = content.replace("COUPON:", "");
      setTimeout(() => {
        alert(`쿠폰 ${couponCode}가 발급되었습니다!`);
        router.push("/main");
      }, 1500);
    }
    // 기타
    else {
      setTimeout(() => {
        alert(`스캔 결과: ${content}`);
        router.push("/main");
      }, 1500);
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setIsScanning(true);
    setShowSuccess(false);
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* QR Scanner */}
      <div className="absolute inset-0">
        {isScanning && (
          <Scanner
            onScan={handleScan}
            components={{
              finder: false,
            }}
            styles={{
              container: {
                width: "100%",
                height: "100vh"
              },
              video: {
                width: "100%",
                height: "100%",
                objectFit: "cover" as const
              }
            }}
          />
        )}
      </div>

      {/* Viewfinder Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full">
          {/* Dark overlay with hole */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Viewfinder box */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 transition-all duration-500 ${
            isLoaded ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}>
            {/* Corner borders */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-white rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-white rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-white rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-white rounded-br-2xl" />
            
            {/* Scanning line animation */}
            {isScanning && (
              <div className="absolute top-2 left-2 right-2 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-scan" />
            )}
          </div>

          {/* Instructions */}
          <div className={`absolute top-32 left-0 right-0 text-center transition-all duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}>
            <p className="text-white text-lg font-medium">QR 코드를 스캔하세요</p>
            <p className="text-white/70 text-sm mt-2">카메라를 QR 코드에 맞춰주세요</p>
          </div>
        </div>
      </div>

      {/* Success Overlay */}
      {showSuccess && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className={`bg-white rounded-2xl p-8 max-w-sm mx-4 transition-all duration-500 ${
            showSuccess ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}>
            <div className="flex flex-col items-center">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-xl font-bold mb-2">스캔 성공!</h2>
              <p className="text-gray-600 text-center text-sm mb-4">
                {scanResult && scanResult.length > 50 
                  ? scanResult.substring(0, 50) + "..." 
                  : scanResult}
              </p>
              
              <button
                onClick={resetScan}
                className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
              >
                다시 스캔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className={`absolute left-6 top-12 z-40 transition-all duration-700 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <button
          onClick={() => router.push("/main")}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center hover:scale-110 transition-transform"
        >
          <svg width="14" height="24" viewBox="0 0 14 24" fill="none">
            <path d="M12 2L2 12L12 22" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Scan Animation CSS */}
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(240px); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
}