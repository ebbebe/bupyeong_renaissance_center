import Link from "next/link";

interface MenuCardProps {
  href: string;
  title: string;
  imageSrc: string;
  delay: number;
  isLoaded: boolean;
  imageOffset?: { x: number; y: number };
  imageSize?: { width: number; height: number };
}

export default function MenuCard({ 
  href, 
  title, 
  imageSrc, 
  delay, 
  isLoaded, 
  imageOffset = { x: 0, y: 0 },
  imageSize = { width: 160, height: 160 }
}: MenuCardProps) {
  return (
    <Link href={href}>
      <div 
        className={`relative h-[178px] backdrop-blur-md bg-white/70 rounded-xl border-[1.6px] border-white shadow-lg overflow-hidden transition-all duration-700 hover:scale-105 hover:shadow-xl cursor-pointer ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={imageSrc}
            alt={title}
            className="object-contain opacity-100 transition-transform hover:scale-110"
            style={{
              width: `${imageSize.width}px`,
              height: `${imageSize.height}px`,
              transform: `translate(${imageOffset.x}px, ${imageOffset.y}px)`
            }}
          />
        </div>
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <span className="font-bold text-[18px] text-[#333333]">{title}</span>
        </div>
      </div>
    </Link>
  );
}