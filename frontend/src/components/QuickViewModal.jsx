import React from 'react';
import { X, Heart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = React.useState(false);

  const handleAddToCart = () => {
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
  const brand = product.brand || "Reaina's Pick";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-[#fdfaf7] relative">
          <img 
            src={product.imageUrl || product.imageurl || product.image || "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800"} 
            alt={product.name}
            className="w-full h-full object-contain p-2 bg-white min-h-[300px] md:min-h-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800";
            }}
          />
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold tracking-widest uppercase text-[#a67c52]">
                {product.category || "Collection"}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#e0d8ce]"></span>
              <span className="text-xs text-gray-500 font-medium">
                {brand}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-serif text-[#3e3e3e] mb-4 leading-tight">
              {product.name}
            </h2>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center text-amber-400">
                <Star size={16} className="fill-current" />
                <Star size={16} className="fill-current" />
                <Star size={16} className="fill-current" />
                <Star size={16} className="fill-current" />
                <Star size={16} className="fill-current opacity-50" />
              </div>
              <span className="text-sm text-gray-600 font-medium">
                {rating.toFixed(1)} Rating
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description || "Beautifully curated item for your cozy lifestyle. Experience the premium quality and thoughtful design of Reaina's Haven."}
            </p>

            {/* Inclusions prominently displayed */}
            {product.includes && (
              <div className="mb-6">
                <h3 className="text-xs font-bold text-[#a67c52] uppercase tracking-wider mb-2">Includes:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.includes.split(',').map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-[#fdfaf7] px-2.5 py-1 rounded-full border border-[#e0d8ce]">
                      <span className="text-[#a67c52] text-[10px]">✨</span>
                      <span className="text-xs text-gray-700 font-medium">{item.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional info tags if any */}
            {(product.mood || product.filter || product.ingredients) && (
              <div className="flex flex-wrap gap-2 mb-8">
                {product.mood && <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-medium border border-rose-100">{product.mood}</span>}
                {product.is_healthy && <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium border border-green-100">Healthy</span>}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-end gap-4 mb-6">
              <div className="text-4xl font-bold text-[#3e3e3e]">
                ₹{formattedPrice}
              </div>
              <div className="text-sm text-gray-500 mb-1 line-through">
                ₹{(parseFloat(getPrice()) * 1.2).toFixed(0)}
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleAddToCart}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all duration-300 shadow-xl ${
                  isAdded 
                    ? "bg-green-600 text-white shadow-green-600/20" 
                    : "bg-[#a67c52] hover:bg-[#8a6541] text-white shadow-[#a67c52]/20"
                }`}
              >
                {isAdded ? "Added to Cart ✓" : "Add to Cart"}
              </button>
              
              <button className="p-4 rounded-2xl border-2 border-[#e0d8ce] text-gray-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all">
                <Heart size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
