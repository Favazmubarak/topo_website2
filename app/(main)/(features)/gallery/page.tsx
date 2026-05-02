"use client";

import Image from "next/image";
import { useGallery } from "./hooks/useGallery";
import { ImageModal } from "@/src/components/common/ImageModal";
import { Skeleton } from "@/src/components/common/Skeleton";
import { useState } from "react";

const LAYOUT_CONFIG = [
  { span: "col-span-1 md:col-span-7", aspect: "aspect-[4/3] md:aspect-none md:w-full md:h-[calc(((100vw-96px-264px)/12*4)+72px)] lg:h-[calc(((min(100vw,1400px)-160px-264px)/12*4)+72px)]" },
  { span: "col-span-1 md:col-span-5", aspect: "aspect-[4/3] md:aspect-none md:w-full md:h-[calc(((100vw-96px-264px)/12*4)+72px)] lg:h-[calc(((min(100vw,1400px)-160px-264px)/12*4)+72px)]" },
  { span: "col-span-1 md:col-span-4", aspect: "aspect-[4/3] md:aspect-square" },
  { span: "col-span-1 md:col-span-4", aspect: "aspect-[4/3] md:aspect-square" },
  { span: "col-span-1 md:col-span-4", aspect: "aspect-[4/3] md:aspect-square" },
  { span: "col-span-1 md:col-span-5", aspect: "aspect-[4/3] md:aspect-none md:w-full md:h-[calc(((100vw-96px-264px)/12*4)+72px)] lg:h-[calc(((min(100vw,1400px)-160px-264px)/12*4)+72px)]" },
  { span: "col-span-2 md:col-span-7", aspect: "aspect-[2/1] md:aspect-none md:w-full md:h-[calc(((100vw-96px-264px)/12*4)+72px)] lg:h-[calc(((min(100vw,1400px)-160px-264px)/12*4)+72px)]" },
  { span: "col-span-1 md:col-span-4", aspect: "aspect-[4/3] md:aspect-square" },
  { span: "col-span-1 md:col-span-4", aspect: "aspect-[4/3] md:aspect-square" },
  { span: "col-span-2 md:col-span-4", aspect: "aspect-[4/3] md:aspect-square" },
  { span: "col-span-1 md:col-span-7", aspect: "aspect-[4/3] md:aspect-none md:w-full md:h-[calc(((100vw-96px-264px)/12*4)+72px)] lg:h-[calc(((min(100vw,1400px)-160px-264px)/12*4)+72px)]" },
  { span: "col-span-1 md:col-span-5", aspect: "aspect-[4/3] md:aspect-none md:w-full md:h-[calc(((100vw-96px-264px)/12*4)+72px)] lg:h-[calc(((min(100vw,1400px)-160px-264px)/12*4)+72px)]" },
  { span: "col-span-1 md:col-span-4", aspect: "aspect-[4/3] md:aspect-square" },
  { span: "col-span-1 md:col-span-4", aspect: "aspect-[4/3] md:aspect-square" },
  { span: "col-span-2 md:col-span-4", aspect: "aspect-[4/3] md:aspect-square" },
];

function LoadingSkeleton() {
  return (
    <div className="min-h-[400px] grid grid-cols-2 md:grid-cols-12 gap-4 sm:gap-6">
      {[...Array(7)].map((_, i) => (
        <Skeleton
          key={i}
          className={`${LAYOUT_CONFIG[i % LAYOUT_CONFIG.length].span} ${LAYOUT_CONFIG[i % LAYOUT_CONFIG.length].aspect} relative aspect-[4/3] rounded-[15px]`}
        />
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

export default function GalleryPage() {
  const { galleryImages, loading, loadingMore, error, hasMore, page, fetchGalleryImages } = useGallery();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      fetchGalleryImages(page + 1);
    }
  };

  const allImageUrls = galleryImages?.map(image => image.imageUrl) || [];

  return (
    <main className="pt-40 sm:pt-32 md:pt-40 lg:pt-40 xl:pt-52 pb-16">
      <section className="w-full px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 mb-10 lg:mb-16">
            <div className="w-full md:w-1/2" data-aos="fade-right">
              <h1 className="font-montserrat text-[#0066B2] text-[clamp(24px,5vw,50px)] font-medium leading-tight tracking-tight">
                Gallery
              </h1>
            </div>
            <div
              className="w-full md:w-1/2 lg:max-w-[500px]"
              data-aos="fade-left"
            >
              <p className="font-poppins font-[400] text-black text-sm sm:text-lg md:text-[20px] leading-relaxed">
                Explore our completed projects showcasing quality, style, and
                precision in every detail.
              </p>
            </div>
          </div>
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState error={error} />
          ) : !galleryImages?.length ? (
            <div className="min-h-[400px] flex justify-center items-center py-20">
              <p className="text-gray-500 text-lg">No gallery images available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-12 gap-4 sm:gap-6">
              {galleryImages.map((image, index) => {
                const layout = LAYOUT_CONFIG[index % LAYOUT_CONFIG.length];

                return (
                  <div
                    key={image._id || index}
                    data-aos="fade-up"
                    data-aos-delay={(index % 4) * 80}
                    className={`${layout.span} ${layout.aspect} relative aspect-[4/3] overflow-hidden rounded-[15px] group cursor-pointer`}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <Image
                      src={image.imageUrl}
                      alt={`Gallery image ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <span className="text-white text-sm font-medium px-4 py-2 bg-white/20 backdrop-blur-md rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        View Full Size
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {hasMore && galleryImages?.length > 0 && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-8 py-3 bg-[#0066B2] text-white hover:bg-[#005299] text-sm font-semibold rounded-full transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg"
              >
                {loadingMore ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
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