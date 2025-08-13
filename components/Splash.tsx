"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const imgLogo = "/images/logo.png";
const imgCharacterRight = "/images/character_tree.png";
const imgCharacterLeft = "/images/character_flower.png";

export default function Splash() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        router.push("/main");
      }, 500); // Wait for fade out animation
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div 
      className={`relative w-full h-screen bg-white overflow-hidden transition-all duration-500 ${
        isExiting ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Logo - positioned higher with animation */}
      <div 
        className={`absolute left-1/2 transform -translate-x-1/2 top-[200px] transition-all duration-1000 ${
          isExiting ? 'translate-y-[-20px] opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <div
          className="w-[108px] h-[186px] bg-center bg-contain bg-no-repeat animate-pulse"
          style={{ backgroundImage: `url('${imgLogo}')` }}
        />
      </div>

      {/* Character on bottom right - green tree with slide animation */}
      <div 
        className={`absolute bottom-[-200px] right-[-210px] w-[538px] h-[631px] transition-all duration-1000 ${
          isExiting ? 'translate-x-[100px] opacity-0' : 'translate-x-0 opacity-100'
        }`}
      >
        <div
          className="w-full h-full bg-center bg-cover bg-no-repeat animate-float"
          style={{ 
            backgroundImage: `url('${imgCharacterRight}')`
          }}
        />
      </div>

      {/* Character on bottom left - purple flower with slide animation */}
      <div 
        className={`absolute bottom-[100px] left-[-260px] w-[613px] h-[591px] transition-all duration-1000 delay-100 ${
          isExiting ? 'translate-x-[-100px] opacity-0' : 'translate-x-0 opacity-100'
        }`}
      >
        <div
          className="w-full h-full bg-center bg-cover bg-no-repeat animate-float-reverse"
          style={{ 
            backgroundImage: `url('${imgCharacterLeft}')`
          }}
        />
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: float-reverse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}