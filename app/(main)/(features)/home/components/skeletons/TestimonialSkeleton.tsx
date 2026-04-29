"use client";

import { Skeleton } from "@/src/components/common/Skeleton";

export default function TestimonialSkeleton() {
  return (
    <div className="flex w-max py-4 overflow-hidden">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white border-2 border-[#E9E9E9] rounded-[24px] p-6 sm:p-8 flex flex-col h-[320px] w-[300px] sm:w-[380px] mx-4 shrink-0"
        >
          {/* rating skeleton */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Skeleton key={s} className="w-5 h-5 rounded-full" />
              ))}
            </div>
            <Skeleton className="w-8 h-8 opacity-20" />
          </div>

          {/* review skeleton */}
          <div className="flex flex-col gap-2 mb-8 flex-grow">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* user skeleton */}
          <div className="flex items-center gap-4 pt-6 border-t border-[#E9E9E9]">
            <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
