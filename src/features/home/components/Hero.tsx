"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useImage } from "../hooks/useImage";
import { SectionImage } from "../api/imageApi";
import HeroSkeleton from "./HeroSkeleton";

interface HeroProps {
  initialImages?: SectionImage[];
}

/** 
 * Advanced Cloudinary Optimization
 * Supports dynamic width and quality for LQIP (Low Quality Image Placeholder) 
 */
const optimizeCloudinaryUrl = (url: string, width: number = 1920, quality: string = "auto"): string => {
  if (!url.includes("res.cloudinary.com")) return url;
  // Use f_auto, q_auto:eco and dpr_auto for ultra-fast, sharp delivery
  return url.replace("/upload/", `/upload/f_auto,q_${quality},w_${width},dpr_auto/`);
};

export default function Hero({ initialImages }: HeroProps) {
  const { images: fetchedImages, loading, error, markAsLoaded, loadedUrls } = useImage("hero");
  const images = initialImages && initialImages.length > 0 ? initialImages : fetchedImages;

  const [imageLoaded, setImageLoaded] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const lastRenderedUrl = useRef<string | null>(null);

  const getRawSrc = (url?: string) => url?.trim() || "/fallback/hero.jpeg";
  
  // High-res URL (Optimized for Laptop/Mobile)
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const rawUrl = getRawSrc(images?.[0]?.imageUrl);
  const highResSrc = optimizeCloudinaryUrl(rawUrl, isMobile ? 800 : 1600, "auto:eco"); // Reduced from 1920 to 1600 for speed
  const blurSrc = optimizeCloudinaryUrl(rawUrl, 40, "auto:low"); // LQIP micro-image

  // Instant Load Logic: Skip skeleton if URL was already loaded in this session
  useEffect(() => {
    const url = getRawSrc(images?.[0]?.imageUrl);
    if (lastRenderedUrl.current === url) return;
    lastRenderedUrl.current = url;

    if (loadedUrls.has(url)) {
      setImageLoaded(true);
      setShowSkeleton(false);
    } else {
      setImageLoaded(false);
      setShowSkeleton(true);
    }
  }, [images, loadedUrls]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setShowSkeleton(false);
    markAsLoaded(rawUrl);
    window.dispatchEvent(new Event("heroReady"));
  };

  return (
    <section
      id="hero"
      className="relative w-full h-[65vh] sm:h-[75vh] md:h-screen overflow-hidden px-4 sm:px-6 md:px-12 lg:px-20 bg-[#F8FBFF]"
    >
      {/* 1. Permanent Blue Architectural Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E6F0FF] via-white to-[#F0F7FF] z-0" />

      {/* 2. Low-Quality Image Placeholder (Smart Blur) */}
      <div 
        className={`absolute inset-0 z-10 transition-opacity duration-1000 ${imageLoaded ? "opacity-0" : "opacity-100"}`}
        style={{
          backgroundImage: `url(${blurSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(40px) scale(1.1)',
        }}
      />

      {/* 3. Skeleton Layer (Only for initial cold load) */}
      {showSkeleton && (
        <div className="absolute inset-0 z-40">
          <HeroSkeleton />
        </div>
      )}

      {error ? (
        <div className="w-full h-full flex items-center justify-center relative z-50">
          <p className="text-red-500 font-medium">Error loading hero image. Please refresh.</p>
        </div>
      ) : (
        <>
          {images && images.length > 0 && (
            <Image
              src={highResSrc}
              alt="Hero Background"
              fill
              priority
              sizes="100vw"
              onLoad={handleImageLoad}
              className={`
                object-cover object-center z-20
                transition-opacity duration-1000 ease-in-out
                ${imageLoaded ? "opacity-100" : "opacity-0"}
              `}
            />
          )}

          {/* Subtle Contrast Overlay */}
          <div
            className={`
              absolute inset-0 bg-black/5 z-25
              transition-opacity duration-1000
              ${imageLoaded ? "opacity-100" : "opacity-0"}
            `}
          />

          {/* Text Content */}
          <div
            className={`relative z-30 flex flex-col justify-center h-full -translate-y-4 sm:-translate-y-6 md:-translate-y-12 lg:-translate-y-16 transition-all duration-1000 ${imageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {images && images.length > 0 && (
              <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-13 items-start">
                <div className="inline-block mx-auto sm:mx-0 flex flex-col gap-2 sm:gap-3 md:gap-4">
                  <div className="w-fit" data-aos="fade-right" data-aos-delay="200">
                    <h1 className="font-highrise font-black text-white uppercase leading-[0.9] text-[44px] sm:text-[56px] md:text-[70px] lg:text-[90px] xl:text-[110px] 2xl:text-[120px] whitespace-nowrap [text-shadow:0_2px_15px_rgba(0,0,0,0.4)] scale-y-120">
                      FRAMING THE FUTURE OF
                    </h1>
                  </div>

                  <div className="flex justify-end w-full mt-3 sm:mt-5 md:mt-6 lg:mt-7 xl:mt-8" data-aos="fade-left" data-aos-delay="400">
                    <h2 className="font-highrise font-black text-white uppercase leading-[0.9] text-[44px] sm:text-[56px] md:text-[70px] lg:text-[90px] xl:text-[120px] whitespace-nowrap text-right [text-shadow:0_2px_15px_rgba(0,0,0,0.4)] scale-y-120">
                      MODERN LIVING
                    </h2>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Fade Gradient */}
          <div className="absolute bottom-0 left-0 w-full h-20 sm:h-24 md:h-28 lg:h-32 bg-[linear-gradient(to_top,white_0%,white_25%,rgba(255,255,255,0.05)_70%,transparent_100%)] z-35" />
        </>
      )}
    </section>
  );
}
