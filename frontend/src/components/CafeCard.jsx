import React, { useState } from "react";
import { Star, Plus, Heart } from "lucide-react";
import toast from "react-hot-toast";
import { API_URL } from "../config";

const CafeCard = ({ item, onImageClick }) => {
  const [wishlist, setWishlist] = useState(false);
  // Ensure we have a consistent price structure
  const [selectedQty, setSelectedQty] = useState(
    item.quantityOptions?.[0] || { label: "Standard", price: item.item_price || 0 }
  );

  // Normalize ingredients and filters
  const ingredients = Array.isArray(item.ingredients) 
    ? item.ingredients 
    : (item.ingredients ? item.ingredients.split(',').map(s => s.trim()) : []);
    
  const filters = Array.isArray(item.filter || item.filters) 
    ? (item.filter || item.filters) 
    : (item.filter || item.filters ? (item.filter || item.filters).split(',').map(s => s.trim()) : []);

  // Mock rating since cafe schema might not have it yet
  const rating = item.rating || "4.2";
  const votes = item.votes || Math.floor(Math.random() * 200) + 50;

  const isVeg = item.item_type === 'veg';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full group">
      
      {/* ── IMAGE SECTION ── */}
      <div 
        className="h-48 overflow-hidden relative bg-gray-50 cursor-pointer"
        onClick={onImageClick}
      >
        {(() => {
          const src = item.imageurl || item.imageUrl || item.imageul;
          return src && src.trim() !== "" ? (
            <img
              src={src}
              alt={item.item_name}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-gray-300">
               <span className="text-4xl">🍽️</span>
             </div>
          );
        })()}
        
        {/* Bestseller Badge */}
        {filters.some(f => f.toLowerCase() === "bestseller" || f.toLowerCase() === "must try") && (
          <div className="absolute top-3 left-0 bg-[#a67c52] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-r-md shadow-md">
            Best Seller
          </div>
        )}

        {/* Veg/Non-Veg Icon (Zomato style) */}
        <div className="absolute top-3 right-3 bg-white p-1 rounded shadow-sm flex items-center justify-center">
          <div className={`w-4 h-4 border-2 flex items-center justify-center ${isVeg ? 'border-green-600' : 'border-red-600'}`}>
            <div className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
          </div>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const token = localStorage.getItem("token");
            if (!token) {
              toast.error("Please login to use wishlist");
              return;
            }
            try {
              const res = await fetch(`${API_URL}/api/user/wishlist`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ productId: item._id || item.id })
              });
              if (res.ok) {
                setWishlist(!wishlist);
                toast.success(wishlist ? "Removed from Wishlist" : "Added to Wishlist", { icon: wishlist ? '💔' : '❤️' });
              }
            } catch (err) {
              console.error(err);
            }
          }}
          className="absolute top-10 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all z-10 border border-gray-100"
        >
          <Heart
            size={14}
            className={`transition-colors duration-300 ${
              wishlist ? "fill-rose-500 stroke-rose-500" : "text-gray-400 stroke-[1.5px]"
            }`}
          />
        </button>
      </div>

      {/* ── DETAILS SECTION ── */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* Title and Rating */}
        <div className="flex justify-between items-start mb-1 gap-2">
          <h2 className="text-lg font-semibold text-gray-800 leading-tight line-clamp-1 flex-grow">
            {item.item_name}
          </h2>
          {/* Zomato style rating box */}
          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center gap-1 bg-green-700 text-white px-1.5 py-0.5 rounded text-xs font-bold shadow-sm">
              {rating} <Star size={10} className="fill-white stroke-white" />
            </div>
          </div>
        </div>

        {/* Price & Votes */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-gray-800">
            ₹{selectedQty?.price || item.item_price || 0}
          </span>
          <span className="text-xs text-gray-500">
            ({votes} votes)
          </span>
        </div>

        {/* Category & Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[10px] font-medium text-[#a67c52] uppercase tracking-wider bg-[#fdfaf7] px-2 py-0.5 rounded border border-[#a67c52]/20">
            {item.category}
          </span>
          {filters.filter(f => f.toLowerCase() !== "bestseller" && f.toLowerCase() !== "must try").map((f, i) => (
            <span key={i} className="text-[10px] text-gray-500 px-2 py-0.5 rounded bg-gray-100">
              {f}
            </span>
          ))}
        </div>

        {/* Ingredients / Description */}
        <div className="flex-grow">
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {ingredients.length > 0 
              ? ingredients.join(", ") 
              : "A delightful culinary creation prepared with the finest ingredients."}
          </p>
          {item.includes && (
            <div className="mt-2 pt-2 border-t border-gray-50">
              <p className="text-[10px] text-[#a67c52] font-bold uppercase tracking-tighter">What's Inside:</p>
              <p className="text-[10px] text-gray-400 italic">{item.includes}</p>
            </div>
          )}
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <div className="mt-4 pt-4 border-t border-dashed border-gray-200 flex items-end justify-between">
          
          {/* Quantity Options (if any) */}
          <div className="flex-grow pr-2">
            {item.quantityOptions && item.quantityOptions.length > 0 ? (
              <div className="flex gap-2 flex-wrap">
                {item.quantityOptions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedQty(q)}
                    className={`text-[10px] px-2 py-1 rounded transition-all ${
                      selectedQty?.label === q.label
                        ? "bg-[#fdfaf7] border border-[#a67c52] text-[#a67c52] font-semibold"
                        : "bg-white border border-gray-200 text-gray-500 hover:border-[#a67c52]/50"
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-[#a67c52] font-medium">100% Handmade</p>
            )}
          </div>

          {/* ADD Button (Swiggy/Zomato style) */}
          <button className="shrink-0 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-sm px-6 py-2 rounded-lg flex items-center justify-center shadow-sm transition-colors group/btn relative overflow-hidden">
            <span className="relative z-10 flex items-center gap-1">
              ADD <Plus size={14} className="stroke-[3px]" />
            </span>
            <div className="absolute inset-0 bg-red-600 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-300"></div>
            <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 delay-100 z-20 font-bold flex gap-1">
              ADD <Plus size={14} className="stroke-[3px]" />
            </span>
          </button>
        </div>

        {/* Customisable Text */}
        {item.quantityOptions && item.quantityOptions.length > 0 && (
          <div className="text-right mt-1">
            <span className="text-[9px] text-gray-400">Customisable</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CafeCard;