import React from 'react';
import Navbar from '../components/Navbar';
import ProductsFooter from '../components/ProductsFooter';
import { Truck, ShieldCheck, Clock, MapPin } from 'lucide-react';

const ShippingPolicy = () => {
  const policies = [
    {
      icon: <Truck className="text-[#a67c52]" size={32} />,
      title: "Delivery Areas",
      description: "We currently offer specialized local delivery within Jabalpur, Madhya Pradesh. For outstation orders of non-perishable items like books and candles, we ship across India via our logistics partners."
    },
    {
      icon: <Clock className="text-[#a67c52]" size={32} />,
      title: "Delivery Timeline",
      description: "Local floral orders can be delivered same-day if placed before 1 PM. Outstation shipping typically takes 3-7 business days depending on your location."
    },
    {
      icon: <ShieldCheck className="text-[#a67c52]" size={32} />,
      title: "Handled with Care",
      description: "Our flowers are transported in temperature-controlled environments or specialized packaging to ensure they arrive fresh and vibrant at your doorstep."
    },
    {
      icon: <MapPin className="text-[#a67c52]" size={32} />,
      title: "Order Tracking",
      description: "You will receive a real-time tracking link via email once your order leaves our haven. You can also view live status updates in your dashboard."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f5f2] flex flex-col">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#a67c52] uppercase tracking-[0.2em] text-sm font-bold block mb-4">Our Logistics</span>
            <h1 className="text-5xl font-serif text-[#3e3e3e] mb-6">Shipping & <span className="text-green-800 italic">Delivery Policy</span></h1>
            <p className="text-gray-500 max-w-2xl mx-auto">We strive to ensure your tokens of love reach their destination in the most pristine condition and perfect timing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {policies.map((p, index) => (
              <div key={index} className="bg-white p-10 rounded-[2rem] border border-[#e0d8ce] shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6">{p.icon}</div>
                <h3 className="text-xl font-serif font-bold text-[#3e3e3e] mb-4">{p.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{p.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[3rem] p-12 border border-[#e0d8ce] shadow-sm">
            <h2 className="text-3xl font-serif text-[#3e3e3e] mb-8 text-center">Detailed Information</h2>
            <div className="space-y-8 max-w-3xl mx-auto">
              <div>
                <h4 className="font-bold text-[#a67c52] mb-2 uppercase text-xs tracking-widest">1. Local Delivery (Jabalpur)</h4>
                <p className="text-gray-600 text-sm leading-relaxed">Our in-house delivery team handles all local orders to ensure delicate flowers and cafe goods are handled with maximum care. Delivery charges are calculated based on distance from our Ranjhi outlet.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#a67c52] mb-2 uppercase text-xs tracking-widest">2. Shipping Charges</h4>
                <p className="text-gray-600 text-sm leading-relaxed">Free local delivery on orders above ₹1,500. For orders below this value, a nominal delivery fee of ₹49 - ₹99 applies within city limits.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#a67c52] mb-2 uppercase text-xs tracking-widest">3. Delivery Attempts</h4>
                <p className="text-gray-600 text-sm leading-relaxed">If the recipient is not available, we will attempt to leave the order with a neighbor or in a safe place. If unsuccessful, a second delivery attempt may incur additional charges.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductsFooter />
    </div>
  );
};

export default ShippingPolicy;
