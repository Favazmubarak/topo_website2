import Hero from "./(features)/home/components/sections/Hero";
import About from "./(features)/home/components/sections/About";
import Products from "./(features)/home/components/sections/products";
import WhyChooseTopo from "./(features)/home/components/sections/WhyChooseTopo";
import FAQ from "./(features)/home/components/sections/FAQ";
import ProductFeatures from "./(features)/home/components/sections/ProductFeatures";
import Testimonials from "./(features)/home/components/sections/Testimonials";
import Gallery from "./(features)/home/components/sections/Gallery";
import Upgrade from "./(features)/home/components/sections/Upgrade";
import Reels from "./(features)/home/components/sections/Reels";
import { getImageBySectionServer } from "./(features)/home/api/imageApi";
import { getAllProductsServer } from "./(features)/products/api/productApi";

export default async function Home() {
  const [heroImages, aboutImages, whyChooseImages, initialProducts] = await Promise.all([
    getImageBySectionServer("hero"),
    getImageBySectionServer("about"),
    getImageBySectionServer("why-choose"),
    getAllProductsServer(1, 12),
  ]);

  return (
    <main>
      <Hero initialImages={heroImages} />

      <About initialImages={aboutImages} />
      <Products initialProducts={initialProducts?.products || []} />
      <WhyChooseTopo initialImages={whyChooseImages} />
      <Testimonials />
      <ProductFeatures />
      <FAQ />
      <Gallery />
      <Upgrade />
      <Reels />
    </main>
  );
}