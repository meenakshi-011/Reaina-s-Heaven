import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductsFooter from '../components/ProductsFooter';
import {
  Truck, Clock, ShieldCheck, MapPin, AlertCircle,
  Package, CheckCircle2, LocateFixed, Home, ChevronRight,
} from 'lucide-react';

const highlights = [
  {
    icon: <Truck className="text-[#a67c52]" size={30} />,
    title: 'Local Delivery',
    sub: 'Jabalpur, Madhya Pradesh',
    desc: 'Same-day delivery for orders placed before 1:00 PM within city limits. Handled by our own trained delivery team for maximum care.',
  },
  {
    icon: <Clock className="text-[#a67c52]" size={30} />,
    title: 'Outstation Shipping',
    sub: 'Pan-India (non-perishables)',
    desc: 'Books, candles & gift hampers ship across India via Delhivery / Blue Dart. Expected delivery: 3–7 business days from dispatch.',
  },
  {
    icon: <ShieldCheck className="text-[#a67c52]" size={30} />,
    title: 'Protected Packaging',
    sub: 'Flowers & fragile items',
    desc: 'Flowers travel in water-sealed pouches or temperature-controlled foam boxes. Breakables are bubble-wrapped and boxed securely.',
  },
  {
    icon: <LocateFixed className="text-[#a67c52]" size={30} />,
    title: 'Live Order Tracking',
    sub: 'Email + Dashboard',
    desc: 'Get a tracking link by email the moment your order leaves our store. Track every step in your user dashboard under "My Orders".',
  },
];

const chargesRows = [
  { zone: 'Jabalpur City (within 5 km)',  perishable: 'Free above ₹1,500 / ₹49 below', nonPerishable: 'Free above ₹1,500 / ₹49 below', time: 'Same-day (before 1 PM)' },
  { zone: 'Jabalpur City (5–15 km)',      perishable: 'Free above ₹1,500 / ₹99 below', nonPerishable: 'Free above ₹1,500 / ₹79 below', time: 'Same-day / Next-day' },
  { zone: 'Jabalpur Outskirts (15–30 km)',perishable: '₹149 flat',                      nonPerishable: '₹99 flat',                      time: 'Next-day' },
  { zone: 'Pan-India (Non-Perishable)',   perishable: 'N/A — Not available',             nonPerishable: 'Calculated at checkout',         time: '3–7 business days' },
];

const orderStatuses = [
  { status: 'Processing',       color: 'bg-yellow-400',  desc: 'Your order has been received and is being prepared.' },
  { status: 'Shipped',          color: 'bg-blue-400',    desc: 'Your order has left our store / warehouse.' },
  { status: 'Out for Delivery', color: 'bg-orange-400',  desc: 'Your delivery partner is on their way to you.' },
  { status: 'Delivered',        color: 'bg-green-500',   desc: 'Delivered & OTP verified. Enjoy your haven!' },
  { status: 'Cancelled',        color: 'bg-red-400',     desc: 'Order cancelled. Refund (if applicable) in 3–5 days.' },
];

