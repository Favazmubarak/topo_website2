"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { useTestimonials } from "../../hooks/useTestimonials";
import { IoMdStar, IoMdStarOutline } from "react-icons/io";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export default function Testimonials() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { testimonials, loading, error} = useTestimonials()
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 320;
    const targetScroll =
      scrollContainerRef.current.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);

    scrollContainerRef.current.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <main className="pt-40 xl:pt-52 pb-20 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#0066B2]"></div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-40 xl:pt-52 pb-20 text-center">
        <h1 className="text-2xl text-red-500">Error: {error}</h1>
      </main>
    );
  }

  if (!loading && testimonials.length === 0) {
    return (
      <div className="w-full py-12 flex justify-center">
        <div className="px-6 py-4 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-600">
          No testimonials available right now.
        </div>
      </div>
    );
  }
  return (
    <section className="w-full bg-white px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-10 sm:mb-14 md:mb-16">
          <h2
            className="font-montserrat text-[#0066B2] text-[clamp(22px,5vw,50px)] font-medium leading-tight"
            data-aos="fade-up"
          >
            What Our Clients Say
          </h2>
        </div>

        <div className="relative">
          {isSmallScreen && showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-[#E9E9E9] rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-200 md:hidden"
              aria-label="Scroll left"
            >
              <IoChevronBack className="w-5 h-5 text-[#0066B2]" />
            </button>
          )}

          {isSmallScreen && showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-[#E9E9E9] rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-200 md:hidden"
              aria-label="Scroll right"
            >
              <IoChevronForward className="w-5 h-5 text-[#0066B2]" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="grid md:grid-cols-2 lg:grid-cols-3 px-6 sm:px-8 lg:px-10 gap-8 sm:gap-10 lg:gap-16 overflow-x-auto md:overflow-x-visible scrollbar-hide"
            style={{
              gridAutoFlow: isSmallScreen ? "column" : "row",
              gridAutoColumns: isSmallScreen ? "minmax(280px, 1fr)" : "auto",
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial._id}
                data-aos={
                  index === 0
                    ? "fade-right"
                    : index === 1
                      ? "fade-up"
                      : "fade-left"
                }
                data-aos-delay={index * 80}
                className="bg-white border-2 border-[#E9E9E9] rounded-[24px] p-4 sm:pb-2 sm:p-5 flex flex-col h-full shrink-0 md:shrink"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-1 text-[#0066B2] text-lg">
                    {[...Array(5)].map((_, i) =>
                      i < testimonial.rating ? (
                        <IoMdStar key={i} />
                      ) : (
                        <IoMdStarOutline key={i} className="text-gray-300" />
                      )
                    )}
                  </div>

                  <Image
                    src="/quotes.png"
                    alt="quote"
                    width={28}
                    height={28}
                    className=" -translate-y-1"
                  />
                </div>

                <p className="font-poppins text-[#2F2F2F] text-sm sm:text-[15px] lg:text-base leading-relaxed mb-14 flex-grow">
                  {testimonial.review}
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-[#E9E9E9]">
                  <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={testimonial?.avatar || "/avatar.jpg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
                    />
                  </div>
                  <span className="font-montserrat text-black text-sm sm:text-[15px] font-medium">
                    {testimonial.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}