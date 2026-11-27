import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  ArrowLeft,
  ShoppingBag,
  Printer,
  Sparkles,
  AlertTriangle,
  Check,
  Circle,
  Truck,
  Phone,
  User,
  Star,
  Send,
  MessageSquarePlus,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { getOrderById, createReview } from "../services/api";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../config";
import ProductsFooter from "../components/ProductsFooter";
import Loader from "../components/Loader";
import ReviewsSection from "../components/ReviewsSection";

const STEPS = [
  { key: "PLACED", label: "Order Placed", desc: "We received your order" },
  { key: "CONFIRMED", label: "Confirmed", desc: "Order verified by kitchen" },
  { key: "PREPARING", label: "Preparing", desc: "Artisans crafting your items" },
  { key: "READY", label: "Ready", desc: "Packed & awaiting pickup" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", desc: "On the way to you" },
  { key: "DELIVERED", label: "Delivered", desc: "Safely received" },
];

// Normalize status key for step index
const normalizeStatus = (status) => {
  if (!status) return "PLACED";
  const s = status.toUpperCase().replace(/\s+/g, "_");
  if (s === "PROCESSING") return "PREPARING";
  if (s === "SHIPPED") return "OUT_FOR_DELIVERY";
  return s;
};

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review state for this specific order
  const [orderRating, setOrderRating] = useState(5);
  const [orderComment, setOrderComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(id);
        if (data && (data._id || data.orderId)) {
          setOrder(data);
        } else {
          setError(data.message || "Order not found");
          toast.error(data.message || "Failed to load order");
        }
      } catch (err) {
        setError("Network error while retrieving order details.");
        toast.error("Error loading order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Socket.IO real-time order status listener
    const socket = io(SOCKET_URL);

    socket.on("orderUpdated", (updatedOrder) => {
      if (
        updatedOrder._id === id ||
        updatedOrder.orderId === id ||
        (order && order._id === updatedOrder._id)
      ) {
        setOrder(updatedOrder);
        toast.success(`🌿 Order status updated to: ${updatedOrder.orderStatus || updatedOrder.status}`, {
          icon: "🔔",
          duration: 5000,
        });
      }
    });

    socket.on("deliveryVerified", (updatedOrder) => {
      if (updatedOrder._id === id || (order && order._id === updatedOrder._id)) {
        setOrder(updatedOrder);
        toast.success("✅ Delivery OTP verified!");
      }
    });

    return () => socket.disconnect();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5f2] flex flex-col justify-between">
        <Navbar />
        <div className="pt-32 pb-20 flex-1 flex items-center justify-center">
          <Loader />
        </div>
        <ProductsFooter />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#f8f5f2] flex flex-col justify-between">
        <Navbar />
        <div className="pt-32 pb-20 px-6 flex-1 flex items-center justify-center">
          <div className="bg-white rounded-[2rem] p-12 max-w-md w-full text-center border border-[#e0d8ce]/40 shadow-sm">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-serif text-[#3e3e3e] mb-2">Order Not Found</h2>
            <p className="text-sm text-gray-500 mb-6">{error || "The requested order could not be located."}</p>
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#a67c52] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#3e3e3e] transition-all"
            >
              <ArrowLeft size={16} />
              <span>Back to My Orders</span>
            </Link>
          </div>
        </div>
        <ProductsFooter />
      </div>
    );
  }

  const orderNumber = order.orderId || order._id.slice(-8).toUpperCase();
  const currentStatus = order.orderStatus || order.status || "PLACED";
  const normalizedCurrent = normalizeStatus(currentStatus);
  const isCancelled = normalizedCurrent === "CANCELLED";

  const currentStepIndex = isCancelled
    ? -1
    : STEPS.findIndex((s) => s.key === normalizedCurrent);

  // Address resolution
  const da = order.deliveryAddress || {};
  const house = da.house || "";
  const street = da.street || "";
  const area = da.area || "";
  const city = da.city || order.shippingAddress?.city || "";
  const state = da.state || "";
  const pincode = da.pincode || order.shippingAddress?.postalCode || "";
  const landmark = da.landmark || "";
  const instructions = da.instructions || "";

  // Items resolution
  const displayItems = order.items && order.items.length > 0 ? order.items : order.orderItems || [];

  return (
    <div className="min-h-screen bg-[#f8f5f2] flex flex-col justify-between">
      <Navbar />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Top Bar Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a67c52] hover:text-[#3e3e3e] transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to All Orders</span>
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e0d8ce] rounded-xl text-xs font-bold text-[#3e3e3e] hover:bg-[#fdfaf7] transition-all shadow-sm"
              >
                <Printer size={14} />
                <span>Print Invoice</span>
              </button>
              <Link
                to="/contactus"
                className="px-4 py-2 bg-[#a67c52] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#3e3e3e] transition-all shadow-sm"
              >
                Help & Support
              </Link>
            </div>
          </div>

          {/* Header Card */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#e0d8ce]/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#e0d8ce]/30">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#a67c52] block mb-1">
                  Reaina's Haven Order
                </span>
                <h1 className="text-3xl font-serif text-[#3e3e3e] flex items-center gap-3">
                  <span>Order</span>
                  <span className="font-mono text-[#a67c52]">#{orderNumber}</span>
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    order.isPaid || order.paymentStatus === "PAID"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  <CreditCard size={12} className="inline mr-1 -mt-0.5" />
                  {order.isPaid || order.paymentStatus === "PAID" ? "PAID" : order.paymentStatus || "PENDING"}
                </span>

                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    isCancelled
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : currentStatus === "DELIVERED" || currentStatus === "Delivered"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {isCancelled ? "CANCELLED" : currentStatus}
                </span>
              </div>
            </div>

            {/* Visual Progress Tracker (Requirement 8) */}
            <div className="pt-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
                Order Status Lifecycle
              </h3>

              {isCancelled ? (
                <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center">
                  <AlertTriangle className="mx-auto text-rose-500 mb-2" size={28} />
                  <h4 className="font-serif font-bold text-rose-800 text-lg">Order Cancelled</h4>
                  <p className="text-xs text-rose-600 mt-1">
                    This order has been cancelled. If payment was deducted, a refund will be processed within 5–7 business days.
                  </p>
                </div>
              ) : (
                <div className="relative">
                  {/* Step Nodes Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {STEPS.map((step, idx) => {
                      const isCompleted = idx < currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      const isPending = idx > currentStepIndex;

                      return (
                        <div
                          key={step.key}
                          className={`relative p-4 rounded-2xl border transition-all text-center flex flex-col items-center justify-between ${
                            isCurrent
                              ? "bg-[#fdfaf7] border-[#a67c52] shadow-sm ring-2 ring-[#a67c52]/20"
                              : isCompleted
                              ? "bg-green-50/50 border-green-200"
                              : "bg-gray-50/50 border-gray-200/60 opacity-60"
                          }`}
                        >
                          {/* Step Icon */}
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold mb-3 shadow-sm ${
                              isCompleted
                                ? "bg-green-600 text-white"
                                : isCurrent
                                ? "bg-[#a67c52] text-white animate-pulse"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {isCompleted ? (
                              <Check size={16} className="stroke-[3]" />
                            ) : isCurrent ? (
                              <span className="text-base leading-none">●</span>
                            ) : (
                              <span>○</span>
                            )}
                          </div>

                          <div>
                            <span
                              className={`text-xs font-bold block ${
                                isCurrent
                                  ? "text-[#a67c52]"
                                  : isCompleted
                                  ? "text-green-800"
                                  : "text-gray-500"
                              }`}
                            >
                              {step.label}
                            </span>
                            <span className="text-[10px] text-gray-400 mt-1 block leading-tight">
                              {step.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column: Order Items */}
            <div className="md:col-span-7 space-y-6">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#e0d8ce]/30">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e0d8ce]/30">
                  <h2 className="text-lg font-serif text-[#3e3e3e] font-semibold flex items-center gap-2">
                    <ShoppingBag size={18} className="text-[#a67c52]" />
                    <span>Ordered Items</span>
                  </h2>
                  <span className="text-xs text-gray-400 font-mono">
                    {displayItems.length} {displayItems.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="divide-y divide-[#f8f5f2]">
                  {displayItems.map((item, idx) => (
                    <div key={idx} className="py-4 flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#fdfaf7] border border-[#e0d8ce]/30 shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#c8a97e]">
                            <Package size={24} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[#3e3e3e] truncate">{item.name}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.quantity || item.qty || 1} × ₹{(item.price || 0).toLocaleString("en-IN")}
                        </p>
                        {item.includes && (
                          <p className="text-[11px] text-[#a67c52] mt-0.5 truncate">
                            <span className="font-semibold">Includes:</span> {item.includes}
                          </p>
                        )}
                      </div>
                      <span className="font-bold text-sm text-[#3e3e3e]">
                        ₹{((item.price || 0) * (item.quantity || item.qty || 1)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals Summary */}
                <div className="mt-6 pt-4 border-t border-[#e0d8ce]/30 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#3e3e3e]">
                      ₹{(order.subtotal || order.totalPrice || order.totalAmount || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery Fee</span>
                    <span className="text-green-600 font-bold uppercase tracking-wider">FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-3 border-t border-[#e0d8ce]/30 text-[#3e3e3e]">
                    <span>Total Amount</span>
                    <span className="text-lg font-serif text-[#a67c52]">
                      ₹{(order.totalAmount || order.totalPrice || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Customer & Delivery Address */}
            <div className="md:col-span-5 space-y-6">
              {/* Delivery Address Card */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#e0d8ce]/30">
                <h2 className="text-lg font-serif text-[#3e3e3e] font-semibold mb-4 pb-3 border-b border-[#e0d8ce]/30 flex items-center gap-2">
                  <MapPin size={18} className="text-[#a67c52]" />
                  <span>Delivery Address</span>
                </h2>

                <div className="text-sm text-[#3e3e3e] leading-relaxed space-y-1">
                  {order.customer?.name && (
                    <p className="font-bold text-base text-[#3e3e3e] mb-1">
                      {order.customer.name}
                    </p>
                  )}
                  {order.customer?.phone && (
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-3">
                      <Phone size={12} className="text-[#a67c52]" />
                      <span>+91 {order.customer.phone}</span>
                    </p>
                  )}

                  <p className="font-medium text-gray-700">
                    {house}
                    {street ? `, ${street}` : ""}
                  </p>
                  <p className="font-medium text-gray-700">
                    {area ? `${area}, ` : ""}
                    {city}
                    {state ? `, ${state}` : ""}
                    {pincode ? ` - ${pincode}` : ""}
                  </p>

                  {landmark && (
                    <p className="text-xs text-gray-500 pt-2 border-t border-[#f8f5f2]">
                      <span className="font-bold text-[#a67c52]">Landmark:</span> Near {landmark}
                    </p>
                  )}

                  {instructions && (
                    <p className="text-xs text-gray-500 pt-1 italic">
                      <span className="font-bold text-[#a67c52]">Instructions:</span> "{instructions}"
                    </p>
                  )}
                </div>

                {/* Geolocation Tag if coordinates saved */}
                {order.location && (
                  <div className="mt-4 pt-3 border-t border-[#e0d8ce]/30 flex items-center gap-2 text-xs text-green-700 font-semibold bg-green-50/60 p-3 rounded-xl border border-green-200/50">
                    <MapPin size={14} className="shrink-0 text-green-600" />
                    <span>
                      📍 Exact delivery pinpoint saved ({order.location.exactLocation || `${order.deliveryAddress?.area || ""}, ${order.deliveryAddress?.city || ""}`.trim() || "Confirmed Location"})
                    </span>
                  </div>
                )}
              </div>

              {/* Delivery OTP Verification Card if Delivered */}
              {order.deliveryOTP && (currentStatus === "DELIVERED" || currentStatus === "Delivered") && (
                <div className="bg-[#fdfaf7] rounded-[2rem] p-6 border border-[#e0d8ce]/50 text-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#a67c52] mb-1">
                    Delivery Verification
                  </h4>
                  <div className="my-3">
                    <span className="font-mono text-3xl font-bold tracking-[0.3em] text-[#3e3e3e]">
                      {order.deliveryOTP}
                    </span>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.isOTPVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {order.isOTPVerified ? "✅ Verified by Partner" : "🔑 Share OTP with Delivery Partner"}
                  </span>
                </div>
              )}
              {/* Rate & Review Your Order Card */}
              <div className="bg-white rounded-[2rem] p-6 border border-[#e0d8ce] shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a67c52] mb-1">
                  <Star size={14} className="fill-amber-400 stroke-amber-400" />
                  <span>Rate Your Sanctuary Experience</span>
                </div>
                <h4 className="text-lg font-serif text-[#3e3e3e] mb-2">
                  How was your order?
                </h4>

                {reviewSubmitted ? (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-center">
                    <CheckCircle2 size={24} className="text-green-700 mx-auto mb-1" />
                    <p className="text-xs font-bold text-green-900">Thank you for your review!</p>
                    <p className="text-[11px] text-green-700 mt-0.5">
                      Your review has been broadcast live across Reaina's Haven.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!orderComment.trim()) {
                        toast.error("Please enter a short comment.");
                        return;
                      }
                      setSubmittingReview(true);
                      try {
                        const firstItemName = order.items?.[0]?.name || "Reaina's Haven Order";
                        const res = await createReview({
                          userName: order.customer?.name || "Sanctuary Patron",
                          userCity: `${order.deliveryAddress?.area || "Ranjhi"}, ${order.deliveryAddress?.city || "Jabalpur"}`,
                          productName: firstItemName,
                          section: "products",
                          orderId: order.orderId,
                          rating: orderRating,
                          comment: orderComment.trim(),
                        });
                        if (res && res._id) {
                          setReviewSubmitted(true);
                          setOrderComment("");
                          toast.success("✨ Review published live across community cards!");
                        } else {
                          toast.error(res?.message || "Failed to submit review.");
                        }
                      } catch (err) {
                        toast.error("Error submitting review.");
                      } finally {
                        setSubmittingReview(false);
                      }
                    }}
                    className="space-y-3 mt-3"
                  >
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setOrderRating(star)}
                          className="p-1 hover:scale-110 transition-transform focus:outline-none"
                        >
                          <Star
                            size={20}
                            className={
                              star <= orderRating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-gray-200 text-gray-200"
                            }
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-600 ml-1">
                        {orderRating} Stars
                      </span>
                    </div>

                    <textarea
                      rows={2}
                      required
                      placeholder="Loved the taste, packaging or prompt delivery? Share with us..."
                      value={orderComment}
                      onChange={(e) => setOrderComment(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#d4c4b0] text-xs focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                    />

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full py-2.5 bg-[#a67c52] hover:bg-[#3e3e3e] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Send size={13} />
                      <span>{submittingReview ? "Submitting..." : "Post Review Live"}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── REAL-TIME COMMUNITY REVIEWS FEED ── */}
        <ReviewsSection 
          currentSection="all" 
          title="Community Orders & Feedback" 
          subtitle="Real-time reviews and experiences from fellow patrons in Jabalpur." 
        />
      </div>

      <ProductsFooter />
    </div>
  );
};

export default OrderDetail;