const rules = [
  {
    num: '01',
    title: 'Same-Day Delivery Cutoff',
    body: 'Orders must be placed by 1:00 PM IST to qualify for same-day delivery within Jabalpur. Orders placed after 1:00 PM will be delivered the next business day. Public holidays may affect scheduling.',
  },
  {
    num: '02',
    title: 'Delivery Slots',
    body: 'We offer two delivery windows: Morning (9:00 AM – 1:00 PM) and Evening (3:00 PM – 7:00 PM). Select your preferred slot at checkout. Slot availability is subject to capacity — book early for peak dates (Valentine\'s Day, Mother\'s Day, etc.).',
  },
  {
    num: '03',
    title: 'OTP-Based Delivery Confirmation',
    body: 'All local orders are confirmed via a One-Time Password (OTP) sent to the recipient\'s registered mobile number at the doorstep. This ensures your order reaches the right hands securely and is recorded in our system as "Delivered".',
  },
  {
    num: '04',
    title: 'Failed Delivery Attempts',
    body: 'If the recipient is unreachable, our partner will attempt to leave the order with a neighbour or in a safe spot. If that\'s not possible, a second delivery attempt will be made the next day. Additional charges of ₹30–₹50 may apply for re-delivery.',
  },
  {
    num: '05',
    title: 'Outstation Courier Policy',
    body: 'Outstation orders (books, hampers, non-perishables) are dispatched within 1–2 business days of payment confirmation. Tracking details are emailed once the parcel is handed to the courier. Reaina\'s Haven is not liable for courier-caused delays once dispatched.',
  },
  {
    num: '06',
    title: 'Incorrect Address',
    body: 'Please double-check your shipping address before confirming. If the parcel is returned due to an incorrect or incomplete address, re-delivery charges will apply. Contact us within 1 hour of placing the order if you need to update the address.',
  },
  {
    num: '07',
    title: 'Peak Season & Holiday Delays',
    body: 'During high-demand periods (Valentine\'s Day, Raksha Bandhan, Diwali, New Year), delivery timelines may extend by 1–2 days. We recommend placing orders at least 48–72 hours in advance during these periods.',
  },
  {
    num: '08',
    title: 'Unserviceable Pincodes',
    body: 'Outstation floral orders are currently not available. If your pincode is outside our serviceable area for a specific product type, the checkout page will notify you. Contact us to check special arrangements.',
  },
];

