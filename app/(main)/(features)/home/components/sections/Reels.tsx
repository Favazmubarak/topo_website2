"use client";

import { FaPlay } from "react-icons/fa";
import { useReels } from "../../hooks/useReels";
import { Reel } from "../../api/reelApi";

function InstagramReel({ reel, index }: { reel: Reel; index: number }) {
  return (
    <a
      href={reel.link}
      target="_blank"
      rel="noopener noreferrer"
      className="relative h-[440px] sm:h-[550px] w-[260px] sm:w-full max-w-[350px] mx-auto rounded-2xl overflow-hidden bg-gray-50 group/card shadow-sm border border-gray-100 block transition-transform duration-500 shrink-0 md:shrink snap-center"
      data-aos="fade-up"
      data-aos-delay={(index % 4) * 100}
    >
      <img
        src={reel.thumbnail}
        alt="Reel Thumbnail"
        className="w-full h-full object-cover transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/40 transition-colors duration-300" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-transform duration-500 border border-white/40">
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

  if (loading && reels.length === 0) {
    return (
      <section className="w-full pb-16 md:pb-24 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <Skeleton className="h-12 w-48 mb-10" />
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[440px] sm:h-[550px] w-[260px] md:w-full rounded-2xl shrink-0" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!loading && reels.length === 0) {
    if (error) {
      return (
        <section className="w-full md:py-12 sm:py-10 py-8 md:pb-24 sm:pb-20 pb-16 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden">
          <div className="max-w-[1400px] mx-auto flex justify-center items-center ">
            <h2 className="text-red-500 font-montserrat">Error: {error}</h2>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="w-full md:py-12 sm:py-10 py-8 md:pb-24 sm:pb-20 pb-16 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-10 sm:mb-14 md:mb-16">
          <h2
            className="font-montserrat text-[#0066B2] text-[clamp(22px,5vw,50px)] font-medium leading-tight"
            data-aos="fade-up"
          >
            Our Reels
          </h2>
        </div>
        <div className="flex overflow-x-auto snap-x snap-mandatory pb-6 gap-6 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8 md:overflow-visible">
          {reels.map((reel, index) => (
            <InstagramReel key={reel._id} reel={reel} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
