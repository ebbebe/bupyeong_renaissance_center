import Link from "next/link";

interface HeaderProps {
  logoSrc: string;
  isLoaded: boolean;
}

export default function Header({ logoSrc, isLoaded }: HeaderProps) {
  return (
    <>
      {/* QR Code Button */}
      <Link 
        href="/qr-scan"
        className={`absolute left-[17px] top-14 z-20 transition-all duration-700 delay-400 ${
          isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        <div className="w-[67px] h-[67px] backdrop-blur-sm bg-white/70 rounded-xl border-[1.6px] border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 14h2v2h-2v-2zm4 0h2v2h-2v-2zm-2 4h2v2h-2v-2zm4 0h2v2h-2v-2z" fill="#333"/>
          </svg>
        </div>
      </Link>

      {/* Logo */}
      <div 
        className={`absolute left-[29px] top-[68px] z-20 transition-all duration-700 delay-500 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
      >
        <div className="w-[43px] h-[43px]">
          <img alt="Logo" className="w-full h-full" src={logoSrc} />
        </div>
      </div>
    </>
  );
}