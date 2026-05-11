export const dynamic = 'force-dynamic';
import nextDynamic from "next/dynamic";
import Hero from "@/src/features/home/components/Hero";
import About from "@/src/features/home/components/About";
import Products from "@/src/features/home/components/products";
import WhyChooseTopo from "@/src/features/home/components/WhyChooseTopo";

const FAQ = nextDynamic(() => import("@/src/features/home/components/FAQ"));
const ProductFeatures = nextDynamic(() => import("@/src/features/home/components/ProductFeatures"));
const Testimonials = nextDynamic(() => import("@/src/features/home/components/Testimonials"));
const Gallery = nextDynamic(() => import("@/src/features/home/components/Gallery"));
const Upgrade = nextDynamic(() => import("@/src/features/home/components/Upgrade"));
const Reels = nextDynamic(() => import("@/src/features/home/components/Reels"));

import { getImageBySectionServer } from "@/src/features/home/api/imageApi";
import { getAllProductsServer } from "@/src/features/products/api/productApi";

import { getAllGalleryImagesServer } from "@/src/features/gallery/api/galleryApi";
import { getAllFAQsServer } from "@/src/features/home/api/faqApi";

export default async function Home() {
  const [heroImages, aboutImages, whyChooseImages, initialProducts, galleryData, faqs] = await Promise.all([
    getImageBySectionServer("hero"),
    getImageBySectionServer("about"),
    getImageBySectionServer("why-choose"),
    getAllProductsServer(1, 12),
    getAllGalleryImagesServer(1, 7),
    getAllFAQsServer(),
  ]);

  return (
    <main>
      <Hero initialImages={heroImages} />

      <About initialImages={aboutImages} />
      <Products initialProducts={initialProducts?.products || []} />
      <WhyChooseTopo initialImages={whyChooseImages} />
      <Testimonials />
      <ProductFeatures />
      <FAQ initialFAQs={faqs} />
      <Gallery initialImages={galleryData?.data || []} />
      <Upgrade />
      <Reels />
    </main>
  );
}