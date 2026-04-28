import { Section } from "../api/imageApi";

interface ImageSkeletonProps {
  activeSection: Section;
}

export const ImageSkeleton = ({ activeSection }: ImageSkeletonProps) => {
  const isWide = activeSection === "hero" || activeSection === "about";
  const count = isWide ? 2 : 1;
  const aspectClass = isWide ? "aspect-video" : "aspect-[21/9]";
  const gridClass = isWide
    ? "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6"
    : "grid grid-cols-1 gap-3 sm:gap-4 md:gap-6";

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
