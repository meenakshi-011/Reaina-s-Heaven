import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { io } from "socket.io-client";
import { API_URL, SOCKET_URL } from "../config";
import {
  Search,
  ShoppingCart,
  User as UserIcon,
  LogOut,
  Package,
  Sparkles,
  LayoutDashboard,
  Shield,
  ChevronDown,
  X,
  Menu,
} from "lucide-react";

/* ─────────────────────────── NAV STRUCTURE ─────────────────────────── */
const navLinks = [
  { label: "Home", to: "/" },
  {
    label: "Products",
    to: "/products",
    dropdown: [
      {
        section: "Shop",
        items: [
          { name: "All Products", to: "/products" },
          { name: "Books", to: "/books" },
          { name: "Flowers", to: "/products" },
        ],
      },
      {
        section: "Occasions",
        items: [
          { name: "Birthdays", to: "/services" },
          { name: "Anniversaries", to: "/services" },
          { name: "Engagements", to: "/services" },
        ],
      },
      {
        section: "Events",
        items: [
          { name: "Private Dining", to: "/services" },
          { name: "Bride to Be", to: "/services" },
          { name: "Baby Shower", to: "/services" },
        ],
      },
    ],
  },
  {
    label: "Café Menu",
    to: "/cafe",
    dropdown: [
      {
        items: [
          { name: "Brownies", to: "/cafe" },
          { name: "Cakes", to: "/cafe" },
          { name: "Breads", to: "/cafe" },
          { name: "Pastries", to: "/cafe" },
          { name: "Desserts & Cupcakes", to: "/cafe" },
          { name: "Croissants & Muffins", to: "/cafe" },
        ],
      },
      {
        items: [
          { name: "Sandwiches & Savouries", to: "/cafe" },
          { name: "Beverages", to: "/cafe" },
          { name: "Biscuits & Cookies", to: "/cafe" },
          { name: "Chocolates", to: "/cafe" },
          { name: "Gifting", to: "/cafe" },
          { name: "Mango Specials 🥭", to: "/cafe" },
        ],
      },
    ],
  },
  {
    label: "Services",
    to: "/services",
    dropdown: [
      {
        section: "Food & Delivery",
        items: [
          { name: "🍱 Tiffin Services", to: "/services#tiffin" },
          { name: "🎂 Cake Services", to: "/services#cakes" },
          { name: "⚡ Instant Delivery", to: "/services#instant-delivery" },
        ],
      },
      {
        section: "Events & Dining",
        items: [
          { name: "Private Couple Dining", to: "/services#private" },
          { name: "Bespoke Party Catering", to: "/services#private" },
          { name: "Café Booking", to: "/services" },
        ],
      },
    ],
  },
  { label: "Experiences", to: "/experiences" },
  { label: "About Us", to: "/aboutus" },
  { label: "Contact Us", to: "/contactus" },
];

