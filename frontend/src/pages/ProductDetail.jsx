import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import axios from 'axios';
import { Heart, Star, ArrowLeft, Truck, ShieldCheck, RefreshCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import ProductsFooter from '../components/ProductsFooter';
import Loader from '../components/Loader';


const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdded, setIsAdded] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load product details.");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfaf7] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#fdfaf7] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <h2 className="text-2xl font-serif text-[#3e3e3e] mb-4">{error || "Product not found"}</h2>
          <button 
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-[#a67c52] text-white rounded-full font-medium"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
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
  const originalPrice = (parseFloat(getPrice()) * 1.2).toFixed(0);
  const rating = product.avg_rating || product.rating || 4.5;
  const brand = product.brand || "Reaina's Pick";

  const renderStars = (score) => {
    const stars = [];
    const full = Math.floor(score);
    const half = score - full >= 0.5;
    for (let i = 1; i <= 5; i++) {
      if (i <= full) {
        stars.push(<Star key={i} size={16} className="fill-amber-400 stroke-amber-400" />);
      } else if (i === full + 1 && half) {
        stars.push(
          <span key={i} className="relative inline-flex" style={{ width: 16, height: 16 }}>
            <Star size={16} className="stroke-amber-400 fill-none absolute" />
            <span className="absolute overflow-hidden" style={{ width: '50%' }}>
              <Star size={16} className="fill-amber-400 stroke-amber-400" />
            </span>
          </span>
        );
      } else {
        stars.push(<Star key={i} size={16} className="fill-none stroke-amber-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-[#fdfaf7] flex flex-col font-sans text-[#3e3e3e]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-gray-500 hover:text-[#a67c52] transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column: Image */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white shadow-sm border border-[#e0d8ce]">
              <img 
                src={product.imageUrl || product.imageurl || product.image || "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800"} 
                alt={product.name}
                className="w-full h-full object-contain p-4 bg-white"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800";
                }}
              />
              <button
                onClick={() => setWishlist(!wishlist)}
                className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
              >
                <Heart
                  size={20}
                  className={`transition-colors duration-300 ${
                    wishlist ? "fill-rose-500 stroke-rose-500" : "text-gray-400 stroke-[1.5px]"
                  }`}
                />
              </button>
            </div>
            
            {/* Optional Thumbnail Row could go here */}
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col">
            <div className="mb-2">
              <span className="text-sm font-bold tracking-widest uppercase text-[#a67c52]">
                {product.category || "Collection"}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-4 text-[#2c2c2c]">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#e0d8ce]">
              <div className="flex items-center gap-1">
                {renderStars(rating)}
              </div>
              <span className="text-sm text-gray-500 font-medium">
                {rating.toFixed(1)} Rating
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500 font-medium">Brand: <span className="text-[#a67c52]">{brand}</span></span>
            </div>

            <div className="flex items-end gap-4 mb-8">
              <span className="text-5xl font-bold text-[#2c2c2c]">₹{formattedPrice}</span>
              <span className="text-xl text-gray-400 line-through mb-1.5">₹{originalPrice}</span>
              <span className="text-sm text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full mb-2 ml-2">Save 20%</span>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {product.description || "Experience the premium quality and thoughtful design of Reaina's Haven. Handpicked and beautifully curated for your special moments."}
            </p>

            {/* Inclusions prominently displayed */}
            {product.includes && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-[#a67c52] uppercase tracking-wider mb-3">This Package Includes:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.includes.split(',').map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#fdfaf7] px-3 py-1.5 rounded-full border border-[#e0d8ce]">
                      <span className="text-[#a67c52] text-xs">✨</span>
                      <span className="text-sm text-gray-700 font-medium">{item.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {(product.mood || product.filter || product.ingredients || product.is_healthy) && (
              <div className="flex flex-wrap gap-3 mb-10">
                {product.mood && <span className="px-4 py-2 bg-[#fdfaf7] text-[#a67c52] rounded-full text-sm font-medium border border-[#e0d8ce]">Mood: {product.mood}</span>}
                {product.is_healthy && <span className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">100% Healthy</span>}
                {product.filter && <span className="px-4 py-2 bg-gray-50 text-gray-600 rounded-full text-sm font-medium border border-gray-200">{product.filter}</span>}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button 
                onClick={handleAddToCart}
                className={`flex-1 py-4 px-8 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 shadow-xl flex justify-center items-center gap-3 ${
                  isAdded 
                    ? "bg-green-600 text-white shadow-green-600/20" 
                    : "bg-[#a67c52] hover:bg-[#8a6541] text-white shadow-[#a67c52]/30"
                }`}
              >
                {isAdded ? "✓ Added to Cart" : "Add to Cart"}
              </button>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-[#e0d8ce]">
              <div className="flex flex-col items-center text-center">
                <Truck className="text-[#a67c52] mb-3" size={28} />
                <h4 className="font-bold text-sm mb-1">Fast Delivery</h4>
                <p className="text-xs text-gray-500">Same day delivery available</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <ShieldCheck className="text-[#a67c52] mb-3" size={28} />
                <h4 className="font-bold text-sm mb-1">Premium Quality</h4>
                <p className="text-xs text-gray-500">Handpicked items</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <RefreshCcw className="text-[#a67c52] mb-3" size={28} />
                <h4 className="font-bold text-sm mb-1">Easy Returns</h4>
                <p className="text-xs text-gray-500">Hassle-free process</p>
              </div>
            </div>

          </div>
        </div>

        {/* ── PRODUCT INFORMATION SECTION ── */}
        <div className="mt-20 border-t border-[#e0d8ce] pt-16">
          <div className="text-center mb-12">
            <span className="text-sm font-bold tracking-widest uppercase text-[#a67c52] mb-2 block">
              Discover More
            </span>
            <h2 className="text-3xl font-serif text-[#3e3e3e]">
              Product Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* What's Inside */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e0d8ce]/50 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#fdfaf7] rounded-full flex items-center justify-center mb-6 border border-[#a67c52]/20">
                <span className="text-[#a67c52] text-xl">🎁</span>
              </div>
              <h3 className="text-xl font-serif text-[#3e3e3e] mb-3">
                What's Inside
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.includes 
                  ? product.includes
                  : (product.ingredients && product.ingredients.length > 0 
                  ? Array.isArray(product.ingredients) ? product.ingredients.join(", ") : product.ingredients
                  : "Carefully curated premium items wrapped beautifully. Each package is designed to provide a complete and delightful unboxing experience.")}
              </p>
            </div>

            {/* Premium Quality */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e0d8ce]/50 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#fdfaf7] rounded-full flex items-center justify-center mb-6 border border-[#a67c52]/20">
                <span className="text-[#a67c52] text-xl">✨</span>
              </div>
              <h3 className="text-xl font-serif text-[#3e3e3e] mb-3">
                Premium Quality
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We source only the finest materials and freshest ingredients. Quality is our top priority, ensuring that every product meets our strict luxury standards.
              </p>
            </div>

            {/* Handmade */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e0d8ce]/50 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#fdfaf7] rounded-full flex items-center justify-center mb-6 border border-[#a67c52]/20">
                <span className="text-[#a67c52] text-xl">💝</span>
              </div>
              <h3 className="text-xl font-serif text-[#3e3e3e] mb-3">
                100% Handmade
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Everything is handcrafted with love and meticulous attention to detail by our skilled artisans, making each piece unique and special just for you.
              </p>
            </div>
          </div>
        </div>
      </main>

      <ProductsFooter />
    </div>
  );
};

export default ProductDetail;
