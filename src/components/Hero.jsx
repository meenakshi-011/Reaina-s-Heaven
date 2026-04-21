import React from "react";


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

        {/* CENTER CONTENT - RESTORED HEADING */}
        <div className="w-full md:w-[45%] text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-serif text-[#3e3e3e] leading-tight mb-6">
            Create Moments <br />
            of <span className="text-green-800 italic">Joy & Comfort</span> 🌿
          </h1>

          <p className="text-lg text-gray-600 max-w-sm mb-8">
            Discover Books, Flowers & Cozy Cafés for Every Occasion. Beautifully curated for you.
          </p>

          <div className="flex gap-4">
            <button className="bg-[#a67c52] text-white px-8 py-3 rounded-full shadow-lg hover:bg-[#8e6a45] transition-all transform hover:scale-105">
              SHOP NOW
            </button>
            <button className="bg-white border border-[#a67c52] text-[#a67c52] px-8 py-3 rounded-full shadow-md hover:bg-gray-50 transition-all">
              BROWSE
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE - Arch Shaped Hamper & Book */}
        <div className="hidden md:block w-[25%] self-end mb-10">
          <div className="relative">
            <img 
              src="https://media.istockphoto.com/id/2148800872/photo/chic-brown-paper-wrapped-gift-box-with-pink-ribbon-and-white-florals.jpg?s=2048x2048&w=is&k=20&c=_UarVfZYL7kj2WJY8QzXCaWCUDqbuZ72VIDRszX2YzM="
              alt="Premium Gift"
              className="w-full `aspect-[3/4]` object-cover rounded-t-full rounded-b-lg shadow-2xl border-6 border-white"
            />
            {/* Small book image overlapping to maintain the theme */}
            <div className="absolute -bottom-10 -left-10 w-32 h-32 z-20">
               <img 
                 src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1170&auto=format&fit=crop" 
                 className="w-full h-full object-cover rounded-2xl shadow-xl border-4 border-white"
               />
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM MARQUEE BAR to match reference */}
      <div className="absolute bottom-0 w-full bg-[#8c8c73] py-2 whitespace-nowrap overflow-hidden">
        <div className="flex animate-marquee text-white text-sm font-light space-x-12 px-4 uppercase tracking-widest">
            <span>Free Shipping on orders over $50</span>
            <span>•</span>
            <span>Shop Our New Arrivals</span>
            <span>•</span>
            <span>Premium Floral Hampers</span>
            <span>•</span>
            <span>Free Shipping on orders over $50</span>
            <span>•</span>
            <span>Shop Our New Arrivals</span>
            <span>•</span>
            <span>Premium Floral Hampers</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;  