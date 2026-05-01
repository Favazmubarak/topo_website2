"use client";

import Link from "next/link";
import Image from "next/image";
import { useImage } from "../../hooks/useImage";
import { Skeleton } from "@/src/components/common/Skeleton";

export default function Upgrade() {

  const { images, loading, error } = useImage("cta")
  const getSafeSrc = (url?: string) =>
    url?.trim() || "/fallback/about1.jpg";

  const handleGetQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('hero');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-slate-white md:py-12 sm:py-10 py-8">
      <div className="max-w-full bg-red-200  mx-auto">
  <div className="w-full h-[180px] sm:h-[240px] md:h-[360px] lg:h-[450px] relative overflow-hidden group shadow-xl">
        {loading ? (
          <Skeleton className="w-full h-full rounded-none" />
        ) : error ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 ">
            <p className="text-red-500 text-sm">Error: {error}</p>
          </div>
        ) : (
          <>
            <div className="absolute inset-0">
              <Image
                src={getSafeSrc(images[0]?.imageUrl)}
                alt="Premium interior with aluminum glass doors"
                fill
                className="object-cover object-[center_60%] transition-transform duration-1000 group-hover:scale-105 "
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/45" />
            </div>

              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-2 sm:px-4 md:px-6 max-w-[900px] mx-auto" data-aos="fade-up">
                <h2 className="font-poppins text-white text-[clamp(14px,4vw,48px)] font-[500] leading-tight tracking-tight mb-1 sm:mb-2 md:mb-4 lg:mb-6 px-1" data-aos="fade-up" data-aos-delay="100">
                  Upgrade Your Space with Topo
                </h2>

                <p className="font-poppins text-white text-[11px] sm:text-xs md:text-base lg:text-[22px] leading-snug mb-2 sm:mb-4 md:mb-6 lg:mb-8 max-w-[650px] mx-auto font-[300] px-1 opacity-90" data-aos="fade-up" data-aos-delay="200">
                  Transform your home with premium aluminum designed for style, strength, and performance.
                </p>

                <Link href="https://wa.me/7907030870" target="_blank" rel="noopener noreferrer">
                  <button className="group/btn text-[10px] sm:text-xs md:text-sm lg:text-base inline-flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 bg-[#0066B2] text-white pl-3 sm:pl-5 md:pl-7 lg:pl-8 pr-0.5 sm:pr-1 md:pr-2 py-1 sm:py-1.5 md:py-2 lg:py-2.5 rounded-full font-poppins transition-all duration-300 hover:bg-[#005596] shadow-md sm:shadow-lg md:shadow-xl hover:shadow-[#0066B2]/20" data-aos="fade-up" data-aos-delay="300">
                    Get a free quote
                    <div className="bg-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover/btn:bg-gray-100">
                      <svg
                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-[#0066B2] -rotate-45"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  </button>
                </Link>
              </div>
          </>
        )}
      </div>
      </div>
    
    </section>
  );
}