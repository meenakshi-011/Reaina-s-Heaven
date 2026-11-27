import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Utensils, 
  Cake, 
  Zap, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  Phone, 
  ArrowRight, 
  Calendar,
  X,
  MessageCircle,
  ShoppingBag
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import ProductsFooter from "../components/ProductsFooter";

const Services = () => {
  const { hash } = useLocation();
  const [selectedServiceForModal, setSelectedServiceForModal] = useState(null);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    phone: "",
    area: "Ranjhi, Jabalpur",
    serviceType: "Tiffin Services",
    planDuration: "Monthly Subscription",
    details: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Smooth scroll to hash anchor on load
  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  const handleOpenModal = (serviceType) => {
    setInquiryForm((prev) => ({ ...prev, serviceType }));
    setSelectedServiceForModal(serviceType);
    setSubmitted(false);
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiryForm.name.trim() || !inquiryForm.phone.trim()) {
      toast.error("Please enter your name and mobile number.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("✨ Inquiry received! Our team will contact you shortly.");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f8f5f2] text-[#3e3e3e]">
      <Navbar />

      {/* ── HERO BANNER ─────────────────── */}
      <section className="relative overflow-hidden bg-[#e8e2d9] py-20 lg:py-28 px-6 text-center">
        {/* Soft botanical decorative elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-white/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#c8a97e]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/60 border border-[#a67c52]/30 text-xs font-bold uppercase tracking-[0.25em] text-[#a67c52] mb-6 shadow-sm">
            <Sparkles size={14} /> Reaina's Haven Speciality Services
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#3e3e3e] leading-tight mb-6">
            Bespoke Culinary & <br />
            <span className="text-green-800 italic">Delivery Services</span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            From wholesome daily home-style tiffins to celebratory artisan cakes and 30-minute instant gourmet food delivery across Jabalpur, we are dedicated to serving you freshness and love.
          </p>

          {/* Quick jump navigation pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#tiffin"
              className="px-5 py-2.5 rounded-full bg-white border border-[#d4c4b0] text-xs font-bold text-[#3e3e3e] hover:border-[#a67c52] hover:text-[#a67c52] shadow-sm transition-all flex items-center gap-2"
            >
              <Utensils size={14} className="text-[#a67c52]" />
              🍱 Tiffin Services
            </a>
            <a
              href="#cakes"
              className="px-5 py-2.5 rounded-full bg-white border border-[#d4c4b0] text-xs font-bold text-[#3e3e3e] hover:border-[#a67c52] hover:text-[#a67c52] shadow-sm transition-all flex items-center gap-2"
            >
              <Cake size={14} className="text-[#a67c52]" />
              🎂 Cakes Services
            </a>
            <a
              href="#instant-delivery"
              className="px-5 py-2.5 rounded-full bg-white border border-[#d4c4b0] text-xs font-bold text-[#3e3e3e] hover:border-[#a67c52] hover:text-[#a67c52] shadow-sm transition-all flex items-center gap-2"
            >
              <Zap size={14} className="text-[#a67c52]" />
              ⚡ Instant Food Delivery
            </a>
          </div>
        </div>
      </section>

      {/* ── CORE SERVICES ────────────────── */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-28">

        {/* 1. TIFFIN SERVICES */}
        <div id="tiffin" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a67c52] bg-amber-50 border border-amber-200/60 px-3 py-1 rounded-full mb-4">
              <Utensils size={13} />
              Daily Homestyle Meal Subscriptions
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#3e3e3e] mb-4">
              Authentic Tiffin Services
            </h2>
            <div className="w-20 h-1 bg-[#a67c52] mb-6 rounded-full" />
            <p className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">
              Say goodbye to unhygienic mess food and daily cooking hassles. Reaina’s Haven delivers pure, wholesome, home-cooked meals right to your office desk or home doorstep in Jabalpur. Cooked with premium ingredients, zero artificial additives, and minimal cold-pressed oils.
            </p>

            {/* Meal Thali Composition */}
            <div className="bg-white p-5 rounded-2xl border border-[#e0d8ce] mb-6 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#a67c52] mb-3">
                What's in Every Daily Dabba:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-gray-700 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a67c52]" /> 4 Soft Desi Rotis
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a67c52]" /> Dal Tadka / Makhani
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a67c52]" /> Seasonal Sabzi
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a67c52]" /> Jeera / Basmati Rice
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a67c52]" /> Fresh Crisp Salad
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a67c52]" /> Daily Sweet Surprise
                </div>
              </div>
            </div>

            {/* Plans summary */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-[#fdfaf7] border border-[#e0d8ce] p-3.5 rounded-xl text-center">
                <span className="text-[10px] font-bold uppercase text-gray-400 block">Trial Dabba</span>
                <span className="text-lg font-serif font-bold text-[#a67c52]">₹119</span>
                <span className="text-[10px] text-gray-500 block">Single meal test</span>
              </div>
              <div className="bg-[#fdfaf7] border border-[#a67c52]/40 p-3.5 rounded-xl text-center shadow-sm">
                <span className="text-[10px] font-bold uppercase text-[#a67c52] block">Weekly Flexi</span>
                <span className="text-lg font-serif font-bold text-[#3e3e3e]">₹699</span>
                <span className="text-[10px] text-gray-500 block">6 days lunch/dinner</span>
              </div>
              <div className="bg-green-50 border border-green-200 p-3.5 rounded-xl text-center">
                <span className="text-[10px] font-bold uppercase text-green-800 block">Monthly Pro</span>
                <span className="text-lg font-serif font-bold text-green-900">₹2,799</span>
                <span className="text-[10px] text-green-700 block">26 days with free delivery</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleOpenModal("Tiffin Services")}
                className="px-7 py-3 bg-[#a67c52] hover:bg-[#3e3e3e] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <span>Book / Inquire Tiffin</span>
                <ArrowRight size={14} />
              </button>
              <a
                href="https://wa.me/919876543210?text=Hi%20Reaina's%20Haven,%20I%20am%20interested%20in%20your%20Daily%20Tiffin%20Services%20in%20Jabalpur."
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-white hover:bg-gray-50 border border-[#d4c4b0] text-gray-700 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <MessageCircle size={14} className="text-green-600" />
                WhatsApp Menu
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative group">
              <img
                src="/aesthetic_indian_thali.jpg"
                alt="Aesthetic Royal Indian Homestyle Thali"
                className="w-full h-[420px] sm:h-[480px] object-cover rounded-[2.5rem] shadow-xl group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#3e3e3e]">On-Time Delivery Windows</p>
                  <p className="text-[11px] text-gray-500">Lunch: 12:30 PM - 2:00 PM | Dinner: 7:30 PM - 9:00 PM</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs shrink-0">
                  <Clock size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. CAKES SERVICES */}
        <div id="cakes" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6">
            <div className="relative group">
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop"
                alt="Custom Celebration Cakes"
                className="w-full h-[420px] sm:h-[480px] object-cover rounded-[2.5rem] shadow-xl group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute top-6 left-6 bg-[#3e3e3e]/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md">
                <Sparkles size={14} className="text-amber-400" />
                100% Pure Eggless
              </div>
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#3e3e3e]">Midnight Surprise Delivery</p>
                  <p className="text-[11px] text-gray-500">Available 11:30 PM – 12:15 AM across Jabalpur</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-xs shrink-0">
                  <Cake size={16} />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a67c52] bg-rose-50 border border-rose-200/60 px-3 py-1 rounded-full mb-4">
              <Cake size={13} />
              Artisan Bakery & Celebration Cakes
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#3e3e3e] mb-4">
              Custom Cake Services
            </h2>
            <div className="w-20 h-1 bg-[#a67c52] mb-6 rounded-full" />
            <p className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">
              Make life's sweetest milestones unforgettable. Our master bakers handcraft breathtaking celebration cakes using pure Belgian chocolates, real French butter, and farm-fresh berries. Whether it's a tiered wedding masterpiece or an intimate birthday cake, we bring your dream design to life.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#e0d8ce]">
                <CheckCircle2 size={16} className="text-green-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-[#3e3e3e] block">Bespoke Themes & Tiered Designs</span>
                  <span className="text-[11px] text-gray-500">Vintage Lambeth piping, fresh floral naked cakes, bento cakes & custom fondants.</span>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#e0d8ce]">
                <CheckCircle2 size={16} className="text-green-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-[#3e3e3e] block">Gourmet Flavor Repertoire</span>
                  <span className="text-[11px] text-gray-500">Belgian Dark Truffle, Lotus Biscoff Crunch, Blueberry Lavender, Dutch Cocoa & Raspberry.</span>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#e0d8ce]">
                <CheckCircle2 size={16} className="text-green-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-[#3e3e3e] block">Complimentary Celebration Kit</span>
                  <span className="text-[11px] text-gray-500">Handwritten personalized message card, golden cake topper, candle set & cake knife.</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/cafe?search=cake"
                className="px-7 py-3 bg-[#a67c52] hover:bg-[#3e3e3e] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <ShoppingBag size={14} />
                <span>Explore Cake Menu</span>
              </Link>
              <button
                onClick={() => handleOpenModal("Custom Cakes Services")}
                className="px-6 py-3 bg-white hover:bg-gray-50 border border-[#d4c4b0] text-gray-700 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <span>Inquire Custom Cake</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* 3. INSTANT FOOD DELIVERY */}
        <div id="instant-delivery" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-800 bg-green-50 border border-green-200/60 px-3 py-1 rounded-full mb-4">
              <Zap size={13} />
              30-45 Mins Express Cloud Kitchen
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#3e3e3e] mb-4">
              Instant Food Delivery
            </h2>
            <div className="w-20 h-1 bg-[#a67c52] mb-6 rounded-full" />
            <p className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">
              Hungry right now? Enjoy gourmet café delights freshly prepared on order and delivered piping hot to your doorstep across Jabalpur in 30 to 45 minutes. From sourdough grilled melts to creamy pasta and artisanal shakes, your comfort meal is just a click away.
            </p>

            {/* Quick Speed Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <div className="bg-white p-3.5 rounded-xl border border-[#e0d8ce] text-center">
                <span className="text-2xl mb-1 block">⏱️</span>
                <span className="text-xs font-bold text-[#3e3e3e] block">30–45 Mins</span>
                <span className="text-[10px] text-gray-500">Express dispatch</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-[#e0d8ce] text-center">
                <span className="text-2xl mb-1 block">🍳</span>
                <span className="text-xs font-bold text-[#3e3e3e] block">100% Fresh</span>
                <span className="text-[10px] text-gray-500">Cooked on order</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-[#e0d8ce] text-center">
                <span className="text-2xl mb-1 block">📍</span>
                <span className="text-xs font-bold text-[#3e3e3e] block">Live Status</span>
                <span className="text-[10px] text-gray-500">Real-time updates</span>
              </div>
            </div>

            <ul className="space-y-2.5 mb-8 text-xs text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-[#a67c52] font-bold">✔</span> Gourmet Pastas: Creamy Alfredo, Spicy Arrabiata & Pink Sauce Penne
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#a67c52] font-bold">✔</span> Sourdough Grilled Melts, Artisan Burgers & Thin-Crust Pizzas
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#a67c52] font-bold">✔</span> Fresh Brownies, Cookies, Iced Lattes & Belgian Shakes
              </li>
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/cafe"
                className="px-7 py-3 bg-green-800 hover:bg-green-900 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <Zap size={14} />
                <span>Order Food Now (Express)</span>
              </Link>
              <Link
                to="/orders"
                className="px-6 py-3 bg-white hover:bg-gray-50 border border-[#d4c4b0] text-gray-700 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <span>Track My Order</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative group">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop"
                alt="Instant Gourmet Food Delivery"
                className="w-full h-[420px] sm:h-[480px] object-cover rounded-[2.5rem] shadow-xl group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute top-6 right-6 bg-green-700 text-white px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md">
                <Zap size={14} />
                Cloud Kitchen Active
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ── WHY CHOOSE REAINA'S HAVEN ─────────────────── */}
      <section className="bg-white border-y border-[#e0d8ce] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#a67c52] block mb-2">Our Promise</span>
            <h3 className="text-3xl font-serif text-[#3e3e3e]">Why Jabalpur Loves Our Services</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#fdfaf7] border border-[#e0d8ce]/60 text-center">
              <div className="w-12 h-12 rounded-full bg-[#f0e8dc] text-[#a67c52] flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                🌿
              </div>
              <h4 className="font-serif font-bold text-lg text-[#3e3e3e] mb-2">Hygienic Cloud Kitchen</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Prepared in a sanitized environment with RO-filtered water, daily fresh vegetable procurement, and strict temperature protocols.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fdfaf7] border border-[#e0d8ce]/60 text-center">
              <div className="w-12 h-12 rounded-full bg-[#f0e8dc] text-[#a67c52] flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                🍱
              </div>
              <h4 className="font-serif font-bold text-lg text-[#3e3e3e] mb-2">Eco-Insulated Packaging</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Spill-proof, airtight containers that lock in heat and freshness without the harmful chemical leaching of cheap plastic.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fdfaf7] border border-[#e0d8ce]/60 text-center">
              <div className="w-12 h-12 rounded-full bg-[#f0e8dc] text-[#a67c52] flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                ⚡
              </div>
              <h4 className="font-serif font-bold text-lg text-[#3e3e3e] mb-2">Prompt Doorstep Service</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Our in-house delivery fleet ensures your tiffins, birthday cakes, and evening snacks arrive precisely on schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONSULTATION CTA ─────────────── */}
      <section className="bg-green-800 py-16 px-6 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-serif mb-4">Have a Special Event or Custom Requirement?</h2>
        <p className="text-white/80 max-w-xl mx-auto mb-8 text-sm sm:text-base">
          From corporate lunch meal plans to grand multi-tiered wedding cakes, we are here to tailor everything to your taste.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => handleOpenModal("Tiffin Services")}
            className="bg-[#c8a97e] hover:bg-[#a67c52] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-xl transition-all duration-300 active:scale-95"
          >
            Inquire Now
          </button>
          <a
            href="https://wa.me/919876543210?text=Hello%20Reaina's%20Haven,%20I%20have%20an%20inquiry%20regarding%20your%20services."
            target="_blank"
            rel="noreferrer"
            className="bg-white/10 hover:bg-white/20 border border-white/40 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <MessageCircle size={15} />
            Chat on WhatsApp
          </a>
        </div>
      </section>

      <ProductsFooter />

      {/* ── INQUIRY & BOOKING MODAL ─────────────────── */}
      {selectedServiceForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e0d8ce]">
            <button
              onClick={() => setSelectedServiceForModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X size={18} />
            </button>

            {submitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-serif text-[#3e3e3e] mb-2">Inquiry Sent Successfully!</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Thank you! Our kitchen & culinary team has received your request for <b>{selectedServiceForModal}</b> and will call you within 30 minutes.
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href={`https://wa.me/919876543210?text=Hi%20Reaina's%20Haven,%20I%20just%20submitted%20an%20inquiry%20for%20${encodeURIComponent(selectedServiceForModal)}.%20My%20name%20is%20${encodeURIComponent(inquiryForm.name)}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} />
                    Confirm Immediately via WhatsApp
                  </a>
                  <button
                    onClick={() => setSelectedServiceForModal(null)}
                    className="w-full py-2.5 text-xs text-gray-500 hover:text-gray-700 font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a67c52] mb-1">
                  <span>✨ Service Booking & Inquiry</span>
                </div>
                <h3 className="text-2xl font-serif text-[#3e3e3e] mb-1">
                  {selectedServiceForModal}
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  Fill in your details below and we will tailor the best service plan for you in Jabalpur.
                </p>

                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#3e3e3e] block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4c4b0] text-sm focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#3e3e3e] block mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit number"
                        value={inquiryForm.phone}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4c4b0] text-sm focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#3e3e3e] block mb-1">
                        Area in Jabalpur *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ranjhi / Civil Lines"
                        value={inquiryForm.area}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, area: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4c4b0] text-sm focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#3e3e3e] block mb-1">
                      {selectedServiceForModal === "Tiffin Services" ? "Preferred Plan" : "Requirement Details"}
                    </label>
                    {selectedServiceForModal === "Tiffin Services" ? (
                      <select
                        value={inquiryForm.planDuration}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, planDuration: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4c4b0] text-sm focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30 bg-white"
                      >
                        <option value="Trial Single Box">Trial Dabba (₹119 / meal)</option>
                        <option value="Weekly Lunch">Weekly Lunch Plan (6 Days - ₹699)</option>
                        <option value="Weekly Dinner">Weekly Dinner Plan (6 Days - ₹699)</option>
                        <option value="Monthly Lunch">Monthly Lunch Subscription (26 Days - ₹2,799)</option>
                        <option value="Monthly Both">Monthly Both Lunch & Dinner (26 Days - ₹5,299)</option>
                      </select>
                    ) : (
                      <textarea
                        rows={3}
                        placeholder={
                          selectedServiceForModal === "Custom Cakes Services"
                            ? "Tell us about the occasion, weight (0.5kg/1kg/2kg), flavor preference, date and delivery time..."
                            : "Any special preferences, quantity, or instructions..."
                        }
                        value={inquiryForm.details}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, details: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4c4b0] text-sm focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                      />
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-[#a67c52] hover:bg-[#3e3e3e] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50 mt-2"
                  >
                    {submitting ? "Submitting Inquiry..." : "Submit Inquiry"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;