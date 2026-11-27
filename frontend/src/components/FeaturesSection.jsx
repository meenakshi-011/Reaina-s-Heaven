import React, { useState } from "react";
import { 
  Sparkles, 
  Clock, 
  Cake, 
  Utensils, 
  Check, 
  Image as ImageIcon, 
  Phone, 
  MessageCircle, 
  X, 
  ChevronRight, 
  Zap,
  Flame,
  Award,
  Heart
} from "lucide-react";

const WHATSAPP_NUMBER = "9098967112";

const FeaturesSection = () => {
  // Card 1 State (Snacks & Instant Eats)
  const [snackTab, setSnackTab] = useState("desi"); // "desi" | "instant"
  const [isSnackModalOpen, setIsSnackModalOpen] = useState(false);

  // Card 2 State (Custom Cakes)
  const [selectedFlavour, setSelectedFlavour] = useState("chocolate");
  const [isCakeModalOpen, setIsCakeModalOpen] = useState(false);

  // Cake Customizer State in Modal
  const [cakeSize, setCakeSize] = useState("1 kg");
  const [isEggless, setIsEggless] = useState(true);
  const [customFlavour, setCustomFlavour] = useState("Rich Chocolate Truffle");
  const [cakeNotes, setCakeNotes] = useState("");

  // Tiffin Subscription State
  const [tiffinTab, setTiffinTab] = useState("student"); // "student" | "pro"
  const [isTiffinModalOpen, setIsTiffinModalOpen] = useState(false);
  const [selectedTiffinPlan, setSelectedTiffinPlan] = useState("Regular Tiffin (₹1,899 / mo)");
  const [tiffinDuration, setTiffinDuration] = useState("Monthly (26 Meals)");
  const [tiffinCustomNotes, setTiffinCustomNotes] = useState("");

  const cakeFlavours = [
    {
      id: "chocolate",
      name: "Rich Belgian Chocolate",
      tag: "Bestseller",
      desc: "Silky dark chocolate ganache, moist Dutch cocoa sponge & decadent truffle glaze.",
      color: "from-amber-900/10 to-amber-950/20"
    },
    {
      id: "vanilla",
      name: "Classic Bourbon Vanilla",
      tag: "Timeless",
      desc: "Pure Madagascar bourbon vanilla bean crumb with velvety Swiss meringue buttercream.",
      color: "from-amber-100/40 to-yellow-100/30"
    },
    {
      id: "butterscotch",
      name: "Butterscotch Crunch",
      tag: "Crunchy & Sweet",
      desc: "Golden caramel drizzle, house-made butter praline crunch & caramelized sponge.",
      color: "from-amber-200/30 to-orange-100/30"
    },
    {
      id: "pineapple",
      name: "Tropical Fresh Pineapple",
      tag: "Refreshing",
      desc: "Loaded with caramelized pineapple compote, whipped dairy cream & light sponge.",
      color: "from-yellow-100/40 to-lime-50/30"
    },
    {
      id: "blackforest",
      name: "Black Forest Classic",
      tag: "Signature",
      desc: "Layers of kirsch-infused chocolate cake, wild sour cherries & shaved Belgian chocolate.",
      color: "from-rose-900/15 to-stone-900/20"
    },
    {
      id: "custom",
      name: "& More Custom Flavours",
      tag: "Chef's Palette",
      desc: "Red Velvet, Lotus Biscoff, Mango Cheesecake, Fresh Fruit, Hazelnut Nutella & more.",
      color: "from-pink-100/30 to-purple-100/20"
    }
  ];

  const snacksData = {
    desi: [
      {
        name: "Handcrafted Chooda (Poha Chivda)",
        tag: "House Special",
        desc: "Authentic homemade namkeen prepared with crispy flattened rice (poha), roasted peanuts, cashews, dried coconut & fresh tempered curry leaves with secret spices.",
        badge: "100% Homemade"
      },
      {
        name: "Crispy Spiral Chakli",
        tag: "Festive Favorite",
        desc: "Golden crunchy spirals hand-pressed with spiced roasted rice flour, sesame seeds & fragrant ajwain. Perfect companion for hot evening chai.",
        badge: "Crispy & Light"
      },
      {
        name: "Artisanal Papads & Fryums",
        tag: "Authentic Crunch",
        desc: "Sun-dried traditional papad assortment, urad dal spiced papad, and crunchy sabudana fryums roasted or fried to perfection.",
        badge: "Fresh Batch"
      },
      {
        name: "Crispy Mathri & Namkeen Bites",
        tag: "Tea-Time Classic",
        desc: "Flaky fenugreek (methi) & ajwain spiced crispy savory crackers, handmade in small batches for lasting freshness.",
        badge: "Snack Jar"
      }
    ],
    instant: [
      {
        name: "Hot Sizzling Maggi (Veg / Cheese)",
        tag: "Instant 15-20 Min",
        desc: "Piping hot classic masala street Maggi loaded with crunchy farm veggies, butter tadka, and optional melted mozzarella cheese burst.",
        badge: "Delivered Hot"
      },
      {
        name: "Creamy Italian & Desi Pasta",
        tag: "Instant Comfort",
        desc: "Al dente penne tossed in velvety Alfredo white sauce or spicy arrabbiata red tomato sauce, garnished with fresh basil & herbs.",
        badge: "Made to Order"
      },
      {
        name: "Artisan Grilled Sandwiches",
        tag: "Crispy & Loaded",
        desc: "Golden toasted multi-grain bread layered with seasoned potato masala, paneer tikka, veggies, and in-house mint coriander chutney.",
        badge: "Cheesy & Warm"
      },
      {
        name: "Golden Peri-Peri French Fries",
        tag: "Crispy Delight",
        desc: "Double-fried crunchy potato fries tossed in aromatic spicy peri-peri herb seasoning with creamy house dip.",
        badge: "Instant Craving"
      }
    ]
  };

  const handleWhatsAppOrderSnacks = (item = "") => {
    const text = item 
      ? `Hi Reaina's Haven! I would like to order: ${item}. Please confirm availability and delivery time.`
      : `Hi Reaina's Haven! I would like to order handcrafted Indian snacks (Chooda, Chakli, Papad) and instant food (Maggi, Pasta). Please share the menu & delivery details.`;
    window.open(`https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleWhatsAppOrderCake = (flavourName = "") => {
    const text = `Hi Reaina's Haven! I want to order a custom cake.\nFlavour: ${flavourName || customFlavour}\nSize: ${cakeSize}\nPreference: ${isEggless ? "100% Eggless" : "Regular with Egg"}\nNotes / Theme: ${cakeNotes || "I have a reference image to share!"}\n\nPlease let me know the pricing and turnaround time.`;
    window.open(`https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleWhatsAppSubscribeTiffin = (plan = "") => {
    const activePlan = plan || selectedTiffinPlan;
    const text = `Hi Reaina's Haven! I want to subscribe to your Daily Tiffin Service.\nPlan: ${activePlan}\nCategory: ${tiffinTab === "student" ? "Student & Hostel Plan" : "Working Professional Plan"}\nDuration: ${tiffinDuration}\nPreferences: ${tiffinCustomNotes || "Standard home-style meals"}\n\nPlease share delivery details and starting date.`;
    window.open(`https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="bg-[#f8f5f2] py-28 md:py-40 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* ── SECTION HEADER ── */}
        <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#a67c52]/10 border border-[#a67c52]/20 px-4 py-1.5 rounded-full mb-4">
            <Sparkles size={12} className="text-[#a67c52]" />
            <span className="text-[#a67c52] uppercase tracking-[0.3em] text-[9px] md:text-[10px] font-black">
              Fresh Kitchen & Custom Patisserie
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#3e3e3e] leading-tight mb-5">
            Handcrafted Desi Snacks <br />
            <span className="text-green-800 italic">& Bespoke Designer Cakes</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            From crispy homemade Chooda & instant hot cravings delivered to your doorstep, to stunning celebration cakes handcrafted exactly from your reference images.
          </p>
        </div>

        {/* ── TWO AESTHETIC SHOWCASE CARDS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-32">
          
          {/* ══════════════════════════════════════════════════
              CARD 1: HANDCRAFTED SNACKS & INSTANT FOOD
             ══════════════════════════════════════════════════ */}
          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 sm:p-8 md:p-10 border border-[#e0d8ce]/60 shadow-[0_15px_60px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_80px_rgba(166,124,82,0.12)] transition-all duration-500 flex flex-col justify-between relative overflow-hidden group">
            
            {/* Ambient background glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* IMAGE SHOWCASE */}
              <div className="relative w-full h-[260px] sm:h-[320px] md:h-[360px] overflow-hidden rounded-[2rem] shadow-md mb-8">
                <img 
                  src="/images/desi_snacks_instant.jpg" 
                  alt="Handcrafted Indian Snacks and Instant Food" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="bg-white/90 backdrop-blur-md text-[#2e2e2e] text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Zap size={12} className="text-amber-600 fill-amber-600" />
                    Instant Hot Delivery
                  </span>
                  <span className="bg-[#274735]/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                    🌿 100% Pure Veg
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-amber-200 block mb-1">
                    Authentic Ghar Ka Taste
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif leading-tight">
                    Chooda, Chakli, Papad & Hot Instant Eats
                  </h3>
                </div>
              </div>

              {/* CARD TITLE & INTRO */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#a67c52] uppercase font-black tracking-widest text-[9px]">
                    Desi Delights & Instant Cravings
                  </span>
                  <span className="text-xs text-gray-400 font-medium">⚡ 20–30 Mins Express</span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-serif text-[#3e3e3e] mb-2">
                  Handcrafted Snacks & Express Food
                </h4>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  We prepare traditional Indian snacks including crunchy homemade <strong className="text-[#3e3e3e]">Chooda</strong> (flaked rice namkeen with roasted peanuts & herbs), crispy <strong className="text-[#3e3e3e]">Chakli</strong>, and roasted/fried <strong className="text-[#3e3e3e]">Papad</strong> — alongside piping hot <strong className="text-[#3e3e3e]">Maggi</strong> and creamy <strong className="text-[#3e3e3e]">Pasta</strong> delivered fresh whenever cravings hit!
                </p>
              </div>

              {/* INTERACTIVE CATEGORY SELECTOR */}
              <div className="bg-[#f8f5f2] p-1.5 rounded-full flex gap-2 mb-6 border border-[#e0d8ce]/50">
                <button
                  type="button"
                  onClick={() => setSnackTab("desi")}
                  className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    snackTab === "desi"
                      ? "bg-white text-[#3e3e3e] shadow-sm border border-[#e0d8ce]"
                      : "text-gray-500 hover:text-[#3e3e3e]"
                  }`}
                >
                  <span>🌾</span>
                  <span>Handmade Desi Snacks</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSnackTab("instant")}
                  className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    snackTab === "instant"
                      ? "bg-[#3e3e3e] text-white shadow-sm"
                      : "text-gray-500 hover:text-[#3e3e3e]"
                  }`}
                >
                  <Flame size={13} className="text-amber-400" />
                  <span>Instant Hot Delivery</span>
                </button>
              </div>

              {/* DYNAMIC ITEM PREVIEW LIST */}
              <div className="space-y-3 mb-8">
                {snacksData[snackTab].map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#fdfaf7] border border-[#e0d8ce]/40 hover:border-[#a67c52]/40 transition-all flex items-start justify-between gap-3 group/item"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-serif text-sm sm:text-base font-semibold text-[#3e3e3e] group-hover/item:text-[#a67c52] transition-colors">
                          {item.name}
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleWhatsAppOrderSnacks(item.name)}
                      className="mt-1 text-[11px] font-bold text-[#a67c52] hover:text-[#3e3e3e] bg-white border border-[#a67c52]/30 px-3 py-1.5 rounded-full whitespace-nowrap shadow-xs hover:shadow-sm transition-all"
                    >
                      Order Now
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="pt-6 border-t border-[#e0d8ce]/60 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setIsSnackModalOpen(true)}
                className="flex-1 py-3.5 px-6 rounded-full border-2 border-[#a67c52] text-[#a67c52] hover:bg-[#a67c52] hover:text-white transition-all text-center font-bold tracking-widest text-[10px] uppercase flex items-center justify-center gap-2"
              >
                <Utensils size={13} />
                Explore Snacks & Bites
              </button>
              <button
                type="button"
                onClick={() => handleWhatsAppOrderSnacks()}
                className="flex-1 py-3.5 px-6 rounded-full bg-[#25D366] text-white hover:bg-[#1fb855] transition-all text-center font-bold tracking-widest text-[10px] uppercase shadow-lg shadow-green-900/10 flex items-center justify-center gap-2"
              >
                <MessageCircle size={14} />
                Instant WhatsApp Order
              </button>
            </div>

          </div>


          {/* ══════════════════════════════════════════════════
              CARD 2: BESPOKE ARTISAN CAKES & CUSTOM BAKES
             ══════════════════════════════════════════════════ */}
          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 sm:p-8 md:p-10 border border-[#e0d8ce]/60 shadow-[0_15px_60px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_80px_rgba(166,124,82,0.12)] transition-all duration-500 flex flex-col justify-between relative overflow-hidden group">
            
            {/* Ambient background glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* IMAGE SHOWCASE */}
              <div className="relative w-full h-[260px] sm:h-[320px] md:h-[360px] overflow-hidden rounded-[2rem] shadow-md mb-8">
                <img 
                  src="/images/custom_artisan_cakes.jpg" 
                  alt="Custom Designer Cakes Made by Reference Image" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="bg-white/95 backdrop-blur-md text-[#2e2e2e] text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Cake size={12} className="text-[#a67c52]" />
                    Baked Fresh to Order
                  </span>
                  <span className="bg-[#a67c52]/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                    📸 Your Reference Image
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-amber-200 block mb-1">
                    Custom Designer Patisserie
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif leading-tight">
                    Vanilla, Chocolate, Butterscotch, Pineapple & More
                  </h3>
                </div>
              </div>

              {/* CARD TITLE & INTRO */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#a67c52] uppercase font-black tracking-widest text-[9px]">
                    Bespoke Celebration Cakes
                  </span>
                  <span className="text-xs text-rose-700 font-medium">✨ 100% Custom Designs</span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-serif text-[#3e3e3e] mb-2">
                  Cakes Made to Your Exact Reference
                </h4>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  Have a dream cake photo from Pinterest or Instagram? Share your reference picture with us! We handcraft stunning celebration cakes customized to your preferred sponge, theme, frosting, and flavors.
                </p>
              </div>

              {/* FLAVOUR SELECTOR PILLS */}
              <div className="mb-6">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-2.5">
                  Select a Signature Flavour to Preview:
                </span>
                <div className="flex flex-wrap gap-2">
                  {cakeFlavours.map((flavour) => (
                    <button
                      key={flavour.id}
                      type="button"
                      onClick={() => setSelectedFlavour(flavour.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        selectedFlavour === flavour.id
                          ? "bg-[#3e3e3e] text-white shadow-md scale-105"
                          : "bg-[#f8f5f2] text-[#4a4a4a] hover:bg-[#e0d8ce]/60 border border-[#e0d8ce]/40"
                      }`}
                    >
                      <span>{flavour.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ACTIVE FLAVOUR HIGHLIGHT BOX */}
              {(() => {
                const activeFlavour = cakeFlavours.find(f => f.id === selectedFlavour) || cakeFlavours[0];
                return (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#fcf9f5] to-amber-50/40 border border-amber-900/10 mb-8">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Award size={14} className="text-[#a67c52]" />
                        <span className="font-serif text-base font-bold text-[#3e3e3e]">
                          {activeFlavour.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#a67c52] uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-amber-200">
                        {activeFlavour.tag}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      {activeFlavour.desc}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-gray-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Check size={12} className="text-green-700" /> 100% Eggless Option
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Check size={12} className="text-green-700" /> Tiered & Bento Sizes
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* REFERENCE IMAGE HIGHLIGHT STRIP */}
              <div className="bg-[#f7f3ed] rounded-2xl p-3.5 mb-6 flex items-center gap-3 border border-[#e0d8ce]/40">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#a67c52] shadow-xs shrink-0">
                  <ImageIcon size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#3e3e3e]">Custom Reference Designs</p>
                  <p className="text-[11px] text-gray-500">Send us any photo or sketch — we match color, florals & toppers.</p>
                </div>
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="pt-6 border-t border-[#e0d8ce]/60 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setIsCakeModalOpen(true)}
                className="flex-1 py-3.5 px-6 rounded-full border-2 border-[#a67c52] text-[#a67c52] hover:bg-[#a67c52] hover:text-white transition-all text-center font-bold tracking-widest text-[10px] uppercase flex items-center justify-center gap-2"
              >
                <Cake size={13} />
                Customise Cake
              </button>
              <button
                type="button"
                onClick={() => handleWhatsAppOrderCake()}
                className="flex-1 py-3.5 px-6 rounded-full bg-[#25D366] text-white hover:bg-[#1fb855] transition-all text-center font-bold tracking-widest text-[10px] uppercase shadow-lg shadow-green-900/10 flex items-center justify-center gap-2"
              >
                <MessageCircle size={14} />
                Share Photo on WhatsApp
              </button>
            </div>

          </div>

        </div>

        {/* ── PREMIUM HOSPITALITY & CAFE CARDS (PRESERVED) ── */}
        <div className="space-y-24 md:space-y-32 mb-32 md:mb-48">
           
           {/* ── CAKES THEME CARD ── */}
           <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-24 flex flex-col lg:flex-row gap-12 md:gap-20 items-center shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-[#e0d8ce]/30">
              <div className="lg:w-1/2 w-full">
                 <div className="flex items-center gap-2 mb-4 md:mb-6">
                    <span className="text-[#a67c52] text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">
                      Bespoke Cake Studio
                    </span>
                    <span className="bg-amber-100/60 text-[#a67c52] text-[10px] font-bold px-3 py-1 rounded-full border border-amber-300/40 flex items-center gap-1">
                      <Sparkles size={11} /> 100% Custom Made
                    </span>
                 </div>

                 <h2 className="text-4xl md:text-6xl font-serif text-[#3e3e3e] leading-tight mb-6 md:mb-8">
                   Artisan Designer Cakes <br />
                   <span className="text-green-800 italic">& Dream Creations</span> 🎂
                 </h2>

                 <p className="text-gray-500 text-sm md:text-lg leading-relaxed mb-6 md:mb-8 max-w-xl">
                   Crafted for your milestones from scratch! From refreshing <strong className="text-[#3e3e3e]">Tropical Pineapple</strong> and rich Belgian chocolate to vintage Korean Bento cakes and grand multi-tier florals. Every cake is custom baked to your exact <strong className="text-[#3e3e3e]">reference image, flavor preference, and 100% Eggless needs</strong>.
                 </p>

                 {/* HIGHLIGHT PILLS: FLAVOURS & DESIGN STYLES */}
                 <div className="space-y-4 mb-8 md:mb-10">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#a67c52] block mb-2">
                        Popular Flavours (100% Eggless Available):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          '🍍 Fresh Tropical Pineapple',
                          '🍫 Belgian Chocolate Truffle',
                          '🍯 Butterscotch Crunch',
                          '🌼 Classic Bourbon Vanilla',
                          '🍒 Black Forest Compote',
                          '🍓 Red Velvet Cream Cheese'
                        ].map((flavour, i) => (
                          <span key={i} className="text-xs bg-[#fdfaf7] text-[#3e3e3e] border border-[#e0d8ce] px-3 py-1.5 rounded-full font-medium shadow-2xs">
                            {flavour}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#a67c52] block mb-2">
                        Bespoke Design Styles & Themes:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { title: 'Korean Bento Mini Cakes', sub: 'Pastel minimalist piping with custom messages' },
                          { title: 'Multi-Tier Floral & Gold', sub: 'Fresh edible blooms & 24k gold leaf accents' },
                          { title: 'Chocolate Drip & Shards', sub: 'Loaded with berries, truffles & Belgian drips' },
                          { title: 'Your Custom Reference Photo', sub: 'Replicated from Pinterest / Instagram' }
                        ].map((design, i) => (
                          <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#f8f5f2]/60 border border-[#e0d8ce]/40">
                            <span className="w-2 h-2 rounded-full bg-green-800 mt-1.5 shrink-0" />
                            <div>
                              <p className="text-xs font-serif font-bold text-[#3e3e3e]">{design.title}</p>
                              <p className="text-[11px] text-gray-500 leading-tight">{design.sub}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                 </div>

                 {/* TWO ACTION BUTTONS */}
                 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                   <button 
                     onClick={() => setIsCakeModalOpen(true)}
                     className="w-full sm:w-auto bg-[#222] text-white px-8 py-5 rounded-full font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-[#a67c52] transition-all shadow-xl flex items-center justify-center gap-2"
                   >
                     <Sparkles size={14} className="text-amber-300" />
                     Customize According to Your Design & Taste
                   </button>
                   <button 
                     onClick={() => window.open(`https://wa.me/91${WHATSAPP_NUMBER}?text=Hi%20Reaina%27s%20Haven!%20I%20would%20like%20to%20order%20a%20custom%20cake%20(Pineapple%20%2F%20Eggless%20%2F%20Custom%20Design).`, "_blank")}
                     className="w-full sm:w-auto bg-[#25D366] text-white px-8 py-5 rounded-full font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-[#1fb855] transition-all shadow-xl flex items-center justify-center gap-2"
                   >
                     <Phone size={13} />
                     Order on 9098967112
                   </button>
                 </div>
              </div>

              <div className="lg:w-1/2 w-full">
                 <div className="rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl h-[380px] md:h-[620px] relative group">
                    <img 
                      src="/images/designer_cakes_spread.jpg" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      alt="Artisan Designer Cakes Spread" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Floating Design Pills on Image */}
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                      <span className="bg-white/90 backdrop-blur-md text-[#3e3e3e] text-[10px] font-bold px-3.5 py-1.5 rounded-full shadow-md w-fit flex items-center gap-1.5">
                        🍍 Fresh Pineapple Gateau
                      </span>
                      <span className="bg-[#274735]/90 backdrop-blur-md text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full shadow-md w-fit flex items-center gap-1.5">
                        🌱 100% Pure Eggless
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 text-white bg-black/45 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] font-mono tracking-widest uppercase text-amber-200">Custom Patisserie Studio</p>
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white">Tiered & Bento</span>
                      </div>
                      <p className="font-serif text-sm sm:text-base leading-snug">
                        Pineapple cream, chocolate drip, Korean bento & multi-tier floral cakes crafted to your reference.
                      </p>
                    </div>
                 </div>
              </div>
           </div>

           {/* ── DAILY TIFFIN SUBSCRIPTION BANNER ── */}
           <div className="bg-[#18211b] rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 text-white flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-16 relative overflow-hidden border border-[#2e3e32] shadow-2xl">
              <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-green-600/10 rounded-full blur-[100px] md:blur-[130px] pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

              <div className="lg:w-[56%] w-full relative z-10 text-center lg:text-left">
                 <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full mb-4 md:mb-6">
                    <span className="text-amber-300 text-xs">🍱</span>
                    <span className="text-[#e2c799] uppercase tracking-[0.25em] text-[9px] md:text-[10px] font-black">
                      Daily Tiffin Service • 26 Meals / Month
                    </span>
                 </div>

                 <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-4 md:mb-6 leading-tight">
                   Ghar Ka Khana, <br />
                   <span className="text-[#c8a97e] italic">Ab Doorstep Par</span> ♡
                 </h2>

                 <p className="text-gray-300 text-sm md:text-base mb-6 md:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                   Wholesome, hygienic home-cooked meals delivered warm to students, hostellers, PG residents, and working professionals. Choose your roti, rice, sabzi & protein preference!
                 </p>

                 {/* AUDIENCE PILLS */}
                 <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                    <span className="text-xs bg-white/10 text-gray-200 px-3 py-1 rounded-full border border-white/10">🎓 Students</span>
                    <span className="text-xs bg-white/10 text-gray-200 px-3 py-1 rounded-full border border-white/10">🏠 Hostellers & PG Residents</span>
                    <span className="text-xs bg-white/10 text-gray-200 px-3 py-1 rounded-full border border-white/10">💼 Working Professionals</span>
                    <span className="text-xs bg-white/10 text-gray-200 px-3 py-1 rounded-full border border-white/10">🌿 Pure Veg & Hygienic</span>
                 </div>

                 {/* TAB SWITCHER */}
                 <div className="bg-black/40 p-1.5 rounded-full inline-flex gap-2 mb-6 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setTiffinTab("student")}
                      className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                        tiffinTab === "student"
                          ? "bg-white text-black shadow-md"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      🎓 Student & Hostel Plans
                    </button>
                    <button
                      type="button"
                      onClick={() => setTiffinTab("pro")}
                      className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                        tiffinTab === "pro"
                          ? "bg-white text-black shadow-md"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      💼 Professional Plans
                    </button>
                 </div>

                 {/* PLAN TIERS GRID */}
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
                    {tiffinTab === "student" ? (
                      <>
                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between">
                           <div>
                              <span className="text-[10px] text-amber-300 uppercase tracking-widest font-bold">Mini Tiffin</span>
                              <p className="text-xl font-serif font-bold text-white mt-0.5 mb-1">₹1,599 <span className="text-xs text-gray-400 font-sans">/mo</span></p>
                              <p className="text-xs text-gray-300">4 Roti • Dal • Seasonal Sabzi</p>
                           </div>
                           <button 
                             onClick={() => handleWhatsAppSubscribeTiffin("Mini Tiffin (₹1,599/mo)")}
                             className="mt-3 text-[10px] uppercase font-bold text-amber-300 hover:underline"
                           >
                             Subscribe →
                           </button>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white/10 border border-amber-300/40 shadow-lg relative flex flex-col justify-between">
                           <span className="absolute -top-2.5 right-3 bg-amber-400 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                             Most Popular
                           </span>
                           <div>
                              <span className="text-[10px] text-amber-300 uppercase tracking-widest font-bold">Regular Tiffin</span>
                              <p className="text-xl font-serif font-bold text-white mt-0.5 mb-1">₹1,899 <span className="text-xs text-gray-400 font-sans">/mo</span></p>
                              <p className="text-xs text-gray-300">4 Roti • Dal • Sabzi • Steamed Rice</p>
                           </div>
                           <button 
                             onClick={() => handleWhatsAppSubscribeTiffin("Regular Tiffin (₹1,899/mo)")}
                             className="mt-3 text-[10px] uppercase font-bold text-white hover:underline"
                           >
                             Subscribe →
                           </button>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between">
                           <div>
                              <span className="text-[10px] text-amber-300 uppercase tracking-widest font-bold">Healthy Tiffin</span>
                              <p className="text-xl font-serif font-bold text-white mt-0.5 mb-1">₹2,199 <span className="text-xs text-gray-400 font-sans">/mo</span></p>
                              <p className="text-xs text-gray-300">4 Roti • Dal • Sabzi • Rice • Curd/Salad</p>
                           </div>
                           <button 
                             onClick={() => handleWhatsAppSubscribeTiffin("Healthy Tiffin (₹2,199/mo)")}
                             className="mt-3 text-[10px] uppercase font-bold text-amber-300 hover:underline"
                           >
                             Subscribe →
                           </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between">
                           <div>
                              <span className="text-[10px] text-amber-300 uppercase tracking-widest font-bold">Home Tiffin</span>
                              <p className="text-xl font-serif font-bold text-white mt-0.5 mb-1">₹2,199 <span className="text-xs text-gray-400 font-sans">/mo</span></p>
                              <p className="text-xs text-gray-300">Roti • Dal • Sabzi • Rice • Salad/Curd</p>
                           </div>
                           <button 
                             onClick={() => handleWhatsAppSubscribeTiffin("Regular Home Tiffin (₹2,199/mo)")}
                             className="mt-3 text-[10px] uppercase font-bold text-amber-300 hover:underline"
                           >
                             Subscribe →
                           </button>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white/10 border border-amber-300/40 shadow-lg relative flex flex-col justify-between">
                           <span className="absolute -top-2.5 right-3 bg-amber-400 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                             Chef's Special
                           </span>
                           <div>
                              <span className="text-[10px] text-amber-300 uppercase tracking-widest font-bold">Special Home</span>
                              <p className="text-xl font-serif font-bold text-white mt-0.5 mb-1">₹2,499 <span className="text-xs text-gray-400 font-sans">/mo</span></p>
                              <p className="text-xs text-gray-300">Roti • Dal • Special Sabzi • Paneer/Chole • Rice</p>
                           </div>
                           <button 
                             onClick={() => handleWhatsAppSubscribeTiffin("Special Home Tiffin (₹2,499/mo)")}
                             className="mt-3 text-[10px] uppercase font-bold text-white hover:underline"
                           >
                             Subscribe →
                           </button>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between">
                           <div>
                              <span className="text-[10px] text-amber-300 uppercase tracking-widest font-bold">Protein Tiffin</span>
                              <p className="text-xl font-serif font-bold text-white mt-0.5 mb-1">₹2,499 <span className="text-xs text-gray-400 font-sans">/mo</span></p>
                              <p className="text-xs text-gray-300">Dal • Protein Source • Sabzi • Roti/Rice • Curd</p>
                           </div>
                           <button 
                             onClick={() => handleWhatsAppSubscribeTiffin("Protein Tiffin (₹2,499/mo)")}
                             className="mt-3 text-[10px] uppercase font-bold text-amber-300 hover:underline"
                           >
                             Subscribe →
                           </button>
                        </div>
                      </>
                    )}
                 </div>
                 
                 {/* ACTION BUTTONS */}
                 <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    <button 
                      onClick={() => handleWhatsAppSubscribeTiffin()}
                      className="w-full sm:w-auto bg-[#25D366] text-white px-9 py-4 rounded-full font-bold text-xs tracking-wider uppercase hover:bg-[#1fb855] transition-all shadow-xl flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={15} />
                      Subscribe on WhatsApp (9098967112)
                    </button>
                    <button 
                      onClick={() => setIsTiffinModalOpen(true)}
                      className="w-full sm:w-auto bg-white/10 hover:bg-white hover:text-black border border-white/20 text-white px-8 py-4 rounded-full font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Sparkles size={14} className="text-amber-300" />
                      Customize Tiffin Plan
                    </button>
                 </div>
              </div>

              {/* IMAGE SHOWCASE */}
              <div className="lg:w-[40%] w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative group">
                 <img 
                   src="/images/daily_tiffin_box.jpg" 
                   className="w-full h-full object-cover h-[350px] md:h-[520px] transition-transform duration-700 group-hover:scale-105" 
                   alt="Daily Tiffin Service Indian Meal" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                 <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-white">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-amber-300 uppercase tracking-widest font-mono">Stainless Steel Tiffin</span>
                      <span className="text-[10px] bg-green-800/80 px-2 py-0.5 rounded-full font-bold">26 Meals / Mo</span>
                    </div>
                    <p className="text-xs text-gray-200">
                      Steaming Dal, Seasonal Sabzi, Soft Phulkas, Fragrant Jeera Rice, Curd & Fresh Salad.
                    </p>
                 </div>
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

      {/* ══════════════════════════════════════════════════
          MODAL 1: SNACKS & INSTANT FOOD DETAILED MENU
         ══════════════════════════════════════════════════ */}
      {isSnackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#fcfaf7] w-full max-w-3xl rounded-[2.5rem] p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-[#e0d8ce] shadow-2xl relative">
            <button
              onClick={() => setIsSnackModalOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white border border-[#e0d8ce] flex items-center justify-center text-gray-500 hover:text-black hover:scale-105 transition-all"
            >
              <X size={18} />
            </button>

            <div className="mb-6">
              <span className="text-[#a67c52] uppercase tracking-[0.2em] text-[10px] font-bold">
                Reaina's Haven Kitchen
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#3e3e3e] mt-1">
                Handcrafted Snacks & Instant Cravings
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Available for instant hot delivery & snack jar gift packs. Freshly prepared with love.
              </p>
            </div>

            {/* Traditional Snacks Section */}
            <div className="mb-8">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#a67c52] mb-3 flex items-center gap-2">
                <span>🌾</span> Traditional Indian Namkeen
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: "Handcrafted Chooda (Poha Chivda)", desc: "Crunchy roasted poha, peanuts, curry leaves & spices", tag: "Pack of 250g / 500g" },
                  { title: "Crispy Spiral Chakli", desc: "Golden spiced rice flour spirals with sesame & ajwain", tag: "Pack of 200g / 400g" },
                  { title: "Roasted & Fried Papad Variety", desc: "Urad dal, jeera papad & crispy sabudana fryums", tag: "Fresh Pack" },
                  { title: "Flaky Mathri & Namkeen Mixture", desc: "Crispy tea-time snacks crafted in pure groundnut oil", tag: "Heritage Recipe" }
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white border border-[#e0d8ce]/60 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-serif font-bold text-sm text-[#3e3e3e]">{item.title}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3">{item.desc}</p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-[#f0ebe1]">
                      <span className="text-[10px] font-semibold text-gray-400">{item.tag}</span>
                      <button
                        onClick={() => handleWhatsAppOrderSnacks(item.title)}
                        className="text-xs font-bold text-[#a67c52] hover:underline"
                      >
                        Order via WhatsApp →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instant Delivery Section */}
            <div className="mb-8">
              <h4 className="text-sm font-bold uppercase tracking-wider text-amber-700 mb-3 flex items-center gap-2">
                <Flame size={15} /> Instant Hot Eats (Ready in 15–25 Mins)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: "Classic Masala Veg Maggi", desc: "Piping hot desi street noodles with sweet peas & veggies" },
                  { title: "Cheese Burst & Butter Maggi", desc: "Loaded with melted mozzarella & butter tadka" },
                  { title: "Creamy White Sauce Pasta", desc: "Cheesy penne Alfredo with sautéed corn & capsicum" },
                  { title: "Spicy Arrabbiata Red Pasta", desc: "Tangy tomato garlic herb sauce with Italian seasoning" },
                  { title: "Artisan Grilled Veg Sandwich", desc: "Golden toasted layered with spicy mint chutney & paneer" },
                  { title: "Crispy Peri-Peri French Fries", desc: "Double-fried golden sticks with spicy peri-peri dust" }
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white border border-[#e0d8ce]/60 flex flex-col justify-between">
                    <div>
                      <span className="font-serif font-bold text-sm text-[#3e3e3e]">{item.title}</span>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3">{item.desc}</p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-[#f0ebe1]">
                      <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">⚡ Fast Delivery</span>
                      <button
                        onClick={() => handleWhatsAppOrderSnacks(item.title)}
                        className="text-xs font-bold text-[#a67c52] hover:underline"
                      >
                        Order Fresh →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-xs font-bold text-[#3e3e3e]">Have custom snack requests or bulk event orders?</p>
                <p className="text-[11px] text-gray-500">We customize spices, packaging for travel, and corporate hampers.</p>
              </div>
              <button
                onClick={() => handleWhatsAppOrderSnacks("Custom Bulk Snack Inquiry")}
                className="bg-[#25D366] text-white px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shadow-md hover:bg-[#1fb855]"
              >
                <MessageCircle size={14} /> WhatsApp: {WHATSAPP_NUMBER}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          MODAL 2: CUSTOM CAKE INQUIRY & CONSULTATION
         ══════════════════════════════════════════════════ */}
      {isCakeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#fcfaf7] w-full max-w-2xl rounded-[2.5rem] p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-[#e0d8ce] shadow-2xl relative">
            <button
              onClick={() => setIsCakeModalOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white border border-[#e0d8ce] flex items-center justify-center text-gray-500 hover:text-black hover:scale-105 transition-all"
            >
              <X size={18} />
            </button>

            <div className="mb-6">
              <span className="text-[#a67c52] uppercase tracking-[0.2em] text-[10px] font-bold">
                Bespoke Patisserie Studio
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#3e3e3e] mt-1">
                Customize Your Dream Cake
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                We bake celebration cakes from scratch according to your flavor preferences and reference images.
              </p>
            </div>

            {/* Customizer Form Controls */}
            <div className="space-y-5 mb-8">
              
              {/* Flavour Choice */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#3e3e3e] block mb-2">
                  1. Select Flavour
                </label>
                <select
                  value={customFlavour}
                  onChange={(e) => setCustomFlavour(e.target.value)}
                  className="w-full bg-white border border-[#e0d8ce] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#a67c52] text-[#3e3e3e]"
                >
                  <option value="Rich Belgian Chocolate Truffle">Rich Belgian Chocolate Truffle</option>
                  <option value="Classic Bourbon Vanilla">Classic Bourbon Vanilla</option>
                  <option value="Butterscotch Crunch with Caramel">Butterscotch Crunch with Caramel</option>
                  <option value="Tropical Fresh Pineapple Cream">Tropical Fresh Pineapple Cream</option>
                  <option value="Black Forest Compote & Shavings">Black Forest Compote & Shavings</option>
                  <option value="Red Velvet with Cream Cheese">Red Velvet with Cream Cheese</option>
                  <option value="Lotus Biscoff Layered Cake">Lotus Biscoff Layered Cake</option>
                  <option value="Fresh Mango / Seasonal Fruit Cake">Fresh Mango / Seasonal Fruit Cake</option>
                  <option value="Other Custom Flavour (Specify in Notes)">Other Custom Flavour (Specify in Notes)</option>
                </select>
              </div>

              {/* Weight / Size */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#3e3e3e] block mb-2">
                  2. Choose Weight / Size
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["0.5 kg (Bento)", "1 kg", "1.5 kg", "2 kg + Multi-tier"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setCakeSize(size)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                        cakeSize === size
                          ? "bg-[#3e3e3e] text-white border-[#3e3e3e]"
                          : "bg-white text-gray-700 border-[#e0d8ce] hover:border-[#a67c52]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Eggless Toggle */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#3e3e3e] block mb-2">
                  3. Dietary Preference
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEggless(true)}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                      isEggless
                        ? "bg-[#274735] text-white border-[#274735]"
                        : "bg-white text-gray-700 border-[#e0d8ce]"
                    }`}
                  >
                    <span>🌱</span> 100% Eggless
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEggless(false)}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                      !isEggless
                        ? "bg-[#3e3e3e] text-white border-[#3e3e3e]"
                        : "bg-white text-gray-700 border-[#e0d8ce]"
                    }`}
                  >
                    <span>🥚</span> Regular (With Egg)
                  </button>
                </div>
              </div>

              {/* Reference Image & Message Notes */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#3e3e3e] block mb-2">
                  4. Design Notes & Reference Photo
                </label>
                <textarea
                  rows={3}
                  value={cakeNotes}
                  onChange={(e) => setCakeNotes(e.target.value)}
                  placeholder="e.g. Birthday theme, pastel pink florals, name on cake 'Happy 25th Reaina', sharing photo on WhatsApp..."
                  className="w-full bg-white border border-[#e0d8ce] rounded-2xl p-4 text-xs sm:text-sm focus:outline-none focus:border-[#a67c52] text-[#3e3e3e]"
                />
              </div>

            </div>

            {/* WhatsApp Direct Action */}
            <div className="p-4 bg-[#f8f5f2] rounded-2xl border border-[#e0d8ce] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[#3e3e3e]">Send this design request to our baker:</p>
                <p className="text-[11px] text-gray-500">Attach your reference image directly in WhatsApp chat!</p>
              </div>
              <button
                onClick={() => handleWhatsAppOrderCake()}
                className="w-full sm:w-auto bg-[#25D366] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-[#1fb855] transition-all"
              >
                <MessageCircle size={15} /> Send to Baker ({WHATSAPP_NUMBER})
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          MODAL 3: TIFFIN SUBSCRIPTION CUSTOMIZER
         ══════════════════════════════════════════════════ */}
      {isTiffinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#fcfaf7] w-full max-w-2xl rounded-[2.5rem] p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-[#e0d8ce] shadow-2xl relative">
            <button
              onClick={() => setIsTiffinModalOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white border border-[#e0d8ce] flex items-center justify-center text-gray-500 hover:text-black hover:scale-105 transition-all"
            >
              <X size={18} />
            </button>

            <div className="mb-6">
              <span className="text-[#a67c52] uppercase tracking-[0.2em] text-[10px] font-bold">
                Reaina's Daily Tiffin Service
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#3e3e3e] mt-1">
                Customize Your Tiffin Subscription
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Flexible plans: choose your meal schedule, roti type, and sabzi rotation. Delivered hot to your doorstep.
              </p>
            </div>

            <div className="space-y-5 mb-8">
              {/* Plan Choice */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#3e3e3e] block mb-2">
                  1. Select Your Tiffin Tier
                </label>
                <select
                  value={selectedTiffinPlan}
                  onChange={(e) => setSelectedTiffinPlan(e.target.value)}
                  className="w-full bg-white border border-[#e0d8ce] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#a67c52] text-[#3e3e3e]"
                >
                  <optgroup label="Student & Hostel Plans">
                    <option value="Mini Tiffin (₹1,599 / mo) - 4 Roti, Dal, Sabzi">Mini Tiffin (₹1,599 / mo) - 4 Roti, Dal, Sabzi</option>
                    <option value="Regular Tiffin (₹1,899 / mo) - 4 Roti, Dal, Sabzi, Rice">Regular Tiffin (₹1,899 / mo) - 4 Roti, Dal, Sabzi, Rice</option>
                    <option value="Healthy Tiffin (₹2,199 / mo) - 4 Roti, Dal, Sabzi, Rice, Curd/Salad">Healthy Tiffin (₹2,199 / mo) - 4 Roti, Dal, Sabzi, Rice, Curd/Salad</option>
                  </optgroup>
                  <optgroup label="Working Professional Plans">
                    <option value="Regular Home Tiffin (₹2,199 / mo) - Roti, Dal, Sabzi, Rice, Salad/Curd">Regular Home Tiffin (₹2,199 / mo) - Roti, Dal, Sabzi, Rice, Salad/Curd</option>
                    <option value="Special Home Tiffin (₹2,499 / mo) - Roti, Dal, Special Sabzi, Rice, Paneer/Chole">Special Home Tiffin (₹2,499 / mo) - Roti, Dal, Special Sabzi, Rice, Paneer/Chole</option>
                    <option value="Protein Tiffin (₹2,499 / mo) - Dal, Protein Source, Sabzi, Roti/Rice, Curd">Protein Tiffin (₹2,499 / mo) - Dal, Protein Source, Sabzi, Roti/Rice, Curd</option>
                  </optgroup>
                </select>
              </div>

              {/* Duration Frequency */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#3e3e3e] block mb-2">
                  2. Choose Subscription Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Monthly (26 Meals)", "Weekly Trial (6 Meals)", "Custom Days"].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setTiffinDuration(dur)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                        tiffinDuration === dur
                          ? "bg-[#18211b] text-white border-[#18211b]"
                          : "bg-white text-gray-700 border-[#e0d8ce] hover:border-[#a67c52]"
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Dietary Notes */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#3e3e3e] block mb-2">
                  3. Meal Preferences & Delivery Address Note
                </label>
                <textarea
                  rows={3}
                  value={tiffinCustomNotes}
                  onChange={(e) => setTiffinCustomNotes(e.target.value)}
                  placeholder="e.g. Extra roti, less spicy dal, preferred delivery time (Lunch 1 PM or Dinner 8 PM), hostel / flat address..."
                  className="w-full bg-white border border-[#e0d8ce] rounded-2xl p-4 text-xs sm:text-sm focus:outline-none focus:border-[#a67c52] text-[#3e3e3e]"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 bg-[#f8f5f2] rounded-2xl border border-[#e0d8ce] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[#3e3e3e]">Send subscription request to kitchen:</p>
                <p className="text-[11px] text-gray-500">We confirm meal start date & delivery slots on WhatsApp.</p>
              </div>
              <button
                onClick={() => handleWhatsAppSubscribeTiffin()}
                className="w-full sm:w-auto bg-[#25D366] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-[#1fb855] transition-all"
              >
                <MessageCircle size={15} /> Subscribe ({WHATSAPP_NUMBER})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FeaturesSection;


