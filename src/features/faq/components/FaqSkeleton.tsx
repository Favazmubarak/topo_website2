export const FaqSkeleton = () => {
  return (
    <div className="space-y-3 md:space-y-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-50/50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100/50 animate-pulse"
        >
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <div className="w-3 h-3 bg-gray-200 rounded-full shrink-0" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
          <div className="pl-5 md:pl-6 space-y-2">
            <div className="h-2 bg-gray-100 rounded w-full" />
            <div className="h-2 bg-gray-100 rounded w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
};
