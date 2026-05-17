import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProductsFooter from "../components/ProductsFooter";
import { getBooks } from "../services/api";
import Loader from "../components/Loader";


const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBooks()
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Could not load our library. Please try again later.");
        setLoading(false);
      });
  }, []);

  const [visibleCount, setVisibleCount] = useState(10);
  const itemsToShow = books.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#fcf9f5]">
      <Navbar />

      {/* ── HERO ────────────────────────── */}
      <section className="relative py-20 px-6 overflow-hidden bg-[#eee8e0]">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-green-800/5 blur-3xl rounded-full translate-x-1/2" />
        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#a67c52] mb-4 block">
            The Haven Library
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-[#3e3e3e] leading-tight mb-4">
            Curated <span className="text-green-800 italic">Stories</span>
          </h1>
          <p className="text-gray-500 text-base max-w-lg leading-relaxed">
            Discover our handpicked collection of artisan journals and timeless classics.
          </p>
        </div>
      </section>

      {/* ── BOOK GRID ───────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-red-50">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[2rem] border border-dashed border-[#e0d8ce]">
            <p className="text-4xl mb-4">📖</p>
            <h3 className="text-xl font-serif text-[#3e3e3e] mb-2">Our shelves are empty</h3>
            <p className="text-gray-500">We are currently restocking our collection.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
              {itemsToShow.map((book) => (
                <div key={book._id} className="group relative flex flex-col h-full bg-white rounded-[1.5rem] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(166,124,82,0.12)] transition-all duration-700 hover:-translate-y-1">
                  
                  {/* ── IMAGE WRAPPER ── */}
                  <div className="relative -mt-10 mb-4 mx-auto w-[90%] aspect-[3/4.2] rounded-xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.12)] transition-all duration-700 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
                    <img 
                      src={book.imageurl || book.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop"} 
                      alt={book.book_name}
                      className="w-full h-full object-contain p-2 bg-white transition-transform duration-1000 group-hover:scale-110"
                    />
                  </div>

                  {/* ── CONTENT ── */}
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-[#a67c52] bg-[#fdfaf7] px-2 py-0.5 rounded-full border border-[#a67c52]/10">
                        {(Array.isArray(book.genre) ? book.genre[0] : book.genre) || "Literary"}
                      </span>
                      <div className="flex items-center gap-0.5 text-[#3e3e3e]">
                        <span className="text-yellow-400 text-[10px]">★</span>
                        <span className="text-[9px] font-bold">{(book.rating || 4.5).toFixed(1)}</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-serif text-[#3e3e3e] leading-tight mb-1 group-hover:text-green-800 transition-colors line-clamp-1">
                      {book.book_name}
                    </h3>
                    <p className="text-[#a67c52] font-serif italic text-[11px] mb-3 truncate">
                      {book.author}
                    </p>
                    
                    <div className="mt-auto pt-3 border-t border-[#f8f5f2] flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#3e3e3e]">{book.release_year || "1813"}</span>
                      <button className="h-8 px-4 rounded-full bg-[#3e3e3e] text-white text-[9px] font-bold uppercase tracking-widest hover:bg-green-800 transition-all">
                        Reserve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < books.length && (
              <div className="mt-20 text-center">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 10)}
                  className="px-12 py-4 bg-[#3e3e3e] text-white rounded-full font-bold uppercase tracking-widest hover:bg-[#a67c52] transition-all shadow-xl hover:scale-105"
                >
                  Load More Books
                </button>
                <p className="mt-4 text-[#8c8c73] text-[10px] uppercase tracking-widest">
                  Showing {visibleCount} of {books.length} titles
                </p>
              </div>
            )}
          </>
        )}
      </section>

      <ProductsFooter />
    </div>
  );
};

export default Books;
