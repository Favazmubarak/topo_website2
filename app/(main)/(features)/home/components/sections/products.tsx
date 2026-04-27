"use client";

import ProductCard from "@/app/(main)/(features)/products/components/ProductCard";
import { useProduct } from "@/app/(main)/(features)/products/hooks/useProduct";


export default function Products() {  
  const { products, loading, error } = useProduct();

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
        {
          loading ? (
            <div className="flex justify-center min-h-[400px] py-10 items-center">
              <div className="animate-spin rounded-full h-16 w-16 md:h-32 md:w-32 border-t-2 border-b-2 border-[#0066B2]"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center min-h-[400px] py-10 items-center">
              <h1 className="text-red-500">{error}</h1>
            </div>
          ) : !products.length ? (
            
              <div className="flex justify-center min-h-[400px] py-10 items-center">
                <h1 className="text-red-500">No Products Available</h1>
              </div>
            
          ) : (
            <div
              className="flex md:grid md:grid-cols-2 lg:grid-cols-3 
gap-3 md:gap-6 lg:gap-8 
overflow-x-auto md:overflow-visible pb-2 
no-scrollbar scrollbar-hide snap-x snap-mandatory"
            >
              {products.slice(0, 3).map((product, index) => (
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
          )
        }

      </div>
    </section>
  );
}