const ShippingPolicy = () => {
  const [openRule, setOpenRule] = useState(null);

  return (
    <div className="min-h-screen bg-[#f8f5f2] flex flex-col">
      <Navbar />

      {/* ── HERO ──────────────────────────────────── */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 right-8 w-80 h-80 bg-[#c8a97e]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 left-0 w-96 h-64 bg-green-800/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block bg-[#a67c52]/10 text-[#a67c52] uppercase tracking-[0.2em] text-xs font-bold px-4 py-2 rounded-full mb-6">
            Our Logistics
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-[#3e3e3e] mb-6 leading-tight">
            Shipping &{' '}
            <span className="text-green-800 italic">Delivery Policy</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            We strive to ensure your tokens of love arrive in pristine condition and
            perfect timing. Here's everything you need to know about how we get your
            order to you.
          </p>
        </div>
      </section>

      {/* ── HIGHLIGHT CARDS ───────────────────────── */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((h, i) => (
            <div key={i} className="bg-white rounded-[2rem] p-8 border border-[#e0d8ce] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-[#f8f5f2] rounded-2xl flex items-center justify-center mb-5">
                {h.icon}
              </div>
              <h3 className="font-serif font-bold text-[#3e3e3e] text-lg mb-1">{h.title}</h3>
              <p className="text-[#a67c52] text-xs font-semibold uppercase tracking-wide mb-3">{h.sub}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CHARGES TABLE ─────────────────────────── */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#a67c52] uppercase tracking-widest text-xs font-bold block mb-3">Transparent Pricing</span>
            <h2 className="text-3xl font-serif text-[#3e3e3e]">Delivery Charges at a Glance</h2>
          </div>
          <div className="bg-white rounded-[2rem] border border-[#e0d8ce] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f8f5f2] border-b border-[#e0d8ce]">
                    <th className="px-6 py-4 text-left font-semibold text-[#3e3e3e]">Zone</th>
                    <th className="px-6 py-4 text-left font-semibold text-[#3e3e3e]">Flowers / Perishables</th>
                    <th className="px-6 py-4 text-left font-semibold text-[#3e3e3e]">Books / Hampers</th>
                    <th className="px-6 py-4 text-left font-semibold text-[#3e3e3e]">Estimated Time</th>
                  </tr>
                </thead>
                <tbody>
                  {chargesRows.map((row, i) => (
                    <tr key={i} className={`border-b border-[#f0ebe4] ${i % 2 === 0 ? 'bg-white' : 'bg-[#faf8f5]'}`}>
                      <td className="px-6 py-4 font-medium text-[#3e3e3e]">{row.zone}</td>
                      <td className="px-6 py-4 text-gray-600">{row.perishable}</td>
                      <td className="px-6 py-4 text-gray-600">{row.nonPerishable}</td>
                      <td className="px-6 py-4 text-gray-600">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-center text-gray-400 text-xs mt-4">
            * All charges include applicable taxes. Exact charges are confirmed at checkout.
          </p>
        </div>
      </section>

      {/* ── ORDER STATUS LIFECYCLE ────────────────── */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#a67c52] uppercase tracking-widest text-xs font-bold block mb-3">Order Journey</span>
            <h2 className="text-3xl font-serif text-[#3e3e3e]">Your Order's Lifecycle</h2>
          </div>
          <div className="bg-white rounded-[2rem] border border-[#e0d8ce] p-8 md:p-12 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {orderStatuses.map((s, i) => (
                <div key={i} className="flex flex-col items-center text-center flex-1 relative">
                  {i < orderStatuses.length - 1 && (
                    <ChevronRight className="hidden md:block absolute right-0 top-4 text-[#e0d8ce]" size={20} />
                  )}
                  <div className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center mb-3 shadow-md`}>
                    <CheckCircle2 size={18} className="text-white" />
                  </div>
                  <p className="font-semibold text-[#3e3e3e] text-sm mb-1">{s.status}</p>
                  <p className="text-gray-400 text-xs leading-snug max-w-[120px]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DETAILED RULES ────────────────────────── */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#a67c52] uppercase tracking-widest text-xs font-bold block mb-3">Terms & Rules</span>
            <h2 className="text-3xl font-serif text-[#3e3e3e]">Detailed Delivery Rules</h2>
          </div>
          <div className="space-y-4">
            {rules.map((r, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-[#e0d8ce] overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setOpenRule(openRule === i ? null : i)}
                  className="w-full px-8 py-5 flex items-center gap-5 text-left"
                >
                  <span className="text-3xl font-serif font-bold text-[#e0d8ce] shrink-0">{r.num}</span>
                  <span className="flex-1 font-serif font-semibold text-[#3e3e3e]">{r.title}</span>
                  <ChevronRight
                    size={18}
                    className={`text-[#a67c52] transition-transform duration-300 shrink-0 ${openRule === i ? 'rotate-90' : ''}`}
                  />
                </button>
                <div className={`px-8 transition-all duration-300 ease-in-out ${openRule === i ? 'pb-6 max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                  <p className="text-gray-600 text-sm leading-relaxed border-t border-[#f0ebe4] pt-4">{r.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── NOTICE BOX ─────────────────────────── */}
          <div className="mt-12 flex gap-4 bg-amber-50 border border-amber-200 rounded-3xl p-6">
            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={22} />
            <div>
              <p className="font-semibold text-amber-800 mb-1">Important Notice</p>
              <p className="text-amber-700 text-sm leading-relaxed">
                Reaina's Haven is not responsible for delays caused by natural disasters, civil unrest, government restrictions, or force-majeure events. We will always communicate proactively if your delivery is impacted.
              </p>
            </div>
          </div>

          {/* ── LINKS ─────────────────────────────── */}
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            {[
              { label: 'Read Refund Policy',        path: '/refund-policy' },
              { label: 'Customization Guide',        path: '/customization' },
              { label: 'Track My Order',             path: '/orders' },
              { label: 'Contact Support',            path: '/contactus' },
            ].map(l => (
              <Link key={l.path} to={l.path} className="flex items-center gap-2 text-sm font-semibold text-[#a67c52] border border-[#a67c52]/30 px-5 py-2.5 rounded-full hover:bg-[#a67c52] hover:text-white transition-all">
                {l.label} <ChevronRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ProductsFooter />
    </div>
  );
};

export default ShippingPolicy;
