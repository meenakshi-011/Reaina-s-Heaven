import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import ProductsFooter from "../components/ProductsFooter";

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, cartTotal } = useCart();
  const navigate = useNavigate();

  const checkoutHandler = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/checkout");
    } else {
      navigate("/login?redirect=/checkout");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      <Navbar />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12">
            <span className="text-sm font-semibold tracking-[0.25em] text-[#a67c52] uppercase mb-2 block text-center md:text-left">
              Your Selection
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-[#3e3e3e] text-center md:text-left">
              Shopping <span className="text-green-800 italic">Cart</span> 🧺
            </h1>
          </header>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-16 text-center shadow-sm border border-[#e0d8ce]/30">
              <div className="w-24 h-24 bg-[#fdfaf7] rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={40} className="text-[#c8a97e]" />
              </div>
              <h2 className="text-2xl font-serif text-[#3e3e3e] mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-10 max-w-md mx-auto">
                Looks like you haven't added anything to your haven yet. Explore our curated collections to find something special.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#a67c52] text-white rounded-full font-medium hover:bg-[#3e3e3e] transition-all shadow-lg"
              >
                Start Shopping <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="group bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-[#e0d8ce]/20 hover:border-[#a67c52]/30 transition-all flex flex-col md:flex-row items-center gap-6"
                  >
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shrink-0 bg-[#fdfaf7]">
                      <img
                        src={item.imageUrl || item.imageurl || item.image || "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&auto=format&fit=crop"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] text-[#a67c52] uppercase font-bold tracking-widest block mb-1">
                            {item.category || "Collection"}
                          </span>
                          <h3 className="text-xl font-serif text-[#3e3e3e] font-semibold">
                            {item.name}
                          </h3>
                          {item.includes && (
                            <div className="mt-2 text-xs text-gray-500 max-w-sm">
                              <span className="font-semibold text-[#a67c52]">Includes:</span> {item.includes}
                            </div>
                          )}
                        </div>
                        <span className="text-xl font-bold text-[#a67c52]">
                          ₹{(item.price * item.qty).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-4">
                        <div className="flex items-center bg-[#fdfaf7] rounded-xl border border-[#e0d8ce]/50 p-1">
                          <button
                            onClick={() => updateQty(item.cartItemId, Math.max(1, item.qty - 1))}
                            className="w-8 h-8 flex items-center justify-center text-[#a67c52] hover:bg-white rounded-lg transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center font-bold text-[#3e3e3e]">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.cartItemId, item.qty + 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#a67c52] hover:bg-white rounded-lg transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="flex items-center gap-2 text-rose-500 hover:text-rose-600 font-medium text-sm transition-colors"
                        >
                          <Trash2 size={16} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-[#a67c52] font-semibold hover:text-[#3e3e3e] transition-colors"
                >
                  <ArrowRight size={18} className="rotate-180" /> Continue Shopping
                </Link>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-[#3e3e3e] rounded-[2rem] p-8 text-white shadow-xl sticky top-32">
                  <h2 className="text-2xl font-serif mb-8 pb-4 border-b border-white/10">Order Summary</h2>
                  
                  <div className="space-y-4 mb-8 text-white/80">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-white">₹{cartTotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-bold text-green-400">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax</span>
                      <span className="font-bold text-white">₹0</span>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6 mb-10">
                    <div className="flex justify-between items-end">
                      <span className="text-lg">Total Amount</span>
                      <span className="text-3xl font-bold text-[#c8a97e]">
                        ₹{cartTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={checkoutHandler}
                    disabled={cartItems.length === 0}
                    className="w-full bg-[#a67c52] hover:bg-white hover:text-[#3e3e3e] py-4 rounded-2xl font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Proceed to Checkout
                  </button>

                  <div className="mt-6 text-center">
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">
                      Secure Checkout Powered by Haven Pay
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ProductsFooter />
    </div>
  );
};

export default Cart;