"use client";

import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="w-full bg-white py-20 px-6 sm:px-10 md:px-16 lg:px-24">
      {/* Top Part: Title and Description */}
      <div className="flex  flex-col md:flex-row justify-between items-start gap-12">
        <div className="w-full md:w-1/3">
          <h2 className="font-montserrat text-[36px] sm:text-[40px] md:text-[60px] lg:text-[100px] leading-none text-[#8F8F8F]">
            About
          </h2>
        </div>
        
        <div className="w-full flex-2 pr-10">
          <p className="font-poppins text-lg sm:text-xl text-[#6C6868] leading-relaxed mb-10">
            Established in 2016, <span className="text-[#0066B2] ">Topo is a trusted name in premium aluminum window solutions,</span> known for delivering quality, precision, and modern design. We believe windows are more than just functional elements they shape the way spaces look, feel, and perform. <span className="text-[#0066B2]">That's why we focus on creating sleek, durable, and energy-efficient systems</span> that enhance both residential and commercial environments.
          </p>
          
          <button className="flex items-center gap-4 bg-[#0066B2] text-white px-2 pl-5 py-3 rounded-full font-poppins text-sm hover:bg-[#005596] transition-all duration-300 group shadow-lg hover:shadow-[#0066B2]/20">
            Learn more
            <div className="bg-white rounded-full p-2 group-hover:bg-gray-100 transition-colors">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-[#0066B2] w-5 h-5 -rotate-45"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Part: Images */}
      {/* Outer Container - Takes full width, items centered or left-aligned */}
      <div className="w-full  py-12">

        {/* The Half-Width Wrapper */}
        <div className="w-full md:max-w-[50%]">

          {/* The Grid - Now inside a half-width container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">

            {/* Image 1 */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px] md:rounded-[20px]">
              <Image
                src="/about/image1.jpg"
                alt="Modern window with pool view"
                fill
                className="object-cover"
              />
            </div>

            {/* Image 2 */}
            <div className="relative h-3/4 self-end aspect-[16/9] w-full overflow-hidden rounded-[20px] md:rounded-[20px]">
              <Image
                src="/about/image2.jpg"
                alt="Interior with premium windows"
                fill
                className="object-cover"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
