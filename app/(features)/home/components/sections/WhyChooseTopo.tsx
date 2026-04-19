"use client";

import Image from "next/image";

const features = [
  {
    title: "High Durability",
    description: "Built with strong aluminum to ensure long-lasting performance in all conditions.",
    icon: (
      <svg className="w-8 h-8 text-[#0066B2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Modern Design",
    description: "Clean, sleek designs that enhance any modern space.",
    icon: (
      <svg className="w-8 h-8 text-[#0066B2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      </svg>
    ),
  },
  {
    title: "Energy Efficient",
    description: "Designed to reduce heat loss and improve energy savings.",
    icon: (
      <svg className="w-8 h-8 text-[#0066B2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: "Custom Solutions",
    description: "Tailored designs to fit your unique space and style.",
    icon: (
      <svg className="w-8 h-8 text-[#0066B2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17.5 19c.5 0 1 .5 1 1s-.5 1-1 1H4c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h3.5" />
      </svg>
    ),
  },
];

export default function WhyChooseTopo() {
  return (
    <section className="w-full bg-white py-14 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto">

        {/* Heading */}
        <div className="max-w-[700px] mb-8 sm:mb-10">
          <h2 className="font-montserrat text-[#0066B2] text-[clamp(22px,5vw,50px)] font-medium leading-tight">
            Why Choose Topo
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-16">

          {/* Left */}
          <div className="w-full lg:w-[42%]">
            <p className="font-montserrat text-black text-[clamp(13px,2.5vw,18px)] mb-6 sm:mb-8 leading-relaxed">
              Built on quality, designed for modern living, and trusted for lasting performance.
            </p>

            <div className="relative w-full aspect-[21/9] sm:aspect-[16/7] lg:aspect-[21/9] rounded-[16px] sm:rounded-[20px] overflow-hidden shadow-xl">
              <Image
                src="/about/image2.jpg"
                alt="Modern window solutions"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
          </div>

          {/* Right */}
          <div className="w-full lg:w-[58%] lg:pl-12">
            <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-6 sm:gap-y-10 lg:gap-y-12">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col gap-2 sm:gap-3">
                  <div>{feature.icon}</div>

                  <h3 className="font-montserrat text-black text-base sm:text-lg lg:text-xl font-medium">
                    {feature.title}
                  </h3>

                  <p className="font-poppins text-[#A0A0A0] text-sm sm:text-[15px] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}