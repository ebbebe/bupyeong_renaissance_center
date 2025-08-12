interface CharacterProps {
  imageSrc: string;
  isLoaded: boolean;
}

export default function Character({ imageSrc, isLoaded }: CharacterProps) {
  return (
    <>
      <div 
        className={`absolute right-[20px] top-[120px] w-[200px] h-[300px] z-30 transition-all duration-1000 delay-600 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div className="relative w-full h-full rotate-[11.68deg] animate-bounce-slow">
          <img 
            src={imageSrc}
            alt="Character"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: rotate(11.68deg) translateY(0); }
          50% { transform: rotate(11.68deg) translateY(-10px); }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}