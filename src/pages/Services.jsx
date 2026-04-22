import React from "react";
import Navbar from "../components/Navbar";
import ProductsFooter from "../components/ProductsFooter";

const Services = () => {
  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      <Navbar />

      {/* ── HERO BANNER ─────────────────── */}
      <section className="relative overflow-hidden bg-[#e8e2d9] py-24 px-6 text-center">
        {/* Soft decorative elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-white/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#c8a97e]/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-sm font-semibold tracking-[0.25em] text-[#a67c52] uppercase mb-4 block">
            How We Can Help
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-[#3e3e3e] leading-tight mb-6">
            Bespoke Services <br />
            <span className="text-green-800 italic">Tailored for You</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Beyond our curated shop, we offer personalized services to make your special
            moments even more memorable. From custom floral arrangements to intimate café
            gatherings, discover how we can collaborate.
          </p>
        </div>
      </section>

      {/* ── SERVICES LIST ────────────────── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-serif text-[#3e3e3e] mb-4">Event Floristry</h2>
            <div className="w-16 h-1 bg-[#a67c52] mb-6"></div>
            <p className="text-gray-600 leading-relaxed mb-6">
              Whether it's an intimate wedding, a milestone birthday, or a corporate
              event, our florists work closely with you to design breathtaking seasonal
              arrangements that perfectly capture the mood of your celebration.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-sm text-gray-700">
                <span className="text-[#a67c52] mr-3">✔</span> Bridal Bouquets & Centerpieces
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <span className="text-[#a67c52] mr-3">✔</span> Corporate Installations
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <span className="text-[#a67c52] mr-3">✔</span> Weekly Fresh Subscriptions
              </li>
            </ul>
            <button className="text-[#a67c52] font-semibold uppercase tracking-widest text-sm hover:text-green-800 transition-colors flex items-center gap-2">
              Inquire Now <span>→</span>
            </button>
          </div>
          <div className="order-1 md:order-2">
            <img 
              src="https://plus.unsplash.com/premium_photo-1671815629144-2ea0698bb3c9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Florals for events" 
              className="w-full h-[400px] object-cover rounded-[2rem] shadow-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <img 
              src="https://plus.unsplash.com/premium_photo-1770580929361-17358c1f270f?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Custom curated hampers" 
              className="w-full h-[400px] object-cover rounded-[2rem] shadow-xl"
            />
          </div>
          <div>
            <h2 className="text-3xl font-serif text-[#3e3e3e] mb-4">Custom Gifting Concierge</h2>
            <div className="w-16 h-1 bg-[#a67c52] mb-6"></div>
            <p className="text-gray-600 leading-relaxed mb-6">
              Need a gift that speaks volumes? Our gifting concierge helps you build
              the perfect hamper. Select from our library of books, artisan coffees,
              candles, and delicate florals to create a deeply personal package.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-sm text-gray-700">
                <span className="text-[#a67c52] mr-3">✔</span> Personalized Handwritten Notes
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <span className="text-[#a67c52] mr-3">✔</span> Corporate & Bulk Gifting
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <span className="text-[#a67c52] mr-3">✔</span> Premium Wrapping Delivery
              </li>
            </ul>
            <button className="text-[#a67c52] font-semibold uppercase tracking-widest text-sm hover:text-green-800 transition-colors flex items-center gap-2">
              Start Building <span>→</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-serif text-[#3e3e3e] mb-4">Private Café Hire</h2>
            <div className="w-16 h-1 bg-[#a67c52] mb-6"></div>
            <p className="text-gray-600 leading-relaxed mb-6">
              Host your next book club, creative workshop, or private celebration in
              the cozy, ambient setting of Reaina's Haven. Enjoy full access to our
              barista bar and a serene environment surrounded by books and foliage.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-sm text-gray-700">
                <span className="text-[#a67c52] mr-3">✔</span> Seats up to 30 Guests
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <span className="text-[#a67c52] mr-3">✔</span> Custom Catering Menu
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <span className="text-[#a67c52] mr-3">✔</span> Dedicated Barista
              </li>
            </ul>
            <button className="text-[#a67c52] font-semibold uppercase tracking-widest text-sm hover:text-green-800 transition-colors flex items-center gap-2">
              Check Availability <span>→</span>
            </button>
          </div>
          <div className="order-1 md:order-2">
            <img 
              src="https://media.istockphoto.com/id/2206937063/photo/table-for-two-at-wedding-reception-with-candlelight-and-city-view-from-window.jpg?s=2048x2048&w=is&k=20&c=I6sMW9ju1fZ5BAqUJ5xW9BNdSuD9YHfsethb7VzyBuo=" 
              alt="Private cafe interior" 
              className="w-full h-[400px] object-cover rounded-[2rem] shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* ── CONSULTATION CTA ─────────────── */}
      <section className="bg-green-800 py-20 px-6 text-center">
        <h2 className="text-4xl font-serif text-white mb-6">Let's Create Something Beautiful</h2>
        <p className="text-white/80 max-w-xl mx-auto mb-10">
          Book a complimentary 30-minute consultation with our team to discuss
          your upcoming event or gifting needs.
        </p>
            <button className="bg-[#c8a97e] text-white px-10 py-3 rounded-full font-medium shadow-xl hover:bg-[#a67c52] hover:scale-105 transition-all duration-300">
          Book Consultation
        </button>
      </section>

      <ProductsFooter />
    </div>
  );
};

export default Services;
