"use client";

import Image from "next/image";
import { useGallery } from "@/src/features/gallery/hooks/useGallery";
import { ImageModal } from "@/src/components/common/ImageModal";
import { Skeleton } from "@/src/components/common/Skeleton";
import { useState, useEffect, useRef } from "react";

function LoadingSkeleton() {
  return (
    <div className="flex gap-4 sm:gap-5">
      {[...Array(4)].map((_, col) => (
        <div key={col} className={`flex flex-col gap-4 sm:gap-5 flex-1 ${col >= 2 ? "hidden md:flex" : ""} ${col >= 3 ? "hidden lg:flex" : ""}`}>
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              className={`w-full rounded-[12px] ${(col + i) % 3 === 0 ? "aspect-[3/4]" : (col + i) % 3 === 1 ? "aspect-[4/3]" : "aspect-square"}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="min-h-[400px] flex justify-center items-center py-20">
      <div className="text-center">
        <p className="text-gray-600 text-red-500">{error}</p>
      </div>
    </div>
  );
}

/** Individual image card with shimmer while the image is downloading */
function GalleryCard({
  src,
  alt,
  onClick,
  aosDelay,
}: {
  src: string;
  alt: string;
  onClick: () => void;
  aosDelay: number;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <div
      data-aos="fade-up"
      data-aos-delay={aosDelay}
      data-aos-once="true"
      className="relative group cursor-pointer overflow-hidden rounded-[12px] bg-gray-100"
      onClick={onClick}
    >
      {/* Shimmer skeleton shown while image downloads */}
      {!imgLoaded && (
        <div className="absolute inset-0 z-10 bg-gray-200 animate-pulse rounded-[12px]" />
      )}
      <Image
        src={src}
        alt={alt}
        width={800}
        height={600}
        onLoad={() => setImgLoaded(true)}
        className={`w-full h-auto block transition-all duration-700 group-hover:scale-[1.03] ${
          imgLoaded ? "opacity-100" : "opacity-0"
        }`}
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-20">
        <span className="text-white text-sm font-medium px-4 py-2 bg-white/20 backdrop-blur-md rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          View Full Size
        </span>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const { galleryImages, loading, loadingMore, error, hasMore, page, fetchGalleryImages, hasFetched } = useGallery();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // --- Pagination state (display layer only, hook is untouched) ---
  const [displayPage, setDisplayPage] = useState(1);
  // boundaries[i] = total galleryImages count after API page i+1 was loaded
  const [boundaries, setBoundaries] = useState<number[]>([]);
  const prevFetchedPage = useRef(0);
  const galleryTopRef = useRef<HTMLDivElement>(null);

  // --- Responsive column count ---
  const [colCount, setColCount] = useState(4);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 768) setColCount(2);
      else if (window.innerWidth < 1024) setColCount(3);
      else setColCount(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Track page boundaries whenever a new API page is loaded
  useEffect(() => {
    if (page > prevFetchedPage.current && galleryImages.length > 0) {
      setBoundaries((prev) => {
        const next = [...prev];
        next[page - 1] = galleryImages.length;
        return next;
      });
      prevFetchedPage.current = page;
      // Auto-advance display to newly loaded page
      if (page > displayPage) setDisplayPage(page);
    }
  }, [page, galleryImages.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Images for the currently displayed page
  const pageStart = displayPage === 1 ? 0 : (boundaries[displayPage - 2] ?? 0);
  const pageEnd = boundaries[displayPage - 1] ?? galleryImages.length;
  const displayedImages = galleryImages.slice(pageStart, pageEnd);
  const totalKnownPages = boundaries.length;

  // Distribute images round-robin across columns — no gaps, no uneven heights
  const columns = Array.from({ length: colCount }, (_, ci) =>
    displayedImages
      .map((img, i) => ({ img, globalIndex: pageStart + i }))
      .filter((_, i) => i % colCount === ci)
  );

  const scrollToGrid = () =>
    galleryTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handlePageChange = (newPage: number) => {
    if (newPage === displayPage) return;
    if (newPage <= totalKnownPages) {
      setDisplayPage(newPage);
      scrollToGrid();
    } else if (newPage === totalKnownPages + 1 && hasMore && !loadingMore && !loading) {
      fetchGalleryImages(newPage); // hook will append; useEffect auto-advances displayPage
      scrollToGrid();
    }
  };

  const allImageUrls = galleryImages?.map((image) => image.imageUrl) || [];

  return (
    <main className="pt-40 sm:pt-32 md:pt-40 lg:pt-40 xl:pt-52 pb-16">
      <section className="w-full px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">

          {/* Header — untouched */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 mb-10 lg:mb-16">
            <div className="w-full md:w-1/2" data-aos="fade-right">
              <h1 className="font-montserrat text-[#0066B2] text-[clamp(24px,5vw,50px)] font-medium leading-tight tracking-tight">
                Gallery
              </h1>
            </div>
            <div className="w-full md:w-1/2 lg:max-w-[500px]" data-aos="fade-left">
              <p className="font-poppins font-[400] text-black text-sm sm:text-lg md:text-[20px] leading-relaxed">
                Explore our completed projects showcasing quality, style, and
                precision in every detail.
              </p>
            </div>
          </div>

          {/* Scroll anchor */}
          <div ref={galleryTopRef} />

          {loading || !hasFetched ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState error={error} />
          ) : !galleryImages?.length ? (
            <div className="min-h-[400px] flex justify-center items-center py-20">
              <p className="text-gray-500 text-lg">No gallery images available</p>
            </div>
          ) : (
            <>
              {/* JS round-robin column distribution — eliminates white space gaps */}
              <div className="flex gap-4 sm:gap-5">
                {columns.map((col, ci) => (
                  <div key={ci} className="flex flex-col gap-4 sm:gap-5 flex-1">
                    {col.map(({ img, globalIndex }) => (
                      <GalleryCard
                        key={img._id || globalIndex}
                        src={img.imageUrl}
                        alt={`Gallery image ${globalIndex + 1}`}
                        aosDelay={ci * 80}
                        onClick={() => setSelectedIndex(globalIndex)}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Rich numbered pagination */}
              {(totalKnownPages > 1 || hasMore) && (
                <div className="mt-14 flex items-center justify-center gap-2 flex-wrap">
                  {/* Prev */}
                  <button
                    onClick={() => handlePageChange(displayPage - 1)}
                    disabled={displayPage <= 1}
                    aria-label="Previous page"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-[#0066B2] hover:text-[#0066B2] transition-all disabled:opacity-30 disabled:cursor-not-allowed text-xl font-light"
                  >
                    ‹
                  </button>

                  {/* Known page numbers */}
                  {Array.from({ length: totalKnownPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                        displayPage === p
                          ? "bg-[#0066B2] text-white shadow-lg shadow-[#0066B2]/30 scale-110"
                          : "border border-gray-200 text-gray-600 hover:border-[#0066B2] hover:text-[#0066B2]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  {/* Next — loads new API page if not yet fetched */}
                  <button
                    onClick={() => handlePageChange(
                      hasMore ? totalKnownPages + 1 : displayPage + 1
                    )}
                    disabled={(!hasMore && displayPage >= totalKnownPages) || loadingMore}
                    aria-label="Next page"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-[#0066B2] hover:text-[#0066B2] transition-all disabled:opacity-30 disabled:cursor-not-allowed text-xl font-light"
                  >
                    {loadingMore ? (
                      <div className="w-4 h-4 border-2 border-[#0066B2]/30 border-t-[#0066B2] rounded-full animate-spin" />
                    ) : "›"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <ImageModal
        isOpen={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        images={allImageUrls}
        currentIndex={selectedIndex || 0}
        onIndexChange={(index) => setSelectedIndex(index)}
      />
    </main>
  );
}