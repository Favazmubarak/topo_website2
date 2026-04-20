"use client";

import Image from "next/image";

const products = [
  {
    id: 1,
    title: "55 SERIES TWO TRACK ECONOMY",
    description: "Strong, stylish aluminum doors that bring in natural light with a modern grid design.",
    image: "/product-section/product1.png",
  },
  {
    id: 2,
    title: "CBD.50",
    subtitle: "50mm Bifold Door",
    description: "Floor-to-ceiling panels that maximize light and create a clean, spacious look.",
    image: "/product-section/product4.png",
  },
  {
    id: 3,
    title: "CS.27.MR",
    subtitle: "27mm Cardinal Sliding",
    description: "Smooth sliding windows offering wide views and a seamless indoor-outdoor feel.",
    image: "/product-section/product6.png",
  },
  {
    id: 4,
    title: "Framed Glass Entrance System",
    description: "Strong, stylish aluminum doors that bring in natural light with a modern grid design.",
    image: "/product-section/product5.png",
  },
  {
    id: 5,
    title: "Full-Height Fixed Glass Panels",
    description: "Floor-to-ceiling panels that maximize light and create a clean, spacious look.",
    image: "/product-section/product2.png",
  },
  {
    id: 6,
    title: "Panoramic Sliding Window",
    description: "Smooth sliding windows offering wide views and a seamless indoor-outdoor feel.",
    image: "/product-section/product3.png",
  },
];

export default function ProductsPage() {
  return (
    <main className="pt-40 xl:pt-52 pb-20 md:pb-28">
      <section className="w-full bg-white px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 mb-8 lg:mb-16">
          <div className="w-full md:w-1/2">
            <h1 className="font-montserrat text-[#0066B2] text-[clamp(24px,5vw,50px)] leading-tight font-medium">
              Our Products
            </h1>
          </div>

          <div className="w-full md:w-1/2 lg:max-w-[600px]">
            <p className="font-poppins font-[400] text-[#A0A0A0] text-[clamp(14px,2.5vw,20px)] leading-relaxed">
              At Topo, we provide high-performance aluminum window and door systems
              engineered for modern living. Each product is crafted with precision
              to ensure durability, energy efficiency, and timeless aesthetic appeal.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative group overflow-hidden rounded-xl md:rounded-2xl aspect-[3/4] md:aspect-[4/5] shadow-lg transition-all duration-500 hover:shadow-2xl"
            >
              {/* Image */}
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60" />

              {/* Content (auto height) */}
              <div className="absolute bottom-2 left-2 right-2 
                bg-white/70 p-3 sm:p-4 md:p-5 
                rounded-lg md:rounded-xl
                flex flex-col gap-1 sm:gap-2
                transition-all duration-300
                lg:min-h-[150px]">

                <h3 className="font-poppins text-black 
                  text-[12px] sm:text-[14px] md:text-[18px] lg:text-[20px]
                  leading-snug font-medium">
                  {product.title}
                </h3>

                {product.subtitle && (
                  <p className="font-poppins 
                    text-[10px] sm:text-xs md:text-sm lg:text-base 
                    font-medium tracking-wide text-gray-700">
                    {product.subtitle}
                  </p>
                )}

                <p className="font-montserrat text-[#2F2F2F] 
                  text-[10px] sm:text-[11px] md:text-[13px] lg:text-[15px]
                  leading-snug font-normal">
                  {product.description}
                </p>

              </div>
            </div>
          ))}
        </div>
        </div>
      </section>
    </main>
  );
}