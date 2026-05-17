import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductsFooter from '../components/ProductsFooter';
import {
  RotateCcw, CheckCircle2, XCircle, Clock, CreditCard,
  PackageX, AlertCircle, ChevronRight, RefreshCcw, Flower2,
  BookOpen, Gift, Coffee,
} from 'lucide-react';

const eligibilityRows = [
  {
    category: 'Fresh Flowers & Bouquets',
    icon: <Flower2 size={16} className="text-[#a67c52]" />,
    returnable: false,
    refundable: 'Conditional',
    window: '2 hours after delivery',
    condition: 'Only if arrived wilted / damaged / incorrect',
  },
  {
    category: 'Cafe Goods (Perishable)',
    icon: <Coffee size={16} className="text-[#a67c52]" />,
    returnable: false,
    refundable: 'Conditional',
    window: '2 hours after delivery',
    condition: 'Only if incorrect item / quality issue',
  },
  {
    category: 'Books',
    icon: <BookOpen size={16} className="text-[#a67c52]" />,
    returnable: true,
    refundable: 'Full',
    window: '7 days from delivery',
    condition: 'Must be unused, in original packaging',
  },
  {
    category: 'Gift Hampers (non-perishable portion)',
    icon: <Gift size={16} className="text-[#a67c52]" />,
    returnable: true,
    refundable: 'Partial',
    window: '7 days from delivery',
    condition: 'Non-perishable items only, original condition',
  },
  {
    category: 'Custom / Personalized Orders',
    icon: <RefreshCcw size={16} className="text-[#a67c52]" />,
    returnable: false,
    refundable: 'No',
    window: 'N/A',
    condition: 'Non-refundable once production has started',
  },
];

const steps = [
  {
    num: '01',
    title: 'Document the Issue',
    desc: 'Take clear photographs of the damaged, incorrect, or defective item immediately upon receiving it. Photos must show the packaging and the product clearly.',
  },
  {
    num: '02',
    title: 'Contact Us Within the Window',
    desc: 'Email support@rainashaven.com or message us via the Contact page within 2 hours (perishables) or 7 days (non-perishables) of receiving your order. Include your Order ID and photos.',
  },
  {
    num: '03',
    title: 'Verification & Approval',
    desc: 'Our team will review your request within 24 business hours. If approved, you\'ll receive a Return Authorization Number (RAN) and instructions on whether a physical return is required.',
  },
  {
    num: '04',
    title: 'Return Pickup / Drop-off (if required)',
    desc: 'For non-perishable returns, we\'ll schedule a free pickup from your address or provide our store address for drop-off. Ensure the item is packed securely in its original packaging.',
  },
  {
    num: '05',
    title: 'Refund Processing',
    desc: 'Once received and inspected, your refund will be processed within 3–5 business days. The amount will be credited to your original payment method or as store credit if you prefer.',
  },
];

const scenarios = [
  {
    icon: <PackageX size={20} className="text-red-500" />,
    title: 'Wrong item delivered',
    resolution: 'Full replacement shipped at no charge, or full refund.',
    eligible: true,
  },
  {
    icon: <XCircle size={20} className="text-red-500" />,
    title: 'Bouquet arrived wilted',
    resolution: 'Photo required. Replacement or store credit offered.',
    eligible: true,
  },
  {
    icon: <Clock size={20} className="text-orange-500" />,
    title: 'Late delivery (beyond promised window)',
    resolution: 'Partial refund of delivery charges or store credit.',
    eligible: true,
  },
  {
    icon: <CheckCircle2 size={20} className="text-green-500" />,
    title: 'Changed your mind after delivery',
    resolution: 'Not eligible for refund (perishables). Books eligible within 7 days.',
    eligible: false,
  },
  {
    icon: <CheckCircle2 size={20} className="text-green-500" />,
    title: 'Customized / personalized order',
    resolution: 'Non-refundable once production has started.',
    eligible: false,
  },
  {
    icon: <CheckCircle2 size={20} className="text-orange-500" />,
    title: 'Courier delay (outstation)',
    resolution: 'We\'ll follow up with courier — refund if item is lost.',
    eligible: 'partial',
  },
];

