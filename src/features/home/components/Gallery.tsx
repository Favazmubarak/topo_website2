"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGallery } from "@/src/features/gallery/hooks/useGallery";
import { Skeleton } from "@/src/components/common/Skeleton";
import { ImageModal } from "@/src/components/common/ImageModal";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryImage } from "@/src/features/gallery/api/galleryApi";

/**
 * Dynamic Architectural Gallery
 * Features an auto-rotating grid that showcases the full portfolio over time.
 */
export default function Gallery({ initialImages }: { initialImages?: GalleryImage[] }) {
  const { galleryImages: allImages, loading, error } = useGallery();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  // State for the 6 visible images
  const [visibleImages, setVisibleImages] = useState<GalleryImage[]>([]);
  const galleryImages = allImages && allImages.length > 0 ? allImages : (initialImages || []);
  
  // Initialization
  useEffect(() => {
    if (galleryImages.length > 0) {
      setVisibleImages(galleryImages.slice(0, 6));
    }
  }, [galleryImages]);

  // Rotation Logic: Every 5 seconds, swap one random image
  useEffect(() => {
    if (galleryImages.length <= 6) return;

    const interval = setInterval(() => {
      setVisibleImages((prev) => {
        const newImages = [...prev];
        const slotToReplace = Math.floor(Math.random() * 6);
        
        // Find an image that isn't currently visible
        const currentIds = new Set(newImages.map(img => img._id));
        const pool = galleryImages.filter(img => !currentIds.has(img._id));
        
        if (pool.length > 0) {
          const replacement = pool[Math.floor(Math.random() * pool.length)];
          newImages[slotToReplace] = replacement;
        }
        
        return newImages;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [galleryImages]);

  const showSkeleton = loading && galleryImages.length === 0;
  const allImageUrls = visibleImages.map(image => image.imageUrl);

  if (error) {
    return (
      <div className="flex justify-center items-center py-20 text-red-500 font-montserrat">
        Error loading gallery: {error}
      </div>
    );
  }

  return (
    <section className="w-full bg-white py-20 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-12">
          <div className="w-full md:w-1/2" data-aos="fade-up">
            <span className="text-[#0066B2] text-[10px] font-mono tracking-[0.5em] uppercase mb-4 block">Selected Projects</span>
            <h2 className="font-montserrat text-[#1A1A1A] text-[clamp(28px,4vw,44px)] font-light leading-none tracking-tighter">
              Precision & <br />
              <span className="text-[#0066B2]">Aesthetic Harmony</span>
            </h2>
          </div>
          <div className="w-full md:w-1/3 lg:max-w-[300px]" data-aos="fade-up" data-aos-delay="100">
            <p className="font-poppins font-light text-gray-400 text-[13px] leading-relaxed">
              Achieving geometric perfection in every architectural installation.
            </p>
          </div>
        </div>

        {showSkeleton ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="w-full aspect-[4/3] rounded-[20px]" />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {/* 
                Auto-Rotating Grid
                Animated with Framer Motion for smooth project transitions
            */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {visibleImages.map((image, index) => (
                <div
                  key={index} // Using index to keep the slot stable
                  className="relative overflow-hidden rounded-[20px] cursor-pointer aspect-[4/3] sm:aspect-square md:aspect-[4/3] bg-gray-50"
                  onClick={() => setSelectedIndex(index)}
                >
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={image._id || `slot-${index}`}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <Image
                        src={image.imageUrl}
                        alt="Project Detail"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Premium Pill Navigation */}
            <div className="flex flex-col items-center pt-8" data-aos="fade-up">
              <Link href="/gallery" className="group flex items-center gap-6 px-10 py-5 rounded-full border border-gray-100 bg-white hover:bg-gray-50 transition-all duration-500 shadow-sm hover:shadow-xl">
                <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-gray-500 group-hover:text-[#0066B2] transition-colors duration-500">
                  Full Portfolio
                </span>
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0066B2] text-white transform group-hover:translate-x-1 transition-transform duration-500 shadow-lg shadow-[#0066B2]/20">
                  <svg 
                    width="18" height="18" viewBox="0 0 24 24" fill="none" 
                    className="stroke-white"
                  >
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      <ImageModal
        isOpen={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        images={allImageUrls}
        currentIndex={selectedIndex || 0}
        onIndexChange={(index) => setSelectedIndex(index)}
      />
    </section>
  );
}
