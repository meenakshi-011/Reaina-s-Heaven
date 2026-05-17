import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProductsFooter from "../components/ProductsFooter";
import { getExperiences } from "../services/api";

const Experiences = () => {
  const [experiencesList, setExperiencesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExperiences()
      .then(data => {
        setExperiencesList(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching experiences:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      <Navbar />

      {/* ── HEADER ───────────────────────── */}
      <section className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center">
        <span className="text-3xl mb-4 block">✨</span>
        <h1 className="text-5xl md:text-6xl font-serif text-[#3e3e3e] leading-tight mb-6">
          Gather, Learn, <span className="text-green-800 italic">& Connect</span>
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Reaina's Haven is more than just a shop; it’s a community. We host a 
          rotating calendar of creative workshops, tastings, and society 
          gatherings designed to help you slow down and learn something beautiful.
        </p>
      </section>

      {/* ── GRID OF EXPERIENCES ──────────── */}
      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {Array.isArray(experiencesList) && experiencesList.map((exp) => (
            <div key={exp.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col sm:flex-row">
              {/* Image side */}
              <div className="w-full sm:w-2/5 h-64 sm:h-auto overflow-hidden relative">
                <img 
                  src={exp.image} 
                  alt={exp.title} 
                  className="w-full h-full object-contain p-2 bg-white group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#a67c52]">
                  {exp.price}
                </div>
              </div>

              {/* Content side */}
              <div className="p-8 w-full sm:w-3/5 flex flex-col justify-center">
                <span className="text-xs uppercase tracking-widest text-[#8c8c73] font-semibold mb-2">
                  {exp.date}
                </span>
                <h3 className="text-2xl font-serif text-[#3e3e3e] mb-3">
                  {exp.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                  {exp.desc}
                </p>
                
                {exp.includes && (
                  <div className="mb-6">
                    <p className="text-[10px] font-bold text-[#a67c52] uppercase tracking-wider mb-1.5">Includes:</p>
                    <p className="text-xs text-gray-500 italic leading-relaxed">
                      {exp.includes}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-between border-t border-[#f0e8dc] pt-5">
                  <span className="text-xs text-rose-500 font-medium">
                    {exp.spots}
                  </span>
                  <button className="bg-[#3e3e3e] text-white px-5 py-2 rounded-full text-sm hover:bg-green-800 transition-colors shadow-md">
                    Book Spot
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRIVATE EVENT BANNER ─────────── */}
      <section className="bg-[#e8e2d9] py-16 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-10 rounded-[2rem] shadow-lg">
          <div>
            <h3 className="text-2xl font-serif text-[#3e3e3e] mb-2">Looking for a private workshop?</h3>
            <p className="text-gray-600 text-sm">
              We can host private masterclasses for birthdays, bridal showers, or corporate team-building.
            </p>
          </div>
          <button className="whitespace-nowrap border-2 border-[#a67c52] text-[#a67c52] px-8 py-3 rounded-full font-medium hover:bg-[#a67c52] hover:text-white transition-all">
            Inquire Details
          </button>
        </div>
      </section>

      <ProductsFooter />
    </div>
  );
};

export default Experiences;
