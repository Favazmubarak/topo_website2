"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    text: "Great experience from start to finish. Smooth installation and very modern design.",
    rating: 5,
    avatar: "/avatar.jpg",
  },
  {
    id: 2,
    name: "Sarah M.",
    text: "Great experience from start to finish. Smooth installation and very modern design.",
    rating: 5,
    avatar: "/avatar.jpg",
  },
  {
    id: 3,
    name: "Sarah M.",
    text: "Great experience from start to finish. Smooth installation and very modern design.",
    rating: 5,
    avatar: "/avatar.jpg",
  },
];

const StarIcon = () => (
  <svg className="w-4 h-4 text-[#0066B2] fill-current" viewBox="0 0 24 24">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const QuoteIcon = () => (
  <svg
    className="w-7 h-7 text-[#0066B2] -translate-y-1"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);

export default function Testimonials() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Check if screen is small
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Update arrow visibility on scroll
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 320; // Adjust based on card width
    const targetScroll =
      scrollContainerRef.current.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);

    scrollContainerRef.current.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-white px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto">
        {/* Heading */}
        <div className="mb-10 sm:mb-14 md:mb-16">
          <h2 className="font-montserrat text-[#0066B2] text-[clamp(22px,5vw,50px)] font-medium leading-tight">
            What Our Clients Say
          </h2>
        </div>

        {/* Testimonials Container */}
        <div className="relative">
          {/* Left Arrow - Mobile Only */}
          {isSmallScreen && showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-[#E9E9E9] rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-200 md:hidden"
              aria-label="Scroll left"
            >
              <svg
                className="w-5 h-5 text-[#0066B2]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Right Arrow - Mobile Only */}
          {isSmallScreen && showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-[#E9E9E9] rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-200 md:hidden"
              aria-label="Scroll right"
            >
              <svg
                className="w-5 h-5 text-[#0066B2]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {/* Testimonials Grid/Scroll */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="grid md:grid-cols-2 lg:grid-cols-3 px-6 sm:px-8 lg:px-10 gap-8 sm:gap-10 lg:gap-16 overflow-x-auto md:overflow-x-visible scrollbar-hide"
            style={{
              // Use the state variable instead of window.innerWidth
              gridAutoFlow: isSmallScreen ? "column" : "row",
              gridAutoColumns: isSmallScreen ? "minmax(280px, 1fr)" : "auto",
            }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white border-2 border-[#E9E9E9] rounded-[24px] p-4 sm:pb-2 sm:p-5 flex flex-col h-full shrink-0 md:shrink"
              >
                {/* Top Row */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>

                  <Image
                    src="/quotes.png"
                    alt="quote"
                    width={28}
                    height={28}
                    className=" -translate-y-1"
                  />
                </div>

                {/* Text */}
                <p className="font-poppins text-[#2F2F2F] text-sm sm:text-[15px] lg:text-base leading-relaxed mb-14 flex-grow">
                  {testimonial.text}
                </p>

                {/* User Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#E9E9E9]">
                  <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
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