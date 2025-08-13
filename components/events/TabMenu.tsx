"use client";

interface TabMenuProps {
  activeTab: 'ongoing' | 'info';
  onTabChange: (tab: 'ongoing' | 'info') => void;
}

export default function TabMenu({ activeTab, onTabChange }: TabMenuProps) {
  return (
    <div className="relative">
      <div className="backdrop-blur-md bg-white/70 rounded-xl border-[2.67px] border-white shadow-lg">
        <div className="flex">
          <button
            onClick={() => onTabChange('ongoing')}
            className={`flex-1 py-4 text-[20px] font-medium transition-colors ${
              activeTab === 'ongoing' ? 'text-black' : 'text-gray-500'
            }`}
          >
            진행 중 행사
          </button>
          <button
            onClick={() => onTabChange('info')}
            className={`flex-1 py-4 text-[20px] font-medium transition-colors ${
              activeTab === 'info' ? 'text-black' : 'text-gray-500'
            }`}
          >
            안내 정보
          </button>
        </div>
        
        {/* Tab indicator */}
        <div className="relative h-[3px] bg-[#d4d3d3] mx-5">
          <div 
            className={`absolute top-0 h-full bg-[#1dcc77] rounded-lg transition-all duration-300 ${
              activeTab === 'ongoing' ? 'left-0 w-1/2' : 'left-1/2 w-1/2'
            }`}
          />
        </div>
      </div>
      
      {/* Helper text */}
      {activeTab === 'ongoing' && (
        <p className="text-center text-[14px] text-black font-bold mt-2">
          해당 행사 배너를 누를 시 링크로 이동합니다.
        </p>
      )}
    </div>
  );
}