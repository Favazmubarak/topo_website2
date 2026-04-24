"use client";

import { useProduct } from "./hooks/useProduct";
import ProductCard from "./components/ProductCard";

export default function ProductsPage() {
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
    <main className="pt-40 xl:pt-52 pb-20 md:pb-28">
      <section className="w-full bg-white px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 mb-8 lg:mb-16">
            <div className="w-full md:w-1/2" data-aos="fade-right">
              <h1 className="font-montserrat text-[#0066B2] text-[clamp(24px,5vw,50px)] leading-tight font-medium">
                Our Products
              </h1>
            </div>

            <div
              className="w-full md:w-1/2 lg:max-w-[600px]"
              data-aos="fade-left"
            >
              <p className="font-poppins font-[400] text-[#A0A0A0] text-[clamp(14px,2.5vw,20px)] leading-relaxed">
                At Topo, we provide high-performance aluminum window and door
                systems engineered for modern living. Each product is crafted
                with precision to ensure durability, energy efficiency, and
                timeless aesthetic appeal.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {products.map((product, index) => (
              <div
                key={product._id}
                data-aos="fade-up"
                data-aos-delay={index * 80}
              >
                <ProductCard
                  productName={product.productName}
                  title={product.title}
                  description={product.description}
                  image={product.imageUrl}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}