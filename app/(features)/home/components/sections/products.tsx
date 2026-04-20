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
      className="w-full bg-white px-4 sm:px-6 md:px-12 lg:px-20"
    >

      <div className="max-w-[1400px] mx-auto">
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
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 60vw, (max-width: 1024px) 45vw, 30vw"
              className="object-cover transition-all duration-700 ease-out group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

            <div className="absolute bottom-1.5 left-1.5 right-1.5 
  bg-white/60
  p-2 md:p-4 rounded-lg md:rounded-xl 
  flex flex-col gap-1
  transition-all duration-500
lg:min-h-[150px]">

              <h3 className="font-montserrat text-black 
    text-[clamp(12px,1.4vw,18px)] 
    leading-tight font-semibold">
                {product.title}
              </h3>

              <p className="font-poppins text-[#2F2F2F] 
    text-[clamp(10px,1.2vw,15px)] 
    leading-snug font-[300]">
                {product.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      </div>
     
    </section>
  );
}