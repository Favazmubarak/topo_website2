import { Section } from "../api/imageApi";

interface ImageSkeletonProps {
  activeSection: Section;
}

export const ImageSkeleton = ({ activeSection }: ImageSkeletonProps) => {
  const count = 3;
  const aspectClass = "aspect-video";
  const gridClass = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6";

  return (
    <div className={gridClass}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={`rounded-xl md:rounded-2xl bg-gray-100 animate-pulse ${aspectClass}`}
        />
      ))}
    </div>
  );
};
