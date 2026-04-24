"use client";

import ProductCard from "@/app/(features)/products/components/ProductCard";
import { useProduct } from "@/app/(features)/products/hooks/useProduct";

// const products = [
//   {
//     id: 1,
//     title: "Framed Glass Entrance System",
//     description:
//       "Strong, stylish aluminum doors that bring in natural light with a modern grid design.",
//     image: "/product-section/product1.png",
//   },
//   {
//     id: 2,
//     title: "Full-Height Fixed Glass Panels",
//     description:
//       "Floor-to-ceiling panels that maximize light and create a clean, spacious look.",
//     image: "/product-section/product2.png",
//   },
//   {
//     id: 3,
//     title: "Panoramic Sliding Window",
//     description:
//       "Smooth sliding windows offering wide views and a seamless indoor-outdoor feel.",
//     image: "/product-section/product3.png",
//   },
// ];

export default function Products() {
    const { products, loading, error } = useProduct();

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
    <section
      id="products"
      className="w-full bg-white px-4 sm:px-6 md:px-12 lg:px-20"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 mb-8 lg:mb-16">
          <div className="w-full md:w-1/2" data-aos="fade-right">
            <h2 className="font-montserrat text-[#0066B2] text-[clamp(20px,5vw,50px)] leading-tight font-medium">
              Our Products
            </h2>
          </div>
          <div
            className="w-full md:w-1/2 lg:max-w-[600px]"
            data-aos="fade-left"
          >
            <p className="font-poppins font-[400] text-[#A0A0A0] text-[clamp(12px,2.5vw,18px)] leading-relaxed">
              At Topo, we offer high-quality aluminum window solutions designed
              for durability, style, and performance. Our products combine
              modern aesthetics with precision engineering to suit both
              residential and commercial spaces.
            </p>
          </div>
        </div>

        <div
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 
gap-3 md:gap-6 lg:gap-8 
overflow-x-auto md:overflow-visible pb-2 
no-scrollbar scrollbar-hide snap-x snap-mandatory"
        >
          {products.slice(0,3).map((product, index) => (
            <div
              key={product._id}
              data-aos="fade-up"
              data-aos-delay={index * 80}
              className="min-w-[60%] sm:min-w-[45%] md:min-w-0 flex-shrink-0 snap-start"
            >
              <ProductCard
                title={product.title}
                productName={product.productName}
                description={product.description}
                image={product.imageUrl}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}