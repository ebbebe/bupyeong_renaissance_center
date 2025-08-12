interface BannerProps {
  isLoaded: boolean;
}

export default function Banner({ isLoaded }: BannerProps) {
  return (
    <div 
      className={`relative z-10 px-4 pt-[232px] transition-all duration-700 delay-700 ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <div className="backdrop-blur-md bg-white/70 rounded-xl border-[2.67px] border-white shadow-xl p-6 hover:shadow-2xl transition-shadow">
        <h1 className="text-[29px] font-bold leading-[41px] text-[#333333]">
          <span>부평</span>
          <span className="font-light">의</span>
          <br />
          <span>역사</span>
          <span className="font-light">와</span>
          <span> 정보</span>
          <span className="font-light">를</span>
          <br />
          <span>한눈에</span>
        </h1>
      </div>
    </div>
  );
}