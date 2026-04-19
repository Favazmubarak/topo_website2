"use client";

import Image from "next/image";

const products = [
  {
    id: 1,
    title: "Framed Glass Entrance System",
    description:
      "Strong, stylish aluminum doors that bring in natural light with a modern grid design.",
    image: "/product-section/product1.png",
  },
  {
    id: 2,
    title: "Full-Height Fixed Glass Panels",
    description:
      "Floor-to-ceiling panels that maximize light and create a clean, spacious look.",
    image: "/product-section/product2.png",
  },
  {
    id: 3,
    title: "Panoramic Sliding Window",
    description:
      "Smooth sliding windows offering wide views and a seamless indoor-outdoor feel.",
    image: "/product-section/product3.png",
  },
];

export default function Products() {
  return (
    <section
      id="products"
      className="w-full bg-white px-6 sm:px-10 md:px-16 lg:px-24"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 mb-8 lg:mb-16">
        <div className="w-full md:w-1/2">
          <h2 className="font-montserrat text-[#0066B2] text-[clamp(20px,5vw,50px)] leading-tight font-medium">
            Our Products
          </h2>
        </div>
        <div className="w-full md:w-1/2 lg:max-w-[600px]">
          <p className="font-poppins font-[400] text-[#A0A0A0] text-[clamp(12px,2.5vw,18px)] leading-relaxed">
            At Topo, we offer high-quality aluminum window solutions designed
            for durability, style, and performance. Our products combine modern
            aesthetics with precision engineering to suit both residential and
            commercial spaces.
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 
gap-3 md:gap-6 lg:gap-8 
overflow-x-auto md:overflow-visible pb-2 
no-scrollbar scrollbar-hide snap-x snap-mandatory">

        {products.map((product) => (
          <div
            key={product.id}
            className="relative group overflow-hidden rounded-xl md:rounded-2xl 
      aspect-[3/4] md:aspect-[4/5] shadow-md 
      min-w-[60%] sm:min-w-[45%] md:min-w-0 
      flex-shrink-0 snap-start"
          >
            {/* Image */}
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Content */}
            <div className="absolute h-[32%] bottom-1.5 left-1.5 right-1.5 
      bg-white/85 p-2 md:p-4 rounded-lg md:rounded-xl 
      flex flex-col justify-start overflow-hidden">

              <h3 className="font-montserrat text-black 
        text-[clamp(12px,1.4vw,18px)] 
        leading-tight font-semibold mb-1 line-clamp-2">
                {product.title}
              </h3>

              <p className="font-poppins text-[#2F2F2F] 
        text-[clamp(9px,1.2vw,15px)] 
        leading-snug font-[300] 
        line-clamp-2">
                {product.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}