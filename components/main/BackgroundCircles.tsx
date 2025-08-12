interface BackgroundCirclesProps {
  circle1Src: string;
  circle2Src: string;
  isLoaded: boolean;
}

export default function BackgroundCircles({ circle1Src, circle2Src, isLoaded }: BackgroundCirclesProps) {
  return (
    <>
      <div 
        className={`absolute right-[-100px] w-[397px] h-[397px] top-[305px] transition-all duration-1000 delay-200 ${
          isLoaded ? 'opacity-50 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        <img alt="" className="w-full h-full" src={circle1Src} />
      </div>
      <div 
        className={`absolute left-[-125px] w-[223px] h-[223px] bottom-[100px] transition-all duration-1000 delay-300 ${
          isLoaded ? 'opacity-50 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        <img alt="" className="w-full h-full" src={circle2Src} />
      </div>
    </>
  );
}