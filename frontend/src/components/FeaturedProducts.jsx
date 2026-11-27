import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Utensils, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Phone, 
  MessageCircle, 
  ArrowRight, 
  Heart, 
  CheckCircle2, 
  X,
  ChefHat,
  Calendar,
  Layers,
  Flame,
  Award
} from "lucide-react";

const FeaturedMenus = () => {
  const [activeModal, setActiveModal] = useState(null); // 'food' | 'tiffin' | null

  return (
    <section className="bg-[#fcfaf8] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#e8dfd5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f3ede6] border border-[#e0d5c7] text-[#a67c52] text-[11px] font-bold tracking-[0.25em] uppercase mb-4 shadow-sm">
            <Sparkles size={12} className="text-[#a67c52]" />
            Signature Kitchen Offerings
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#3e3e3e] leading-tight">
            Taste the Warmth of <span className="italic text-[#a67c52]">Pure Home Food</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 font-sans leading-relaxed">
            Freshly prepared with authentic ingredients, hygiene, and love. Order your favorite homestyle meals or subscribe to daily tiffin delivered right to your doorstep.
          </p>
        </div>

        {/* 2 Aesthetic Menu Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">

          {/* ══════════════════════════════════════════════
              CARD 1: HOME-STYLE FOOD MENU
             ══════════════════════════════════════════════ */}
          <div className="group bg-white rounded-3xl border border-[#e8dfd5] shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col relative">
            
            {/* Top Image Banner */}
            <div className="relative h-64 sm:h-72 overflow-hidden bg-[#fdfaf7]">
              <img 
                src="/homestyle_food_menu.jpg" 
                alt="Reaina's Heaven Home-Style Food Menu" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Badges on Image */}
              <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                <span className="bg-white/95 backdrop-blur-md text-[#a67c52] font-black text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                  <ChefHat size={12} />
                  Home Kitchen
                </span>
                <span className="bg-green-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                  100% Veg
                </span>
              </div>

              {/* Title & Tagline on Image Banner */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-rose-200 mb-0.5">
                  Reaina's Heaven
                </p>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2">
                    Home-Style Food <Heart size={20} className="fill-rose-400 stroke-rose-400 inline" />
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-200 italic font-serif mt-1">
                  "Ghar jaisa swaad, pyaar se bana."
                </p>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between bg-white">
              
              {/* Highlight Pillars */}
              <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-[#fdfaf7] rounded-2xl border border-[#eee5da] mb-6 text-center">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Preparation</p>
                  <p className="text-xs font-bold text-[#3e3e3e] mt-0.5">Freshly Prepared</p>
                </div>
                <div className="border-x border-[#e8dfd5]">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Quality</p>
                  <p className="text-xs font-bold text-[#3e3e3e] mt-0.5">100% Hygienic</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Service</p>
                  <p className="text-xs font-bold text-[#3e3e3e] mt-0.5">Made To Order</p>
                </div>
              </div>

              {/* Menu Sections Summary */}
              <div className="space-y-4 mb-8">
                
                {/* Breakfast Corner */}
                <div className="p-3.5 rounded-2xl bg-[#faf7f4] border border-[#eee4d8] hover:border-[#a67c52]/40 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#a67c52] flex items-center gap-1.5">
                      <span>☀️</span> Breakfast Corner
                    </span>
                    <span className="text-[10px] font-semibold text-gray-500">Morning Specials</span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    Poha, Upma, Idli (4 pcs + Chutney), Plain & Masala Dosa, Onion/Veg Uttapam, Sabudana Khichdi
                  </p>
                </div>

                {/* Paratha Corner */}
                <div className="p-3.5 rounded-2xl bg-[#faf7f4] border border-[#eee4d8] hover:border-[#a67c52]/40 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#a67c52] flex items-center gap-1.5">
                      <span>🫓</span> Paratha Corner
                    </span>
                    <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                      Curd + Pickle Included
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    Aloo Paratha, Pyaz Paratha, Gobhi Paratha, Mix Veg Paratha, Paneer Paratha with Amul Butter
                  </p>
                </div>

                {/* Indian Thali */}
                <div className="p-3.5 rounded-2xl bg-[#faf7f4] border border-[#eee4d8] hover:border-[#a67c52]/40 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#a67c52] flex items-center gap-1.5">
                      <span>🍲</span> Indian Thali & Quick Bites
                    </span>
                    <span className="text-[10px] font-semibold text-gray-500">Full Meals & Snacks</span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    Mini Thali, Regular Thali, Special Thali, Paneer Thali, Bread Pakoda, Sandwiches, Maggi & Pasta
                  </p>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-5 border-t border-[#f0e8de] flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setActiveModal('food')}
                  className="flex-1 py-3 px-4 rounded-xl border border-[#a67c52] text-[#a67c52] hover:bg-[#a67c52] hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Utensils size={14} />
                  View Full Menu
                </button>
                <a
                  href="https://wa.me/919098967112?text=Hello%20Reaina's%20Heaven!%20I%20would%20like%20to%20order%20from%20your%20Home-Style%20Food%20Menu."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-green-500/20 flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={15} />
                  DM For Orders (9098967112)
                </a>
              </div>

            </div>
          </div>

          {/* ══════════════════════════════════════════════
              CARD 2: DAILY TIFFIN SERVICE
             ══════════════════════════════════════════════ */}
          <div className="group bg-white rounded-3xl border border-[#e8dfd5] shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col relative">
            
            {/* Top Image Banner */}
            <div className="relative h-64 sm:h-72 overflow-hidden bg-[#fdfaf7]">
              <img 
                src="/daily_tiffin_service.jpg" 
                alt="Reaina's Heaven Daily Tiffin Service" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Badges on Image */}
              <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                <span className="bg-[#b84a5b] text-white font-black text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                  <Calendar size={12} />
                  26 Meals / Month
                </span>
                <span className="bg-white/95 backdrop-blur-md text-[#3e3e3e] font-bold text-[10px] px-2.5 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                  Weekly & Monthly
                </span>
              </div>

              {/* Title & Tagline on Image Banner */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-amber-200 mb-0.5">
                  Reaina's Heaven
                </p>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2">
                    Daily Tiffin Service 🍱
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-200 italic font-serif mt-1">
                  "Ghar ka khana, ab doorstep par."
                </p>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between bg-white">
              
              {/* Highlight Pillars */}
              <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-[#fdfaf7] rounded-2xl border border-[#eee5da] mb-6 text-center">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Plan</p>
                  <p className="text-xs font-bold text-[#3e3e3e] mt-0.5">Student / Hosteller</p>
                </div>
                <div className="border-x border-[#e8dfd5]">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Starting</p>
                  <p className="text-xs font-bold text-green-700 mt-0.5">₹1,599 / mo</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Choice</p>
                  <p className="text-xs font-bold text-[#3e3e3e] mt-0.5">Custom Diet</p>
                </div>
              </div>

              {/* Tiffin Plans Summary */}
              <div className="space-y-4 mb-8">
                
                {/* Student & Hostel Plans */}
                <div className="p-3.5 rounded-2xl bg-[#faf7f4] border border-[#eee4d8] hover:border-[#a67c52]/40 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#a67c52] flex items-center gap-1.5">
                      <span>🎓</span> Student & Hostel Plans
                    </span>
                    <span className="text-[11px] font-bold text-green-700">From ₹1,599/mo</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex justify-between items-center">
                      <span>• Mini Tiffin (4 Roti, Dal, Sabzi)</span>
                      <span className="font-bold text-gray-800">₹1,599</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>• Regular Tiffin (+ Rice)</span>
                      <span className="font-bold text-gray-800">₹1,899</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>• Healthy Tiffin (+ Curd & Salad)</span>
                      <span className="font-bold text-gray-800">₹2,199</span>
                    </div>
                  </div>
                </div>

                {/* Working Professional Plans */}
                <div className="p-3.5 rounded-2xl bg-[#faf7f4] border border-[#eee4d8] hover:border-[#a67c52]/40 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#a67c52] flex items-center gap-1.5">
                      <span>💼</span> Working Professional Plans
                    </span>
                    <span className="text-[11px] font-bold text-green-700">From ₹2,199/mo</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex justify-between items-center">
                      <span>• Regular Home Tiffin (Meal + Salad/Curd)</span>
                      <span className="font-bold text-gray-800">₹2,199</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>• Special Home Tiffin (Paneer/Chole/Rajma)</span>
                      <span className="font-bold text-gray-800">₹2,499</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>• High Protein Tiffin (Diet Focused)</span>
                      <span className="font-bold text-gray-800">₹2,499</span>
                    </div>
                  </div>
                </div>

                {/* Custom Preference Tag */}
                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-amber-900 text-[11px] flex items-center gap-2">
                  <Heart size={14} className="text-amber-700 shrink-0 fill-amber-700" />
                  <span><strong>Customized to your taste:</strong> Choose your preferred Roti, Rice, Sabzi & Protein daily.</span>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-5 border-t border-[#f0e8de] flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setActiveModal('tiffin')}
                  className="flex-1 py-3 px-4 rounded-xl border border-[#a67c52] text-[#a67c52] hover:bg-[#a67c52] hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Calendar size={14} />
                  View All Plans
                </button>
                <a
                  href="https://wa.me/919098967112?text=Hello%20Reaina's%20Heaven!%20I%20want%20to%20subscribe%20to%20your%20Daily%20Tiffin%20Service.%20Please%20share%20details."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#b84a5b] hover:bg-[#9e3e4d] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-[#b84a5b]/20 flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={15} />
                  DM To Subscribe (9098967112)
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Quick Help Bar */}
        <div className="mt-12 bg-white rounded-2xl border border-[#e8dfd5] p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fdfaf7] border border-[#e8dfd5] flex items-center justify-center text-[#a67c52] shrink-0">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#3e3e3e]">Have customized meal requirements or party orders?</p>
              <p className="text-xs text-gray-500">Call or WhatsApp our kitchen directly for personalized menus.</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <a 
              href="tel:9098967112" 
              className="px-5 py-2.5 rounded-xl border border-gray-200 hover:border-[#a67c52] text-xs font-bold text-gray-700 hover:text-[#a67c52] transition-colors"
            >
              Call: +91 9098967112
            </a>
            <Link 
              to="/cafe" 
              className="px-5 py-2.5 rounded-xl bg-[#a67c52] hover:bg-[#8e6a45] text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
            >
              Explore Online Café Menu <ArrowRight size={13} />
            </Link>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════
          POPUP MODAL 1: FULL HOME-STYLE FOOD MENU
         ══════════════════════════════════════════════ */}
      {activeModal === 'food' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 border border-[#e8dfd5]">
            <button 
              onClick={() => setActiveModal(null)} 
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#a67c52]">Reaina's Heaven</span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#3e3e3e] mt-1 font-bold">
                Home-Style Food Menu ♡
              </h3>
              <p className="text-xs text-gray-500 italic mt-1 font-serif">"Ghar jaisa swaad, pyaar se bana."</p>
            </div>

            <div className="space-y-6 text-sm">
              {/* Breakfast Corner */}
              <div className="bg-[#fcfaf8] p-4 rounded-2xl border border-[#eee4d8]">
                <h4 className="font-bold text-[#a67c52] uppercase tracking-wider text-xs mb-3 flex items-center gap-1.5">
                  ☀️ Breakfast Corner
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                  <div>• Poha</div>
                  <div>• Upma</div>
                  <div>• Idli (4 pcs + Chutney)</div>
                  <div>• Plain Dosa</div>
                  <div>• Masala Dosa (+ Potato Masala)</div>
                  <div>• Onion Uttapam</div>
                  <div>• Veg Uttapam</div>
                  <div>• Masala Uttapam</div>
                  <div>• Sabudana Khichdi</div>
                </div>
              </div>

              {/* Paratha Corner */}
              <div className="bg-[#fcfaf8] p-4 rounded-2xl border border-[#eee4d8]">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-[#a67c52] uppercase tracking-wider text-xs flex items-center gap-1.5">
                    🫓 Paratha Corner
                  </h4>
                  <span className="text-[10px] text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full font-bold">
                    Served with Curd + Pickle
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                  <div>• Aloo Paratha</div>
                  <div>• Pyaz Paratha</div>
                  <div>• Gobhi Paratha</div>
                  <div>• Mix Veg Paratha</div>
                  <div>• Paneer Paratha</div>
                </div>
              </div>

              {/* Indian Thali */}
              <div className="bg-[#fcfaf8] p-4 rounded-2xl border border-[#eee4d8]">
                <h4 className="font-bold text-[#a67c52] uppercase tracking-wider text-xs mb-3 flex items-center gap-1.5">
                  🍲 Indian Thali
                </h4>
                <div className="space-y-2 text-xs text-gray-700">
                  <div className="p-2 rounded-xl bg-white border border-[#eee4d8]">
                    <span className="font-bold text-gray-900 block">Mini Thali</span>
                    <span className="text-gray-500">Roti • Dal • Seasonal Sabzi • Achar</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#eee4d8]">
                    <span className="font-bold text-gray-900 block">Regular Thali</span>
                    <span className="text-gray-500">Roti • Dal • Sabzi • Rice • Salad</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#eee4d8]">
                    <span className="font-bold text-gray-900 block">Special Thali</span>
                    <span className="text-gray-500">Roti • Dal • 2 Sabzi • Rice • Raita • Salad</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#eee4d8]">
                    <span className="font-bold text-gray-900 block">Paneer Thali</span>
                    <span className="text-gray-500">Roti • Dal • Paneer Sabzi • Rice • Raita • Salad</span>
                  </div>
                </div>
              </div>

              {/* Homemade Snacks & Quick Bites */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#fcfaf8] p-4 rounded-2xl border border-[#eee4d8]">
                  <h4 className="font-bold text-[#a67c52] uppercase tracking-wider text-xs mb-2">🥟 Homemade Snacks</h4>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Poha & Upma</li>
                    <li>• Sabudana Khichdi</li>
                    <li>• Bread Pakoda</li>
                    <li>• Aloo / Pyaz Pakoda</li>
                  </ul>
                </div>
                <div className="bg-[#fcfaf8] p-4 rounded-2xl border border-[#eee4d8]">
                  <h4 className="font-bold text-[#a67c52] uppercase tracking-wider text-xs mb-2">🍕 Quick Bites</h4>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Veg Maggi & Paneer Maggi</li>
                    <li>• Veg, Cheese & Paneer Sandwich</li>
                    <li>• Veg Pasta</li>
                    <li>• French Fries</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/919098967112?text=Hello%20Reaina's%20Heaven!%20I%20want%20to%20place%20an%20order%20from%20the%20Home-Style%20Food%20Menu."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5"
              >
                <MessageCircle size={15} /> DM on WhatsApp: 9098967112
              </a>
              <Link
                to="/cafe"
                onClick={() => setActiveModal(null)}
                className="flex-1 py-3 rounded-xl bg-[#a67c52] text-white text-xs font-bold uppercase tracking-wider text-center"
              >
                Order on Café Page
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          POPUP MODAL 2: FULL DAILY TIFFIN SERVICE DETAILS
         ══════════════════════════════════════════════ */}
      {activeModal === 'tiffin' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 border border-[#e8dfd5]">
            <button 
              onClick={() => setActiveModal(null)} 
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#b84a5b]">Reaina's Heaven</span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#3e3e3e] mt-1 font-bold">
                Daily Tiffin Service Plans 🍱
              </h3>
              <p className="text-xs text-gray-500 italic mt-1 font-serif">"Ghar ka khana, ab doorstep par."</p>
              <div className="inline-block bg-amber-50 text-amber-800 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-200 mt-2">
                26 Meals / Month • Weekly & Monthly Plans Available
              </div>
            </div>

            <div className="space-y-6 text-sm">
              {/* Student & Hostel Plans */}
              <div className="bg-[#fcfaf8] p-4 rounded-2xl border border-[#eee4d8]">
                <h4 className="font-bold text-[#b84a5b] uppercase tracking-wider text-xs mb-3 flex items-center gap-1.5">
                  🎓 Student & Hostel Plans
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-[#eee4d8] flex justify-between items-center">
                    <div>
                      <span className="font-bold text-gray-900 block text-sm">Mini Tiffin</span>
                      <span className="text-gray-500">4 Roti • Dal • Seasonal Sabzi</span>
                    </div>
                    <span className="text-base font-bold text-green-700">₹1,599 <span className="text-[10px] text-gray-400 font-normal">/ mo</span></span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#eee4d8] flex justify-between items-center">
                    <div>
                      <span className="font-bold text-gray-900 block text-sm">Regular Tiffin</span>
                      <span className="text-gray-500">4 Roti • Dal • Sabzi • Steamed Rice</span>
                    </div>
                    <span className="text-base font-bold text-green-700">₹1,899 <span className="text-[10px] text-gray-400 font-normal">/ mo</span></span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#eee4d8] flex justify-between items-center">
                    <div>
                      <span className="font-bold text-gray-900 block text-sm">Healthy Tiffin</span>
                      <span className="text-gray-500">4 Roti • Dal • Sabzi • Rice • Curd / Fresh Salad</span>
                    </div>
                    <span className="text-base font-bold text-green-700">₹2,199 <span className="text-[10px] text-gray-400 font-normal">/ mo</span></span>
                  </div>
                </div>
              </div>

              {/* Working Professional Plans */}
              <div className="bg-[#fcfaf8] p-4 rounded-2xl border border-[#eee4d8]">
                <h4 className="font-bold text-[#b84a5b] uppercase tracking-wider text-xs mb-3 flex items-center gap-1.5">
                  💼 Working Professional Plans
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-[#eee4d8] flex justify-between items-center">
                    <div>
                      <span className="font-bold text-gray-900 block text-sm">Regular Home Tiffin</span>
                      <span className="text-gray-500">Roti • Dal • Sabzi • Rice • Salad / Curd</span>
                    </div>
                    <span className="text-base font-bold text-green-700">₹2,199 <span className="text-[10px] text-gray-400 font-normal">/ mo</span></span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#eee4d8] flex justify-between items-center">
                    <div>
                      <span className="font-bold text-gray-900 block text-sm">Special Home Tiffin</span>
                      <span className="text-gray-500">Roti • Dal • Special Sabzi • Rice • Paneer / Chole / Rajma rotation • Curd / Salad</span>
                    </div>
                    <span className="text-base font-bold text-green-700">₹2,499 <span className="text-[10px] text-gray-400 font-normal">/ mo</span></span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#eee4d8] flex justify-between items-center">
                    <div>
                      <span className="font-bold text-gray-900 block text-sm">Protein Tiffin</span>
                      <span className="text-gray-500">Dal • High-Protein Source • Sabzi • Roti / Rice • Curd / Salad</span>
                    </div>
                    <span className="text-base font-bold text-green-700">₹2,499 <span className="text-[10px] text-gray-400 font-normal">/ mo</span></span>
                  </div>
                </div>
              </div>

              {/* Preference & Audience */}
              <div className="p-4 rounded-2xl bg-[#faf7f4] border border-[#eee4d8] text-xs text-gray-700">
                <p className="font-bold text-[#3e3e3e] mb-1">❤️ Customized According to Your Preference</p>
                <p className="text-gray-600 mb-3">Choose your preferred roti, rice, sabzi and protein according to your dietary goals.</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-white px-2.5 py-1 rounded-md border text-[11px] font-semibold text-gray-700">Students</span>
                  <span className="bg-white px-2.5 py-1 rounded-md border text-[11px] font-semibold text-gray-700">Hostellers & PG</span>
                  <span className="bg-white px-2.5 py-1 rounded-md border text-[11px] font-semibold text-gray-700">Working Professionals</span>
                  <span className="bg-white px-2.5 py-1 rounded-md border text-[11px] font-semibold text-gray-700">Everyday Food Lovers</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/919098967112?text=Hello%20Reaina's%20Heaven!%20I%20want%20to%20subscribe%20to%20the%20Daily%20Tiffin%20Service.%20Please%20guide%20me."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl bg-[#b84a5b] text-white text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5"
              >
                <MessageCircle size={15} /> DM on WhatsApp: 9098967112
              </a>
              <a
                href="tel:9098967112"
                className="flex-1 py-3 rounded-xl border border-gray-300 hover:border-[#a67c52] text-gray-700 hover:text-[#a67c52] text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5"
              >
                <Phone size={14} /> Call: 9098967112
              </a>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default FeaturedMenus;
