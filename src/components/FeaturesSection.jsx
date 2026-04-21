import React from "react";
import { Link } from "react-router-dom";

const FeaturesSection = () => {
  const provides = [
    { 
      title: "Botanical Wonders", 
      label: "Flowers",
      desc: "Seasonally curated blooms sourced from local ethical gardens for moments of pure joy.", 
      img: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1080&auto=format&fit=crop",
      link: "/products"
    },
    { 
      title: "Artisanal Brews", 
      label: "Café",
      desc: "Experience the calming ritual of artisan coffee and hand-blended herbal teas.", 
      img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1080&auto=format&fit=crop",
      link: "/services"
    },
    { 
      title: "Literary Escapes", 
      label: "Books",
      desc: "Discover a sanctuary of words with our hand-picked collection of art and poetry.", 
      img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1080&auto=format&fit=crop",
      link: "/products"
    },
    { 
      title: "Curated Hampers", 
      label: "Gift Boxes",
      desc: "The perfect expression of love, thoughtfully assembled in keepsake packaging.", 
      img: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?q=80&w=1080&auto=format&fit=crop",
      link: "/products"
    },
  ];

  return (
    <div className="bg-[#f8f5f2] py-48 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* ── HEADER ── */}
        <div className="text-center mb-32 max-w-2xl mx-auto">
          <span className="text-[#a67c52] uppercase tracking-[0.6em] text-[10px] font-black mb-6 block">Our Craft</span>
          <h2 className="text-5xl md:text-6xl font-serif text-[#3e3e3e] leading-tight mb-8">
            Elevate Your <br />
            <span className="text-green-800 italic">Daily Rituals</span>
          </h2>
          <p className="text-gray-400 text-sm italic">A curated haven designed for the mindful soul.</p>
        </div>

        {/* ── WHAT WE PROVIDE (ULTRA CLEAN GRID) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-32 mb-48">
          {provides.map((item, idx) => (
            <div 
              key={idx} 
              className="group flex flex-col items-center text-center"
            >
              <Link to={item.link} className="relative w-full h-[550px] overflow-hidden rounded-[3rem] shadow-sm group-hover:shadow-[0_30px_100px_rgba(0,0,0,0.12)] transition-all duration-1000 mb-10">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-black/10 transition-colors duration-700" />
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-8 py-3 rounded-full text-xs font-bold tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  EXPLORE {item.label}
                </div>
              </Link>
              
              <div className="max-w-sm">
                 <span className="text-[#a67c52] uppercase font-black tracking-widest text-[9px] mb-4 block">{item.label}</span>
                 <h3 className="text-3xl md:text-4xl font-serif text-[#3e3e3e] mb-4">{item.title}</h3>
                 <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── PREMIUM CARDS (MAXIMUM BREATHING ROOM) ── */}
        <div className="space-y-32 mb-48">
           
           {/* EVENT CARD */}
           <div className="bg-white rounded-[4rem] p-16 md:p-24 flex flex-col lg:flex-row gap-20 items-center shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
              <div className="lg:w-1/2">
                 <span className="text-[#a67c52] text-[10px] font-black uppercase tracking-[0.4em] mb-10 block">Hospitality</span>
                 <h2 className="text-5xl md:text-6xl font-serif text-[#3e3e3e] leading-tight mb-8">Exclusive<br />Event <span className="text-green-800 italic">Hosting</span></h2>
                 <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-md">Transforming your special milestones into timeless memories with bespoke floral art and artisanal catering.</p>
                 <div className="grid grid-cols-2 gap-8 mb-12">
                    {['Birthdays', 'Anniversaries', 'Engagements', 'Private Dinners'].map(item => (
                       <div key={item} className="flex items-center gap-4">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-800" />
                          <span className="font-serif text-lg text-[#3e3e3e]">{item}</span>
                       </div>
                    ))}
                 </div>
                 <button className="bg-[#222] text-white px-12 py-5 rounded-full font-bold text-[11px] tracking-[0.2em] hover:bg-green-800 transition-all shadow-2xl">REQUEST INQUIRY</button>
              </div>
              <div className="lg:w-1/2 w-full">
                 <div className="rounded-[3.5rem] overflow-hidden shadow-2xl h-[600px]">
                    <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover" alt="Events" />
                 </div>
              </div>
           </div>

           {/* CAFE BANNER */}
           <div className="bg-[#222] rounded-[4rem] p-16 md:p-24 text-white flex flex-col lg:flex-row items-center justify-between gap-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-800/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="lg:w-[55%] relative z-10">
                 <h2 className="text-5xl md:text-7xl font-serif mb-10 leading-tight">Quietude <br />& <span className="text-[#a67c52]">Caffeine</span></h2>
                 <p className="text-gray-400 text-lg mb-14 leading-relaxed max-w-xl">A special invitation for your first visit. Enjoy an exclusive 20% privilege on all café reservations and specialty blends.</p>
                 
                 <div className="flex flex-wrap items-center gap-10">
                    <div className="border-l border-white/20 pl-8 py-2">
                       <p className="text-[10px] uppercase font-bold tracking-widest text-[#a67c52] mb-2">Member Code</p>
                       <p className="text-4xl font-serif tracking-[0.2em]">HAVEN20</p>
                    </div>
                    <button className="bg-white text-black px-12 py-5 rounded-full font-black text-[11px] tracking-[0.2em] hover:bg-[#a67c52] hover:text-white transition-all shadow-2xl">RESERVE TABLE</button>
                 </div>
              </div>

              <div className="lg:w-[40%] w-full rounded-[3rem] overflow-hidden shadow-2xl skew-y-1">
                 <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover h-[500px]" alt="Cafe Sip" />
              </div>
           </div>

        </div>

        {/* ── FINAL NOTE ── */}
        <div className="text-center pt-20">
           <p className="text-4xl md:text-6xl font-serif text-[#3e3e3e] max-w-5xl mx-auto leading-tight italic">
             "Where the soul finds its <span className="text-green-800">quiet</span>."
           </p>
           <div className="w-40 h-px bg-[#a67c52]/20 mx-auto mt-16 mb-10"></div>
           <p className="font-black uppercase tracking-[0.6em] text-[10px] text-[#a67c52]">Est. 2026 — Reaina's Haven</p>
        </div>

      </div>
    </div>
  );
};

export default FeaturesSection;
