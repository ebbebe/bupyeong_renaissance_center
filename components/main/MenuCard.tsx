import Link from "next/link";

interface MenuCardProps {
  href: string;
  title: string;
  imageSrc: string;
  delay: number;
  isLoaded: boolean;
}

export default function MenuCard({ href, title, imageSrc, delay, isLoaded }: MenuCardProps) {
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
            className="w-[140px] h-[140px] object-contain opacity-60 hover:opacity-80 transition-opacity"
          />
        </div>
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <span className="font-bold text-[18px] text-[#333333]">{title}</span>
        </div>
      </div>
    </Link>
  );
}