import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShoppingBag,
  CreditCard,
  MapPin,
  Eye,
  Check,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { getMyOrders } from "../services/api";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../config";
import ProductsFooter from "../components/ProductsFooter";
import Loader from "../components/Loader";

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
          const orderNum = updatedOrder.orderId || updatedOrder._id.slice(-8).toUpperCase();
          const newStatus = updatedOrder.orderStatus || updatedOrder.status;
          toast.success(`Order #${orderNum} status is now ${newStatus}`, { icon: "📦" });
          return prevOrders.map((o) => (o._id === updatedOrder._id ? updatedOrder : o));
        }
        return prevOrders;
      });
    });

    return () => socket.disconnect();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "PLACED":
      case "Processing":
        return {
          color: "text-amber-700 bg-amber-50 border-amber-200",
          icon: <Clock size={12} />,
          label: "🟡 PLACED",
        };
      case "CONFIRMED":
        return {
          color: "text-blue-700 bg-blue-50 border-blue-200",
          icon: <Check size={12} />,
          label: "🔵 CONFIRMED",
        };
      case "PREPARING":
        return {
          color: "text-amber-800 bg-amber-100/70 border-amber-300",
          icon: <Clock size={12} className="animate-spin" />,
          label: "🟡 PREPARING",
        };
      case "READY":
        return {
          color: "text-emerald-700 bg-emerald-50 border-emerald-200",
          icon: <Package size={12} />,
          label: "🟢 READY",
        };
      case "OUT_FOR_DELIVERY":
      case "Shipped":
        return {
          color: "text-indigo-700 bg-indigo-50 border-indigo-200",
          icon: <Truck size={12} />,
          label: "🚚 OUT FOR DELIVERY",
        };
      case "DELIVERED":
      case "Delivered":
        return {
          color: "text-green-700 bg-green-50 border-green-200",
          icon: <CheckCircle2 size={12} />,
          label: "✅ DELIVERED",
        };
      case "CANCELLED":
      case "Cancelled":
        return {
          color: "text-rose-700 bg-rose-50 border-rose-200",
          icon: <AlertCircle size={12} />,
          label: "❌ CANCELLED",
        };
      default:
        return {
          color: "text-gray-700 bg-gray-50 border-gray-200",
          icon: <Package size={12} />,
          label: status || "PLACED",
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f2] flex flex-col justify-between">
      <Navbar />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold tracking-[0.25em] text-[#a67c52] uppercase mb-2 block">
                Order Management
              </span>
              <h1 className="text-3xl md:text-5xl font-serif text-[#3e3e3e]">
                My <span className="text-green-800 italic">Orders</span> 📦
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                View real-time preparation status and delivery history for all your sanctuary orders.
              </p>
            </div>
            <Link
              to="/products"
              className="text-xs font-bold uppercase tracking-wider text-[#a67c52] flex items-center gap-2 hover:text-[#3e3e3e] transition-all group"
            >
              <span>Explore More Delights</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </header>

          {loading ? (
            <Loader />
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-16 text-center shadow-sm border border-[#e0d8ce]/30">
              <div className="w-24 h-24 bg-[#fdfaf7] rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={40} className="text-[#c8a97e]" />
              </div>
              <h2 className="text-2xl font-serif text-[#3e3e3e] mb-3">No orders yet</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm">
                You haven't placed any orders yet. Discover our fresh cafe treats, floral bouquets, and botanical gift hampers.
              </p>
              <Link
                to="/products"
                className="px-8 py-3.5 bg-[#a67c52] text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#3e3e3e] transition-all shadow-lg"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const orderNum = order.orderId || order._id.slice(-8).toUpperCase();
                const currentStatus = order.orderStatus || order.status || "PLACED";
                const badge = getStatusBadge(currentStatus);

                const da = order.deliveryAddress;
                const deliveryArea = da
                  ? `${da.area || ""}${da.city ? `, ${da.city}` : ""}`
                  : `${order.shippingAddress?.city || "Local Delivery"}`;

                const items = order.items && order.items.length > 0 ? order.items : order.orderItems || [];
                const totalAmount = order.totalAmount || order.totalPrice || 0;
                const isPaid = order.isPaid || order.paymentStatus === "PAID";

                return (
                  <div
                    key={order._id}
                    className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-[#e0d8ce]/30 hover:border-[#a67c52]/40 transition-all group"
                  >
                    {/* Top Order Summary Bar */}
                    <div className="bg-[#fdfaf7] px-6 sm:px-8 py-5 border-b border-[#e0d8ce]/30 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-6 sm:gap-10">
                        <div>
                          <p className="text-[10px] text-[#a67c52] uppercase font-bold tracking-widest mb-0.5">
                            Order ID
                          </p>
                          <p className="font-mono font-bold text-sm text-[#3e3e3e]">
                            #{orderNum}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#a67c52] uppercase font-bold tracking-widest mb-0.5">
                            Date
                          </p>
                          <p className="font-semibold text-xs text-[#3e3e3e]">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#a67c52] uppercase font-bold tracking-widest mb-0.5">
                            Delivery Area
                          </p>
                          <p className="text-xs font-semibold text-[#3e3e3e] flex items-center gap-1">
                            <MapPin size={12} className="text-[#a67c52]" />
                            <span>{deliveryArea}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#a67c52] uppercase font-bold tracking-widest mb-0.5">
                            Total
                          </p>
                          <p className="font-bold text-sm text-[#3e3e3e]">
                            ₹{totalAmount.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                            isPaid
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          <CreditCard size={11} />
                          {isPaid ? "PAID" : order.paymentStatus || "COD"}
                        </span>

                        <span
                          className={`flex items-center gap-1 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${badge.color}`}
                        >
                          {badge.icon}
                          <span>{badge.label}</span>
                        </span>
                      </div>
                    </div>

                    {/* Order Body */}
                    <div className="p-6 sm:p-8">
                      <div className="divide-y divide-[#f8f5f2]">
                        {items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="py-3 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#fdfaf7] border border-[#e0d8ce]/30 shrink-0">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#c8a97e]">
                                    <Package size={20} />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-sm font-semibold text-[#3e3e3e] truncate">
                                  {item.name}
                                </h4>
                                <p className="text-xs text-gray-400">
                                  Qty: <span className="font-semibold text-gray-700">{item.quantity || item.qty || 1}</span> × ₹{(item.price || 0).toLocaleString("en-IN")}
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-sm text-[#3e3e3e] shrink-0">
                              ₹{((item.price || 0) * (item.quantity || item.qty || 1)).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}

                        {items.length > 3 && (
                          <p className="text-xs text-gray-400 pt-2 italic">
                            + {items.length - 3} more items in this order
                          </p>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-6 pt-6 border-t border-[#f8f5f2] flex flex-wrap items-center justify-between gap-4">
                        <div className="text-xs text-gray-500 flex items-center gap-1.5">
                          <MapPin size={14} className="text-[#a67c52]" />
                          <span>Delivery to: <b>{deliveryArea}</b></span>
                          {order.location && (
                            <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-full ml-1">
                              GPS Saved
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <Link
                            to={`/orders/${order._id}`}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#a67c52] hover:bg-[#3e3e3e] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
                          >
                            <Eye size={14} />
                            <span>View Order</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ProductsFooter />
    </div>
  );
};

export default Orders;