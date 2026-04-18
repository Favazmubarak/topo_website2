import Hero from "./(features)/home/components/sections/Hero";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="h-screen bg-gray-900 flex items-center justify-center text-white">
        <Hero />
      </section>

      {/* About Section */}
      <section id="about" className="h-screen bg-white flex items-center justify-center text-black">
        <div className="max-w-2xl px-8">
          <h2 className="text-4xl font-bold mb-4 font-poppins">About Us</h2>
          <p className="text-xl font-light font-poppins">
            This is the about section. Clicking the About link in the navbar scrolls here smoothly.
          </p>
        </div>
      </section>
      
      {/* Spacer for scrolling */}
      <section className="h-[50vh] bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Scroll down for more...</p>
      </section>
    </main>
  );
}