"use client";

import { Skeleton } from "@/src/components/common/Skeleton";

export default function HeroSkeleton() {
  return (
    <div className="absolute inset-0 w-full h-full z-50">

      <Skeleton className="absolute inset-0 w-full h-full rounded-none bg-gray-200" />

      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 flex flex-col justify-center h-full -translate-y-4 sm:-translate-y-6 md:-translate-y-12 lg:-translate-y-16 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-13 items-start w-full">
          <div className="inline-block mx-auto sm:mx-0 flex flex-col gap-2 sm:gap-3 md:gap-4">

            <div className="w-fit" data-aos="fade-right" data-aos-delay="200">
              <h1 className="font-highrise font-black text-transparent bg-white/20 backdrop-blur-sm rounded-full scale-y-120 origin-left animate-pulse uppercase leading-[0.9] text-[44px] sm:text-[56px] md:text-[70px] lg:text-[90px] xl:text-[120px] whitespace-nowrap">
                FRAMING THE FUTURE OF
              </h1>
            </div>

            <div className="flex justify-end w-full mt-3 sm:mt-5 md:mt-6 lg:mt-7 xl:mt-8" data-aos="fade-left" data-aos-delay="400">
              <h2 className="font-highrise font-black text-transparent bg-white/20 backdrop-blur-sm rounded-full scale-y-120 origin-right animate-pulse uppercase leading-[0.9] text-[44px] sm:text-[56px] md:text-[70px] lg:text-[90px] xl:text-[120px] whitespace-nowrap text-right">
                MODERN LIVING
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div
        className="
              absolute bottom-0 left-0 w-full 
              h-20 sm:h-24 md:h-28 lg:h-32 
              bg-[linear-gradient(to_top,white_0%,white_25%,rgba(255,255,255,0.1)_70%,transparent_100%)]
              z-20
            "
      />
    </div>
  );
}
