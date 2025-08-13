import Link from "next/link";

interface HeaderProps {
  logoSrc: string;
  isLoaded: boolean;
}

export default function Header({ logoSrc, isLoaded }: HeaderProps) {
  return (
    <>
      {/* QR Logo Button */}
      <Link 
        href="/qr-scan"
        className={`absolute left-[17px] top-14 z-30 transition-all duration-700 delay-400 ${
          isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        <div className="w-[67px] h-[67px] backdrop-blur-sm bg-white/70 rounded-xl border-[1.6px] border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
          <img alt="QR" className="w-[43px] h-[43px]" src={logoSrc} />
        </div>
      </Link>
    </>
  );
}