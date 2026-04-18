"use client";

import Image from "next/image";

export default function Upgrade() {
  return (
    <section className="w-full my-10 sm:my-16 md:my-24 pb-10 sm:pb-16 md:pb-24">
      <div className="w-full h-[300px] sm:h-[380px] md:h-[450px] relative overflow-hidden group">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/about/image2.jpg"
            alt="Premium interior with aluminum glass doors"
            fill
            className="object-cover object-[center_60%] transition-transform duration-1000 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 max-w-[900px] mx-auto">
          <h2 className="font-poppins text-white text-[clamp(22px,6vw,48px)] font-[500] leading-tight tracking-tight mb-4 md:mb-6 px-2">
            Upgrade Your Space with Topo
          </h2>
          
          <p className="font-poppins text-white text-base sm:text-lg md:text-[22px] leading-relaxed mb-6 md:mb-10 max-w-[750px] mx-auto font-[300] px-4 opacity-90">
            Transform your home or project with premium aluminum designed for style, strength, and performance.
          </p>

          {/* Action Button */}
          <button className="group/btn text-sm sm:text-base inline-flex items-center gap-3 md:gap-4 bg-[#0066B2] text-white pl-6 sm:pl-8 pr-2 py-2 rounded-full font-poppins transition-all duration-300 hover:bg-[#005596] hover:scale-105 shadow-xl">
            Get a Free Quote
            <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover/btn:scale-110">
              <svg 
                className="w-5 h-5 text-[#0066B2] -rotate-45" 
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
        </div>
      </div>
    </section>
  );
}
