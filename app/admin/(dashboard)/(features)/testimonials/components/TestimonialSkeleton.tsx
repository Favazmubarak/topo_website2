export const TestimonialSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-50/50 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-gray-100/50 animate-pulse"
        >
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200" />
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="w-2 h-2 bg-gray-200 rounded-full" />
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-gray-100 rounded w-full" />
            <div className="h-2 bg-gray-100 rounded w-5/6" />
            <div className="h-2 bg-gray-100 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
};
