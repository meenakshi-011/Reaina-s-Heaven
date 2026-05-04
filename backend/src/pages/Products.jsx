import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProductsFooter from "../components/ProductsFooter";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const categories = ["All", "Flowers", "Hampers", "Books", "Café", "Candles"];
const moods = ["All", "Romantic", "Cozy", "Calm", "Energizing"];
const priceRanges = ["All", "Under $30", "$30 - $60", "Over $60"];



/* ─────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────── */
const ProductCard = ({ product }) => {
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col border border-transparent hover:border-[#e0d8ce]">
      {/* Image */}
      <div className="relative overflow-hidden h-60">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-[#3e3e3e]/0 group-hover:bg-[#3e3e3e]/10 transition-all duration-500" />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
          {product.tag && (
            <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${product.tagColor} shadow-sm backdrop-blur-lg`}>
              {product.tag}
            </span>
          )}
          <span className="bg-white/80 backdrop-blur-sm text-[#8c8c73] text-[10px] uppercase font-semibold tracking-widest px-3 py-1 rounded-full shadow-sm">
            {product.mood}
          </span>
        </div>

        {/* Wishlist */}
        <button
          onClick={() => setWishlist(!wishlist)}
          className="absolute top-3 right-3 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
          aria-label="Add to wishlist"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-5 h-5 transition-colors duration-200 ${
              wishlist ? "fill-rose-500 stroke-rose-500" : "fill-none stroke-gray-400"
            }`}
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs text-[#8c8c73] uppercase tracking-widest font-medium mb-1">
          {product.category}
        </span>
        <h3 className="text-[#3e3e3e] font-serif text-lg font-semibold leading-snug mb-2">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed flex-1">{product.description}</p>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-5">
          <span className="text-xl font-bold text-[#a67c52]">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAdd}
            className={`px-5 py-2 rounded-full text-sm font-medium shadow-md transition-all duration-300 ${
              added
                ? "bg-green-700 text-white scale-95"
                : "bg-[#a67c52] hover:bg-[#8e6a45] text-white hover:scale-105"
            }`}
          >
            {added ? "✓ Added!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
const Products = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeMood, setActiveMood] = useState("All");
  const [activePrice, setActivePrice] = useState("All");
  const [search, setSearch] = useState("");
  
  // Real-time integration states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from our local json-server API
    fetch('http://localhost:5000/products')
      .then(res => {
        if (!res.ok) throw new Error('Database connection failed');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchMood = activeMood === "All" || p.mood === activeMood;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    
    let matchPrice = true;
    if (activePrice === "Under $30") matchPrice = p.price < 30;
    if (activePrice === "$30 - $60") matchPrice = p.price >= 30 && p.price <= 60;
    if (activePrice === "Over $60") matchPrice = p.price > 60;

    return matchCat && matchMood && matchPrice && matchSearch;
  });

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
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a67c52]">▼</span>
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
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a67c52]">▼</span>
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
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a67c52]">▼</span>
              </div>
            </div>
          </div>

          <div className="text-sm font-medium text-[#c8a97e] bg-white px-4 py-2 rounded-full border border-[#e0d8ce] shadow-sm">
            {filtered.length} Result{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>
      </section>

      {/* ── PRODUCT GRID ─────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 text-center text-[#a67c52]">
            <div className="w-12 h-12 border-4 border-[#e0d8ce] border-t-[#a67c52] rounded-full animate-spin mb-4"></div>
            <p className="font-serif">Loading collection...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-28 text-center bg-red-50 text-red-700 rounded-3xl border border-red-200">
            <span className="text-4xl mb-4">⚠️</span>
            <h3 className="text-xl font-serif mb-2">Failed to load catalogue</h3>
            <p className="text-sm">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center bg-white rounded-3xl border border-dashed border-[#d4c4b0]">
            <span className="text-5xl mb-4 opacity-50">🍃</span>
            <h3 className="text-xl font-serif text-[#3e3e3e] mb-2">No exact match found</h3>
            <p className="text-gray-400 text-sm">Try tweaking your filters or search term to discover more items.</p>
            <button 
              onClick={() => {
                setActiveCategory("All");
                setActiveMood("All");
                setActivePrice("All");
                setSearch("");
              }}
              className="mt-6 px-6 py-2 bg-[#f8f5f2] border border-[#d4c4b0] text-[#a67c52] text-sm font-medium rounded-full hover:bg-white transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
