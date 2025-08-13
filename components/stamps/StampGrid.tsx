"use client";

interface StampGridProps {
  totalStamps: number;
  collectedStamps: number;
  isVisible?: boolean;
}

export default function StampGrid({ totalStamps = 9, collectedStamps = 4, isVisible = true }: StampGridProps) {
  const stamps = Array.from({ length: totalStamps }, (_, i) => i < collectedStamps);

  return (
    <div className="flex flex-col items-center">
      {/* Grid */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        {stamps.map((isCollected, index) => (
          <div
            key={index}
            className={`relative w-20 h-20 transition-all duration-500 ${
              isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            }`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            {isCollected ? (
              // Collected stamp - BP logo in green
              <div className="w-full h-full rounded-full border-4 border-[#16cb73] bg-white flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="10" r="3" fill="#16cb73"/>
                  <path d="M12 15 Q 15 20 12 25 T 12 35" stroke="#16cb73" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  <path d="M28 15 Q 25 20 28 25 T 28 35" stroke="#16cb73" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  <circle cx="20" cy="20" r="1.5" fill="#16cb73"/>
                </svg>
              </div>
            ) : (
              // Empty stamp placeholder
              <div className="w-full h-full rounded-full border-4 border-gray-300 bg-gray-100" />
            )}
            
            {/* Stamp animation on collect */}
            {isCollected && (
              <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 animate-ping-once" />
            )}
          </div>
        ))}
      </div>

      {/* Coupon button */}
      <button
        className={`px-12 py-3 bg-[#16cb73] text-white font-bold text-sm rounded-full transition-all duration-300 ${
          collectedStamps === totalStamps 
            ? 'hover:bg-green-600 hover:scale-105 shadow-lg' 
            : 'opacity-50 cursor-not-allowed'
        }`}
        disabled={collectedStamps < totalStamps}
      >
        쿠폰 발급
      </button>

      {/* Custom animation */}
      <style jsx>{`
        @keyframes ping-once {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        .animate-ping-once {
          animation: ping-once 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}