"use client";

import { useState, useEffect } from "react";
import Header from "./main/Header";
import Banner from "./main/Banner";
import Character from "./main/Character";
import MenuCard from "./main/MenuCard";
import BackgroundCircles from "./main/BackgroundCircles";

// Image assets
const images = {
  story: "/images/story.png",
  facilities: "/images/facilities.png",
  stamp: "/images/stamp.png",
  events: "/images/events.png",
  character: "/images/character_tree.png",
  logo: "/images/qr_logo.png",
  circle1: "/images/circle1.svg",
  circle2: "/images/circle2.svg"
};

// Menu items configuration
const menuItems = [
  {
    id: "story",
    href: "/story",
    title: "부평 이야기",
    imageSrc: images.story,
    delay: 800
  },
  {
    id: "facilities",
    href: "/facilities",
    title: "주변 편의시설",
    imageSrc: images.facilities,
    delay: 900
  },
  {
    id: "events",
    href: "/events",
    title: "행사 정보",
    imageSrc: images.events,
    delay: 1000
  },
  {
    id: "stamps",
    href: "/stamps",
    title: "내 스탬프 현황",
    imageSrc: images.stamp,
    delay: 1100
  }
];

export default function MainScreen() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  return (
    <div 
      className={`relative w-full min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden transition-all duration-700 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background decorations */}
      <BackgroundCircles 
        circle1Src={images.circle1}
        circle2Src={images.circle2}
        isLoaded={isLoaded}
      />

      {/* Header with QR and Logo */}
      <Header 
        logoSrc={images.logo}
        isLoaded={isLoaded}
      />

      {/* Character animation */}
      <Character 
        imageSrc={images.character}
        isLoaded={isLoaded}
      />

      {/* Main banner */}
      <Banner isLoaded={isLoaded} />

      {/* Menu grid */}
      <div className="relative z-10 px-4 mt-8 pb-8">
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <MenuCard
              key={item.id}
              href={item.href}
              title={item.title}
              imageSrc={item.imageSrc}
              delay={item.delay}
              isLoaded={isLoaded}
            />
          ))}
        </div>
      </div>
    </div>
  );
}