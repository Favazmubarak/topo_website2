"use client";

import Image from "next/image";
import { useTestimonials } from "../../hooks/useTestimonials";
import { IoMdStar, IoMdStarOutline } from "react-icons/io";
import TestimonialSkeleton from "../skeletons/TestimonialSkeleton";

export default function Testimonials() {
  const { testimonials, loading, error } = useTestimonials();

  
  const scrollItems = [...testimonials, ...testimonials];

  return (
    <section className="w-full bg-white md:py-12 sm:py-10 py-8 overflow-hidden">
      <div className="px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <h2
            className="font-montserrat text-[#0066B2] text-[clamp(22px,5vw,50px)] font-medium leading-tight"
            data-aos="fade-up"
          >
            What Our Clients Say
          </h2>

          {loading ? (
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 w-12 sm:w-24 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-12 sm:w-24 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
              <TestimonialSkeleton />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center min-h-[400px] text-red-500 text-center px-4">
              Error: {error}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="flex justify-center items-center min-h-[400px] text-gray-500">
              No testimonials available right now.
            </div>
          ) : (
            <div className="relative w-full">
              <div className="flex w-max animate-marquee hover:[animation-play-state:paused] py-4">
                {scrollItems.map((testimonial, index) => (
                  <div
                    key={`${testimonial._id}-${index}`}
                    className="bg-white border-2 border-[#E9E9E9] rounded-[24px] p-6 sm:p-8 flex flex-col h-[320px] w-[300px] sm:w-[380px] mx-4 shrink-0 transition-shadow hover:shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-1 text-[#0066B2] text-xl">
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
                        width={32}
                        height={32}
                        className="opacity-20"
                      />
                    </div>
                    <p className="font-poppins text-[#2F2F2F] text-sm sm:text-base leading-relaxed mb-8 flex-grow line-clamp-5 overflow-hidden italic">
                      "{testimonial.review}"
                    </p>
                    <div className="flex items-center gap-4 pt-6 border-t border-[#E9E9E9]">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#E9E9E9]">
                        <Image
                          src={testimonial?.avatar || "/avatar.jpg"}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-montserrat text-base font-semibold text-[#333]">
                          {testimonial.name}
                        </span>
                        <span className="text-xs text-gray-500">Verified Client</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
