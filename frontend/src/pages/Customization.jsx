import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductsFooter from '../components/ProductsFooter';
import {
  Palette, Flower2, Gift, MessageSquare, Calendar,
  ChevronRight, Clock, Package, Sparkles, AlertCircle,
  BookOpen, Coffee, Heart, Phone,
} from 'lucide-react';

const options = [
  {
    icon: <Flower2 size={28} className="text-[#a67c52]" />,
    title: 'Custom Bouquets',
    badge: 'Most Popular',
    badgeColor: 'bg-green-100 text-green-700',
    desc: 'Choose your blooms, colour palette, wrap style, and message. Our florists will craft a one-of-a-kind arrangement for your occasion.',
    options: [
      'Preferred flowers / colour theme',
      'Bouquet size — Small, Medium, Large, Grand',
      'Wrapping style — Kraft, Silk, Rustic, Luxury',
      'Add-ons — ribbons, dried flowers, baby\'s breath',
      'Personal message card (free)',
    ],
    leadTime: '24 hours in advance',
    extraCost: 'No extra charge for colour requests',
  },
  {
    icon: <Gift size={28} className="text-[#a67c52]" />,
    title: 'Custom Gift Hampers',
    badge: 'Great for Gifting',
    badgeColor: 'bg-[#a67c52]/10 text-[#a67c52]',
    desc: 'Mix and match from our full catalog — flowers, books, cafe goods, candles — to build a completely personalized hamper.',
    options: [
      'Choose items: flowers + books + cafe goods + candles',
      'Choose box style — Luxury kraft, Wicker basket, Premium tote',
      'Add custom tissue paper, shredded filler, sticker seals',
      'Custom printed label with recipient\'s name',
      'Heartfelt message card (free)',
    ],
    leadTime: '48 hours in advance',
    extraCost: 'Custom label & premium box: +₹99–₹199',
  },
  {
    icon: <Coffee size={28} className="text-[#a67c52]" />,
    title: 'Custom Cafe Orders',
    badge: 'Bespoke Bakes',
    badgeColor: 'bg-orange-100 text-orange-700',
    desc: 'Order custom bakes, cakes, or specialty food items for events — with dietary preferences, custom flavours, and special decoration.',
    options: [
      'Flavor customization (chocolate, red velvet, vanilla, etc.)',
      'Dietary needs — eggless, vegan, gluten-free, sugar-free',
      'Custom text or design on cakes / brownies',
      'Bulk event orders (10+ units)',
      'Theme-based decoration',
    ],
    leadTime: '48–72 hours in advance',
    extraCost: 'Depends on complexity; quoted individually',
  },
  {
    icon: <BookOpen size={28} className="text-[#a67c52]" />,
    title: 'Curated Book Packs',
    badge: 'For Book Lovers',
    badgeColor: 'bg-blue-100 text-blue-700',
    desc: 'Let us curate a hand-picked selection of books based on a theme, genre, or person\'s personality — perfect as a thoughtful gift.',
    options: [
      'Genre preference — fiction, self-help, wellness, art',
      'Reading level — beginner, intermediate, advanced',
      'Theme — travel, healing, romance, leadership, etc.',
      'Recipient personality brief (optional)',
      'Custom book marks or sticky note packs add-on',
    ],
    leadTime: '24–48 hours',
    extraCost: 'Curated pack note card: free',
  },
];

const process = [
  {
    step: '01',
    icon: <MessageSquare size={20} className="text-[#a67c52]" />,
    title: 'Tell Us Your Vision',
    desc: 'Use the "Special Instructions" field at checkout, or reach out via our Contact page or WhatsApp. Share as much detail as possible — occasion, colour preferences, dietary needs, recipient personality, budget.',
  },
  {
    step: '02',
    icon: <Phone size={20} className="text-[#a67c52]" />,
    title: 'We\'ll Consult With You',
    desc: 'For complex or high-value custom orders, a team member will call or WhatsApp you within 4 business hours to confirm details, share design concepts (if applicable), and finalize your quote.',
  },
  {
    step: '03',
    icon: <Calendar size={20} className="text-[#a67c52]" />,
    title: 'Confirm & Advance Payment',
    desc: 'Custom orders above ₹1,000 require a 50% advance via Razorpay (UPI, card, netbanking). The remaining 50% is collected at delivery. This ensures your slot and materials are reserved.',
  },
  {
    step: '04',
    icon: <Sparkles size={20} className="text-[#a67c52]" />,
    title: 'We Craft With Love',
    desc: 'Our artisans, florists, and bakers get to work creating your personalized order. You\'ll receive a progress photo (for orders above ₹2,000) via WhatsApp before we finalize.',
  },
  {
    step: '05',
    icon: <Package size={20} className="text-[#a67c52]" />,
    title: 'Delivery or Pickup',
    desc: 'Your custom order is carefully packaged and delivered on your chosen date. You can also pick it up from our Ranjhi store — we\'ll have it beautifully wrapped and ready.',
  },
];

