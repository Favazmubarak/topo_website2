"use client";

import { useProduct } from "./hooks/useProduct";
import ProductCard from "./components/ProductCard";
import ProductCardSkeleton from "./components/ProductCardSkeleton";


export default function ProductsPage() {
  const { products, loading, error, currentPage, totalPages, fetchProducts } = useProduct();

  const handlePageChange = (page: number) => {
    fetchProducts(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="pt-40 xl:pt-52 min-h-screen pb-20 md:pb-28">
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
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <h1 className="text-xl text-red-500">{error}</h1>
            </div>
          ) : !products.length ? (
            <div className="flex flex-col justify-center items-center py-24 text-center" data-aos="fade-up">
              <p className="font-poppins text-gray-400 text-lg md:text-xl italic">
                Our latest collection is currently being prepared.
              </p>
              <p className="font-poppins text-gray-300 text-sm mt-2">
                Please check back soon for our high-performance window and door solutions.
              </p>
            </div>
          ) : (
            <>
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
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full border border-gray-200 hover:bg-[#0066B2] hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-inherit transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                      />
                    </svg>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-full font-poppins text-sm transition-all ${
                            currentPage === page
                              ? "bg-[#0066B2] text-white"
                              : "text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full border border-gray-200 hover:bg-[#0066B2] hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-inherit transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}