import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductsFooter from "../components/ProductsFooter";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      <Navbar />

      {/* ── HERO / INTRO ─────────────────── */}
      <section className="relative pt-24 pb-16 px-6 overflow-hidden">
        {/* Soft background decor */}
        <div className="absolute top-0 right-0 w-1/3 h-[500px] bg-[#e8e2d9] rounded-bl-full pointer-events-none -translate-y-12" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-[#c8a97e]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 md:pr-10">
            <span className="text-sm font-semibold tracking-[0.25em] text-[#8c8c73] uppercase mb-4 block">
              Our Story
            </span>
            <h1 className="text-5xl md:text-6xl font-serif text-[#3e3e3e] leading-tight mb-8">
              Welcome to <br />
              <span className="text-green-800 italic">Reaina’s Haven</span> 🌿
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              It started with a simple belief: that the most beautiful moments in
              life happen when we slow down. Reaina’s Haven was born out of a love
              for fragrant flowers, the comforting aroma of fresh coffee, and the
              quiet joy found within the pages of a good book.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              We curate a sanctuary—whether online or through the packages that arrive
              at your door—designed to bring warmth, peace, and a touch of nature into
              your everyday spaces.
            </p>
          </div>

          <div className="w-full md:w-[45%]">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl p-2 bg-white">
              <img
                src="https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="w-full h-full object-cover rounded-[1.5rem]"
              />
              {/* Overlay sticker/badge */}
              <div className="absolute -left-6 top-12 bg-[#a67c52] text-white p-4 rounded-full shadow-lg border-4 border-[#f8f5f2] animate-[spin_15s_linear_infinite]">
                <svg viewBox="0 0 100 100" className="w-20 h-20">
                  <path id="curve" fill="transparent" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                  <text className="text-[14px] uppercase tracking-widest font-bold fill-white">
                    <textPath href="#curve">
                      Est. 2026 • Made with Love • 
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR VALUES ───────────────────── */}
      <section className="bg-white py-24 px-6 relative">
        <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
          <h2 className="text-4xl font-serif text-[#3e3e3e] mb-4">What We Stand For</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Every piece we offer is a reflection of our commitment to quality,
            nature, and community.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          {[
            {
              title: "Sustainably Sourced",
              icon: "🌿",
              text: "We partner directly with local flower farmers and ethical suppliers to ensure our goods are kind to the earth.",
            },
            {
              title: "Mindful Curation",
              icon: "☕",
              text: "Every book, candle, and café blend is hand-picked to inspire comfort and bring a sense of calm to your routine.",
            },
            {
              title: "Warm Connections",
              icon: "💌",
              text: "At our core, we believe in the power of giving. Whether it’s a gift for yourself or someone else, every package is sent with love.",
            },
          ].map((value, idx) => (
            <div key={idx} className="bg-[#f8f5f2] rounded-3xl p-10 text-center hover:-translate-y-2 transition-transform duration-500 shadow-sm hover:shadow-xl">
              <div className="text-5xl mb-6">{value.icon}</div>
              <h3 className="text-xl font-serif text-[#3e3e3e] font-semibold mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {value.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOUNDER NOTE / ARTISANS ──────── */}
      <section className="py-24 px-6 bg-[#eee8e0]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center justify-between gap-16">
          <div className="flex-1">
            <h2 className="text-4xl font-serif text-[#3e3e3e] mb-6">
              Meet the Hand Behind the <span className="italic text-[#a67c52]">Haven</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              "We wanted to build a place where the noise of the outside world simply
              melts away. A place where you can find the perfect floral arrangement
              for a loved one, pick up a life-changing book, and perhaps sip on a
              beautifully brewed cup of coffee while you're at it."
            </p>
            <p className="text-gray-600 leading-relaxed font-semibold mb-8">
              — Reaina, Founder
            </p>
            
            <Link 
              to="/products"
              className="inline-block px-8 py-3 bg-[#3e3e3e] text-white rounded-full font-medium hover:bg-green-800 transition-colors shadow-lg hover:shadow-xl"
            >
              Explore Our Collection
            </Link>
          </div>

          <div className="w-full md:w-5/12 grid grid-cols-2 gap-4">
            <img 
              src="/fresh_floral_bouquet.png" 
              alt="Fresh floral bouquet" 
              className="w-full h-64 object-cover rounded-2xl md:translate-y-8 shadow-md"
            />
            <img 
              src="https://plus.unsplash.com/premium_photo-1725889036084-b7874a628773?q=80&w=740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Beautiful wildflowers" 
              className="w-full h-64 object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────── */}
      <ProductsFooter />
    </div>
  );
};

export default AboutUs;
