
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FF7A00]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-12 text-center max-w-4xl">
          <p className="text-[#FF7A00] tracking-[0.3em] text-xs md:text-sm uppercase mb-6">
            Pure Vegetarian · Est. Tradition
          </p>

          <h1
            className="text-5xl md:text-7xl text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            The Brijwasi
          </h1>

          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-xl mx-auto">
            Authentic flavours, royal hospitality — a dining experience
            rooted in tradition, served with warmth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reservation"
              className="bg-[#FF7A00] text-black font-semibold px-8 py-3.5 rounded-full hover:bg-[#FF9640] transition-colors"
            >
              Book a Table
            </Link>
            <Link
              href="/menu"
              className="border border-gray-600 text-white font-semibold px-8 py-3.5 rounded-full hover:border-[#FF7A00] hover:text-[#FF7A00] transition-colors"
            >
              View Menu
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600 text-xs tracking-widest animate-bounce">
          SCROLL
        </div>
      </section>

      {/* HIGHLIGHTS STRIP */}
      <section className="border-t border-gray-800 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          <div>
            <p className="text-[#FF7A00] text-3xl mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
              100%
            </p>
            <p className="text-gray-400 text-sm">Pure Vegetarian Kitchen</p>
          </div>
          <div>
            <p className="text-[#FF7A00] text-3xl mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
              50+
            </p>
            <p className="text-gray-400 text-sm">Signature Dishes</p>
          </div>
          <div>
            <p className="text-[#FF7A00] text-3xl mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
              15+
            </p>
            <p className="text-gray-400 text-sm">Years of Culinary Legacy</p>
          </div>
        </div>
      </section>

      {/* FEATURED SECTION */}
      <section className="py-20 px-6 border-t border-gray-800">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-xl overflow-hidden border border-gray-800 h-72 md:h-96 bg-[#1A1A1A] flex items-center justify-center">
            <span className="text-gray-600 text-sm">Signature dish image goes here</span>
          </div>

          <div>
            <p className="text-[#FF7A00] tracking-[0.2em] text-xs uppercase mb-3">
              Our Promise
            </p>
            <h2
              className="text-3xl md:text-4xl text-white mb-5"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Tradition on Every Plate
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              From time-honoured family recipes to the freshest seasonal
              ingredients, every dish at The Brijwasi is crafted to bring
              you the authentic taste of Brij's rich culinary heritage.
            </p>
            <Link
              href="/about"
              className="text-[#FF7A00] font-semibold hover:underline"
            >
              Learn Our Story →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="py-16 px-6 border-t border-gray-800 text-center">
        <h2
          className="text-4xl md:text-6xl text-white mb-4"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Reserve your table today
        </h2>
        <p className="text-gray-400 mb-8">
          Join us for an evening of authentic flavours and warm hospitality.
        </p>
        <Link
          href="/reservation"
          className="inline-block bg-[#FF7A00] text-black font-semibold px-8 py-3.5 rounded-full hover:bg-[#FF9640] transition-colors"
        >
          Book a Table
        </Link>
      </section>
    </main>
  );
}