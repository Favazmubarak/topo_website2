"use client";

import { Skeleton } from "@/src/components/common/Skeleton";

export default function FAQSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-[#E1ECFF] rounded-[20px] p-5 sm:p-6 md:p-8 flex flex-col"
        >
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-4 sm:gap-6 md:gap-8 w-full">
              <Skeleton className="h-6 w-10 sm:w-12 bg-blue-200" />
              <Skeleton className="h-6 w-full max-w-[400px] bg-blue-200" />
            </div>
            <Skeleton className="h-8 w-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 bg-blue-300" />
          </div>
        </div>
      ))}
    </div>
  );
}
