"use client";

import { Skeleton } from "@/src/components/common/Skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl md:rounded-2xl aspect-[3/4] md:aspect-[4/5] shadow-lg bg-gray-100">
      <Skeleton className="w-full h-full rounded-none" />

      <div className="absolute bottom-2 left-2 right-2 bg-white/70 p-3 sm:p-4 md:p-5 rounded-lg md:rounded-xl flex flex-col gap-2 lg:min-h-[150px]">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex flex-col gap-1 mt-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
}
