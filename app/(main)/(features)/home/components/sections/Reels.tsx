"use client";

import { useRef } from "react";
import { FaPlay } from "react-icons/fa";
import { useReels } from "../../hooks/useReels";
import { Reel } from "../../api/reelApi";

function InstagramReel({ reel, index }: { reel: Reel; index: number }) {
  return (
    <a
      href={reel.link}
      target="_blank"
      rel="noopener noreferrer"
      className="relative h-[480px] sm:h-[550px] w-[270px] sm:w-[310px] rounded-2xl overflow-hidden bg-gray-50 snap-center sm:snap-start shrink-0 group/card shadow-sm border border-gray-100 block transition-transform duration-500 hover:scale-[1.02]"
      data-aos="fade-up"
      data-aos-delay={index * 100}
    >
      <img
        src={reel.thumbnail}
        alt="Reel Thumbnail"
        className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/40 transition-colors duration-300" />
      
      {/* Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-90 group-hover/card:scale-100 transition-transform duration-500 border border-white/40">
          <FaPlay size={18} className="translate-x-0.5" />
        </div>
      </div>

      {/* Button at bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)]">
        <div className="bg-white py-3 rounded-full text-black text-[10px] font-bold text-center uppercase tracking-widest opacity-0 group-hover/card:opacity-100 translate-y-4 group-hover/card:translate-y-0 transition-all duration-500 shadow-xl">
          Watch on Instagram
        </div>
      </div>
    </a>
  );
}

export default function Reels() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { reels, loading, error } = useReels();

  if (loading && reels.length === 0) {
    return (
      <section className="w-full pb-16 md:pb-24 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="h-12 w-48 bg-gray-100 animate-pulse rounded-lg mb-10" />
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[550px] w-[310px] bg-gray-100 animate-pulse rounded-2xl shrink-0" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!loading && reels.length === 0) {
    if (error) {
      return (
        <section className="w-full pb-16 md:pb-24 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden">
          <div className="max-w-[1400px] mx-auto flex justify-center items-center py-10">
            <h2 className="text-red-500 font-montserrat">Error: {error}</h2>
          </div>
        </section>
      );
    }
    return null; // Or show a placeholder if needed
  }

  return (
    <section className="w-full pb-16 md:pb-24 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-10 sm:mb-14 md:mb-16">
          <h2
            className="font-montserrat text-[#0066B2] text-[clamp(22px,5vw,50px)] font-medium leading-tight"
            data-aos="fade-up"
          >
            Our Reels
          </h2>
        </div>

        <div className="relative group">
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
          >
            {reels.map((reel, index) => (
              <InstagramReel key={reel._id} reel={reel} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
