"use client";

import Image from "next/image";
import { BsNoiseReduction, BsFillCloudsFill, BsTools } from "react-icons/bs";

const features = [
  {
    title: "Noise reduction",
    description: "Blocks outside noise for a peaceful space",
    icon: <BsNoiseReduction className="w-8 h-8 sm:w-10 sm:h-10" />,
  },
  {
    title: "Thermal insulation",
    description: "Keeps your space cool in summer and warm in winter",
    icon: (
      <div className="relative w-8 h-8 sm:w-10 sm:h-10">
        <Image
          src="/icons/steam.png"
          alt="steam"
          width={40}
          height={40}
          className="object-contain"
        />
      </div>
    ),
  },
  {
    title: "Low maintenance",
    description: "Easy to clean and highly durable for everyday use",
    icon: <BsTools className="w-8 h-8 sm:w-10 sm:h-10" />,
  },
  {
    title: "Weather resistance",
    description: "Designed to withstand extreme weather conditions",
    icon: (
      <BsFillCloudsFill className="w-8 h-8 sm:w-10 sm:h-10 scale-x-[-1]" />
    ),
  },
];

const ArrowIcon = ({ color }: { color: string }) => (
  <svg
    className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 ${color}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

export default function ProductFeatures() {
  return (
    <section className="w-full bg-[#E1ECFF] my-10 sm:my-16 py-14 sm:py-24 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-montserrat text-[#0066B2] text-[clamp(20px,5vw,50px)] font-medium leading-tight mb-3" data-aos="fade-up">
            Product Features
          </h2>
          <p className="font-montserrat font-[500] text-black text-xs sm:text-base md:text-[20px] max-w-[800px] mx-auto" data-aos="fade-up" data-aos-delay="100">
            Designed to deliver comfort, durability, and high performance in every detail.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 80}
              className="group relative rounded-[20px] p-4 sm:p-8 pr-2 flex flex-col h-full min-h-[200px] sm:min-h-[240px]
              bg-white text-black
              transition-all duration-500 ease-in-out
              hover:shadow-[0_20px_40px_rgba(0,102,178,0.2)]"
            >
              {/* Smooth Background Overlay */}
              <div className="absolute inset-0 bg-[#0066B2] rounded-[20px] opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100" />

              <div className="relative z-10 mb-4 sm:mb-6 text-black transition-colors duration-500 group-hover:text-white">
                {feature.icon}
              </div>

              <h3 className="relative z-10 font-montserrat text-sm sm:text-xl font-[400] transition-colors duration-500 group-hover:text-white">
                {feature.title}
              </h3>

              <p className="relative z-10 font-montserrat font-[500] text-xs sm:text-[16px] leading-relaxed mb-8 sm:mb-12 text-[#929292] transition-colors duration-500 group-hover:text-blue-50/90">
                {feature.description}
              </p>

              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10">
                <div className="rounded-full p-2 sm:p-2.5 flex items-center justify-center bg-[#0066B2] transition-all duration-500 group-hover:bg-white group-hover:scale-105">
                  <ArrowIcon color="text-white group-hover:text-[#0066B2]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}