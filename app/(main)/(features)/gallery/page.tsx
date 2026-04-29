"use client";

import Image from "next/image";
import { useGallery } from "./hooks/useGallery";
import { ImageModal } from "@/src/components/common/ImageModal";
import { useState } from "react";

const LAYOUT_CONFIG = [
  { span: "col-span-1 md:col-span-7", aspect: "md:aspect-[7/4]" },
  { span: "col-span-1 md:col-span-5", aspect: "md:aspect-[5/4]" },
  { span: "col-span-1 md:col-span-4", aspect: "md:aspect-square" },
  { span: "col-span-1 md:col-span-4", aspect: "md:aspect-square" },
  { span: "col-span-1 md:col-span-4", aspect: "md:aspect-square" },
  { span: "col-span-1 md:col-span-5", aspect: "md:aspect-[5/4]" },
  { span: "col-span-2 md:col-span-7", aspect: "md:aspect-[7/4]" },
  { span: "col-span-1 md:col-span-4", aspect: "md:aspect-square" },
  { span: "col-span-1 md:col-span-4", aspect: "md:aspect-square" },
  { span: "col-span-2 md:col-span-4", aspect: "md:aspect-square" },
  { span: "col-span-1 md:col-span-7", aspect: "md:aspect-[7/4]" },
  { span: "col-span-1 md:col-span-5", aspect: "md:aspect-[5/4]" },
  { span: "col-span-1 md:col-span-4", aspect: "md:aspect-square" },
  { span: "col-span-1 md:col-span-4", aspect: "md:aspect-square" },
  { span: "col-span-2 md:col-span-4", aspect: "md:aspect-square" },
];

function LoadingSkeleton() {
  return (
    <div className="min-h-[400px] grid grid-cols-2 md:grid-cols-12 gap-4 sm:gap-6">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className={`${LAYOUT_CONFIG[i % LAYOUT_CONFIG.length].span} ${LAYOUT_CONFIG[i % LAYOUT_CONFIG.length].aspect} relative aspect-[4/3] rounded-[15px] bg-gray-200 animate-pulse`}
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
  const { galleryImages, loading, error } = useGallery();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <main className="pt-40 sm:pt-32 md:pt-40 lg:pt-40 xl:pt-52 pb-16">
      <section className="w-full px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
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

          {/* Content */}
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
                    onClick={() => setSelectedImage(image.imageUrl)}
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
        </div>
      </section>

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage || ""}
      />
    </main>
  );
}