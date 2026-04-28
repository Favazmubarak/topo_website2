import React from "react";

export const ReelSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-6 animate-pulse">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-lg md:rounded-xl mb-4 md:mb-6" />
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                        <div className="h-2 bg-gray-100 rounded w-1/3" />
                    </div>
                    <div className="mt-3 md:mt-4 h-2 bg-gray-100 rounded w-1/4" />
                </div>
            ))}
        </div>
    );
};
