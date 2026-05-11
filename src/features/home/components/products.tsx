"use client";

import ProductCard from "@/src/features/products/components/ProductCard";
import { useProduct } from "@/src/features/products/hooks/useProduct";

import ProductCardSkeleton from "@/src/features/products/components/ProductCardSkeleton";
import { Product } from "@/src/features/products/api/productApi";

interface ProductsProps {
  initialProducts?: Product[];
}

export default function Products({ initialProducts }: ProductsProps) {  
  const { products: fetchedProducts, loading, error } = useProduct();
  
  // Use fetched data if available, otherwise fall back to initial data
  const products = fetchedProducts && fetchedProducts.length > 0 ? fetchedProducts : (initialProducts || []);
  const showSkeleton = loading && products.length === 0;

  return (
    <section
      id="products"
      className="w-full px-0 sm:px-6 md:px-12 lg:px-20 md:py-12 sm:py-10 py-8"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex px-4 flex-col md:flex-row justify-between items-start gap-8 md:gap-12 mb-8 lg:mb-16">
          <div className="w-full md:w-1/2" data-aos="fade-right">
            <h2 className="font-montserrat text-[#0066B2] text-[clamp(24px,5vw,50px)] leading-tight font-medium">
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
          showSkeleton ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8 pb-5 md:pb-0">
              {[1, 2, 3].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
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
              className="flex pb-5 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 
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
