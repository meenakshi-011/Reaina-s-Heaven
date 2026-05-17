import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CreditCard, ShoppingBag, CheckCircle2, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { createOrder, createPaymentOrder, verifyPayment } from "../services/api";
import { toast } from "react-hot-toast";
import ProductsFooter from "../components/ProductsFooter";

import { RAZORPAY_KEY_ID } from "../config";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState("Online Payment");

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePayment = async (dbOrderId) => {
    if (!RAZORPAY_KEY_ID) {
      toast.error("Razorpay Key ID is missing. Please check your environment variables.");
      return;
    }
    try {
      const order = await createPaymentOrder({
        amount: cartTotal,
        currency: "INR",
        receipt: `receipt_${dbOrderId}`,
      });
 
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Reaina's Haven",
        description: "Transaction for your haven items",
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await verifyPayment({
              ...response,
              db_order_id: dbOrderId,
            });

            if (verifyRes.order) {
              toast.success("Payment Successful! Order placed. 🌿");
              clearCart();
              navigate("/orders");
            }
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: "Guest User",
          email: "guest@example.com",
        },
        theme: {
          color: "#a67c52",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Failed to initiate payment");
    }
  };

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
      toast.error("Please fill in all shipping details");
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.imageUrl || item.imageurl || item.image,
          price: item.price,
          product: item._id,
          includes: item.includes,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: cartTotal,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: cartTotal,
      };

      const result = await createOrder(orderData);
      
      if (result._id) {
        if (paymentMethod === "Online Payment") {
          await handlePayment(result._id);
        } else {
          toast.success("Order placed successfully! 🌿");
          clearCart();
          navigate(`/orders`);
        }
      } else {
        toast.error(result.message || "Failed to place order");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      <Navbar />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 text-center">
            <span className="text-sm font-semibold tracking-[0.25em] text-[#a67c52] uppercase mb-2 block">
              Final Step
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-[#3e3e3e]">
              Secure <span className="text-green-800 italic">Checkout</span> 🔒
            </h1>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#e0d8ce]/20">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-[#fdfaf7] rounded-2xl flex items-center justify-center text-[#a67c52]">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif text-[#3e3e3e]">Shipping Details</h2>
                    <p className="text-sm text-gray-400">Where should we send your haven items?</p>
                  </div>
                </div>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#a67c52] uppercase tracking-widest mb-2">Street Address</label>
                    <input type="text" name="address" value={shippingAddress.address} onChange={handleChange} placeholder="e.g. 123 Haven Street, Apartment 4B" className="w-full bg-[#fdfaf7] border border-[#e0d8ce]/50 rounded-xl px-4 py-3 outline-none focus:border-[#a67c52] transition-colors text-[#3e3e3e]" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#a67c52] uppercase tracking-widest mb-2">City</label>
                    <input type="text" name="city" value={shippingAddress.city} onChange={handleChange} placeholder="e.g. Mumbai" className="w-full bg-[#fdfaf7] border border-[#e0d8ce]/50 rounded-xl px-4 py-3 outline-none focus:border-[#a67c52] transition-colors text-[#3e3e3e]" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#a67c52] uppercase tracking-widest mb-2">Postal Code</label>
                    <input type="text" name="postalCode" value={shippingAddress.postalCode} onChange={handleChange} placeholder="e.g. 400001" className="w-full bg-[#fdfaf7] border border-[#e0d8ce]/50 rounded-xl px-4 py-3 outline-none focus:border-[#a67c52] transition-colors text-[#3e3e3e]" required />
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#e0d8ce]/20">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-[#fdfaf7] rounded-2xl flex items-center justify-center text-[#a67c52]">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif text-[#3e3e3e]">Payment Method</h2>
                    <p className="text-sm text-gray-400">Choose your preferred way to pay</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {["Online Payment", "Cash on Delivery"].map((method) => (
                    <label
                      key={method}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        paymentMethod === method
                          ? "border-[#a67c52] bg-[#fdfaf7]"
                          : "border-[#e0d8ce]/20 hover:border-[#a67c52]/30"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === method ? "border-[#a67c52]" : "border-gray-300"
                        }`}>
                          {paymentMethod === method && <div className="w-2.5 h-2.5 bg-[#a67c52] rounded-full" />}
                        </div>
                        <span className={`font-semibold ${paymentMethod === method ? "text-[#a67c52]" : "text-[#3e3e3e]"}`}>
                          {method === "Online Payment" ? "Secure Online Payment (Card/UPI)" : method}
                        </span>
                      </div>
                      {paymentMethod === method && <CheckCircle2 size={20} className="text-[#a67c52]" />}
                      <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="hidden" />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-[#3e3e3e] rounded-[2rem] p-8 text-white shadow-xl sticky top-32">
                <h2 className="text-2xl font-serif mb-8 pb-4 border-b border-white/10 flex items-center gap-3">
                  <ShoppingBag size={20} className="text-[#c8a97e]" /> Review Order
                </h2>

                <div className="max-h-60 overflow-y-auto space-y-4 mb-8 pr-2 scrollbar-hide">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                        <img src={item.imageUrl || item.imageurl || item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold truncate text-white/90">{item.name}</h4>
                        <p className="text-xs text-white/40">{item.qty} × ₹{(item.price || 0).toLocaleString("en-IN")}</p>
                        {item.includes && <p className="text-[10px] text-white/50 truncate mt-0.5"><span className="text-[#c8a97e]">Incl:</span> {item.includes}</p>}
                      </div>
                      <span className="text-sm font-bold text-[#c8a97e]">₹{((item.price || 0) * (item.qty || 1)).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 mb-8 pt-4 border-t border-white/10">
                  <div className="flex justify-between text-white/60"><span>Subtotal</span><span>₹{(cartTotal || 0).toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between text-white/60"><span>Shipping</span><span className="text-green-400 font-medium">FREE</span></div>
                  <div className="flex justify-between text-xl font-bold pt-4 border-t border-white/10"><span>Total Amount</span><span className="text-[#c8a97e]">₹{(cartTotal || 0).toLocaleString("en-IN")}</span></div>
                </div>

                <button
                  onClick={placeOrderHandler}
                  disabled={loading}
                  className="w-full bg-[#a67c52] hover:bg-white hover:text-[#3e3e3e] py-4 rounded-2xl font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Confirm & {paymentMethod === "Online Payment" ? "Pay Now" : "Place Order"} <ArrowRight size={18} /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductsFooter />
    </div>
  );
};

export default Checkout;