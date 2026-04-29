"use client";

import { Skeleton } from "@/src/components/common/Skeleton";

export default function HeroSkeleton() {
  return (
    <div className="relative w-full h-full flex flex-col justify-center -translate-y-4 sm:-translate-y-6 md:-translate-y-12 lg:-translate-y-16">
      <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-13 items-start w-full">
        <div className="inline-block mx-auto sm:mx-0 flex flex-col gap-2 sm:gap-3 md:gap-4 w-full">
          {/* First line skeleton */}
          <div className="w-fit">
            <Skeleton className="h-[44px] sm:h-[56px] md:h-[70px] lg:h-[90px] xl:h-[120px] w-[280px] sm:w-[400px] md:w-[600px] lg:w-[800px] xl:w-[1000px] bg-gray-100" />
          </div>

          {/* Second line skeleton */}
          <div className="flex justify-end w-full mt-3 sm:mt-5 md:mt-6 lg:mt-7 xl:mt-8">
            <Skeleton className="h-[44px] sm:h-[56px] md:h-[70px] lg:h-[90px] xl:h-[120px] w-[220px] sm:w-[320px] md:w-[450px] lg:w-[600px] xl:w-[750px] bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
