export const dynamic = 'force-dynamic';
import nextDynamic from "next/dynamic";
import Hero from "./(features)/home/components/sections/Hero";
import About from "./(features)/home/components/sections/About";
import Products from "./(features)/home/components/sections/products";
import WhyChooseTopo from "./(features)/home/components/sections/WhyChooseTopo";

const FAQ = nextDynamic(() => import("./(features)/home/components/sections/FAQ"));
const ProductFeatures = nextDynamic(() => import("./(features)/home/components/sections/ProductFeatures"));
const Testimonials = nextDynamic(() => import("./(features)/home/components/sections/Testimonials"));
const Gallery = nextDynamic(() => import("./(features)/home/components/sections/Gallery"));
const Upgrade = nextDynamic(() => import("./(features)/home/components/sections/Upgrade"));
const Reels = nextDynamic(() => import("./(features)/home/components/sections/Reels"));

import { getImageBySectionServer } from "./(features)/home/api/imageApi";
import { getAllProductsServer } from "./(features)/products/api/productApi";

import { getAllGalleryImagesServer } from "./(features)/gallery/api/galleryApi";
import { getAllFAQsServer } from "./(features)/home/api/faqApi";

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