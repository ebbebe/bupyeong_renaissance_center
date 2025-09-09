"use client";

interface HistoryItem {
  id: number;
  date: string;
  description: string;
}

const stampHistory: HistoryItem[] = [
  {
    id: 1,
    date: "25.07.08",
    description: "상권홍보/SNS/기타 완료 스탬프 지급"
  },
  {
    id: 2,
    date: "25.07.07",
    description: "평리단길/영화/음악/인물 완료 스탬프 지급"
  },
  {
    id: 3,
    date: "25.07.06",
    description: "부평 상권변천사 역사보기 스탬프 지급"
  },
  {
    id: 4,
    date: "25.07.01",
    description: "앱런 스탬프 지급"
  }
];

interface StampHistoryProps {
  isVisible?: boolean;
}

export default function StampHistory({ isVisible = true }: StampHistoryProps) {
  return (
    <div className="space-y-3">
      {stampHistory.map((item, index) => (
        <div
          key={item.id}
          className={`flex items-center justify-between p-4 bg-white/50 rounded-lg transition-all duration-500 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <span className="text-gray-600 text-sm font-medium">{item.date}</span>
          <span className="text-black text-base">{item.description}</span>
        </div>
      ))}
    </div>
  );
}