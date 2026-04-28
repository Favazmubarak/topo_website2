"use client";

import { useRef } from "react";
import { useReels } from "../../hooks/useReels";

function InstagramReel({ link, index }: { link: string; index: number }) {
  // Extract reel ID from link
  // Formats: 
  // https://www.instagram.com/reels/CODE/
  // https://www.instagram.com/p/CODE/
  // https://www.instagram.com/reel/CODE/
  
  const getEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      let pathname = urlObj.pathname;
      
      // Ensure it ends with /
      if (!pathname.endsWith('/')) {
          pathname += '/';
      }
      
      // Check if it's already an embed URL
      if (pathname.includes('/embed/')) {
          return url;
      }

      return `https://www.instagram.com${pathname}embed`;
    } catch (e) {
      return url;
    }
  };

  return (
    <div
      className="relative h-[550px] w-[310px] rounded-2xl overflow-hidden bg-gray-50 snap-center sm:snap-start shrink-0 group/card shadow-sm border border-gray-100"
      data-aos="fade-up"
      data-aos-delay={index * 100}
    >
      <iframe
        src={getEmbedUrl(link)}
        className="w-full h-full border-none"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      />
    </div>
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
              <InstagramReel key={reel._id} link={reel.link} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
