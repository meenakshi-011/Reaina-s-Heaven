import React, { useState, useEffect } from "react";
import { Heart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_URL } from "../config";

/**
 * A premium product card component designed for Reaina's Haven.
 * Features:
 * - Hover-responsive image scaling
 * - Animated wishlist heart
 * - Dynamic badges for tags and mood
 * - Filled/half/empty star ratings
 * - Brand + rating info strip at the bottom
 */
function ProductCard({ product, isWishlisted, onQuickView }) {
  const [wishlist, setWishlist] = useState(isWishlisted);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    setWishlist(isWishlisted);
  }, [isWishlisted]);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add items to cart", {
        icon: '🔒',
        style: { borderRadius: '20px', background: '#3e3e3e', color: '#fff' }
      });
      navigate("/login");
      return;
    }
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const getPrice = () => {
    if (typeof product.price === 'object' && product.price !== null) {
      return product.price.value;
    }
    return product.price || 0;
  };

  const formattedPrice = parseFloat(getPrice()).toLocaleString('en-IN');
  const rating = product.avg_rating || product.rating || 4.5;
  const brand = product.brand || null;

  // Render up to 5 stars (filled / half / empty)
  const renderStars = (score) => {
    const stars = [];
    const full = Math.floor(score);
    const half = score - full >= 0.5;
    for (let i = 1; i <= 5; i++) {
      if (i <= full) {
        stars.push(<Star key={i} size={10} className="fill-amber-400 stroke-amber-400" />);
      } else if (i === full + 1 && half) {
        stars.push(
          <span key={i} className="relative inline-flex" style={{ width: 10, height: 10 }}>
            <Star size={10} className="stroke-amber-400 fill-none absolute" />
            <span className="absolute overflow-hidden" style={{ width: '50%' }}>
              <Star size={10} className="fill-amber-400 stroke-amber-400" />
            </span>
          </span>
        );
      } else {
        stars.push(<Star key={i} size={10} className="fill-none stroke-amber-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(166,124,82,0.1)] transition-all duration-500 hover:-translate-y-1.5 flex flex-col border border-[#e0d8ce]/30 hover:border-[#a67c52]/20 w-full h-full">

      {/* ── IMAGE SECTION ─────────────────── */}
      <div className="relative aspect-square overflow-hidden bg-[#fdfaf7] shrink-0">
        <img
          src={product.imageUrl || product.imageurl || product.image || "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&auto=format&fit=crop"}
          alt={product.name}
          className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&auto=format&fit=crop";
          }}
        />

        {/* Wishlist Button */}
        <button
          onClick={async (e) => {
            e.preventDefault();
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
                body: JSON.stringify({ productId: product._id || product.id })
              });
              if (res.ok) {
                setWishlist(!wishlist);
                toast.success(wishlist ? "Removed from Wishlist" : "Added to Wishlist", { icon: wishlist ? '💔' : '❤️' });
              }
            } catch (err) {
              console.error(err);
            }
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all z-10 border border-[#e0d8ce]/20"
        >
          <Heart
            size={14}
            className={`transition-colors duration-300 ${
              wishlist ? "fill-rose-500 stroke-rose-500" : "text-gray-400 stroke-[1.5px]"
            }`}
          />
        </button>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[80%] translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <button 
            onClick={() => navigate(`/product/${product._id || product.id}`)}
            className="w-full bg-white/95 backdrop-blur-sm text-[#3e3e3e] py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-lg border border-white/40 hover:bg-[#3e3e3e] hover:text-white transition-all"
          >
            View Details
          </button>
        </div>
      </div>

      {/* ── INFO SECTION ──────────────────── */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[8px] text-[#a67c52] uppercase font-bold tracking-widest mb-1.5">
          {(() => {
            const name = product.name?.toLowerCase() || "";
            if (name.includes("chocolate")) return "Chocolate";
            if (name.includes("flower") || name.includes("bouquet")) return "Flowers";
            if (name.includes("candle")) return "Candles";
            if (name.includes("book")) return "Books";
            if (name.includes("hamper")) return "Hampers";
            if (name.includes("combo")) return "Combos";
            return product.category || "Collection";
          })()}
        </span>

        <h3 className="text-[#3e3e3e] font-serif text-base font-semibold leading-tight mb-1.5 group-hover:text-[#a67c52] transition-colors line-clamp-1">
          {product.name}
        </h3>

        <p className="text-gray-500 text-[10px] leading-relaxed line-clamp-2 flex-1 opacity-70">
          {product.description || "Beautifully curated item for your cozy lifestyle."}
        </p>



        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between pt-3 border-t border-[#f8f5f2] mt-auto">
          <span className="text-lg font-bold text-[#3e3e3e]">₹{formattedPrice}</span>
          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center h-8 px-4 rounded-full transition-all duration-300 text-[9px] font-bold uppercase tracking-widest ${
              isAdded
                ? "bg-green-600 text-white"
                : "bg-[#a67c52] hover:bg-[#3e3e3e] text-white shadow-sm"
            }`}
          >
            {isAdded ? "✓" : "Add"}
          </button>
        </div>

        {/* Product Inclusions */}
        {product.includes && (
          <div className="mt-3 pt-3 border-t border-[#f8f5f2]">
            <span className="text-[9px] font-bold text-[#a67c52] uppercase tracking-wider block mb-1.5">Includes:</span>
            <div className="flex flex-wrap gap-1">
              {product.includes.split(',').map((item, idx) => (
                <span key={idx} className="bg-[#fdfaf7] text-[#6b5c47] text-[9px] px-1.5 py-0.5 rounded border border-[#e0d8ce]/50">
                  {item.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── BRAND & RATING STRIP ──────────── */}
      <div className="mx-3 mb-3 rounded-2xl bg-[#fdfaf7] border border-[#ede7df] px-3 py-2 flex items-center justify-between gap-2">
        {/* Brand name */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[10px] text-[#c8a97e] flex-shrink-0">🏷️</span>
          <span className="text-[10px] font-semibold text-[#6b5c47] truncate leading-none">
            {brand || "Reaina's Pick"}
          </span>
        </div>

        {/* Vertical divider */}
        <span className="w-px h-4 bg-[#e0d8ce] flex-shrink-0" />

        {/* Star icons + numeric score */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="flex items-center gap-[1px]">
            {renderStars(rating)}
          </div>
          <span className="text-[10px] font-bold text-[#3e3e3e] leading-none ml-0.5">
            {rating.toFixed(1)}
          </span>
        </div>
      </div>

    </div>
  );
}

export default ProductCard;