import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { API_URL, SOCKET_URL } from "../config";
import Navbar from "../components/Navbar";
import ProductsFooter from "../components/ProductsFooter";
import CafeCard from "../components/CafeCard";
import CafeItemModal from "../components/CafeItemModal";
import Loader from "../components/Loader";


const Cafe = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCafeItem, setSelectedCafeItem] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        console.log(`Fetching from: ${API_URL}/api/cafe`);
        const res = await axios.get(`${API_URL}/api/cafe`);
        console.log("Fetched items:", res.data);
        setItems(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Real-time updates for Cafe Menu
  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("cafeItemAdded", (newItem) => {
      setItems(prev => [newItem, ...prev]);
    });

    socket.on("cafeItemUpdated", (updatedItem) => {
      setItems(prev => prev.map(item => item._id === updatedItem._id ? updatedItem : item));
    });

    socket.on("cafeItemDeleted", (itemId) => {
      setItems(prev => prev.filter(item => item._id !== itemId));
    });

    return () => socket.disconnect();
  }, []);

  const [search, setSearch] = useState("");
  const { search: urlSearch } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(urlSearch);
    const query = params.get("search");
    if (query) {
      setSearch(query);
    }
  }, [urlSearch]);

  const categories = ["All", ...new Set(items.map(i => i.category).filter(Boolean))];

  const filteredItems = items
    .filter(i => {
      const img = i.imageurl || i.imageul || "";
      return img.trim() !== "";
    })
    .filter(i => selectedCategory === "All" || i.category === selectedCategory)
    .filter(i => i.item_name.toLowerCase().includes(search.toLowerCase()));

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCafeItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fdfaf7]">
      <Navbar />

      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&auto=format&fit=crop" 
            alt="Cafe Hero" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">
            Reaina's <span className="italic text-[#c8a97e]">Heaven Cafe</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Experience the finest artisanal brews and gourmet delicacies.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-red-50 p-10">
            <h3 className="text-xl font-serif text-red-800 mb-2">Fetch Error</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="px-8 py-3 bg-[#a67c52] text-white rounded-full">Retry</button>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2 rounded-full border whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-[#a67c52] text-white border-[#a67c52] shadow-lg"
                        : "bg-white text-[#3e3e3e] border-[#e0d8ce] hover:border-[#a67c52]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search treats..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-[#e0d8ce] focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30 bg-white shadow-sm text-sm"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a67c52]"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </div>
            </div>

            {filteredItems.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-[#e0d8ce]">
                    <p className="text-4xl mb-4">☕</p>
                    <h3 className="text-2xl font-serif text-[#3e3e3e] mb-2">No menu items found</h3>
                    <p className="text-gray-500">The kitchen is preparing something special. Please check back soon!</p>
                </div>
            ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {currentCafeItems.map((item) => (
                      <CafeCard 
                        key={item._id} 
                        item={item} 
                        onImageClick={() => setSelectedCafeItem(item)} 
                      />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 py-12 border-t border-[#e0d8ce]">
                      <button 
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${
                          currentPage === 1 
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                            : "bg-white border border-[#a67c52] text-[#a67c52] hover:bg-[#a67c52] hover:text-white shadow-sm"
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
                                ? "bg-[#3e3e3e] text-white shadow-xl"
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
                            : "bg-white border border-[#a67c52] text-[#a67c52] hover:bg-[#a67c52] hover:text-white shadow-sm"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
            )}
          </>
        )}

        {/* ── CAFE INFORMATION SECTION ── */}
        <div className="mt-24 border-t border-[#e0d8ce] pt-16">
          <div className="text-center mb-12">
            <span className="text-sm font-bold tracking-widest uppercase text-[#a67c52] mb-2 block">
              Our Promise
            </span>
            <h2 className="text-3xl font-serif text-[#3e3e3e]">
              The Heaven Cafe Experience
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
            {/* Premium Ingredients */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e0d8ce]/50 hover:shadow-md transition-shadow text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-[#fdfaf7] rounded-full flex items-center justify-center mb-6 border border-[#a67c52]/20">
                <span className="text-[#a67c52] text-2xl">🌿</span>
              </div>
              <h3 className="text-xl font-serif text-[#3e3e3e] mb-3">
                Fresh Ingredients
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Every delicacy is prepared using only the finest, freshest, and locally sourced ingredients. We believe that exceptional taste begins with exceptional quality.
              </p>
            </div>

            {/* Handmade */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e0d8ce]/50 hover:shadow-md transition-shadow text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-[#fdfaf7] rounded-full flex items-center justify-center mb-6 border border-[#a67c52]/20">
                <span className="text-[#a67c52] text-2xl">🤲</span>
              </div>
              <h3 className="text-xl font-serif text-[#3e3e3e] mb-3">
                100% Handmade
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                From our artisanal brews to our gourmet pastries, everything is 100% handmade from scratch by our passionate chefs with meticulous attention to detail.
              </p>
            </div>
          </div>
        </div>
      </main>

      <ProductsFooter />

      <CafeItemModal 
        item={selectedCafeItem} 
        isOpen={!!selectedCafeItem} 
        onClose={() => setSelectedCafeItem(null)} 
      />
    </div>
  );
};

export default Cafe;
