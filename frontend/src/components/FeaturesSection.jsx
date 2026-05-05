import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFeatures } from "../services/api";

const FeaturesSection = () => {
  const [provides, setProvides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeatures()
      .then(data => {
        setProvides(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching features:", err);
        setLoading(false);
      });
  }, []);

  if (loading && provides.length === 0) {
    return (
      <div className="bg-[#f8f5f2] py-48 px-6 text-center">
        <div className="w-10 h-10 border-2 border-[#e0d8ce] border-t-[#a67c52] rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f5f2] py-48 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* ── HEADER ── */}
        <div className="text-center mb-24 md:mb-32 max-w-2xl mx-auto">
          <span className="text-[#a67c52] uppercase tracking-[0.4em] md:tracking-[0.6em] text-[9px] md:text-[10px] font-black mb-4 md:mb-6 block">Our Craft</span>
          <h2 className="text-4xl md:text-6xl font-serif text-[#3e3e3e] leading-tight mb-6 md:mb-8">
            Elevate Your <br />
            <span className="text-green-800 italic">Daily Rituals</span>
          </h2>
          <p className="text-gray-400 text-xs md:text-sm italic">A curated haven designed for the mindful soul.</p>
        </div>

        {/* ── WHAT WE PROVIDE (ULTRA CLEAN GRID) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-20 md:gap-y-32 mb-32 md:mb-48">
          {Array.isArray(provides) && provides.map((item, idx) => (
            <div 
              key={idx} 
              className="group flex flex-col items-center text-center"
            >
              <Link to={item.link} className="relative w-full h-[400px] md:h-[550px] overflow-hidden rounded-[2.5rem] md:rounded-[3rem] shadow-sm group-hover:shadow-[0_30px_100px_rgba(0,0,0,0.12)] transition-all duration-1000 mb-8 md:mb-10">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-black/10 transition-colors duration-700" />
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-8 py-3 rounded-full text-[10px] font-bold tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  EXPLORE {item.label}
                </div>
              </Link>
              
              <div className="max-w-sm px-4">
                 <span className="text-[#a67c52] uppercase font-black tracking-widest text-[8px] md:text-[9px] mb-3 md:mb-4 block">{item.label}</span>
                 <h3 className="text-2xl md:text-4xl font-serif text-[#3e3e3e] mb-3 md:mb-4">{item.title}</h3>
                 <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── PREMIUM CARDS (MAXIMUM BREATHING ROOM) ── */}
        <div className="space-y-24 md:space-y-32 mb-32 md:mb-48">
           
           {/* EVENT CARD */}
           <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-24 flex flex-col lg:flex-row gap-12 md:gap-20 items-center shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-[#e0d8ce]/30">
              <div className="lg:w-1/2 w-full">
                 <span className="text-[#a67c52] text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mb-6 md:mb-10 block">Hospitality</span>
                 <h2 className="text-4xl md:text-6xl font-serif text-[#3e3e3e] leading-tight mb-6 md:mb-8">Exclusive<br />Event <span className="text-green-800 italic">Hosting</span></h2>
                 <p className="text-gray-400 text-sm md:text-lg leading-relaxed mb-8 md:mb-12 max-w-md">Transforming your special milestones into timeless memories with bespoke floral art and artisanal catering.</p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-10 md:mb-12">
                    {['Birthdays', 'Anniversaries', 'Engagements', 'Private Dinners'].map(item => (
                       <div key={item} className="flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-800" />
                          <span className="font-serif text-base md:text-lg text-[#3e3e3e]">{item}</span>
                       </div>
                    ))}
                 </div>
                 <button className="w-full sm:w-auto bg-[#222] text-white px-12 py-5 rounded-full font-bold text-[10px] tracking-[0.2em] hover:bg-green-800 transition-all shadow-xl">REQUEST INQUIRY</button>
              </div>
              <div className="lg:w-1/2 w-full">
                 <div className="rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl h-[350px] md:h-[600px]">
                    <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover" alt="Events" />
                 </div>
              </div>
           </div>

           {/* CAFE BANNER */}
           <div className="bg-[#222] rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-24 text-white flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-green-800/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />
              <div className="lg:w-[55%] w-full relative z-10 text-center lg:text-left">
                 <h2 className="text-4xl md:text-7xl font-serif mb-6 md:mb-10 leading-tight">Quietude <br />& <span className="text-[#a67c52]">Caffeine</span></h2>
                 <p className="text-gray-400 text-sm md:text-lg mb-10 md:mb-14 leading-relaxed max-w-xl mx-auto lg:mx-0">A special invitation for your first visit. Enjoy an exclusive 20% privilege on all café reservations and specialty blends.</p>
                 
                 <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 md:gap-10">
                    <div className="border-l lg:border-l border-white/20 pl-0 lg:pl-8 py-2 text-center lg:text-left">
                       <p className="text-[10px] uppercase font-bold tracking-widest text-[#a67c52] mb-1 md:mb-2">Member Code</p>
                       <p className="text-3xl md:text-4xl font-serif tracking-[0.2em]">HAVEN20</p>
                    </div>
                    <button className="w-full sm:w-auto bg-white text-black px-12 py-5 rounded-full font-black text-[10px] tracking-[0.2em] hover:bg-[#a67c52] hover:text-white transition-all shadow-xl">RESERVE TABLE</button>
                 </div>
              </div>

              <div className="lg:w-[40%] w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl skew-y-0 lg:skew-y-1">
                 <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover h-[300px] md:h-[500px]" alt="Cafe Sip" />
              </div>
           </div>

        </div>

        {/* ── FINAL NOTE ── */}
        <div className="text-center pt-10 md:pt-20">
           <p className="text-3xl md:text-6xl font-serif text-[#3e3e3e] max-w-5xl mx-auto leading-tight italic px-4">
             "Where the soul finds its <span className="text-green-800">quiet</span>."
           </p>
           <div className="w-24 md:w-40 h-px bg-[#a67c52]/20 mx-auto mt-12 md:mt-16 mb-8 md:mb-10"></div>
           <p className="font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-[8px] md:text-[10px] text-[#a67c52]">Est. 2024 — Reaina's Haven</p>
        </div>

      </div>
    </div>
  );
};

export default FeaturesSection;
