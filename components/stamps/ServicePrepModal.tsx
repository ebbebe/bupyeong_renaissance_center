"use client";

interface ServicePrepModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ServicePrepModal({ isOpen, onClose }: ServicePrepModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(80,80,80,0.5)]">
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="bg-[#fcfcfc] w-[400px] h-[220px] rounded-lg flex flex-col items-center justify-center relative">
          <h2 className="text-[20px] font-black text-black mb-[10px] text-center font-['Pretendard'] leading-[53px]">
            서비스 준비중 입니다.
          </h2>
          
          <div className="text-[16px] font-medium text-black text-center leading-[25px] mb-[15px] font-['Pretendard'] w-[321px]">
            <p className="mb-0">스탬프 현황 서비스는 현재 준비중입니다.</p>
            <p className="mb-0">곧 더 나은 서비스로 찾아뵙겠습니다.</p>
          </div>
          
          <button
            onClick={onClose}
            className="bg-[#1dcc77] text-black text-[20px] font-medium w-[158px] h-[50px] rounded-[32px] hover:bg-[#16cb73] transition-colors font-['Pretendard'] flex items-center justify-center"
          >
            메인으로
          </button>
        </div>
      </div>
    </div>
  );
}