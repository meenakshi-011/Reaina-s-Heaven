import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductsFooter from '../components/ProductsFooter';
import { ChevronDown, HelpCircle, MessageCircle, Flower2, ShoppingBag, Truck, RotateCcw, Palette } from 'lucide-react';

const categories = [
  { id: 'all',          label: 'All Questions',        icon: <HelpCircle size={16} /> },
  { id: 'products',     label: 'Products & Cafe',       icon: <ShoppingBag size={16} /> },
  { id: 'flowers',      label: 'Flowers & Bouquets',    icon: <Flower2 size={16} /> },
  { id: 'delivery',     label: 'Delivery & Shipping',   icon: <Truck size={16} /> },
  { id: 'returns',      label: 'Returns & Refunds',     icon: <RotateCcw size={16} /> },
  { id: 'custom',       label: 'Customization',         icon: <Palette size={16} /> },
];

const faqs = [
  // ── PRODUCTS & CAFE ──────────────────────────────────────────────────
  {
    category: 'products',
    question: 'Are your cafe goods really 100% handmade?',
    answer:
      'Yes! Every single item in our cafe menu — from brownies to artisanal breads — is handcrafted in our cloud kitchen. We never use commercial pre-mixes or artificial preservatives. All ingredients are sourced fresh daily from trusted local suppliers.',
  },
  {
    category: 'products',
    question: 'Do you offer healthy versions of your desserts?',
    answer:
      'Absolutely. We specialize in "Healthy Versions" of classic treats using alternative flours (oats, almond, whole wheat) and natural sweeteners like jaggery and dates. Every healthy item is clearly labelled on our cafe menu. Feel free to ask us for ingredient details before ordering.',
  },
  {
    category: 'products',
    question: 'Can I get the full ingredient list for a cafe item?',
    answer:
      'Transparency is our priority. Complete ingredient details are included with every generated invoice for cafe items. If you have a specific allergy or dietary requirement, please reach out to us via the Contact Us page before placing your order — we\'ll happily accommodate you.',
  },
  {
    category: 'products',
    question: 'Do your cafe products contain nuts or dairy?',
    answer:
      'Some items do contain nuts, dairy, or gluten. Each product page on our cafe menu notes key allergens. For severe allergies, we strongly recommend contacting us directly before ordering so we can advise on safe choices or prepare allergen-free alternatives.',
  },
  {
    category: 'products',
    question: 'What books do you stock? Can I request a title?',
    answer:
      'Our Books section features curated titles across fiction, self-help, wellness, and art. We hand-pick every title based on quality and reader joy. If you\'re looking for a specific book, message us and we\'ll do our best to source it for you or add it to our next collection.',
  },
  // ── FLOWERS & BOUQUETS ───────────────────────────────────────────────
  {
    category: 'flowers',
    question: 'What types of flowers do you offer?',
    answer:
      'We offer a curated selection of seasonal blooms, exotic imported flowers, and signature handcrafted bouquets. Our range includes roses, lilies, gerberas, orchids, sunflowers, and mixed seasonal arrangements. Each bouquet is freshly assembled by our in-house florists on the day of delivery.',
  },
  {
    category: 'flowers',
    question: 'How long will my flowers stay fresh?',
    answer:
      'Under proper care, most of our arrangements stay fresh for 5–7 days. We include a care card with every delivery with tips on water changes, trimming stems, and temperature. Avoid placing flowers in direct sunlight or near heat sources to extend their life.',
  },
  {
    category: 'flowers',
    question: 'Can I request a specific colour palette for my bouquet?',
    answer:
      'Yes! Simply mention your preferred colour palette, occasion, and any flowers you love or want to avoid in the "Special Instructions" field at checkout. Our florists will create an arrangement tailored to your vision. Custom colour requests are free of charge.',
  },
  {
    category: 'flowers',
    question: 'Do you offer seasonal or rare flowers?',
    answer:
      'We work with local flower farmers and wholesale markets to source seasonal and sometimes rare blooms. Availability depends on the time of year. Check our Products page regularly or contact us to ask about a specific flower — we\'ll let you know expected availability.',
  },
  // ── DELIVERY & SHIPPING ──────────────────────────────────────────────
  {
    category: 'delivery',
    question: 'Do you offer same-day delivery?',
    answer:
      'Yes! For orders placed before 1:00 PM, we offer same-day delivery within Jabalpur city limits. Orders placed after 1:00 PM are delivered the following day. For time-sensitive occasions (weddings, anniversaries), please contact us in advance so we can ensure priority scheduling.',
  },
  {
    category: 'delivery',
    question: 'Which areas do you deliver to?',
    answer:
      'We offer local hand-delivered service covering all areas within Jabalpur, Madhya Pradesh. For non-perishable items like books and gift hampers, we ship pan-India via trusted courier partners (Delhivery, Blue Dart, India Post). Outstation floral orders are currently not available.',
  },
  {
    category: 'delivery',
    question: 'How can I track my order?',
    answer:
      'Once your order is dispatched, you\'ll receive a tracking number via email. You can also visit the "Orders" section in your user dashboard for real-time status updates — from "Processing" all the way to "Delivered". Local deliveries are confirmed via OTP at the door.',
  },
  {
    category: 'delivery',
    question: 'What are the delivery charges?',
    answer:
      'Local delivery within Jabalpur is FREE for orders above ₹1,500. For orders below ₹1,500, a nominal fee of ₹49–₹99 applies based on distance. For outstation shipping of books and non-perishables, shipping charges are calculated at checkout based on your pincode and order weight.',
  },
  {
    category: 'delivery',
    question: 'What happens if I\'m not home during delivery?',
    answer:
      'Our delivery partner will attempt to contact you on your registered phone number. If unreachable, they will try to leave the parcel with a neighbour or in a safe location and send you a photo confirmation. A second delivery attempt can be arranged — an additional fee of ₹30–₹50 may apply.',
  },
  {
    category: 'delivery',
    question: 'Can I schedule a delivery for a specific date and time?',
    answer:
      'Absolutely. During checkout, you\'ll find a "Preferred Delivery Date" option. We offer morning (9 AM – 1 PM) and evening (3 PM – 7 PM) delivery slots. Please place scheduled orders at least 24 hours in advance to guarantee the slot. For same-day timing, call us directly.',
  },
  // ── RETURNS & REFUNDS ────────────────────────────────────────────────
  {
    category: 'returns',
    question: 'What is your return policy for flowers?',
    answer:
      'Due to their perishable nature, floral arrangements cannot be returned or exchanged once delivered. However, if your bouquet arrives damaged, wilted, or significantly different from what was ordered, please photograph it and contact us within 2 hours of delivery. We will assess and arrange a replacement or store credit.',
  },
  {
    category: 'returns',
    question: 'Can I return books or non-perishable items?',
    answer:
      'Yes. Books and non-perishable goods (candles, stationery, etc.) can be returned within 7 days of delivery, provided the item is in its original, unused condition with all original packaging intact. To initiate a return, visit your Orders page or email us at support@rainashaven.com.',
  },
  {
    category: 'returns',
    question: 'How long does a refund take to process?',
    answer:
      'Once we receive and inspect your returned item, refunds are processed within 3–5 business days. The refunded amount will be credited back to your original payment method (Razorpay UPI / card) or added as store credit if you prefer. You\'ll receive an email confirmation once the refund is issued.',
  },
  {
    category: 'returns',
    question: 'What if my order arrives damaged or incorrect?',
    answer:
      'We\'re deeply sorry if that happens. Please take clear photos of the damage/incorrect item and contact us within 24 hours of delivery via the Contact Us page or WhatsApp. We will arrange a full replacement or refund at zero extra cost to you — no need to return the damaged item.',
  },
  // ── CUSTOMIZATION ────────────────────────────────────────────────────
  {
    category: 'custom',
    question: 'Can I customize a gift hamper?',
    answer:
      'Yes, and we love doing this! You can request a fully custom hamper combining flowers, cafe goods, books, and candles. Use the "Special Instructions" box at checkout, or reach out via our Contact page to discuss your vision. Custom hampers are available for all budgets.',
  },
  {
    category: 'custom',
    question: 'Can I add a personal message or card to my order?',
    answer:
      'Of course! At checkout, there\'s a "Gift Message" field where you can write a personal note of up to 150 characters. We\'ll hand-write it on a premium card and include it in your package. This service is completely free for all orders.',
  },
  {
    category: 'custom',
    question: 'Do you offer corporate gifting or bulk orders?',
    answer:
      'We do! Reaina\'s Haven offers bespoke corporate gifting solutions for events, festive seasons, and employee appreciation. For bulk orders of 10+ units, we offer special pricing and custom branding. Contact us at corporate@rainashaven.com or through our Contact page.',
  },
  {
    category: 'custom',
    question: 'Can I customize the packaging or wrapping style?',
    answer:
      'Yes! We offer several premium packaging options — including kraft paper wraps, silk ribbon ties, luxury box packaging, and eco-friendly jute bags. Select your preference at checkout or mention it in the Special Instructions field. Premium packaging upgrades may carry a small additional charge.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex]   = useState(null);
  const [activeCategory, setCategory] = useState('all');

  const filtered = activeCategory === 'all' ? faqs : faqs.filter(f => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#f8f5f2] flex flex-col">
      <Navbar />

      {/* ── HERO ──────────────────────────────── */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-[#c8a97e]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-64 bg-green-800/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block bg-[#a67c52]/10 text-[#a67c52] uppercase tracking-[0.2em] text-xs font-bold px-4 py-2 rounded-full mb-6">
            Help Centre
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-[#3e3e3e] mb-6 leading-tight">
            Frequently Asked{' '}
            <span className="text-green-800 italic">Questions</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Everything you need to know about our products, delivery, returns, and
            customizations. Can't find what you need?{' '}
            <Link to="/contactus" className="text-[#a67c52] underline underline-offset-4">
              Contact our team.
            </Link>
          </p>
        </div>
      </section>

      {/* ── CATEGORY TABS ─────────────────────── */}
      <section className="px-6 pb-4">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-3 justify-center">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setCategory(cat.id); setOpenIndex(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-[#a67c52] text-white border-[#a67c52] shadow-md scale-105'
                  : 'bg-white text-[#3e3e3e] border-[#e0d8ce] hover:border-[#a67c52] hover:text-[#a67c52]'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── FAQ ACCORDION ─────────────────────── */}
      <section className="pt-8 pb-20 px-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm text-gray-400 mb-8">
            Showing <span className="text-[#a67c52] font-semibold">{filtered.length}</span> questions
          </p>

          <div className="space-y-4">
            {filtered.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl border border-[#e0d8ce] overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left group"
                >
                  <div className="flex items-start gap-4">
                    <span className="w-7 h-7 rounded-full bg-[#f8f5f2] border border-[#e0d8ce] flex items-center justify-center text-xs font-bold text-[#a67c52] shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-base md:text-lg font-serif font-semibold text-[#3e3e3e] group-hover:text-[#a67c52] transition-colors leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`text-[#a67c52] transition-transform duration-300 shrink-0 ml-4 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    size={20}
                  />
                </button>
                <div
                  className={`px-8 transition-all duration-300 ease-in-out ${
                    openIndex === index
                      ? 'pb-8 opacity-100 max-h-96'
                      : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  <div className="ml-11 border-l-2 border-[#a67c52]/20 pl-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── POLICY QUICK-LINKS ───────────────── */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: 'Shipping Policy',       path: '/shipping-policy',      emoji: '🚚', desc: 'Delivery rules, timelines & charges' },
              { title: 'Refund Policy',          path: '/refund-policy',        emoji: '💸', desc: 'Returns, exchanges & refund process' },
              { title: 'Customization Guide',   path: '/customization',        emoji: '🎨', desc: 'How to personalize your order' },
            ].map(p => (
              <Link
                key={p.path}
                to={p.path}
                className="bg-white rounded-3xl border border-[#e0d8ce] p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="text-4xl mb-3">{p.emoji}</div>
                <h3 className="font-serif text-[#3e3e3e] font-semibold group-hover:text-[#a67c52] transition-colors mb-1">{p.title}</h3>
                <p className="text-gray-400 text-xs">{p.desc}</p>
              </Link>
            ))}
          </div>

          {/* ── CTA ─────────────────────────────── */}
          <div className="mt-12 bg-gradient-to-br from-[#eee8e0] to-[#e8dfd5] rounded-[2rem] p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
              <HelpCircle size={180} />
            </div>
            <h3 className="text-2xl font-serif text-[#3e3e3e] mb-3">Still have questions?</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Our team is here to help you create the perfect moment — reach out anytime.
            </p>
            <Link
              to="/contactus"
              className="inline-flex items-center gap-2 bg-[#a67c52] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#3e3e3e] transition-all shadow-lg hover:shadow-xl"
            >
              <MessageCircle size={18} /> Contact Support
            </Link>
          </div>
        </div>
      </section>

      <ProductsFooter />
    </div>
  );
};

export default FAQ;