const RefundPolicy = () => {
  const [openStep, setOpenStep] = useState(null);

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
            Refunds & Returns
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-[#3e3e3e] mb-6 leading-tight">
            Our Refund &{' '}
            <span className="text-green-800 italic">Return Policy</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Your satisfaction is our highest priority. We want every experience with
            Reaina's Haven to be wonderful — and if it isn't, we'll make it right.
          </p>
        </div>
      </section>

      {/* ── PHILOSOPHY BANNER ─────────────────────── */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-green-800 to-[#2d5a27] rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 text-[200px] font-serif leading-none">❝</div>
          <p className="text-xl md:text-2xl font-serif leading-relaxed mb-4 relative z-10">
            "We don't want a single customer to leave unhappy. If something goes wrong, reach out — we will always find a fair resolution."
          </p>
          <p className="text-white/70 font-semibold relative z-10">— Reaina, Founder</p>
        </div>
      </section>

      {/* ── ELIGIBILITY TABLE ─────────────────────── */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#a67c52] uppercase tracking-widest text-xs font-bold block mb-3">What's Covered</span>
            <h2 className="text-3xl font-serif text-[#3e3e3e]">Return & Refund Eligibility</h2>
          </div>
          <div className="bg-white rounded-[2rem] border border-[#e0d8ce] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f8f5f2] border-b border-[#e0d8ce] text-left">
                    <th className="px-6 py-4 font-semibold text-[#3e3e3e]">Product Category</th>
                    <th className="px-6 py-4 font-semibold text-[#3e3e3e]">Returnable?</th>
                    <th className="px-6 py-4 font-semibold text-[#3e3e3e]">Refundable?</th>
                    <th className="px-6 py-4 font-semibold text-[#3e3e3e]">Request Window</th>
                    <th className="px-6 py-4 font-semibold text-[#3e3e3e]">Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {eligibilityRows.map((row, i) => (
                    <tr key={i} className={`border-b border-[#f0ebe4] ${i % 2 === 0 ? 'bg-white' : 'bg-[#faf8f5]'}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 font-medium text-[#3e3e3e]">
                          {row.icon} {row.category}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {row.returnable
                          ? <span className="flex items-center gap-1 text-green-600 font-semibold"><CheckCircle2 size={14} /> Yes</span>
                          : <span className="flex items-center gap-1 text-red-400 font-semibold"><XCircle size={14} /> No</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${row.refundable === 'Full' ? 'text-green-600' : row.refundable === 'Conditional' ? 'text-orange-500' : row.refundable === 'Partial' ? 'text-yellow-600' : 'text-red-400'}`}>
                          {row.refundable}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{row.window}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{row.condition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── REFUND PROCESS ────────────────────────── */}
      <section className="px-6 pb-16 bg-white">
        <div className="max-w-4xl mx-auto py-16">
          <div className="text-center mb-12">
            <span className="text-[#a67c52] uppercase tracking-widest text-xs font-bold block mb-3">Step by Step</span>
            <h2 className="text-3xl font-serif text-[#3e3e3e]">How to Request a Refund or Return</h2>
          </div>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div
                key={i}
                className="rounded-3xl border border-[#e0d8ce] overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setOpenStep(openStep === i ? null : i)}
              >
                <div className="px-8 py-5 flex items-center gap-5">
                  <span className="text-3xl font-serif font-bold text-[#e0d8ce] shrink-0 w-10">{step.num}</span>
                  <span className="flex-1 font-serif font-semibold text-[#3e3e3e]">{step.title}</span>
                  <ChevronRight size={18} className={`text-[#a67c52] transition-transform duration-300 shrink-0 ${openStep === i ? 'rotate-90' : ''}`} />
                </div>
                <div className={`px-8 transition-all duration-300 ease-in-out ${openStep === i ? 'pb-6 max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                  <p className="text-gray-600 text-sm leading-relaxed border-t border-[#f0ebe4] pt-4">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-[#f8f5f2] rounded-3xl p-6 flex items-center gap-4 border border-[#e0d8ce]">
            <CreditCard size={24} className="text-[#a67c52] shrink-0" />
            <div>
              <p className="font-semibold text-[#3e3e3e] mb-1">Refund Timeline</p>
              <p className="text-gray-500 text-sm">Refunds are processed within <strong>3–5 business days</strong> to your original payment method. UPI refunds typically land within 1–2 business days; card refunds may take up to 5–7 business days depending on your bank.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMON SCENARIOS ──────────────────────── */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#a67c52] uppercase tracking-widest text-xs font-bold block mb-3">Common Situations</span>
            <h2 className="text-3xl font-serif text-[#3e3e3e]">What Happens In Your Scenario?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {scenarios.map((s, i) => (
              <div key={i} className="bg-white rounded-3xl border border-[#e0d8ce] p-6 flex gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-2xl bg-[#f8f5f2] flex items-center justify-center shrink-0">
                  {s.icon}
                </div>
                <div>
                  <p className="font-semibold text-[#3e3e3e] mb-1">{s.title}</p>
                  <p className="text-gray-500 text-sm">{s.resolution}</p>
                  <span className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full ${s.eligible === true ? 'bg-green-100 text-green-700' : s.eligible === false ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-700'}`}>
                    {s.eligible === true ? '✓ Eligible' : s.eligible === false ? '✗ Not Eligible' : '~ Partial'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOTICE ────────────────────────────────── */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 bg-amber-50 border border-amber-200 rounded-3xl p-6 mb-8">
            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={22} />
            <div>
              <p className="font-semibold text-amber-800 mb-1">Non-Refundable Situations</p>
              <ul className="text-amber-700 text-sm space-y-1 list-disc list-inside">
                <li>Flowers not kept in water or proper conditions after delivery</li>
                <li>Damage caused by recipient mishandling</li>
                <li>Refund requests made after the eligibility window</li>
                <li>Custom / personalized orders once production has commenced</li>
                <li>Digital or downloadable products (if applicable)</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { label: 'Contact Support',     path: '/contactus' },
              { label: 'Shipping Policy',     path: '/shipping-policy' },
              { label: 'Customization Guide', path: '/customization' },
              { label: 'Track My Order',      path: '/orders' },
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

export default RefundPolicy;
