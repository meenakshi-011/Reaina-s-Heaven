import React from 'react';
import { X, Star, ShieldCheck, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CafeItemModal = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;

  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = React.useState(false);
  const [selectedQty, setSelectedQty] = React.useState(
    item.quantityOptions?.[0] || { label: "Standard", price: item.item_price || 0 }
  );

  const handleAddToCart = () => {
    addToCart({ 
      ...item, 
      name: item.item_name, 
      price: selectedQty?.price || item.item_price || 0,
      image: item.imageurl || item.imageul,
      selectedQty 
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const isVeg = item.item_type === 'veg';
  const rating = item.rating || "4.2";
  const votes = item.votes || Math.floor(Math.random() * 200) + 50;
  
  const ingredients = Array.isArray(item.ingredients) 
    ? item.ingredients 
    : (item.ingredients ? item.ingredients.split(',').map(s => s.trim()) : []);

  const src = item.imageurl || item.imageul;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Image Section */}
        <div className="w-full h-64 sm:h-80 bg-[#fdfaf7] relative shrink-0">
          {src && src.trim() !== "" ? (
            <img 
              src={src} 
              alt={item.item_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <span className="text-6xl">🍽️</span>
            </div>
          )}
          
          {/* Veg/Non-Veg Icon */}
          <div className="absolute top-4 left-4 bg-white p-1.5 rounded shadow-md flex items-center justify-center">
            <div className={`w-5 h-5 border-2 flex items-center justify-center ${isVeg ? 'border-green-600' : 'border-red-600'}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 md:p-8 flex flex-col flex-grow bg-white">
          <div className="flex justify-between items-start gap-4 mb-2">
            <h2 className="text-2xl md:text-3xl font-serif text-[#3e3e3e] leading-tight">
              {item.item_name}
            </h2>
            <div className="flex items-center gap-1 bg-green-700 text-white px-2 py-1 rounded text-sm font-bold shadow-sm shrink-0">
              {rating} <Star size={14} className="fill-white stroke-white" />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <span className="text-xl font-bold text-gray-800">
              ₹{selectedQty?.price || item.item_price || 0}
            </span>
            <span className="text-sm text-gray-500">
              ({votes} ratings)
            </span>
          </div>

          {/* Quantity Options */}
          {item.quantityOptions && item.quantityOptions.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Select Quantity/Size:</p>
              <div className="flex gap-2 flex-wrap">
                {item.quantityOptions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedQty(q)}
                    className={`px-4 py-2 rounded-xl text-sm transition-all border ${
                      selectedQty?.label === q.label
                        ? "bg-[#fdfaf7] border-[#a67c52] text-[#a67c52] font-bold shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:border-[#a67c52]/50"
                    }`}
                  >
                    {q.label} - ₹{q.price}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description & Ingredients */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Ingredients & Details</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {ingredients.length > 0 
                ? ingredients.join(", ") 
                : "A delightful culinary creation prepared with the finest ingredients."}
            </p>
          </div>

          {/* Quality Promises */}
          <div className="bg-[#fdfaf7] rounded-2xl p-5 border border-[#e0d8ce] mb-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[#e0d8ce] shrink-0">
                <ShieldCheck size={16} className="text-[#a67c52]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#3e3e3e]">Premium Quality</h4>
                <p className="text-xs text-gray-500 mt-0.5">Prepared using only the finest, locally sourced ingredients.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[#e0d8ce] shrink-0">
                <Leaf size={16} className="text-[#a67c52]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#3e3e3e]">100% Handmade</h4>
                <p className="text-xs text-gray-500 mt-0.5">Handcrafted from scratch by our passionate chefs with love.</p>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all duration-300 shadow-xl ${
              isAdded 
                ? "bg-green-600 text-white shadow-green-600/20" 
                : "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20"
            }`}
          >
            {isAdded ? "✓ Added to Cart" : `ADD ITEM - ₹${selectedQty?.price || item.item_price || 0}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CafeItemModal;
