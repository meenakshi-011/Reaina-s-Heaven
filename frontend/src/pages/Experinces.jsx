import React from "react";
import Navbar from "../components/Navbar";
import ProductsFooter from "../components/ProductsFooter";
import ReviewsSection from "../components/ReviewsSection";

const Experiences = () => {
  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      <Navbar />

      {/* ── REAL-TIME REVIEWS & EXPERIENCES SECTION ── */}
      <div className="pt-6">
        <ReviewsSection 
          currentSection="all" 
          title="Community Experiences & Real-Time Reviews" 
          subtitle="Real-time feedback and ratings from patrons across Jabalpur." 
        />
      </div>

      {/* ── PRIVATE WORKSHOP & EVENT BANNER ─────────── */}
      <section className="bg-[#e8e2d9] py-16 px-6 mb-16">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-10 rounded-[2rem] shadow-lg">
          <div>
            <h3 className="text-2xl font-serif text-[#3e3e3e] mb-2">Looking to host a private gathering?</h3>
            <p className="text-gray-600 text-sm">
              We host creative workshops, private book clubs, and intimate cafe celebrations at Reaina's Haven.
            </p>
          </div>
          <a
            href="/services"
            className="whitespace-nowrap border-2 border-[#a67c52] text-[#a67c52] px-8 py-3 rounded-full font-medium hover:bg-[#a67c52] hover:text-white transition-all text-sm inline-block"
          >
            Explore Services
          </a>
        </div>
      </section>

      <ProductsFooter />
    </div>
  );
};

export default Experiences;
