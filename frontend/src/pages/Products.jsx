import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { API_URL } from "../config";
import Navbar from "../components/Navbar";
import ProductsFooter from "../components/ProductsFooter";
import ProductCard from "../components/Productcard";
import Loader from "../components/Loader";


import { getProducts } from "../services/api";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const priceRanges = ["All", "Under ₹1000", "₹1000 - ₹3000", "Over ₹3000"];


/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
const categories = ["All", "Combos", "Hampers", "Books", "Flowers", "Chocolates", "Candles"];

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
const Products = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeMood, setActiveMood] = useState("All");
  const [activePrice, setActivePrice] = useState("All");
  const [search, setSearch] = useState("");
  
  const [sortBy, setSortBy] = useState("Featured");
  
  // Real-time integration states
  const [products, setProducts] = useState([]);
  const [userWishlist, setUserWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { search: urlSearch } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(urlSearch);
    const query = params.get("search");
    if (query) {
      setSearch(query);
    }
    
    // Fetch products
    getProducts()
      .then(data => {
        if (data.error || data.message === "Total data failure") {
          throw new Error(data.message || 'Database connection failed');
        }
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

    // Fetch user wishlist if logged in
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user && data.user.wishlist) {
          setUserWishlist(data.user.wishlist.map(item => item._id || item));
        }
      })
      .catch(err => console.error("Wishlist fetch error:", err));
    }
  }, [urlSearch]);

  // Derive dynamic filters from data
  const moods = ["All", ...new Set(products.map(p => p.mood).filter(Boolean))];

  const filtered = products
    .filter((p) => {
      // Only show products that have an image
      const img = p.imageUrl || p.imageurl || p.image || "";
      if (!img.trim()) return false;

      // Category filter
      let matchCat = activeCategory === "All";
      if (!matchCat) {
        const catLower = activeCategory.toLowerCase();
        matchCat = (p.category && p.category.toLowerCase().includes(catLower.slice(0, -1))) ||
                  (p.name && p.name.toLowerCase().includes(catLower.slice(0, -1)));
        if (catLower === 'combos' || catLower === 'hampers') {
          const singular = catLower.slice(0, -1);
          matchCat = (p.category && p.category.toLowerCase().includes(singular)) ||
                    (p.name && p.name.toLowerCase().includes(singular));
        }
      }

      const matchMood = activeMood === "All" || p.mood === activeMood;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());

      const pPrice = typeof p.price === 'object' && p.price !== null ? p.price.value : (p.price || 0);
      let matchPrice = true;
      if (activePrice === "Under ₹1000") matchPrice = pPrice < 1000;
      if (activePrice === "₹1000 - ₹3000") matchPrice = pPrice >= 1000 && pPrice <= 3000;
      if (activePrice === "Over ₹3000") matchPrice = pPrice > 3000;

      return matchCat && matchMood && matchPrice && matchSearch;
    })
    .sort((a, b) => {
      const priceA = typeof a.price === 'object' && a.price !== null ? a.price.value : (a.price || 0);
      const priceB = typeof b.price === 'object' && b.price !== null ? b.price.value : (b.price || 0);

      if (sortBy === "Price: Low to High") return priceA - priceB;
      if (sortBy === "Price: High to Low") return priceB - priceA;
      if (sortBy === "Rating: High to Low") return (b.avg_rating || b.rating || 0) - (a.avg_rating || a.rating || 0);
      return 0; // Featured / Default
    });

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Reset to page 1 whenever filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeMood, activePrice, search, sortBy]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      <Navbar />

      {/* ── HERO BANNER ─────────────────── */}
      <section className="relative overflow-hidden bg-[#eee8e0] py-16 px-6">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#c8a97e]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-96 h-72 bg-green-800/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm text-[#8c8c73] uppercase tracking-[0.25em] font-medium mb-3">
              Our Collection
            </p>
            <h1 className="text-5xl md:text-6xl font-serif text-[#3e3e3e] leading-tight mb-5">
              Curated With{" "}
              <span className="text-green-800 italic">Love &amp; Care</span>
            </h1>
            <p className="text-gray-500 max-w-md leading-relaxed text-lg mb-8 mx-auto md:mx-0">
              Find exactly what you are looking for by categorizing items by product type, aesthetic mood, or price.
            </p>
            <div className="relative inline-flex w-full max-w-sm">
              <input
                type="text"
                placeholder="Search by name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-5 pr-12 py-3 rounded-full border border-[#d4c4b0] bg-white/80 backdrop-blur-sm text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#a67c52]/40 shadow-sm"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a67c52]"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── ADVANCED FILTERS ─────────────── */}
      <section className="sticky top-0 z-30 bg-[#f8f5f2]/95 backdrop-blur-lg border-b border-[#e0d8ce] shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-4">
            {/* CATEGORY SELECTOR */}
            <div className="flex items-center gap-2">
              <label className="text-[#8c8c73] text-xs font-bold uppercase tracking-widest hidden lg:block">Category:</label>
              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-[#d4c4b0] text-[#3e3e3e] text-sm font-medium rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-[#a67c52] shadow-sm cursor-pointer"
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a67c52] text-[10px]">▼</span>
              </div>
            </div>

            {/* MOOD SELECTOR */}
            <div className="flex items-center gap-2">
              <label className="text-[#8c8c73] text-xs font-bold uppercase tracking-widest hidden lg:block">Mood:</label>
              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-[#d4c4b0] text-[#3e3e3e] text-sm font-medium rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-[#a67c52] shadow-sm cursor-pointer"
                  value={activeMood}
                  onChange={(e) => setActiveMood(e.target.value)}
                >
                  {moods.map((mood) => (
                    <option key={mood} value={mood}>{mood}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a67c52] text-[10px]">▼</span>
              </div>
            </div>

            {/* PRICE SELECTOR */}
            <div className="flex items-center gap-2">
              <label className="text-[#8c8c73] text-xs font-bold uppercase tracking-widest hidden lg:block">Price:</label>
              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-[#d4c4b0] text-[#3e3e3e] text-sm font-medium rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-[#a67c52] shadow-sm cursor-pointer"
                  value={activePrice}
                  onChange={(e) => setActivePrice(e.target.value)}
                >
                  {priceRanges.map((price) => (
                    <option key={price} value={price}>{price}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a67c52] text-[10px]">▼</span>
              </div>
            </div>

            {/* SORT SELECTOR */}
            <div className="flex items-center gap-2 lg:ml-4 lg:pl-4 lg:border-l lg:border-[#d4c4b0]">
              <label className="text-[#8c8c73] text-xs font-bold uppercase tracking-widest hidden lg:block">Sort By:</label>
              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-[#d4c4b0] text-[#3e3e3e] text-sm font-medium rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-[#a67c52] shadow-sm cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating: High to Low</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a67c52] text-[10px]">▼</span>
              </div>
            </div>
          </div>

          <div className="text-sm font-medium text-[#c8a97e] bg-white px-4 py-2 rounded-full border border-[#e0d8ce] shadow-sm">
            {filtered.length} Result{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>
      </section>

      {/* ── PRODUCT GRID ─────────────────── */}
      <section className="max-w-[1400px] mx-auto px-6 py-12">
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-red-100 shadow-sm px-6">
            <span className="text-3xl mb-4">✨</span>
            <h3 className="text-xl font-serif text-[#3e3e3e] mb-2">Something went wrong</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#a67c52] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#3e3e3e] transition-all"
            >
              Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[2.5rem] border border-dashed border-[#e0d8ce] px-6">
            <span className="text-4xl mb-6 grayscale opacity-50">🌿</span>
            <h3 className="text-2xl font-serif text-[#3e3e3e] mb-3">No results found</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8">We couldn't find any products matching your current filters. Try resetting them to see everything.</p>
            <button 
              onClick={() => {
                setActiveCategory("All");
                setActiveMood("All");
                setActivePrice("All");
                setSearch("");
              }}
              className="px-8 py-3 bg-[#fdfaf7] border border-[#a67c52]/30 text-[#a67c52] text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#a67c52] hover:text-white transition-all shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 lg:gap-x-8 lg:gap-y-12 mb-16">
              {currentItems.map((product) => (
                <ProductCard 
                  key={product._id || product.id} 
                  product={product} 
                  isWishlisted={userWishlist.includes(product._id || product.id)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 py-8 border-t border-[#e0d8ce]">
                <button 
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${
                    currentPage === 1 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-white border border-[#a67c52] text-[#a67c52] hover:bg-[#a67c52] hover:text-white"
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                        currentPage === i + 1
                          ? "bg-[#3e3e3e] text-white shadow-lg"
                          : "bg-white text-[#a67c52] border border-[#e0d8ce] hover:border-[#a67c52]"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${
                    currentPage === totalPages 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-white border border-[#a67c52] text-[#a67c52] hover:bg-[#a67c52] hover:text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── NATURE BANNER ─────────────────── */}
      <section className="relative overflow-hidden bg-green-800 py-20 px-6 text-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&auto=format&fit=crop"
            alt="Nature"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-green-300 uppercase tracking-widest text-sm mb-3">
            Our Promise
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight mb-6">
            Sustainably Sourced, <br />
            <span className="italic text-[#c8a97e]">Mindfully Made</span>
          </h2>
          <p className="text-white/70 leading-relaxed mb-8">
            We partner with local growers, independent authors, and small-batch
            artisans to bring you products that are good for you and the planet.
          </p>
          <button className="bg-[#c8a97e] text-white px-10 py-3 rounded-full font-medium hover:bg-[#a67c52] transition-all hover:scale-105 shadow-xl">
            Learn Our Story
          </button>
        </div>
      </section>

      {/* ── NEWSLETTER ─────────────────────── */}
      <section className="bg-[#eee8e0] py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-3xl mb-3 block">🌸</span>
          <h2 className="text-3xl font-serif text-[#3e3e3e] mb-3">
            Stay in the loop
          </h2>
          <p className="text-gray-500 mb-8">
            Get weekly arrivals, seasonal offers &amp; cozy inspiration
            delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-5 py-3 rounded-full border border-[#d4c4b0] bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#a67c52]/40 shadow-sm"
            />
            <button className="bg-[#a67c52] text-white px-7 py-3 rounded-full font-medium hover:bg-[#8e6a45] transition-all hover:scale-105 shadow-md">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────── */}
      <ProductsFooter />
    </div>
  );
};

export default Products;
