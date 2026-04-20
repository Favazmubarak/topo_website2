"use client";

import Image from "next/image";

export default function About() {
  return (
    <section
      id="about"
      className="w-full bg-white py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 lg:px-20"
    >
      <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start gap-10 md:gap-12">

        <div className="w-full md:w-[30%]">
          <h2 className="font-montserrat text-[36px] sm:text-[44px] md:text-[64px] lg:text-[90px] leading-none text-[#8F8F8F]">
            About
          </h2>
        </div>

        <div className="w-full md:w-[70%] lg:max-w-[720px]">
          <p className="font-poppins text-base sm:text-lg md:text-xl text-[#6C6868] leading-relaxed mb-8 sm:mb-10">
            Established in 2016,{" "}
            <span className="text-[#0066B2]">
              Topo is a trusted name in premium aluminum window solutions,
            </span>{" "}
            known for delivering quality, precision, and modern design. We
            believe windows are more than just functional elements they shape
            the way spaces look, feel, and perform.{" "}
            <span className="text-[#0066B2]">
              That's why we focus on creating sleek, durable, and energy-efficient systems
            </span>{" "}
            that enhance both residential and commercial environments.
          </p>

          <button className="flex items-center gap-3 sm:gap-4 bg-[#0066B2] text-white px-3 sm:pl-5 py-2.5 sm:py-3 rounded-full font-poppins text-sm hover:bg-[#005596] transition-all duration-300 group shadow-lg hover:shadow-[#0066B2]/20">
            Learn more
            <div className="bg-white rounded-full p-2 group-hover:bg-gray-100 transition-colors">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#0066B2] w-4 h-4 sm:w-5 sm:h-5 -rotate-45"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </button>
        </div>
      </div>

      <div className="w-full pt-12 sm:pt-16">

        <div className="w-full md:max-w-[55%]">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">

            <div className="relative group aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-[16px] sm:rounded-[20px]">

              <Image
                src="/about/image1.jpg"
                alt="Modern window with pool view"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 30vw"
              />



            </div>

            <div className="relative group aspect-[16/10] sm:aspect-[16/9] sm:h-[85%] self-end w-full overflow-hidden rounded-[16px] sm:rounded-[20px]">

              <Image
                src="/about/image2.jpg"
                alt="Interior with premium windows"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 30vw"
              />



            </div>

          </div>
        </div>
      </div>
      </div>
    </section>
  );
}