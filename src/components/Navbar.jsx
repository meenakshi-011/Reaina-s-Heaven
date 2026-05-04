import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { io } from "socket.io-client";
import { API_URL, SOCKET_URL } from "../config";

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
          { name: "Books", to: "/books" },
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
    to: "/cafe",
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
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { cartItemsCount } = useCart();
  const isAdmin = user?.role?.toUpperCase() === "SUPER_ADMIN" || user?.role?.toUpperCase() === "ADMIN"; 

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetch(`${API_URL}/api/user/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          }
        } catch (error) {
          console.error("Error fetching user in navbar:", error);
        }
      }
    };
    fetchUser();
  }, [location.pathname]);

  // Global Real-time Notifications
  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("newOrder", (order) => {
      // Notify Admin
      if (isAdmin) {
        toast.success(`🎉 New Order! #${order._id.slice(-8).toUpperCase()}`, {
          duration: 8000,
          position: "top-right",
          style: { background: '#2d3a2d', color: '#fff', border: '1px solid #c8a97e' },
          icon: '📦'
        });
      }
    });

    socket.on("newSignup", (newUser) => {
      // Notify Admin
      if (isAdmin) {
        toast.success(`👤 New Member: ${newUser.name}`, {
          duration: 5000,
          position: "top-right",
          style: { background: '#a67c52', color: '#fff' },
          icon: '✨'
        });
      }
    });

    socket.on("orderUpdated", (updatedOrder) => {
      // Notify the specific User
      if (user && (updatedOrder.user === user._id || updatedOrder.user?._id === user._id)) {
        toast(`🚚 Order #${updatedOrder._id.slice(-8).toUpperCase()} Status: ${updatedOrder.status}`, {
          duration: 8000,
          position: "bottom-right",
          style: { background: '#f8f5f2', color: '#2d3a2d', border: '2px solid #a67c52' },
        });
      }
    });

    return () => socket.disconnect();
  }, [isAdmin, user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setProfileOpen(false);
    setUser(null);
    toast.success("Successfully logged out.", {
      style: { background: '#f8f5f2', color: '#2d3a2d', border: '1px solid #c8a97e' },
      iconTheme: { primary: '#a67c52', secondary: '#f8f5f2' },
    });
    navigate("/login");
  };

  return (
    <nav className="w-full bg-[#f8f5f2] shadow-md sticky top-0 z-40">
      <div className="w-full flex items-center justify-between px-6 lg:px-12 py-4">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-serif text-green-800 hover:opacity-80 transition-opacity whitespace-nowrap">
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
        <div className="flex items-center gap-2 md:gap-3">
          {/* SEARCH (Desktop only) */}
          <div className="relative hidden xl:block">
            <input
              type="text"
              placeholder="Find a cozy gift…"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`/products?search=${e.target.value}`);
                }
              }}
              className="px-4 py-2 w-48 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30 bg-white transition-all"
            />
          </div>

          {/* CART ICON */}
          <Link to="/cart" className="relative w-8 h-8 md:w-9 md:h-9 bg-white border border-[#d4c4b0] rounded-full flex items-center justify-center shadow-sm hover:bg-[#f0e8dc] transition-colors duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#a67c52]"
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
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 md:w-4 md:h-4 bg-rose-500 text-white rounded-full text-[8px] md:text-[10px] flex items-center justify-center font-bold">
                {cartItemsCount}
              </span>
            )}
          </Link>

          {/* PROFILE & LOGOUT */}
          <div className="flex items-center gap-2 md:gap-4">
            {localStorage.getItem("token") ? (
              <>
                <div className="relative">
                  <div 
                    className="w-8 h-8 md:w-9 md:h-9 bg-[#c8a97e] rounded-full flex items-center justify-center text-white text-[10px] md:text-xs font-semibold shadow-sm cursor-pointer hover:bg-[#a67c52] transition-colors"
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    {user?.name ? user.name[0].toUpperCase() : "?"}
                  </div>
                  
                  {/* PROFILE DROPDOWN */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-40 md:w-48 bg-white border border-[#e0d8ce] rounded-xl shadow-lg overflow-hidden py-2 z-50">
                      <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-[#f8f5f2] hover:text-green-800 transition-colors">
                        User Dashboard
                      </Link>
                      <Link to="/orders" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-[#f8f5f2] hover:text-green-800 transition-colors">
                        My Orders
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-[#f8f5f2] hover:text-green-800 transition-colors">
                          Admin Panel
                        </Link>
                      )}
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={handleLogout} 
                  className="hidden md:block text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-full border border-red-200 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-1.5 md:gap-2">
                <Link to="/login" className="text-[10px] md:text-sm font-medium text-gray-700 hover:text-green-700 bg-white/50 px-2.5 md:px-4 py-1.5 md:py-2 rounded-full border border-gray-200 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="text-[10px] md:text-sm font-medium text-white bg-[#a67c52] hover:bg-[#8e6844] px-2.5 md:px-4 py-1.5 md:py-2 rounded-full transition-colors shadow-sm">
                  Sign Up
                </Link>
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
        <div className="lg:hidden absolute top-full left-0 w-full h-[calc(100vh-64px)] bg-white/95 backdrop-blur-md z-50 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col p-8 gap-8">
            
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search for gifts, cafe treats..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setMenuOpen(false);
                    navigate(`/products?search=${e.target.value}`);
                  }
                }}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#e0d8ce] bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a67c52]"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </div>

            <div className="flex flex-col gap-6">
              {navLinks.map(({ label, to, dropdown }) => (
                <div key={label} className="flex flex-col">
                  <Link
                    to={to}
                    className="text-[#3e3e3e] text-2xl font-serif font-bold py-2 flex justify-between items-center group"
                    onClick={() => !dropdown && setMenuOpen(false)}
                  >
                    <span className="group-hover:text-[#a67c52] transition-colors">{label}</span>
                    {dropdown && <span className="text-[10px] bg-[#fdfaf7] px-3 py-1 rounded-full text-[#a67c52] font-sans uppercase tracking-widest border border-[#a67c52]/10">View All</span>}
                  </Link>
                  {dropdown && (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4 pl-4 border-l-2 border-[#fdfaf7]">
                      {dropdown.flatMap(d => d.items).slice(0, 8).map((item, idx) => (
                        <Link 
                          key={idx} 
                          to={item.to} 
                          className="text-gray-500 text-sm py-1 hover:text-[#a67c52] transition-colors"
                          onClick={() => setMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-auto pt-10 border-t border-gray-100 flex flex-col gap-4">
              {!localStorage.getItem("token") ? (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="w-full text-center py-4 rounded-2xl bg-white border border-[#a67c52] text-[#a67c52] font-bold text-lg shadow-sm">Login</Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)} className="w-full text-center py-4 rounded-2xl bg-[#a67c52] text-white font-bold text-lg shadow-lg">Create Account</Link>
                </>
              ) : (
                <button 
                  onClick={() => { handleLogout(); setMenuOpen(false); }} 
                  className="w-full text-center py-4 rounded-2xl bg-rose-50 text-rose-600 font-bold text-lg border border-rose-100"
                >
                  Logout
                </button>
              )}
            </div>

            <div className="text-center pb-10">
              <p className="text-gray-400 text-xs font-medium tracking-widest uppercase">Reaina's Haven 🌿 Jabalpur</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;