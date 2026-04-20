import Hero from "./(features)/home/components/sections/Hero";
import About from "./(features)/home/components/sections/About";
import Products from "./(features)/home/components/sections/products";
import WhyChooseTopo from "./(features)/home/components/sections/WhyChooseTopo";
import FAQ from "./(features)/home/components/sections/FAQ";
import ProductFeatures from "./(features)/home/components/sections/ProductFeatures";
import Testimonials from "./(features)/home/components/sections/Testimonials";
import Gallery from "./(features)/home/components/sections/Gallery";
import Upgrade from "./(features)/home/components/sections/Upgrade";

export default function Home() {
  return (
    <main>
      <Hero />
      

      <About />
      <Products />
      <WhyChooseTopo />
      <Testimonials />
      <ProductFeatures />
      <FAQ />
      <Gallery />
      <Upgrade />
    </main>
  );
}