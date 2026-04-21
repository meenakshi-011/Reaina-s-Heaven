import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/aboutus" },
  { 
    label: "Products", 
    to: "/products",
    dropdown: [
      {
        section: "Retail & Experiences",
        items: [
          { name: "Books", to: "/products" },
          { name: "Flowers", to: "/products" },
          { name: "Café Booking", to: "/services" }
        ]
      },
      {
        section: "Private Events",
        items: [
          { name: "Private Couple Booking", to: "/services" },
          { name: "Bride to be", to: "/services" },
          { name: "Baby Shower", to: "/services" },
          { name: "Bachelors", to: "/services" }
        ]
      },
      {
        section: "Special Combos",
        items: [
          { name: "Birthdays", to: "/services" },
          { name: "Anniversaries", to: "/services" },
          { name: "Engagement Parties", to: "/services" }
        ]
      }
    ]
  },
  { 
    label: "Café Menu", 
    to: "#",
    dropdown: [
      {
        items: [
          { name: "BROWNIES", to: "/cafe" },
          { name: "BREADS", to: "/cafe" },
          { name: "COMBOS", to: "/cafe" },
          { name: "DESSERTS & CUPCAKES", to: "/cafe" },
          { name: "SANDWICHES & SAVOURIES", to: "/cafe" },
          { name: "BEVERAGES", to: "/cafe" },
          { name: "COLLECTIBLES", to: "/cafe" },
          { name: "MANGO SPECIALS", to: "/cafe" }
        ]
      },
      {
        items: [
          { name: "BISCUITS, COOKIES & CRACKERS", to: "/cafe" },
          { name: "CAKES", to: "/cafe" },
          { name: "CROISSANT, DANISHES & MUFFINS", to: "/cafe" },
          { name: "PASTRIES", to: "/cafe" },
          { name: "TEA CAKES", to: "/cafe" },
          { name: "GIFTING", to: "/cafe" },
          { name: "CHOCOLATES", to: "/cafe" }
        ]
      }
    ]
  },
  { label: "Services", to: "/services" },
  { label: "Experiences", to: "/experiences" },
  { label: "Contact Us", to: "/contactus" },
];

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const isLoggedIn = true; // Mocked logic: User is logged in
  const isAdmin = true;     // Mocked logic: User is an admin

  return (
    <nav className="w-full bg-[#f8f5f2] shadow-md sticky top-0 z-40">
      <div className="w-full flex items-center justify-between px-6 lg:px-12 py-4">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-serif text-green-800 hover:opacity-80 transition-opacity">
          Reaina's Haven 🌿
        </Link>

        {/* NAV LINKS — desktop */}
        <div className="hidden lg:flex flex-1 justify-center gap-2 xl:gap-6 text-gray-700 font-medium text-[13px] items-center">
          {navLinks.map(({ label, to, dropdown }) => {
            const isActive = location.pathname === to;

            if (dropdown) {
              return (
                <div key={label} className="relative group">
                  <Link
                    to={to}
                    className={`relative px-4 py-2 transition-colors duration-200 flex items-center gap-1 font-medium rounded-full whitespace-nowrap ${
                      isActive
                        ? "bg-[#222] text-white"
                        : "text-gray-700 hover:bg-gray-100 group-hover:bg-[#222] group-hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>

                  {/* DROP-DOWN MENU (SOLID & LEFT-ALIGNED) */}
                  <div className="absolute top-full left-0 w-[650px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pt-2">
                    <div className={`bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl p-10 grid gap-12 ${dropdown.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                      {dropdown.map((col, idx) => (
                        <div key={idx}>
                          {col.section && (
                            <h4 className="text-[#3e3e3e] font-bold uppercase tracking-widest text-[11px] mb-6 border-b border-gray-100 pb-2">{col.section}</h4>
                          )}
                          <ul className="flex flex-col gap-5">
                            {col.items.map((item, i) => (
                              <li key={i}>
                                <Link to={item.to} className="text-[#a67c52] font-semibold text-[13px] uppercase hover:text-green-800 transition-colors block tracking-wide">
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={label}
                to={to}
                className={`relative px-4 py-2 transition-colors duration-200 flex items-center gap-1 font-medium rounded-full whitespace-nowrap ${
                  isActive
                    ? "font-semibold text-green-800 bg-green-50"
                    : "text-gray-700 hover:bg-gray-100 hover:text-green-800"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Find a cozy gift…"
            className="hidden xl:block px-4 py-2 w-48 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30 bg-white"
          />

          {/* AI BUTTON */}
          <button className="bg-[#c8a97e] text-white px-3 md:px-5 py-2 rounded-full text-[11px] md:text-sm shadow-md hover:scale-105 hover:bg-[#a67c52] transition-all duration-200 whitespace-nowrap">
            Ask Haven AI ✨
          </button>

          {/* CART ICON */}
          <button className="relative w-9 h-9 bg-white border border-[#d4c4b0] rounded-full flex items-center justify-center shadow-sm hover:bg-[#f0e8dc] transition-colors duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-[#a67c52]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0z"
              />
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
              3
            </span>
          </button>

          {/* PROFILE */}
          <div className="relative">
            {isLoggedIn ? (
              <div 
                className="w-9 h-9 bg-[#c8a97e] rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm cursor-pointer hover:bg-[#a67c52] transition-colors"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                R
              </div>
            ) : (
              <button className="text-sm font-medium text-gray-700 hover:text-green-700">Login</button>
            )}

            {/* PROFILE DROPDOWN */}
            {profileOpen && isLoggedIn && (
              <div className="absolute right-0 mt-3 w-48 bg-white border border-[#e0d8ce] rounded-xl shadow-lg overflow-hidden py-2 focus:outline-none z-50">
                <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f8f5f2] hover:text-green-800 transition-colors">
                  User Dashboard
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f8f5f2] hover:text-green-800 transition-colors">
                    Admin Panel
                  </Link>
                )}
                <div className="border-t border-[#e0d8ce] my-1"></div>
                <button onClick={() => setProfileOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-red-500 font-medium hover:bg-red-50 transition-colors">
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* HAMBURGER — mobile */}
          <button
            className="md:hidden ml-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-[#f8f5f2] border-t border-[#e0d8ce] px-6 pb-5 pt-3 flex flex-col gap-3">
          {navLinks.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="text-gray-700 text-sm font-medium py-1.5 hover:text-green-700 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;