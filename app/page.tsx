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
      {/* Hero Section */}
      <section className="h-screen bg-gray-900 flex items-center justify-center text-white">
        <Hero />
      </section>

      {/* About Section */}
      <About />

      {/* Products Section */}
      <Products />

      {/* Why Choose Topo Section */}
      <WhyChooseTopo />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Product Features Section */}
      <ProductFeatures />

      {/* FAQ Section */}
      <FAQ />

      {/* Gallery Section */}
      <Gallery />

      {/* Upgrade CTA Section */}
      <Upgrade />

      {/* Spacer for scrolling */}
      <section className="h-[50vh] bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Scroll down for more...</p>
      </section>
    </main>
  );
}