"use client";

interface EventCardProps {
  title: string;
  imageSrc: string;
  link: string;
  delay?: number;
  isVisible?: boolean;
}

export default function EventCard({ title, imageSrc, link, delay = 0, isVisible = true }: EventCardProps) {
  const handleClick = () => {
    if (link && link !== "#") {
      // URL이 http:// 또는 https://로 시작하지 않으면 https://를 추가
      const fullUrl = link.startsWith('http://') || link.startsWith('https://') 
        ? link 
        : `https://${link}`;
      window.open(fullUrl, '_blank');
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative w-full h-[142px] rounded-xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{
        transitionDelay: `${delay}ms`,
        backgroundImage: `url('${imageSrc}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay for better text visibility if needed */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white text-lg font-bold drop-shadow-lg">{title}</p>
        </div>
      </div>
    </div>
  );
}