/* ─────────────────────────── COMPONENT ─────────────────────────────── */
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const profileRef = useRef(null);
  const { cartItemsCount } = useCart();

  const isAdmin =
    user?.role?.toUpperCase() === "SUPER_ADMIN" ||
    user?.role?.toUpperCase() === "ADMIN" ||
    user?.role?.toUpperCase() === "OPERATIONS_MANAGER";

  const isLoggedIn = !!localStorage.getItem("token");

  /* ── Fetch user ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setUser(null); return; }
    fetch(`${API_URL}/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setUser(d.user))
      .catch(() => {});
  }, [location.pathname]);

  /* ── Close profile dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Lock scroll when mobile menu open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* ── Socket notifications ── */
  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on("newOrder", (order) => {
      if (isAdmin)
        toast.success(`🎉 New Order #${order._id.slice(-6).toUpperCase()}`, {
          duration: 7000, position: "top-right",
          style: { background: "#2d3a2d", color: "#fff", border: "1px solid #c8a97e" },
        });
    });
    socket.on("newSignup", (u) => {
      if (isAdmin)
        toast.success(`👤 New Member: ${u.name}`, {
          duration: 5000, position: "top-right",
          style: { background: "#a67c52", color: "#fff" },
        });
    });
    socket.on("orderUpdated", (o) => {
      if (user && (o.user === user._id || o.user?._id === user._id))
        toast(`🚚 Order #${o._id.slice(-6).toUpperCase()} → ${o.status}`, {
          duration: 7000, position: "bottom-right",
          style: { background: "#f8f5f2", color: "#2d3a2d", border: "2px solid #a67c52" },
        });
    });
    return () => socket.disconnect();
  }, [isAdmin, user]);

  /* ── Logout ── */
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setProfileOpen(false);
    setMobileOpen(false);
    toast.success("Logged out successfully.", {
      style: { background: "#f8f5f2", color: "#2d3a2d", border: "1px solid #c8a97e" },
      iconTheme: { primary: "#a67c52", secondary: "#f8f5f2" },
    });
    navigate("/login");
  };

  /* ── Search submit ── */
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  };

  /* ── User initials / avatar ── */
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : null;

  /* ── Active link check ── */
  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <>
      {/* ══════════════════════ DESKTOP NAV ══════════════════════ */}
      <nav className="w-full bg-[#FAF8F5]/96 backdrop-blur-md border-b border-[#e8dfd5] sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto flex items-center gap-4 px-5 lg:px-8 xl:px-12 h-16">

          {/* BRAND */}
          <Link
            to="/"
            className="flex items-center gap-1.5 shrink-0 font-serif text-[#2d3a2d] font-bold text-xl hover:opacity-80 transition-opacity"
          >
            Reaina's Haven
            <span className="text-base">🌿</span>
          </Link>

          {/* ─── DESKTOP LINKS ─── */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 ml-2 flex-1">
            {navLinks.map(({ label, to, dropdown }) => {
              const active = isActive(to);
              if (dropdown) {
                return (
                  <div key={label} className="relative group">
                    <Link
                      to={to}
                      className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-[13px] xl:text-sm font-medium transition-colors whitespace-nowrap ${
                        active
                          ? "bg-[#2d3a2d] text-white"
                          : "text-gray-700 hover:bg-black/[0.06] hover:text-[#2d3a2d]"
                      }`}
                    >
                      {label}
                      <ChevronDown
                        size={12}
                        className="opacity-50 group-hover:rotate-180 transition-transform duration-200 mt-px"
                      />
                    </Link>

                    {/* MEGA DROPDOWN */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div
                        className={`bg-white shadow-[0_16px_48px_rgba(0,0,0,0.13)] rounded-2xl border border-[#e8dfd5] p-6 grid gap-6 min-w-[480px] ${
                          dropdown.length === 2 ? "grid-cols-2" : "grid-cols-3"
                        }`}
                      >
                        {dropdown.map((col, i) => (
                          <div key={i}>
                            {col.section && (
                              <p className="text-[10px] font-bold uppercase tracking-widest text-[#a67c52] mb-3 border-b border-gray-100 pb-2">
                                {col.section}
                              </p>
                            )}
                            <ul className="space-y-2">
                              {col.items.map((item, j) => (
                                <li key={j}>
                                  <Link
                                    to={item.to}
                                    className="text-[13px] text-gray-600 hover:text-[#a67c52] hover:translate-x-0.5 transition-all block font-medium"
                                  >
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
                  className={`inline-flex items-center px-3 py-2 rounded-full text-[13px] xl:text-sm font-medium transition-colors whitespace-nowrap ${
                    active
                      ? "bg-[#2d3a2d] text-white"
                      : "text-gray-700 hover:bg-black/[0.06] hover:text-[#2d3a2d]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* ─── RIGHT SIDE CONTROLS ─── */}
          <div className="flex items-center gap-2 ml-auto shrink-0">

            {/* CUSTOM STUDIO PILL — always visible on desktop */}
            <Link
              to="/customization"
              className={`hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap ${
                isActive("/customization")
                  ? "bg-[#a67c52] text-white shadow-sm"
                  : "bg-[#a67c52]/10 text-[#a67c52] border border-[#a67c52]/25 hover:bg-[#a67c52] hover:text-white hover:border-[#a67c52]"
              }`}
            >
              <Sparkles size={13} />
              Custom Studio
            </Link>

            {/* SEARCH — desktop only */}
            <div className="relative hidden xl:flex items-center">
              <Search
                size={14}
                className="absolute left-3 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Find a cozy gift…"
                className="pl-8 pr-4 py-2 w-44 2xl:w-52 rounded-full border border-[#ddd5cb] bg-white/80 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#a67c52] focus:ring-1 focus:ring-[#a67c52]/30 transition-all"
              />
            </div>

            {/* CART */}
            <Link
              to="/cart"
              title="Cart"
              className="relative w-9 h-9 flex items-center justify-center rounded-full border border-[#ddd5cb] bg-white text-[#a67c52] hover:border-[#a67c52] hover:bg-[#FDF9F5] transition-colors shadow-sm"
            >
              <ShoppingCart size={16} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {cartItemsCount > 99 ? "99+" : cartItemsCount}
                </span>
              )}
            </Link>

            {/* PROFILE / AUTH */}
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((p) => !p)}
                  title="Account"
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-[#a67c52] to-[#c8966a] flex items-center justify-center text-white text-sm font-bold shadow-sm cursor-pointer hover:shadow-md hover:scale-105 transition-all ring-2 ring-transparent hover:ring-[#a67c52]/30"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user?.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : userInitial ? (
                    userInitial
                  ) : (
                    <UserIcon size={15} />
                  )}
                </button>

                {/* PROFILE DROPDOWN */}
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-[#e8dfd5] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* Header */}
                    <div className="px-4 py-3.5 bg-[#FAF8F5] border-b border-gray-100">
                      <p className="font-semibold text-[13px] text-gray-900 truncate">
                        {user?.name || "Member"}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {user?.email}
                      </p>
                      <span
                        className={`inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          isAdmin
                            ? "bg-amber-100 text-amber-700"
                            : "bg-[#a67c52]/10 text-[#a67c52]"
                        }`}
                      >
                        {user?.role || "Customer"}
                      </span>
                    </div>

                    {/* Menu */}
                    <div className="py-1 text-[13px]">
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-[#FAF8F5] hover:text-[#a67c52] transition-colors"
                      >
                        <LayoutDashboard size={14} className="shrink-0" />
                        Dashboard
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-[#FAF8F5] hover:text-[#a67c52] transition-colors"
                      >
                        <Package size={14} className="shrink-0" />
                        My Orders
                      </Link>
                      <Link
                        to="/customization"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-[#FAF8F5] hover:text-[#a67c52] transition-colors"
                      >
                        <Sparkles size={14} className="shrink-0 text-[#a67c52]" />
                        My Custom Requests
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-[#FAF8F5] hover:text-[#a67c52] transition-colors font-medium"
                        >
                          <Shield size={14} className="shrink-0 text-amber-600" />
                          Admin Panel
                        </Link>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 py-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 transition-colors font-medium cursor-pointer"
                      >
                        <LogOut size={14} className="shrink-0" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-[13px] font-semibold text-gray-700 hover:text-[#2d3a2d] rounded-full hover:bg-black/[0.05] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-[13px] font-semibold text-white bg-[#a67c52] hover:bg-[#8e6840] rounded-full shadow-sm transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* HAMBURGER */}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full border border-[#ddd5cb] bg-white text-gray-700 hover:border-[#a67c52] hover:text-[#a67c52] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════ MOBILE DRAWER ══════════════════════ */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto"
          style={{ top: "64px" }}
        >
          <div className="p-5 space-y-5 pb-24">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search gifts, cakes, flowers…"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#a67c52] focus:ring-1 focus:ring-[#a67c52]/20"
              />
            </div>

            {/* Custom Studio CTA */}
            <Link
              to="/customization"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#a67c52]/10 text-[#a67c52] border border-[#a67c52]/20 font-semibold text-sm hover:bg-[#a67c52] hover:text-white transition-all"
            >
              <Sparkles size={16} />
              Custom Studio ✨
            </Link>

            {/* Nav links */}
            <div className="divide-y divide-gray-100">
              {navLinks.map(({ label, to, dropdown }) => (
                <div key={label} className="py-1">
                  <Link
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between py-2.5 font-semibold text-sm ${
                      isActive(to) ? "text-[#a67c52]" : "text-gray-800"
                    }`}
                  >
                    {label}
                    {dropdown && (
                      <ChevronDown size={14} className="text-gray-400" />
                    )}
                  </Link>
                  {dropdown && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 pl-3 pb-2">
                      {dropdown
                        .flatMap((d) => d.items)
                        .slice(0, 8)
                        .map((item, i) => (
                          <Link
                            key={i}
                            to={item.to}
                            onClick={() => setMobileOpen(false)}
                            className="text-[12px] text-gray-500 hover:text-[#a67c52] transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Auth */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              {isLoggedIn ? (
                <>
                  {user && (
                    <div className="flex items-center gap-3 px-1 pb-3 border-b border-gray-100">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#a67c52] to-[#c8966a] flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {userInitial || <UserIcon size={15} />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  )}
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-1 py-2 text-sm text-gray-700">
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-1 py-2 text-sm text-gray-700">
                    <Package size={15} /> My Orders
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-1 py-2 text-sm text-gray-700">
                      <Shield size={15} className="text-amber-600" /> Admin Panel
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-2xl bg-red-50 text-red-600 font-semibold text-sm border border-red-100 cursor-pointer"
                  >
                    <LogOut size={15} /> Log Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="py-3 text-center rounded-2xl border border-gray-200 font-semibold text-sm text-gray-800 hover:border-[#a67c52]"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="py-3 text-center rounded-2xl bg-[#a67c52] text-white font-semibold text-sm shadow-sm hover:bg-[#8e6840]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
