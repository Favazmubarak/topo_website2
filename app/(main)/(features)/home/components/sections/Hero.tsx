"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useImage } from "../../hooks/useImage";
import HeroSkeleton from "../skeletons/HeroSkeleton";

export default function Hero() {
  const { images, loading, error } = useImage("hero");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const getSafeSrc = (url?: string) =>
    url?.trim() || "/fallback/hero.jpeg";

  
  useEffect(() => {
    setImageLoaded(false);
    setShowSkeleton(true);
  }, [images]);

  useEffect(() => {
    if (imageLoaded) {
      const timer = setTimeout(() => setShowSkeleton(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [imageLoaded]);

  return (
    <section
      id="hero"
      className="relative w-full h-[65vh] sm:h-[75vh] md:h-screen overflow-hidden px-4 sm:px-6 md:px-12 lg:px-20 bg-gray-50"
    >
      {showSkeleton && (
        <div 
          className={`absolute inset-0 z-40 transition-opacity duration-1000 ease-in-out ${
            imageLoaded ? "opacity-0" : "opacity-100"
          }`}
        >
          <HeroSkeleton />
        </div>
      )}
      
      {error ? (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      ) : (
        <>
          {!loading && (
            <Image
              src={getSafeSrc(images?.[0]?.imageUrl)}
              alt="Hero Background"
              fill
              priority
              unoptimized
              sizes="100vw"
              onLoad={() => setImageLoaded(true)}
              className={`
                object-cover object-center
                transition-opacity duration-1000 ease-in-out
                ${imageLoaded ? "opacity-100" : "opacity-0"}
              `}
            />
          )}
          <div
            className={`
              absolute inset-0 bg-black/10
              transition-opacity duration-1000
              ${imageLoaded ? "opacity-100" : "opacity-0"}
            `}
          />
          <div className={`relative z-10 flex flex-col justify-center h-full -translate-y-4 sm:-translate-y-6 md:-translate-y-12 lg:-translate-y-16 transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {!loading && (
              <div className="flex bg-red-400 flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-13 items-start">
                  <div className="inline-block max-w-full overflow-hidden mx-auto sm:mx-0 flex flex-col gap-2 sm:gap-3 md:gap-4">
                  <div
                    className="w-fit"
                    data-aos="fade-right"
                    data-aos-delay="200"
                  >
                    <h1
                      className="
                        font-highrise 
                        font-black
                        text-white 
                        uppercase 
                        leading-[0.9] 
                        text-[44px]
                        sm:text-[56px]
                        md:text-[70px]
                        lg:text-[90px]
                        xl:text-[120px]
                        whitespace-nowrap
                        [text-shadow:0_2px_15px_rgba(0,0,0,0.5)]
                        scale-y-120
                      "
                    >
                      FRAMING THE FUTURE OF
                    </h1>
                  </div>

                  <div
                    className="
                      flex justify-end w-full 
                      mt-3 sm:mt-5 md:mt-6 lg:mt-7 xl:mt-8
                    "
                    data-aos="fade-left"
                    data-aos-delay="400"
                  >
                    <h2
                      className="
                        font-highrise 
                        font-black
                        text-white 
                        uppercase 
                        leading-[0.9] 
                        text-[44px]
                        sm:text-[56px]
                        md:text-[70px]
                        lg:text-[90px]
                        xl:text-[120px]
                        whitespace-nowrap
                        text-right
                        [text-shadow:0_2px_15px_rgba(0,0,0,0.5)]
                        scale-y-120
                      "
                    >
                      MODERN LIVING
                    </h2>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div
            className="
              absolute bottom-0 left-0 w-full 
              h-20 sm:h-24 md:h-28 lg:h-32 
              bg-[linear-gradient(to_top,white_0%,white_25%,rgba(255,255,255,0.1)_70%,transparent_100%)]
              z-20
            "
          />
        </>
      )}
    </section>
  );
}
