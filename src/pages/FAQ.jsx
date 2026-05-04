import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ProductsFooter from '../components/ProductsFooter';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Are your cafe goods really 100% handmade?",
      answer: "Yes, every single item in our cafe menu—from brownies to artisanal breads—is 100% handmade in our cloud kitchen. We do not use commercial pre-mixes or artificial preservatives."
    },
    {
      question: "Do you offer healthy versions of your desserts?",
      answer: "Absolutely! We specialize in 'Healthy Versions' of classic treats. We use alternative flours (like oats and almond flour) and natural sweeteners for our healthy range, ensuring you can indulge without the guilt."
    },
    {
      question: "Can I get the ingredient details of the food I order?",
      answer: "Transparency is our priority. We provide complete ingredient details with every generated bill (invoice) for our cafe items, so you know exactly what goes into your body."
    },
    {
      question: "What types of flowers do you offer?",
      answer: "We offer a curated selection of seasonal blooms, exotic flowers, and signature curated bouquets. Each arrangement is handcrafted by our expert florists to ensure the highest quality and beauty."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via email. You can also track your order status in real-time through the 'Orders' section in your user dashboard."
    },
    {
      question: "Do you offer same-day delivery?",
      answer: "Yes, for orders placed before 1:00 PM, we offer same-day delivery within Jabalpur. For other areas, delivery typically takes 1-3 business days depending on the location."
    },
    {
      question: "Can I customize a gift hamper?",
      answer: "Absolutely! We love creating personalized experiences. You can reach out to us via the Contact Us page or visit our store in Ranjhi to build a custom gift hamper with flowers, books, and cafe goods."
    },
    {
      question: "What is your return policy?",
      answer: "Due to the perishable nature of flowers, we do not accept returns on floral arrangements. However, for books and non-perishable goods, you can request a return within 7 days if the item is in its original condition."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f5f2] flex flex-col">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#a67c52] uppercase tracking-[0.2em] text-sm font-bold block mb-4">Common Questions</span>
            <h1 className="text-5xl font-serif text-[#3e3e3e] mb-6">Frequently Asked <span className="text-green-800 italic">Questions</span></h1>
            <p className="text-gray-500 max-w-2xl mx-auto">Everything you need to know about our services, orders, and delivery. If you can't find your answer here, feel free to contact us.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-3xl border border-[#e0d8ce] overflow-hidden transition-all duration-300"
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left group"
                >
                  <span className="text-lg font-serif font-semibold text-[#3e3e3e] group-hover:text-[#a67c52] transition-colors">{faq.question}</span>
                  <ChevronDown className={`text-[#a67c52] transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
                </button>
                <div className={`px-8 transition-all duration-300 ease-in-out ${openIndex === index ? 'pb-8 opacity-100 max-h-40' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 bg-[#eee8e0] rounded-[2rem] p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
              <HelpCircle size={150} />
            </div>
            <h3 className="text-2xl font-serif text-[#3e3e3e] mb-4">Still have questions?</h3>
            <p className="text-gray-600 mb-8">We're here to help you create your perfect moment.</p>
            <a href="/contactus" className="inline-flex items-center gap-2 bg-[#a67c52] text-white px-8 py-3 rounded-full font-bold hover:bg-[#3e3e3e] transition-all shadow-lg">
              <MessageCircle size={18} /> Contact Support
            </a>
          </div>
        </div>
      </section>

      <ProductsFooter />
    </div>
  );
};

export default FAQ;
