"use client";

import Image from "next/image";

export default function Gallery() {
  return (
    <section className="w-full pb-10 sm:pb-16 md:pb-24 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 mb-10 lg:mb-16">
          <div className="w-full md:w-1/2">
            <h2 className="font-montserrat text-[#0066B2] text-[clamp(24px,5vw,50px)] font-medium leading-tight tracking-tight">
              Gallery
            </h2>
          </div>
          <div className="w-full md:w-1/2 lg:max-w-[500px]">
            <p className="font-poppins font-[400] text-black text-sm sm:text-lg md:text-[20px] leading-relaxed">
              Explore our completed projects showcasing quality, style, and precision in every detail.
            </p>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-4 sm:gap-6">
          {/* Row 1: Image 1 and 2 */}
          <div className="col-span-1 md:col-span-7 relative aspect-[4/3] md:aspect-[7/4] overflow-hidden rounded-[15px] group">
            <Image
              src="/gallery/image1.png"
              alt="Modern living room with large glass windows overlooking a city skyline"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div className="col-span-1 md:col-span-5 relative aspect-[4/3] md:aspect-[5/4] overflow-hidden rounded-[15px] group">
            <Image
              src="/gallery/image2.jpg"
              alt="Elegant interior with a designer pendant lamp and mountain view"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Row 2: Image 3 and 4 */}
          <div className="col-span-1 md:col-span-4 relative aspect-[4/3] md:aspect-square overflow-hidden rounded-[15px] group">
            <Image
              src="/gallery/image3.jpg"
              alt="Stylish red lounger chair in a sun-drenched room"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div className="col-span-1 md:col-span-4 relative aspect-[4/3] md:aspect-square overflow-hidden rounded-[15px] group">
            <Image
              src="/gallery/image4.jpg"
              alt="Minimalist living space with a white sofa and large windows"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          {/* Row 3: Image 5 and 6 */}
          <div className="col-span-1 md:col-span-4 relative aspect-[4/3] md:aspect-square overflow-hidden rounded-[15px] group">
            <Image
              src="/gallery/image5.jpg"
              alt="Contemporary living room with forest views through panoramic windows"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          <div className="col-span-1 md:col-span-5 relative aspect-[4/3] md:aspect-[5/4] overflow-hidden rounded-[15px] group">
            <Image
              src="/gallery/image6.png"
              alt="Modern glass outdoor patio structure nestled in greenery"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Row 4: Image 7 */}
          <div className="col-span-2 md:col-span-7 relative aspect-[2/1] md:aspect-[7/4] overflow-hidden rounded-[15px] group">
            <Image
              src="/gallery/image7.jpg"
              alt="Luxury lounge area with sunset views and artistic lighting"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
