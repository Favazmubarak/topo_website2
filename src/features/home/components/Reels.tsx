"use client";

import { FaPlay } from "react-icons/fa";
import { useReels } from "../hooks/useReels";
import { Reel } from "../api/reelApi";
import { useRef, useEffect, useState, useCallback } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

function InstagramReel({ reel, index }: { reel: Reel; index: number }) {
  return (
    <a
      href={reel.link}
      target="_blank"
      rel="noopener noreferrer"
      className="relative h-[480px] sm:h-[580px] w-full rounded-2xl overflow-hidden bg-gray-50 group/card shadow-sm border border-gray-100 block transition-all duration-500 hover:shadow-xl"
    >
      <img
        src={reel.thumbnail}
        alt="Reel Thumbnail"
        className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
      />
      <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/40 transition-colors duration-300" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-transform duration-500 border border-white/40 group-hover/card:scale-110">
          <FaPlay size={18} className="translate-x-0.5" />
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)]">
        <div className="bg-white py-3 rounded-full text-black text-[10px] font-bold text-center uppercase tracking-widest opacity-0 group-hover/card:opacity-100 translate-y-4 group-hover/card:translate-y-0 transition-all duration-500 shadow-xl">
          Watch on Instagram
        </div>
      </div>
    </a>
  );
}

import { Skeleton } from "@/src/components/common/Skeleton";

export default function Reels() {
  const { reels, loading, error } = useReels();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(4);

  // Responsive items count logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else if (window.innerWidth < 1280) setItemsPerView(3);
      else setItemsPerView(4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = useCallback(() => {
    if (reels.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % reels.length);
  }, [reels.length]);

  const handlePrev = useCallback(() => {
    if (reels.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length);
  }, [reels.length]);

  // Enhanced Auto-slide logic for a more "moving" feel
  useEffect(() => {
    if (loading || reels.length === 0 || isHovered) return;

    const timer = setInterval(() => {
      handleNext();
    }, 3000); // Faster interval for "moving" feel

    return () => clearInterval(timer);
  }, [loading, reels.length, isHovered, handleNext]);

  if (loading && reels.length === 0) {
    return (
      <section className="w-full pb-16 md:pb-24 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <Skeleton className="h-12 w-48 mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[480px] sm:h-[580px] w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!loading && reels.length === 0) {
    if (error) return (
      <section className="w-full md:py-12 px-4 flex justify-center">
        <h2 className="text-red-500 font-montserrat">Error: {error}</h2>
      </section>
    );
    return null;
  }

  // Infinite items for the slider view
  const getVisibleReels = () => {
    const result = [];
    for (let i = 0; i < itemsPerView; i++) {
      const index = (currentIndex + i) % reels.length;
      result.push({ ...reels[index], uniqueKey: `${reels[index]._id}-${currentIndex}-${i}` });
    }
    return result;
  };

  return (
    <section className="w-full md:py-12 sm:py-10 py-8 md:pb-24 sm:pb-20 pb-16 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden bg-[#FBFBFB]">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 sm:mb-14 md:mb-16 flex justify-between items-end px-2">
          <div className="flex flex-col">
            <span className="text-[#0066B2] text-[10px] font-mono tracking-[0.5em] uppercase mb-4 block" data-aos="fade-right">Featured</span>
            <h2 className="font-montserrat text-[#1A1A1A] text-[clamp(24px,5vw,44px)] font-light leading-none tracking-tighter" data-aos="fade-up">
              Our <span className="text-[#0066B2]">Reels</span>
            </h2>
          </div>
          
          {/* Top Right Pagination Buttons */}
          <div className="flex gap-3 pb-2" data-aos="fade-left">
            <button 
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#0066B2] hover:text-[#0066B2] transition-all duration-300 shadow-sm bg-white hover:scale-105 active:scale-95"
            >
              <HiChevronLeft size={22} />
            </button>
            <button 
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#0066B2] hover:text-[#0066B2] transition-all duration-300 shadow-sm bg-white hover:scale-105 active:scale-95"
            >
              <HiChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Animated Slider Container */}
        <div 
          className="relative w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex gap-6 min-h-[480px] sm:min-h-[580px]">
            <AnimatePresence mode="popLayout" initial={false}>
              {getVisibleReels().map((reel, idx) => (
                <motion.div
                  key={reel.uniqueKey}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.33, 1, 0.68, 1] // High-end "Quartz" easing
                  }}
                  className={`${
                    itemsPerView === 4 ? "w-[calc(25%-1.125rem)]" : 
                    itemsPerView === 3 ? "w-[calc(33.33%-1rem)]" : 
                    itemsPerView === 2 ? "w-[calc(50%-0.75rem)]" : "w-full"
                  } shrink-0`}
                >
                  <InstagramReel reel={reel} index={idx} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Bottom Progress Bars */}
          <div className="flex justify-center gap-2 mt-12">
            {reels.map((_, i) => (
              <div 
                key={i}
                className={`h-1 rounded-full transition-all duration-700 ${
                  i === currentIndex % reels.length ? "w-10 bg-[#0066B2]" : "w-2 bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
