"use client";

import Image from "next/image";
import { useTestimonials } from "../hooks/useTestimonials";
import { IoMdStar } from "react-icons/io";
import TestimonialSkeleton from "./TestimonialSkeleton";

/**
 * Premium Architectural Testimonials
 * Clean edge-to-edge horizontal marquee with high-end typography and golden ratings.
 */
export default function Testimonials() {
  const { testimonials, loading, error } = useTestimonials();

  // Multiplied items for seamless infinite scroll
  const scrollItems = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="w-full bg-[#FBFBFB] md:py-24 sm:py-16 py-12 overflow-hidden border-y border-gray-50">
      <div className="px-6 md:px-12 lg:px-20">
        <div className="max-w-[1500px] mx-auto">
          
          {/* Section Header */}
          <div className="flex flex-col items-center text-center mb-16" data-aos="fade-up">
            <span className="text-[#0066B2] text-[10px] font-mono tracking-[0.5em] uppercase mb-4 block">Testimonials</span>
            <h2 className="font-montserrat text-[#1A1A1A] text-[clamp(28px,4vw,44px)] font-light leading-none tracking-tighter">
              Client <span className="text-[#0066B2]">Perspectives</span>
            </h2>
            <div className="w-12 h-[1px] bg-gray-200 mt-8" />
          </div>

          {loading ? (
            <TestimonialSkeleton />
          ) : error ? (
            <div className="flex justify-center items-center min-h-[300px] text-red-500 font-montserrat">
              Error: {error}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="flex justify-center items-center min-h-[300px] text-gray-400 font-montserrat">
              No feedback available yet.
            </div>
          ) : (
            <div className="relative w-full">
              <div className="flex w-max animate-marquee hover:[animation-play-state:paused] py-8">
                {scrollItems.map((testimonial, index) => (
                  <div
                    key={`${testimonial._id}-${index}`}
                    className="bg-white rounded-[32px] p-6 sm:p-8 flex flex-col h-[280px] sm:h-[300px] w-[280px] sm:w-[380px] mx-3 sm:mx-5 shrink-0 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 transition-all duration-700 hover:shadow-[0_20px_50px_-20px_rgba(0,102,178,0.15)] hover:-translate-y-3"
                  >
                    {/* Golden Stars Rating */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex gap-0.5 text-[#FFB800]">
                        {[...Array(5)].map((_, i) => (
                          <IoMdStar key={i} className={`text-xl ${i < testimonial.rating ? "opacity-100" : "opacity-20 text-gray-400"}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-gray-300">REF_{index + 10}</span>
                    </div>

                    {/* Premium Typography Content */}
                    <p className="font-poppins font-normal text-[#2A2A2A] text-base md:text-[17px] leading-[1.6] mb-6 flex-grow italic overflow-y-auto no-scrollbar">
                      "{testimonial.review}"
                    </p>

                    {/* Footer / Branding */}
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-50">
                        <Image
                          src={testimonial?.avatar || "/avatar.jpg"}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-montserrat text-[13px] font-bold text-[#1A1A1A] tracking-tight uppercase leading-none">
                          {testimonial.name}
                        </span>
                        <span className="text-[9px] font-mono text-[#0066B2] font-semibold uppercase tracking-[0.2em] mt-1.5 opacity-70">
                          Verified Partner
                        </span>
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
