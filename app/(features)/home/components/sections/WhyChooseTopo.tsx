"use client";

import Image from "next/image";
import { GoShieldCheck } from "react-icons/go";
import { PiPencilSimple } from "react-icons/pi";
import { SlEnergy } from "react-icons/sl";
import { TbCloudPlus } from "react-icons/tb";
import { useImage } from "../../hooks/useImage";

const features = [
  {
    title: "High Durability",
    description: "Built with strong aluminum to ensure long-lasting performance in all conditions.",
    icon: <GoShieldCheck className="w-8 h-8 text-[#0066B2]" />,
  },
  {
    title: "Modern Design",
    description: "Clean, sleek designs that enhance any modern space.",
    icon: <PiPencilSimple className="w-8 h-8 text-[#0066B2]" />,
  },
  {
    title: "Energy Efficient",
    description: "Designed to reduce heat loss and improve energy savings.",
    icon: <SlEnergy className="w-8 h-8 text-[#0066B2]" />,
  },
  {
    title: "Custom Solutions",
    description: "Tailored designs to fit your unique space and style.",
    icon: <TbCloudPlus className="w-8 h-8 text-[#0066B2]" />,
  },
];

export default function WhyChooseTopo() {

  const {images, loading, error} = useImage("why-choose")

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
  return (
    <section className="w-full bg-white py-14 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto">

        <div className="max-w-[700px] mb-8 sm:mb-10" data-aos="fade-up">
          <h2 className="font-montserrat text-[#0066B2] text-[clamp(22px,5vw,50px)] font-medium leading-tight">
            Why Choose Topo
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-16">

          <div className="w-full lg:w-[42%]" data-aos="fade-right" data-aos-delay="200">
            <p className="font-montserrat text-black text-[clamp(13px,2.5vw,18px)] mb-6 sm:mb-8 leading-relaxed">
              Built on quality, designed for modern living, and trusted for lasting performance.
            </p>

            <div className="group relative w-full aspect-[21/9] sm:aspect-[16/7] lg:aspect-[21/9] rounded-[16px] sm:rounded-[20px] overflow-hidden shadow-xl" data-aos="fade-up" data-aos-delay="300">
              <Image
                src={images[0]?.imageUrl?.trim() || "/fallback.png"}
                alt="Modern window solutions"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
          </div>

          <div className="w-full lg:w-[58%] lg:pl-12">
            <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-6 sm:gap-y-10 lg:gap-y-12">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col gap-2 sm:gap-3" data-aos="fade-left" data-aos-delay={index * 100 + 400}>
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