import React from "react";

const ProductsFooter = () => {
  return (
    <footer className="bg-[#3e3e3e] text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

        {/* Brand */}
        <div className="md:col-span-1">
          <h2 className="font-serif text-2xl text-[#c8a97e] mb-3">
            Reaina's Haven 🌿
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            A curated sanctuary of flowers, books, and cozy café goods — made
            with love for every occasion.
          </p>

          {/* Socials */}
          <div className="flex gap-4 mt-8">
            {[
              { 
                name: "Instagram", 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                )
              },
              { 
                name: "Threads", 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.25 15.25c-1.5 1.5-3.5 2-5.5 1.5s-4-2-4.5-5.5 1-6.5 4.5-7 6.5 2 6 6-.5 6-3.5 5.5-5-2.5-4-6.5 2.5-4.5 4.5-4 4 2 3.5 4.5"></path></svg>
                )
              },
              { 
                name: "Twitter", 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                )
              },
              { 
                name: "Whatsapp", 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-7.6 8.38 8.38 0 0 1 3.8.9L21 3z"></path></svg>
                )
              }
            ].map((s) => (
              <a
                key={s.name}
                href={s.name === "Instagram" ? "https://instagram.com/reainas_heaven" : "#"}
                target={s.name === "Instagram" ? "_blank" : undefined}
                rel={s.name === "Instagram" ? "noopener noreferrer" : undefined}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#a67c52] hover:border-[#a67c52] hover:scale-110 transition-all duration-300 group"
                aria-label={s.name}
              >
                <div className="group-hover:text-white transition-colors text-white/70">
                  {s.icon}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        {[
          {
            title: "Shop",
            links: [
              { name: "Flowers", path: "/products" },
              { name: "Café Goods", path: "/cafe" },
              { name: "Books", path: "/books" },
              { name: "Gift Hampers", path: "/products" },
            ],
          },
          {
            title: "Support",
            links: [
              { name: "Contact Us", path: "/contactus" },
              { name: "FAQs", path: "/faq" },
              { name: "Shipping Policy", path: "/shipping-policy" },
              { name: "Order Tracking", path: "/orders" },
            ],
          },
          {
            title: "Collaborate",
            links: [
              { name: "Partner With Us", path: "/contactus" },
              { name: "Collab With Us", path: "/contactus" },
              { name: "Become a Member", path: "/signup" },
            ],
          },
        ].map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#c8a97e] mb-4">
              {col.title}
            </h3>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.path}
                    className="text-white/60 text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-white/40 text-xs">
        <span>© 2026 Reaina's Haven. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white/70 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white/70 transition-colors">Cookie Preferences</a>
        </div>
      </div>
    </footer>
  );
};

export default ProductsFooter;
