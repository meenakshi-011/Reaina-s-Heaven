import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="w-full h-screen bg-[#f8f5f2] flex items-center">
      <img
        src="https://images.unsplash.com/photo-1682778964821-76d9840a19e1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 w-full gap-12 relative z-10">

        {/* LEFT IMAGE - Floral Bouquet */}
        <div className="hidden md:block w-[25%] -mt-10">
          <img src=" https://plus.unsplash.com/premium_photo-1677005405379-f6fcc2350d9c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Fresh Flowers"
            className="w-full `aspect-[4/5]` object-cover rounded-3xl shadow-2xl border-4 border-white transform -rotate-3 hover:rotate-0 transition duration-500"
          />
        </div>

        {/* CENTER CONTENT */}
        <div className="w-full lg:w-[45%] text-center flex flex-col items-center py-12 md:py-0">
          <span className="text-[#a67c52] uppercase tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px] font-bold mb-6 bg-[#a67c52]/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
            Est. 2024 • Reaina's Haven
          </span>
          <h1 className="text-[2.8rem] sm:text-5xl lg:text-7xl font-serif text-[#3e3e3e] leading-[1.1] mb-6 md:mb-8 tracking-tight">
            Create Moments <br className="hidden sm:block" />
            of <span className="text-green-800 italic">Joy & Comfort</span> 🌿
          </h1>

          <p className="text-sm md:text-lg text-gray-600 max-w-xs md:max-w-sm mb-10 leading-relaxed px-4 md:px-0 opacity-90">
            Discover a curated sanctuary of Books, Flowers & Cozy Cafés. Beautifully crafted for your soul.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-8 sm:px-0">
            <Link to="/products" className="bg-[#a67c52] text-white px-10 py-4.5 rounded-full shadow-2xl hover:bg-[#3e3e3e] transition-all transform hover:scale-105 text-center font-bold tracking-widest text-[10px] md:text-xs uppercase">
              Shop Collection
            </Link>
            <Link to="/cafe" className="bg-white/80 backdrop-blur-sm border-2 border-[#a67c52] text-[#a67c52] px-10 py-4.5 rounded-full shadow-md hover:bg-[#a67c52] hover:text-white transition-all text-center font-bold tracking-widest text-[10px] md:text-xs uppercase">
              Explore Café
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE - desktop only */}
        <div className="hidden lg:block w-[25%] self-end mb-10">
          <div className="relative">
            <img 
              src="https://media.istockphoto.com/id/2148800872/photo/chic-brown-paper-wrapped-gift-box-with-pink-ribbon-and-white-florals.jpg?s=2048x2048&w=is&k=20&c=_UarVfZYL7kj2WJY8QzXCaWCUDqbuZ72VIDRszX2YzM="
              alt="Premium Gift"
              className="w-full aspect-[3/4] object-cover rounded-t-full rounded-b-lg shadow-2xl border-6 border-white"
            />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 z-20">
               <img 
                 src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1170&auto=format&fit=crop" 
                 className="w-full h-full object-cover rounded-2xl shadow-xl border-4 border-white"
                 alt="Books"
               />
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM MARQUEE BAR to match reference */}
      <div className="absolute bottom-0 w-full bg-[#8c8c73] py-2.5 whitespace-nowrap overflow-hidden border-t border-white/10 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="flex animate-marquee text-white text-[9px] md:text-xs font-bold space-x-12 px-4 uppercase tracking-[0.2em]">
            <span>Free Shipping on orders over ₹499</span>
            <span className="opacity-50">•</span>
            <span>Shop Our New Arrivals</span>
            <span className="opacity-50">•</span>
            <span>Premium Floral Hampers</span>
            <span className="opacity-50">•</span>
            <span>100% Handmade Treats</span>
            <span className="opacity-50">•</span>
            <span>Curated Cozy Books</span>
            <span className="opacity-50">•</span>
            <span>Free Shipping on orders over ₹499</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;  