const faqs = [
  {
    q: 'How far in advance should I place a custom order?',
    a: 'For bouquets, at least 24 hours. For hampers and custom bakes, 48–72 hours. For large events or weddings, please reach out at least 1 week in advance.',
  },
  {
    q: 'Can I request a budget for a custom hamper?',
    a: 'Absolutely! Just tell us your budget and occasion — we\'ll build the best possible hamper within your price range.',
  },
  {
    q: 'Is there a minimum order value for custom orders?',
    a: 'There\'s no minimum for custom bouquets. For custom hampers and event orders, a minimum of ₹500 applies.',
  },
  {
    q: 'Are custom orders refundable?',
    a: 'Unfortunately, custom/personalized orders are non-refundable once production has started. However, if the final product is significantly different from what was agreed, we\'ll work with you to fix it.',
  },
  {
    q: 'Can I add a photo or printed element to my order?',
    a: 'Yes! We offer custom printed labels and message cards. For photo frames or printed photo add-ons, contact us directly and we\'ll guide you on the best options.',
  },
  {
    q: 'Do you handle corporate or bulk customization?',
    a: 'Yes — corporate gifting with custom branding, logos, and bulk quantities is available. Email corporate@rainashaven.com for a dedicated quote.',
  },
];

const Customization = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-[#f8f5f2] flex flex-col">
      <Navbar />

      {/* ── HERO ──────────────────────────────────── */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 right-8 w-80 h-80 bg-[#c8a97e]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-64 bg-green-800/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block bg-[#a67c52]/10 text-[#a67c52] uppercase tracking-[0.2em] text-xs font-bold px-4 py-2 rounded-full mb-6">
            Make It Yours
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-[#3e3e3e] mb-6 leading-tight">
            Customization{' '}
            <span className="text-green-800 italic">Guide</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Every order at Reaina's Haven can be made uniquely yours. From flower
            colours to hamper contents to custom bakes — here's everything you need to
            know about personalizing your order.
          </p>
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            <Link to="/contactus" className="bg-[#a67c52] text-white px-7 py-3 rounded-full font-bold hover:bg-[#3e3e3e] transition-all shadow-lg">
              Start a Custom Order →
            </Link>
            <Link to="/products" className="bg-white text-[#3e3e3e] border border-[#e0d8ce] px-7 py-3 rounded-full font-bold hover:border-[#a67c52] hover:text-[#a67c52] transition-all">
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      {/* ── CUSTOMIZATION OPTIONS ─────────────────── */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#a67c52] uppercase tracking-widest text-xs font-bold block mb-3">What We Can Customize</span>
            <h2 className="text-3xl font-serif text-[#3e3e3e]">Pick Your Personalization</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {options.map((opt, i) => (
              <div key={i} className="bg-white rounded-[2rem] border border-[#e0d8ce] p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 bg-[#f8f5f2] rounded-2xl flex items-center justify-center">
                    {opt.icon}
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${opt.badgeColor}`}>{opt.badge}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#3e3e3e] mb-3">{opt.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{opt.desc}</p>

                <div className="mb-5">
                  <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider mb-3">You Can Customize</p>
                  <ul className="space-y-2">
                    {opt.options.map((o, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 bg-[#a67c52] rounded-full shrink-0" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-4 pt-5 border-t border-[#f0ebe4]">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#a67c52]" />
                    <span className="text-xs text-gray-500">Lead time: <strong className="text-[#3e3e3e]">{opt.leadTime}</strong></span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">💡 {opt.extraCost}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────── */}
      <section className="px-6 pb-16 bg-white">
        <div className="max-w-4xl mx-auto py-16">
          <div className="text-center mb-12">
            <span className="text-[#a67c52] uppercase tracking-widest text-xs font-bold block mb-3">How It Works</span>
            <h2 className="text-3xl font-serif text-[#3e3e3e]">The Custom Order Process</h2>
          </div>
          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-[#e0d8ce] hidden md:block" />
            <div className="space-y-8">
              {process.map((p, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="relative z-10 w-12 h-12 bg-[#a67c52] rounded-full flex items-center justify-center shrink-0 shadow-md">
                    <span className="text-white font-bold text-sm">{p.step}</span>
                  </div>
                  <div className="bg-[#f8f5f2] rounded-3xl p-6 flex-1 border border-[#e0d8ce]">
                    <div className="flex items-center gap-2 mb-2">
                      {p.icon}
                      <h3 className="font-serif font-bold text-[#3e3e3e]">{p.title}</h3>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPORTANT TIPS ────────────────────────── */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#a67c52] uppercase tracking-widest text-xs font-bold block mb-3">Pro Tips</span>
            <h2 className="text-3xl font-serif text-[#3e3e3e]">Tips for the Best Custom Order</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: '🌸', tip: 'Order early for peak seasons', body: 'Valentine\'s Day, Mother\'s Day, Diwali, and New Year slots fill up fast. Book at least 72 hours in advance.' },
              { icon: '📸', tip: 'Share reference photos', body: 'A picture is worth a thousand words. Send us reference photos of colour palettes or styles you love.' },
              { icon: '💬', tip: 'Be specific about your occasion', body: 'Telling us the occasion (birthday, anniversary, condolence) helps us tailor the arrangement perfectly.' },
              { icon: '💰', tip: 'Mention your budget upfront', body: 'We\'ll work our magic within your budget. Don\'t be shy — there\'s something beautiful for every price point.' },
              { icon: '🌿', tip: 'Ask about seasonal flowers', body: 'Seasonal blooms are fresher and more affordable. Ask us what\'s in season for the best results.' },
              { icon: '📅', tip: 'Plan ahead for events', body: 'For weddings, corporate events, or large parties, contact us at least 1–2 weeks in advance.' },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-3xl border border-[#e0d8ce] p-6 flex gap-4 hover:shadow-md transition-shadow">
                <span className="text-3xl shrink-0">{t.icon}</span>
                <div>
                  <p className="font-semibold text-[#3e3e3e] mb-1">{t.tip}</p>
                  <p className="text-gray-500 text-sm">{t.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CUSTOM FAQ ────────────────────────────── */}
      <section className="px-6 pb-16 bg-white">
        <div className="max-w-4xl mx-auto py-16">
          <div className="text-center mb-10">
            <span className="text-[#a67c52] uppercase tracking-widest text-xs font-bold block mb-3">Questions</span>
            <h2 className="text-3xl font-serif text-[#3e3e3e]">Customization FAQs</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-3xl border border-[#e0d8ce] overflow-hidden bg-[#f8f5f2]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-7 py-5 flex items-center justify-between text-left"
                >
                  <span className="font-serif font-semibold text-[#3e3e3e]">{f.q}</span>
                  <ChevronRight size={18} className={`text-[#a67c52] transition-transform duration-300 shrink-0 ml-4 ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                <div className={`px-7 transition-all duration-300 ease-in-out ${openFaq === i ? 'pb-5 max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                  <p className="text-gray-600 text-sm leading-relaxed border-t border-[#e0d8ce] pt-4">{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOTICE ────────────────────────────────── */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 bg-amber-50 border border-amber-200 rounded-3xl p-6 mb-10">
            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={22} />
            <div>
              <p className="font-semibold text-amber-800 mb-1">Please Note</p>
              <p className="text-amber-700 text-sm leading-relaxed">
                Custom and personalized orders cannot be cancelled or refunded once production has started. Please review your order details carefully before confirming. A 50% advance is non-refundable for all custom orders.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-[#3e3e3e] to-[#2d2d2d] rounded-[2rem] p-10 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <Palette size={300} className="absolute -right-10 -bottom-10" />
            </div>
            <Heart size={32} className="text-[#c8a97e] mx-auto mb-4" />
            <h3 className="text-2xl font-serif mb-3">Ready to Create Something Special?</h3>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              Tell us your dream — we'll bring it to life with care, creativity, and a whole lot of love.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/contactus" className="bg-[#a67c52] text-white px-7 py-3 rounded-full font-bold hover:bg-[#c8a97e] transition-all shadow-lg">
                Start Custom Order
              </Link>
              <Link to="/faq" className="bg-white/10 text-white border border-white/20 px-7 py-3 rounded-full font-bold hover:bg-white/20 transition-all">
                View FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ProductsFooter />
    </div>
  );
};

export default Customization;
