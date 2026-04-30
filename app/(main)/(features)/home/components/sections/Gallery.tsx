"use client";

import Image from "next/image";
import { useGallery } from "@/app/(main)/(features)/gallery/hooks/useGallery";
import { Skeleton } from "@/src/components/common/Skeleton";
import { ImageModal } from "@/src/components/common/ImageModal";
import { useState } from "react";
import { GalleryImage } from "@/app/(main)/(features)/gallery/api/galleryApi";

const LAYOUT_CONFIG = [
  { span: "col-span-1 md:col-span-7", aspect: "aspect-[4/3] md:aspect-[7/4]" },
  { span: "col-span-1 md:col-span-5", aspect: "aspect-[4/3] md:aspect-[5/4]" },
  { span: "col-span-1 md:col-span-4", aspect: "aspect-[4/3] md:aspect-square" },
  { span: "col-span-1 md:col-span-4", aspect: "aspect-[4/3] md:aspect-square" },
  { span: "col-span-1 md:col-span-4", aspect: "aspect-[4/3] md:aspect-square" },
  { span: "col-span-1 md:col-span-5", aspect: "aspect-[4/3] md:aspect-[5/4]" },
  { span: "col-span-2 md:col-span-7", aspect: "aspect-[2/1] md:aspect-[7/4]" },
];

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-12 gap-4 sm:gap-6">
      {[...Array(7)].map((_, i) => (
        <Skeleton
          key={i}
          className={`${LAYOUT_CONFIG[i].span} ${LAYOUT_CONFIG[i].aspect} rounded-[15px]`}
        />
      ))}
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="text-center">
        <p className="text-gray-600 text-red-500">{error}</p>
      </div>
    </div>
  );
}


interface GalleryProps {
  initialImages?: GalleryImage[];
}

export default function Gallery({ initialImages }: GalleryProps) {
  const { galleryImages: fetchedImages, loading, error } = useGallery();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryImages = initialImages && initialImages.length > 0 ? initialImages : fetchedImages;
  
  const displayImages = galleryImages?.slice(0, 7) || [];

  return (
    <section className="w-full pb-10 sm:pb-16 md:pb-24 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 mb-10 lg:mb-16">
          <div className="w-full md:w-1/2" data-aos="fade-right">
            <h2 className="font-montserrat text-[#0066B2] text-[clamp(24px,5vw,50px)] font-medium leading-tight tracking-tight">
              Gallery
            </h2>
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
        ) : !displayImages.length ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500 text-lg">No gallery images available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-12 gap-4 sm:gap-6">
            {displayImages.map((image, index) => {
              const layout = LAYOUT_CONFIG[index];

              return (
                <div
                  key={image._id || index}
                  className={`${layout.span} ${layout.aspect} relative overflow-hidden rounded-[15px] group cursor-pointer`}
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
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

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage || ""}
      />
    </section>
  );
}