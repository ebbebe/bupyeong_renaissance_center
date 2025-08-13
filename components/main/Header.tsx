interface HeaderProps {
  logoSrc: string;
  isLoaded: boolean;
}

export default function Header({ logoSrc, isLoaded }: HeaderProps) {
  return (
    <>
      {/* QR Code Button */}
      <div 
        className={`absolute left-[17px] top-14 z-20 transition-all duration-700 delay-400 ${
          isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        <div className="w-[67px] h-[67px] backdrop-blur-sm bg-white/70 rounded-xl border-[1.6px] border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
        </div>
      </div>

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