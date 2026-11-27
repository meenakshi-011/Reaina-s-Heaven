import React, { useState, useEffect } from "react";
import { Star, MessageSquarePlus, CheckCircle2, Sparkles, X, Heart, ShieldCheck, Send } from "lucide-react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { SOCKET_URL } from "../config";
import { getReviews, createReview } from "../services/api";

const ReviewsSection = ({ 
  currentSection = "all", 
  title = "Real-Time Community Reviews",
  subtitle = "What our Jabalpur patrons are saying about their orders & experiences."
}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(currentSection);
  const [showModal, setShowModal] = useState(false);
  const [newIncomingId, setNewIncomingId] = useState(null);

  // Form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [city, setCity] = useState("Ranjhi, Jabalpur");
  const [productName, setProductName] = useState("");
  const [section, setSection] = useState(currentSection === "all" ? "general" : currentSection);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch reviews
  const fetchReviewsList = async (sect) => {
    try {
      setLoading(true);
      const data = await getReviews(sect);
      if (Array.isArray(data)) {
        setReviews(data);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsList(activeFilter);
  }, [activeFilter]);

  // ⚡ REAL-TIME SOCKET.IO LISTENER
  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("newReview", (incomingReview) => {
      console.log("⚡ Real-time review received via Socket.IO:", incomingReview);
      setNewIncomingId(incomingReview._id);

      // Prepend review if it matches current filter or if filter is "all"
      setReviews((prev) => {
        const exists = prev.some((r) => r._id === incomingReview._id);
        if (exists) return prev;
        return [incomingReview, ...prev];
      });

      toast.success(`✨ New review from ${incomingReview.userName} just arrived!`, {
        icon: "🌟",
        duration: 4000,
      });

      // Clear highlight after 5s
      setTimeout(() => setNewIncomingId(null), 5000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please share a brief comment about your experience.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createReview({
        userName: name.trim() || undefined,
        userCity: city.trim() || "Jabalpur",
        productName: productName.trim() || undefined,
        section,
        rating,
        comment: comment.trim(),
      });

      if (res && res._id) {
        toast.success("🎉 Thank you for your heartfelt review!");
        setShowModal(false);
        setComment("");
        setName("");
        setProductName("");
        // Prepend to local state if not already added by socket
        setReviews((prev) => (prev.some((r) => r._id === res._id) ? prev : [res, ...prev]));
      } else {
        toast.error(res?.message || "Failed to submit review.");
      }
    } catch (err) {
      toast.error(err.message || "Network error while submitting review.");
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto w-full">
      {/* ── HEADER ───────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#e0d8ce]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-[10px] font-bold uppercase tracking-wider text-green-800">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block" />
              Real-Time Customer Feed
            </span>
            <span className="text-xs text-[#a67c52] font-semibold flex items-center gap-1">
              <Star size={13} className="fill-amber-400 stroke-amber-400" />
              {averageRating} / 5.0 ({reviews.length} Reviews)
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#3e3e3e] leading-tight">
            {title}
          </h2>
          <p className="text-gray-500 text-sm mt-1 max-w-xl">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-[#a67c52] hover:bg-[#3e3e3e] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <MessageSquarePlus size={15} />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* ── SECTION FILTER PILLS ─────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {[
          { label: "All Reviews", val: "all" },
          { label: "🌿 General Sanctuary", val: "general" },
          { label: "🌸 Products & Flowers", val: "products" },
          { label: "☕ Café & Cakes", val: "cafe" },
          { label: "🍱 Tiffin Services", val: "tiffin" },
          { label: "📖 Experiences & Community", val: "experiences" },
        ].map((f) => (
          <button
            key={f.val}
            onClick={() => setActiveFilter(f.val)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              activeFilter === f.val
                ? "bg-[#3e3e3e] text-white border-[#3e3e3e] shadow-sm"
                : "bg-white text-gray-600 border-[#e0d8ce] hover:border-[#a67c52]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── REVIEWS GRID ─────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm animate-pulse h-48" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#e0d8ce] p-8">
          <span className="text-4xl block mb-2">💌</span>
          <h4 className="font-serif text-lg text-[#3e3e3e] mb-1">Be the First to Review</h4>
          <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">
            Share your experience with Jabalpur's sanctuary. Your review will appear in real time!
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2.5 bg-[#a67c52] text-white rounded-full text-xs font-bold uppercase tracking-wider"
          >
            Write Review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => {
            const isJustArrived = newIncomingId === rev._id;
            return (
              <div
                key={rev._id}
                className={`bg-white rounded-3xl p-6 border transition-all duration-500 flex flex-col justify-between relative ${
                  isJustArrived
                    ? "border-green-400 shadow-xl ring-2 ring-green-400/40 bg-green-50/20"
                    : "border-[#e0d8ce]/70 shadow-sm hover:shadow-md"
                }`}
              >
                {isJustArrived && (
                  <span className="absolute -top-3 right-6 bg-green-600 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md animate-bounce">
                    ✨ Just Now
                  </span>
                )}

                <div>
                  {/* Stars & Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={
                            s <= (rev.rating || 5)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-gray-200 text-gray-200"
                          }
                        />
                      ))}
                    </div>
                    {rev.isVerifiedBuyer && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200/50">
                        <CheckCircle2 size={11} />
                        Verified Jabalpur Patron
                      </span>
                    )}
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-gray-700 leading-relaxed italic mb-4 font-normal">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <div>
                    <h5 className="text-xs font-bold text-[#3e3e3e]">
                      {rev.userName}
                    </h5>
                    <p className="text-[11px] text-[#a67c52]">
                      📍 {rev.userCity || "Jabalpur"}
                    </p>
                  </div>
                  {rev.productName && (
                    <span className="text-[10px] text-gray-400 font-medium max-w-[130px] truncate text-right">
                      {rev.productName}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── WRITE REVIEW MODAL ─────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e0d8ce]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a67c52] mb-1">
              <Sparkles size={14} />
              <span>Share Your Experience</span>
            </div>
            <h3 className="text-2xl font-serif text-[#3e3e3e] mb-2">
              Write a Review
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Your feedback is published live in real-time across Reaina's Haven community cards.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Star Rating Selector */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#3e3e3e] block mb-1.5">
                  Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        size={28}
                        className={
                          star <= (hoverRating || rating)
                            ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                            : "fill-gray-200 text-gray-200"
                        }
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-600 ml-2">
                    {rating} out of 5 Stars
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#3e3e3e] block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4c4b0] text-sm focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#3e3e3e] block mb-1">
                    Locality in Jabalpur
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ranjhi / Wright Town"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4c4b0] text-sm focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#3e3e3e] block mb-1">
                    Section
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4c4b0] text-sm focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30 bg-white"
                  >
                    <option value="general">General Sanctuary</option>
                    <option value="products">Floral Bouquet / Hamper</option>
                    <option value="cafe">Café Delights & Cakes</option>
                    <option value="tiffin">Daily Tiffin Service</option>
                    <option value="experiences">Haven Book Society / Events</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#3e3e3e] block mb-1">
                    Item / Experience Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Haven Book Society"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4c4b0] text-sm focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#3e3e3e] block mb-1">
                  Your Review / Experience *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share what you loved about the food, delivery, packaging, or community vibe..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4c4b0] text-sm focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#a67c52] hover:bg-[#3e3e3e] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                <Send size={14} />
                <span>{submitting ? "Publishing Real-Time..." : "Publish Review Live"}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
