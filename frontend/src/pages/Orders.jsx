import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Truck, CheckCircle2, Clock, ChevronRight, ShoppingBag, CreditCard } from "lucide-react";
import Navbar from "../components/Navbar";
import { getMyOrders } from "../services/api";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../config";
import ProductsFooter from "../components/ProductsFooter";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        if (Array.isArray(data)) {
          setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } else {
          toast.error("Failed to load orders");
        }
      } catch (error) {
        toast.error("An error occurred while fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    const socket = io(SOCKET_URL);
    
    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prevOrders) => {
        const orderExists = prevOrders.some((o) => o._id === updatedOrder._id);
        if (orderExists) {
          toast.success(`Order #${updatedOrder._id.slice(-8).toUpperCase()} status changed to ${updatedOrder.status}`);
          return prevOrders.map((o) => o._id === updatedOrder._id ? updatedOrder : o);
        }
        return prevOrders;
      });
    });

    return () => socket.disconnect();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing": return "text-amber-600 bg-amber-50 border-amber-100";
      case "Shipped": return "text-blue-600 bg-blue-50 border-blue-100";
      case "Delivered": return "text-green-600 bg-green-50 border-green-100";
      case "Cancelled": return "text-rose-600 bg-rose-50 border-rose-100";
      default: return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing": return <Clock size={14} />;
      case "Shipped": return <Truck size={14} />;
      case "Delivered": return <CheckCircle2 size={14} />;
      default: return <Package size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      <Navbar />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-sm font-semibold tracking-[0.25em] text-[#a67c52] uppercase mb-2 block">Order History</span>
              <h1 className="text-4xl md:text-5xl font-serif text-[#3e3e3e]">Track Your <span className="text-green-800 italic">Orders</span> 📦</h1>
            </div>
            <Link to="/products" className="text-[#a67c52] font-semibold flex items-center gap-2 hover:text-[#3e3e3e] transition-all group">Discover More Products <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></Link>
          </header>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#a67c52]/20 border-t-[#a67c52] rounded-full animate-spin mb-4" />
              <p className="text-gray-400 font-medium italic">Fetching your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-16 text-center shadow-sm border border-[#e0d8ce]/30">
              <div className="w-24 h-24 bg-[#fdfaf7] rounded-full flex items-center justify-center mx-auto mb-6"><ShoppingBag size={40} className="text-[#c8a97e]" /></div>
              <h2 className="text-2xl font-serif text-[#3e3e3e] mb-4">No orders found</h2>
              <p className="text-gray-500 mb-10 max-w-md mx-auto">You haven't placed any orders yet. Start exploring our collections to find something you love.</p>
              <Link to="/products" className="px-8 py-3 bg-[#a67c52] text-white rounded-full font-medium hover:bg-[#3e3e3e] transition-all shadow-lg">Go to Products</Link>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-[2rem] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#e0d8ce]/20 hover:border-[#a67c52]/20 transition-all">
                  <div className="bg-[#fdfaf7] px-8 py-6 border-b border-[#e0d8ce]/30 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex gap-8">
                      <div><p className="text-[10px] text-[#a67c52] uppercase font-bold tracking-widest mb-1">Order Date</p><p className="font-semibold text-[#3e3e3e]">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
                      <div><p className="text-[10px] text-[#a67c52] uppercase font-bold tracking-widest mb-1">Total Amount</p><p className="font-bold text-[#3e3e3e]">₹{order.totalPrice.toLocaleString("en-IN")}</p></div>
                      <div className="hidden sm:block"><p className="text-[10px] text-[#a67c52] uppercase font-bold tracking-widest mb-1">Order ID</p><p className="font-mono text-xs text-gray-400">#{order._id.slice(-8).toUpperCase()}</p></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${order.isPaid ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                            <CreditCard size={14} /> {order.isPaid ? 'Paid' : 'Unpaid'}
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)} {order.status}
                        </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="space-y-6">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row items-center gap-6 group">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#fdfaf7] border border-[#e0d8ce]/20 shrink-0"><img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div>
                          <div className="flex-1 text-center sm:text-left"><h4 className="text-lg font-serif font-semibold text-[#3e3e3e] group-hover:text-[#a67c52] transition-colors">{item.name}</h4><p className="text-sm text-gray-500 mb-2">Quantity: <span className="font-semibold text-[#3e3e3e]">{item.qty}</span></p></div>
                          <div className="sm:text-right"><p className="text-lg font-bold text-[#3e3e3e]">₹{(item.price * item.qty).toLocaleString("en-IN")}</p></div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 pt-8 border-t border-[#f8f5f2] flex flex-wrap items-center justify-between gap-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500"><MapPin size={16} className="text-[#a67c52]" /><span>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</span></div>
                        {order.status === "Delivered" && (
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-bold ${order.isOTPVerified ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'}`}>
                            {order.isOTPVerified ? (
                              <><span>✅ Delivery Verified</span></>
                            ) : (
                              <>
                                <span>🔑 Delivery OTP: <span className="font-mono text-lg ml-1 tracking-widest">{order.deliveryOTP}</span></span>
                                <span className="text-[10px] block opacity-70">(Share this with delivery partner)</span>
                              </>
                            )}
                          </div>
                        )}
                        {order.status === "Delivered" && order.isOTPVerified && <span className="text-green-600 font-bold text-xs flex items-center gap-1 mt-1"><CheckCircle2 size={14} /> Finalized on {new Date(order.updatedAt).toLocaleDateString()}</span>}
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => window.print()} className="px-6 py-2 border border-[#e0d8ce] text-[#3e3e3e] text-sm font-semibold rounded-xl hover:bg-[#fdfaf7] transition-all">Invoice</button>
                        <Link to="/contactus" className="px-6 py-2 bg-[#a67c52] text-white text-sm font-semibold rounded-xl hover:bg-[#3e3e3e] transition-all shadow-md text-center">Support</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ProductsFooter />
    </div>
  );
};

const MapPin = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

export default Orders;