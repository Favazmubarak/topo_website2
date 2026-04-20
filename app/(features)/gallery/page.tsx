"use client";

import Image from "next/image";

export default function GalleryPage() {
  const images = [
    { src: "/gallery/image1.png", alt: "Modern living room with large glass windows", span: "col-span-1 md:col-span-7", aspect: "md:aspect-[7/4]" },
    { src: "/gallery/image2.jpg", alt: "Elegant interior with designer pendant lamp", span: "col-span-1 md:col-span-5", aspect: "md:aspect-[5/4]" },
    { src: "/gallery/image3.jpg", alt: "Stylish red lounger chair in sun-drenched room", span: "col-span-1 md:col-span-4", aspect: "md:aspect-square" },
    { src: "/gallery/image4.jpg", alt: "Minimalist living space with white sofa", span: "col-span-1 md:col-span-4", aspect: "md:aspect-square" },
    { src: "/gallery/image5.jpg", alt: "Contemporary living room with forest views", span: "col-span-1 md:col-span-4", aspect: "md:aspect-square" },
    { src: "/gallery/image6.png", alt: "Modern glass outdoor patio structure", span: "col-span-1 md:col-span-5", aspect: "md:aspect-[5/4]" },
    { src: "/gallery/image7.jpg", alt: "Luxury lounge area with sunset views", span: "col-span-2 md:col-span-7", aspect: "md:aspect-[7/4]" },
    { src: "/gallery/image8.jpg", alt: "Architectural detail of modern facade", span: "col-span-1 md:col-span-4", aspect: "md:aspect-square" },
    { src: "/gallery/image9.jpg", alt: "Interior space with premium finishes", span: "col-span-1 md:col-span-4", aspect: "md:aspect-square" },
    { src: "/gallery/image10.jpg", alt: "Living area with panoramic windows", span: "col-span-2 md:col-span-4", aspect: "md:aspect-square" },
    { src: "/gallery/image11.jpg", alt: "Designer furniture in modern setting", span: "col-span-1 md:col-span-7", aspect: "md:aspect-[7/4]" },
    { src: "/gallery/image12.jpg", alt: "Spacious room with natural light", span: "col-span-1 md:col-span-5", aspect: "md:aspect-[5/4]" },
    { src: "/gallery/image13.jpg", alt: "Evening view of modern lighting", span: "col-span-1 md:col-span-4", aspect: "md:aspect-square" },
    { src: "/gallery/image14.jpg", alt: "Sleek interior design detail", span: "col-span-1 md:col-span-4", aspect: "md:aspect-square" },
    { src: "/gallery/image15.jpg", alt: "Final showcase project view", span: "col-span-2 md:col-span-4", aspect: "md:aspect-square" },
  ];

  return (
    <main className="pt-30 sm:pt-32 md:pt-32 lg:pt-36 pb-16">
      <section className="w-full px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 mb-10 lg:mb-16">
            <div className="w-full md:w-1/2">
              <h1 className="font-montserrat text-[#0066B2] text-[clamp(32px,6vw,64px)] font-medium leading-tight tracking-tight">
                Our Gallery
              </h1>
            </div>
            <div className="w-full md:w-1/2 lg:max-w-[500px]">
              <p className="font-poppins font-[400] text-black text-sm sm:text-lg md:text-[20px] leading-relaxed">
                Discover our extensive portfolio of high-end projects, where innovative design meets exceptional craftsmanship.
              </p>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-12 gap-4 sm:gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className={`${image.span} ${image.aspect} relative aspect-[4/3] overflow-hidden rounded-[15px] group`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
       