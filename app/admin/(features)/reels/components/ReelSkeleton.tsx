import React from "react";

export const ReelSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-6 animate-pulse">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-lg md:rounded-xl" />
                        <div className="flex gap-1">
                            <div className="w-6 h-6 bg-gray-200 rounded-lg" />
                            <div className="w-6 h-6 bg-gray-200 rounded-lg" />
                        </div>
                    </div>
                    
                    {/* Thumbnail Skeleton */}
                    <div className="aspect-[9/16] w-full bg-gray-200 rounded-lg md:rounded-xl" />
                    
                    <div className="mt-4 flex justify-between">
                        <div className="h-2 bg-gray-200 rounded w-1/4" />
                        <div className="h-2 bg-gray-100 rounded w-1/5" />
                    </div>
                </div>
            ))}
        </div>
    );
};
