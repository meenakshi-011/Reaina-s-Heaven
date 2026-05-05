import React from 'react';
import Navbar from '../components/Navbar';
import { API_URL } from '../config';
import ProductsFooter from '../components/ProductsFooter';
import { toast } from 'react-hot-toast';

const Contactus = () => {
  return (
    <div className="min-h-screen bg-[#f8f5f2] flex flex-col">
      <Navbar />

      {/* ── HERO SECTION ───────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-12 px-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c8a97e]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-[#a67c52] uppercase tracking-[0.2em] text-sm font-bold block mb-4">Say Hello</span>
          <h1 className="text-5xl md:text-6xl font-serif text-[#3e3e3e] leading-tight mb-6">
            We'd Love To <br className="hidden md:block" />
            <span className="text-green-800 italic">Hear From You</span> 💌
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
            Whether you have a question about our curated floral bouquets, want to book a private event, or just want to say hello, our team at Reaina's Haven is always ready to talk.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ───────────────────────── */}
      <section className="flex-1 w-full max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-white rounded-[2rem] shadow-sm border border-[#e0d8ce] overflow-hidden flex flex-col md:flex-row">
          
          {/* CONTACT INFO SIDE */}
          <div className="w-full md:w-[40%] bg-[#eee8e0] p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none">
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40.1633 134.408C23.0132 119.516 4.79361 97.5029 4.38202 75.3121C3.96162 52.6457 21.055 33.1672 40.5929 18.232C60.2079 3.23877 84.1869 -1.68822 108.57 0.449704C132.894 2.5828 155.334 16.3268 174.453 32.8687C193.305 49.1804 206.182 72.0306 198.815 95.1293C191.137 119.2 163.633 131.066 142.131 146.402C119.67 162.422 98.4239 193.284 72.8273 198.406C48.2435 203.325 57.0697 149.091 40.1633 134.408Z" fill="#a67c52"/>
              </svg>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-serif text-[#3e3e3e] mb-8">Get In Touch</h3>
              
              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#a67c52] shadow-sm shrink-0">
                    📍
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-[#a67c52] font-bold mb-1">Visit Us</h4>
                    <p className="text-gray-600 leading-relaxed text-sm">Subhash Nagar, Ranjhi <br /> Jabalpur, Madhya Pradesh</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#a67c52] shadow-sm shrink-0">
                    📞
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-[#a67c52] font-bold mb-1">Call Us</h4>
                    <p className="text-gray-600 leading-relaxed text-sm">+1 (555) 123-4567 <br /> Mon-Sat, 9AM to 6PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#a67c52] shadow-sm shrink-0">
                    ✉️
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-[#a67c52] font-bold mb-1">Email Us</h4>
                    <p className="text-gray-600 leading-relaxed text-sm">meenakshipatel928@gmail.com <br /> support@reainashaven.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-[#d4c4b0] relative z-10">
              <p className="text-xs uppercase tracking-widest text-[#8c8c73] font-bold mb-4">Follow Our Journey</p>
              <div className="flex gap-4">
                <a 
                  href="https://instagram.com/reainas_heaven" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm font-medium text-[#3e3e3e] hover:text-[#a67c52] transition-colors"
                >
                  Instagram
                </a>
                <button className="text-sm font-medium text-[#3e3e3e] hover:text-[#a67c52] transition-colors">Pinterest</button>
                <button className="text-sm font-medium text-[#3e3e3e] hover:text-[#a67c52] transition-colors">Spotify</button>
              </div>
            </div>
          </div>

          {/* CONTACT FORM SIDE */}
          <div className="w-full md:w-[60%] p-10 lg:p-14 bg-white">
            <h3 className="text-2xl font-serif text-[#3e3e3e] mb-2">Send a Message</h3>
            <p className="text-gray-500 text-sm mb-8">We usually respond within 24 hours.</p>

            <form className="flex flex-col gap-6" onSubmit={async (e) => {
              e.preventDefault();
              const token = localStorage.getItem("token");
              
              if (!token) {
                toast.error("Please login to send a message.", {
                  icon: '🔒',
                  style: { borderRadius: '20px', background: '#3e3e3e', color: '#fff' }
                });
                return;
              }

              const formData = new FormData(e.target);
              const data = Object.fromEntries(formData.entries());
              
              const loadingToast = toast.loading("Sending your message...");
              
              try {
                const res = await fetch(`${API_URL}/api/contact`, {
                  method: "POST",
                  headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  },
                  body: JSON.stringify(data)
                });
                
                if (res.ok) {
                  toast.success("Thank you! Your message has been sent to Meenakshi.", { id: loadingToast });
                  e.target.reset();
                } else {
                  const errData = await res.json();
                  toast.error(errData.message || "Failed to send message.", { id: loadingToast });
                }
              } catch (err) {
                toast.error("An error occurred.", { id: loadingToast });
              }
            }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col items-start gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#8c8c73]">First Name</label>
                  <input name="firstName" required type="text" placeholder="Sarah" className="w-full bg-[#f8f5f2] border border-transparent focus:border-[#a67c52] focus:bg-white text-gray-700 rounded-xl px-4 py-3 outline-none transition-all duration-300 shadow-sm" />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#8c8c73]">Last Name</label>
                  <input name="lastName" required type="text" placeholder="Jenkins" className="w-full bg-[#f8f5f2] border border-transparent focus:border-[#a67c52] focus:bg-white text-gray-700 rounded-xl px-4 py-3 outline-none transition-all duration-300 shadow-sm" />
                </div>
              </div>

              <div className="flex flex-col items-start gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#8c8c73]">Email Address</label>
                <input name="email" required type="email" placeholder="sarah@example.com" className="w-full bg-[#f8f5f2] border border-transparent focus:border-[#a67c52] focus:bg-white text-gray-700 rounded-xl px-4 py-3 outline-none transition-all duration-300 shadow-sm" />
              </div>

              <div className="flex flex-col items-start gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#8c8c73]">Inquiry Type</label>
                <select name="inquiryType" className="w-full bg-[#f8f5f2] border border-transparent focus:border-[#a67c52] focus:bg-white text-gray-700 rounded-xl px-4 py-3 outline-none transition-all duration-300 shadow-sm cursor-pointer appearance-none">
                  <option>General Question</option>
                  <option>Event Booking (Bride To Be, Baby Shower)</option>
                  <option>Order Status / Support</option>
                  <option>Partnership / Collab</option>
                </select>
              </div>

              <div className="flex flex-col items-start gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#8c8c73]">Your Message</label>
                <textarea name="message" required rows={5} placeholder="Tell us how we can help..." className="w-full bg-[#f8f5f2] border border-transparent focus:border-[#a67c52] focus:bg-white text-gray-700 rounded-xl px-4 py-3 outline-none transition-all duration-300 shadow-sm resize-none"></textarea>
              </div>

              <button className="bg-[#a67c52] text-white font-medium rounded-xl px-8 py-4 mt-2 hover:bg-[#8e6a45] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 self-start">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* ── FOOTER ───────────────────────── */}
      <ProductsFooter />
    </div>
  );
};

export default Contactus;