import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductsFooter from "../components/ProductsFooter";
import Loader from "../components/Loader";
import CakeVisualPreview from "../components/customStudio/CakeVisualPreview";
import HamperVisualPreview from "../components/customStudio/HamperVisualPreview";
import BouquetVisualPreview from "../components/customStudio/BouquetVisualPreview";
import ReferenceImageUploader from "../components/customStudio/ReferenceImageUploader";
import LivePriceSidebar from "../components/customStudio/LivePriceSidebar";
import AICustomizationDrawer from "../components/customStudio/AICustomizationDrawer";
import CustomizationRequestDetailModal from "../components/customStudio/CustomizationRequestDetailModal";
import {
  getCustomizationConfigs,
  calculateCustomizationPrice,
  createCustomizationRequest,
  getMyCustomizationRequests,
  getProducts,
  getCafes,
  createPaymentOrder,
  verifyPayment,
} from "../services/api";
import { io } from "socket.io-client";
import { SOCKET_URL, RAZORPAY_KEY_ID } from "../config";
import toast from "react-hot-toast";
import {
  Sparkles,
  Sliders,
  Bot,
  Package,
  Cake,
  Flower2,
  Gift,
  Utensils,
  HeartHandshake,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Info,
  ChevronRight,
  Plus,
  RefreshCw,
} from "lucide-react";

const CATEGORY_ICONS = {
  cakes: Cake,
  food: Utensils,
  hampers: Gift,
  flowers: Flower2,
  personalized_gifts: HeartHandshake,
  other: Sparkles,
};

const Customization = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState("STUDIO"); // 'STUDIO' | 'MY_REQUESTS'
  const [customizationMode, setCustomizationMode] = useState("INTERACTIVE"); // 'INTERACTIVE' | 'AI_ASSISTED'
  const [selectedCategory, setSelectedCategory] = useState("cakes");

  // Configurations & Catalog
  const [configs, setConfigs] = useState([]);
  const [currentConfig, setCurrentConfig] = useState(null);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]); // for Hamper builder
  const [packagingOptionName, setPackagingOptionName] = useState("");
  const [decorationOptionName, setDecorationOptionName] = useState("");
  const [referenceImages, setReferenceImages] = useState([]);
  const [specifications, setSpecifications] = useState({
    messageOnProduct: "",
    dietaryRequirements: [],
    designDescription: "",
    recipientName: "",
    engravingText: "",
    specialInstructions: "",
  });
  const [budget, setBudget] = useState(1500);
  const [occasion, setOccasion] = useState("Birthday");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState({
    house: "",
    area: "",
    city: "Jabalpur",
    pincode: "482001",
  });

  // Price Calculation State
  const [pricing, setPricing] = useState(null);
  const [calculatingPrice, setCalculatingPrice] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // My Requests State
  const [myRequests, setMyRequests] = useState([]);
  const [selectedRequestModal, setSelectedRequestModal] = useState(null);

  // AI Drawer State
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  // 1. Initial Load of Configs & Inventory
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const [configList, prodData, cafeData] = await Promise.all([
          getCustomizationConfigs().catch(() => []),
          getProducts().catch(() => []),
          getCafes().catch(() => []),
        ]);

        if (Array.isArray(configList) && configList.length > 0) {
          setConfigs(configList);
          const initial = configList.find((c) => c.category === selectedCategory) || configList[0];
          setCurrentConfig(initial);
          setSelectedCategory(initial.category);

          // Populate default option values
          const initialOpts = {};
          (initial.fields || []).forEach((f) => {
            if (f.defaultValue !== null && f.defaultValue !== undefined) {
              initialOpts[f.id] = f.defaultValue;
            }
          });
          setSelectedOptions(initialOpts);
        }

        // Combine retail products and cafe items for hamper builder
        const combined = [
          ...(Array.isArray(prodData) ? prodData : []).map((p) => ({
            ...p,
            type: "Product",
          })),
          ...(Array.isArray(cafeData) ? cafeData : []).map((c) => ({
            _id: c._id,
            name: c.item_name,
            price: c.price || c.item_price || 0,
            imageUrl: c.imageurl || c.imageUrl || "",
            category: c.category,
            type: "Cafe",
          })),
        ];
        setCatalogProducts(combined);
      } catch (err) {
        console.error("Failed to initialize studio:", err);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  // 2. Fetch User's Existing Requests
  const fetchUserRequests = async () => {
    if (!isLoggedIn) return;
    try {
      const data = await getMyCustomizationRequests();
      setMyRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Could not load user requests:", err.message);
    }
  };

  useEffect(() => {
    if (activeTab === "MY_REQUESTS") {
      fetchUserRequests();
    }
  }, [activeTab, isLoggedIn]);

  // 3. Socket.IO Real-time Status Sync
  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("customizationStatusUpdated", (data) => {
      toast.success(`Request ${data.status.replace("_", " ")}!`, { icon: "✨" });
      fetchUserRequests();
      if (selectedRequestModal && selectedRequestModal._id === data.requestId) {
        setSelectedRequestModal((prev) => ({ ...prev, status: data.status }));
      }
    });

    socket.on("newQuoteGenerated", (data) => {
      toast.success(`New quotation (v${data.version}) ready for ₹${data.total}!`, {
        icon: "📜",
        duration: 6000,
      });
      fetchUserRequests();
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedRequestModal]);

  // 4. Change Active Category
  const handleCategorySelect = (categoryKey) => {
    setSelectedCategory(categoryKey);
    const matched = configs.find((c) => c.category === categoryKey);
    setCurrentConfig(matched);

    if (matched) {
      const initialOpts = {};
      (matched.fields || []).forEach((f) => {
        if (f.defaultValue !== null && f.defaultValue !== undefined) {
          initialOpts[f.id] = f.defaultValue;
        }
      });
      setSelectedOptions(initialOpts);
      setPackagingOptionName(matched.packagingOptions?.[0]?.name || "");
      setDecorationOptionName(matched.decorationOptions?.[0]?.name || "");
    }
  };

  // 5. Authoritative Price Recalculation Effect (Debounced)
  useEffect(() => {
    let active = true;
    const fetchPrice = async () => {
      if (!selectedCategory) return;
      setCalculatingPrice(true);
      try {
        const res = await calculateCustomizationPrice({
          category: selectedCategory,
          selectedOptions,
          selectedProducts,
          packagingOptionName,
          decorationOptionName,
        });
        if (active) setPricing(res);
      } catch (err) {
        console.warn("Price calculation:", err.message);
      } finally {
        if (active) setCalculatingPrice(false);
      }
    };

    const timer = setTimeout(fetchPrice, 200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, selectedOptions, selectedProducts, packagingOptionName, decorationOptionName]);

  // 6. Option Changes
  const handleOptionChange = (fieldId, val) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [fieldId]: val,
    }));
  };

  // 7. Hamper Product Selection Toggle
  const toggleHamperProduct = (product) => {
    const pId = product._id;
    const exists = selectedProducts.some((p) => (p._id || p.product || p.id) === pId);
    if (exists) {
      setSelectedProducts((prev) => prev.filter((p) => (p._id || p.product || p.id) !== pId));
    } else {
      setSelectedProducts((prev) => [
        ...prev,
        {
          _id: pId,
          product: pId,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.imageUrl,
        },
      ]);
    }
  };

  // 8. Submit Final Customization Request
  const handleSubmit = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to submit your custom design.");
      navigate("/login");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        category: selectedCategory,
        customizationMode,
        selectedOptions,
        selectedProducts,
        packagingOptionName,
        decorationOptionName,
        specifications: {
          ...specifications,
          messageOnProduct: selectedOptions.cakeMessage || selectedOptions.cardMessage || specifications.messageOnProduct,
        },
        referenceImages,
        budget: Number(budget) || null,
        occasion,
        deliveryDate: deliveryDate || undefined,
        deliveryAddress,
      };

      const result = await createCustomizationRequest(payload);
      toast.success(result.message || "Customization request submitted!");
      setActiveTab("MY_REQUESTS");
      fetchUserRequests();
    } catch (err) {
      toast.error(err.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  // 9. Payment Integration for Approved Quotation
  const handleProceedToPay = async (request, quote) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to proceed with payment.");
        navigate("/login");
        return;
      }

      toast.loading("Initiating secure Razorpay checkout...", { id: "payment-toast" });

      const paymentOrder = await createPaymentOrder({
        amount: quote.total,
        currency: "INR",
        receipt: `custom_${request._id}`,
      });

      toast.dismiss("payment-toast");

      if (!paymentOrder || !paymentOrder.id) {
        throw new Error("Failed to initialize payment gateway order.");
      }

      // Check if Razorpay checkout script is loaded
      if (typeof window.Razorpay === "undefined") {
        toast.error("Payment gateway is initializing. Please click again.");
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.body.appendChild(script);
        return;
      }

      const options = {
        key: RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "Reaina's Heaven",
        description: `Customization Order #${request.requestNumber}`,
        order_id: paymentOrder.id,
        handler: async function (response) {
          try {
            toast.loading("Verifying payment...", { id: "verify-toast" });
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              db_order_id: request._id,
            });

            toast.dismiss("verify-toast");
            toast.success("Payment successful! Your bespoke order is now confirmed.");
            setSelectedRequestModal(null);
            fetchUserRequests();
          } catch (e) {
            toast.dismiss("verify-toast");
            toast.error(e.message || "Payment verification failed");
          }
        },
        prefill: {
          name: request.customer?.name || "",
          email: request.customer?.email || "",
          contact: request.customer?.phone || "",
        },
        theme: { color: "#a67c52" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.dismiss("payment-toast");
      toast.error(err.message || "Payment failed");
    }
  };

  // 10. AI Brief Application into Studio
  const handleApplyAIBrief = (brief) => {
    if (brief.category && configs.some((c) => c.category === brief.category)) {
      handleCategorySelect(brief.category);
    }
    if (brief.budget) setBudget(brief.budget);
    if (brief.occasion) setOccasion(brief.occasion);

    setSpecifications((prev) => ({
      ...prev,
      designDescription: brief.designDescription || prev.designDescription,
      specialInstructions: brief.specialInstructions || prev.specialInstructions,
    }));

    if (Array.isArray(brief.suggestedProducts) && brief.suggestedProducts.length > 0) {
      setSelectedProducts(brief.suggestedProducts);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-gray-800 flex flex-col font-sans">
      <Navbar />

      {/* Hero Studio Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f2ece4] via-[#f7f2ea] to-[#FAF8F5] pt-12 pb-10 border-b border-[#ebdccf]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a67c52]/10 border border-[#a67c52]/20 text-[#a67c52] text-xs font-semibold uppercase tracking-wider shadow-2xs">
            <Sparkles size={14} className="animate-spin text-[#a67c52]" />
            <span>Reaina Custom Studio</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 tracking-tight">
            Your Imagination. <span className="text-[#a67c52] italic">Your Creation.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-600 leading-relaxed font-light">
            Create something uniquely yours. Customize your favourite products, share your inspiration, and let our master bakers, florists, and designers bring your ideas to life.
          </p>

          {/* Navigation Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveTab("STUDIO")}
              className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-semibold transition-all shadow-xs cursor-pointer ${
                activeTab === "STUDIO"
                  ? "bg-[#2d3a2d] text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Interactive Studio
            </button>

            <button
              onClick={() => {
                if (!isLoggedIn) {
                  toast.error("Please login to view your custom requests.");
                  navigate("/login");
                  return;
                }
                setActiveTab("MY_REQUESTS");
              }}
              className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-semibold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
                activeTab === "MY_REQUESTS"
                  ? "bg-[#2d3a2d] text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <span>My Custom Requests</span>
              {myRequests.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#a67c52] text-white text-[10px] flex items-center justify-center font-bold">
                  {myRequests.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setAiDrawerOpen(true)}
              className="px-5 py-2.5 rounded-2xl text-xs md:text-sm font-semibold bg-gradient-to-r from-[#a67c52] to-[#c29668] text-white shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Bot size={16} />
              <span>Ask AI Consultant</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Studio Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeTab === "STUDIO" ? (
          <div className="space-y-8">
            {/* Category Ribbon */}
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wider font-bold text-gray-400">Select Customization Category</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {configs.map((cfg) => {
                  const Icon = CATEGORY_ICONS[cfg.category] || Sparkles;
                  const isSelected = selectedCategory === cfg.category;

                  return (
                    <button
                      key={cfg.category}
                      onClick={() => handleCategorySelect(cfg.category)}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 cursor-pointer relative overflow-hidden group ${
                        isSelected
                          ? "bg-white border-[#a67c52] shadow-md ring-2 ring-[#a67c52]/20"
                          : "bg-white/70 hover:bg-white border-[#e3d7cb] hover:border-[#a67c52]/50 shadow-xs"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected ? "bg-[#a67c52] text-white" : "bg-[#f5eee6] text-[#a67c52]"
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#a67c52] animate-ping" />
                        )}
                      </div>

                      <div>
                        <p className="text-xs font-bold text-gray-900 group-hover:text-[#a67c52] transition-colors line-clamp-1">
                          {cfg.displayName}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium">Starts ₹{cfg.basePrice}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Studio Workspace: 2-Column Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (7 cols): Controls & Previews */}
              <div className="lg:col-span-8 space-y-6">
                {/* Live Preview Stage */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#ede3d7] space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                      <h2 className="font-serif font-bold text-base text-gray-900">
                        {currentConfig?.displayName || "Interactive Preview"}
                      </h2>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {currentConfig?.badge || "Bespoke Creation"}
                    </span>
                  </div>

                  {/* Render Visual Preview depending on category */}
                  {selectedCategory === "cakes" && (
                    <CakeVisualPreview
                      flavour={selectedOptions.flavour}
                      weight={selectedOptions.weight}
                      shape={selectedOptions.shape}
                      tiers={selectedOptions.tiers}
                      frosting={selectedOptions.frosting}
                      colorPalette={selectedOptions.colorPalette}
                      toppings={selectedOptions.toppings}
                      cakeMessage={selectedOptions.cakeMessage || specifications.messageOnProduct}
                    />
                  )}

                  {selectedCategory === "hampers" && (
                    <HamperVisualPreview
                      packagingType={selectedOptions.packagingType}
                      theme={selectedOptions.theme}
                      colorCombination={selectedOptions.colorCombination}
                      selectedProducts={selectedProducts}
                      recipientName={selectedOptions.recipientName || specifications.recipientName}
                      onRemoveProduct={(id) => {
                        setSelectedProducts((prev) => prev.filter((p) => (p._id || p.product || p.id) !== id));
                      }}
                    />
                  )}

                  {selectedCategory === "flowers" && (
                    <BouquetVisualPreview
                      flowerTypes={selectedOptions.flowerTypes || ["dutch_roses"]}
                      bouquetSize={selectedOptions.bouquetSize}
                      wrappingStyle={selectedOptions.wrappingStyle}
                      ribbonColor={selectedOptions.ribbonColor}
                      cardMessage={selectedOptions.cardMessage || specifications.messageOnProduct}
                    />
                  )}

                  {(selectedCategory === "food" || selectedCategory === "personalized_gifts" || selectedCategory === "other") && (
                    <div className="relative w-full aspect-16/9 rounded-2xl overflow-hidden shadow-inner border border-gray-200">
                      <img
                        src={currentConfig?.heroImage || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800"}
                        alt={currentConfig?.displayName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#e6cbb3]">
                          {currentConfig?.tagline}
                        </span>
                        <h3 className="text-xl font-serif font-bold">{currentConfig?.displayName}</h3>
                        <p className="text-xs text-gray-200 mt-1 max-w-lg">{currentConfig?.description}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hamper Live Catalogue Picker (Only for Hampers) */}
                {selectedCategory === "hampers" && (
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#ede3d7] space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <h3 className="font-serif font-bold text-base text-gray-900">
                          Select Available Products to Fill Your Hamper
                        </h3>
                        <p className="text-xs text-gray-400">
                          Choose blooms, chocolates, and artisan goods from our real verified catalogue
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#a67c52] bg-[#a67c52]/10 px-3 py-1 rounded-full">
                        {selectedProducts.length} added
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
                      {catalogProducts.map((prod) => {
                        const isAdded = selectedProducts.some((p) => (p._id || p.product || p.id) === prod._id);
                        return (
                          <div
                            key={prod._id}
                            onClick={() => toggleHamperProduct(prod)}
                            className={`p-2.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between h-44 relative group ${
                              isAdded
                                ? "border-[#a67c52] bg-[#fdfaf7] shadow-xs ring-1 ring-[#a67c52]"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                          >
                            <img
                              src={prod.imageUrl || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300"}
                              alt={prod.name}
                              className="w-full h-24 object-cover rounded-xl mb-1.5"
                            />
                            <div>
                              <p className="text-xs font-bold text-gray-800 line-clamp-1">{prod.name}</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs font-bold text-[#a67c52]">₹{prod.price}</span>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                  isAdded ? "bg-[#a67c52] text-white" : "bg-gray-100 text-gray-600"
                                }`}>
                                  {isAdded ? "Added" : "+ Add"}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Dynamic Configuration Controls Form */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#ede3d7] space-y-6">
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="font-serif font-bold text-base text-gray-900">Customization Specifications</h3>
                    <p className="text-xs text-gray-400">Configure flavours, portions, and bespoke finishes</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {(currentConfig?.fields || []).map((field) => {
                      const userValue = selectedOptions[field.id];

                      if (field.type === "select" || field.type === "radio") {
                        return (
                          <div key={field.id} className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                              <span>{field.label}</span>
                              {field.required && <span className="text-red-500">*</span>}
                            </label>
                            <select
                              value={userValue || ""}
                              onChange={(e) => handleOptionChange(field.id, e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50/60 focus:bg-white focus:outline-none focus:border-[#a67c52] text-xs text-gray-800"
                            >
                              {(field.options || []).map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label} {opt.price > 0 ? `(+₹${opt.price})` : ""}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      }

                      if (field.type === "color") {
                        return (
                          <div key={field.id} className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-gray-700 block">{field.label}</label>
                            <div className="flex flex-wrap gap-2.5">
                              {(field.options || []).map((opt) => {
                                const isSelected = userValue === opt.value;
                                return (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleOptionChange(field.id, opt.value)}
                                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                                      isSelected
                                        ? "border-[#a67c52] bg-[#a67c52]/10 text-gray-900 ring-1 ring-[#a67c52]"
                                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                    }`}
                                  >
                                    <span
                                      className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                                      style={{ backgroundColor: opt.previewColor || "#ddd" }}
                                    />
                                    <span>{opt.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      if (field.type === "multiselect") {
                        const selectedList = Array.isArray(userValue) ? userValue : [];
                        return (
                          <div key={field.id} className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-gray-700 block">{field.label}</label>
                            <div className="flex flex-wrap gap-2">
                              {(field.options || []).map((opt) => {
                                const isChecked = selectedList.includes(opt.value);
                                return (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                      const updated = isChecked
                                        ? selectedList.filter((v) => v !== opt.value)
                                        : [...selectedList, opt.value];
                                      handleOptionChange(field.id, updated);
                                    }}
                                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                                      isChecked
                                        ? "border-[#a67c52] bg-[#a67c52] text-white shadow-xs"
                                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                    }`}
                                  >
                                    {opt.label} {opt.price > 0 ? `(+₹${opt.price})` : ""}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      if (field.type === "text" || field.type === "textarea") {
                        return (
                          <div key={field.id} className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-gray-700 block">{field.label}</label>
                            {field.type === "textarea" ? (
                              <textarea
                                rows={2}
                                value={userValue || ""}
                                placeholder={field.placeholder || ""}
                                onChange={(e) => handleOptionChange(field.id, e.target.value)}
                                className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50/60 focus:bg-white focus:outline-none focus:border-[#a67c52] text-xs text-gray-800"
                              />
                            ) : (
                              <input
                                type="text"
                                value={userValue || ""}
                                placeholder={field.placeholder || ""}
                                onChange={(e) => handleOptionChange(field.id, e.target.value)}
                                className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50/60 focus:bg-white focus:outline-none focus:border-[#a67c52] text-xs text-gray-800"
                              />
                            )}
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>

                  {/* Packaging Options */}
                  {currentConfig?.packagingOptions && currentConfig.packagingOptions.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <label className="text-xs font-bold text-gray-700 block">Select Luxury Packaging</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {currentConfig.packagingOptions.map((pkg) => {
                          const isSelected = packagingOptionName === pkg.name;
                          return (
                            <button
                              key={pkg.name}
                              type="button"
                              onClick={() => setPackagingOptionName(pkg.name)}
                              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? "border-[#a67c52] bg-[#fbf8f5] ring-1 ring-[#a67c52]"
                                  : "border-gray-200 bg-white hover:border-gray-300"
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-gray-900 line-clamp-1">{pkg.name}</span>
                                <span className="text-xs font-bold text-[#a67c52]">
                                  {pkg.price > 0 ? `+₹${pkg.price}` : "Free"}
                                </span>
                              </div>
                              {pkg.description && (
                                <p className="text-[10px] text-gray-400 line-clamp-2">{pkg.description}</p>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Reference Images Upload System */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#ede3d7] space-y-4">
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="font-serif font-bold text-base text-gray-900">
                      Inspiration & Reference Images
                    </h3>
                    <p className="text-xs text-gray-400">
                      Upload Pinterest moodboards, color palettes, or screenshot references to guide our creators
                    </p>
                  </div>
                  <ReferenceImageUploader
                    images={referenceImages}
                    onImagesChange={setReferenceImages}
                    maxImages={5}
                  />
                </div>

                {/* Delivery Date & Address Details */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#ede3d7] space-y-4">
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="font-serif font-bold text-base text-gray-900">Delivery Information</h3>
                    <p className="text-xs text-gray-400">Specify when and where your creation should be delivered</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-bold text-gray-700">Target Delivery Date</label>
                      <input
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#a67c52]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-gray-700">Delivery City</label>
                      <input
                        type="text"
                        value={deliveryAddress.city}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#a67c52]"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="font-bold text-gray-700">House / Apartment / Street Address</label>
                      <input
                        type="text"
                        placeholder="House / Flat No., Landmark..."
                        value={deliveryAddress.house}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, house: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#a67c52]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (4 cols): Sticky Price Breakdown & Submit */}
              <div className="lg:col-span-4">
                <LivePriceSidebar
                  pricing={pricing}
                  loading={calculatingPrice}
                  submitting={submitting}
                  onSubmit={handleSubmit}
                  onSaveDraft={() => {
                    localStorage.setItem("saved_studio_draft", JSON.stringify({
                      category: selectedCategory,
                      selectedOptions,
                      selectedProducts,
                    }));
                    toast.success("Draft saved to this device!");
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* My Requests Tab View */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-900">My Custom Creations</h2>
                <p className="text-xs text-gray-500">Track artisan reviews, view official quotations, and monitor production</p>
              </div>
              <button
                onClick={fetchUserRequests}
                className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={14} /> Refresh Requests
              </button>
            </div>

            {myRequests.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#f8f5f2] text-[#a67c52] flex items-center justify-center mx-auto">
                  <Sparkles size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-gray-900">No Custom Requests Yet</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                    You haven't submitted any bespoke design requests yet. Use our studio to design something special!
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("STUDIO")}
                  className="px-5 py-2.5 rounded-2xl bg-[#a67c52] text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  Start Customizing Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {myRequests.map((req) => (
                  <div
                    key={req._id}
                    onClick={() => setSelectedRequestModal(req)}
                    className="bg-white rounded-3xl p-5 border border-[#ede3d7] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#a67c52] uppercase tracking-wider">
                          {req.requestNumber || "CUSTOM ORDER"}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 uppercase">
                          {req.status?.replace("_", " ")}
                        </span>
                      </div>

                      <h4 className="text-base font-serif font-bold text-gray-900 capitalize group-hover:text-[#a67c52] transition-colors">
                        {req.category} Customization
                      </h4>

                      <p className="text-xs text-gray-500 line-clamp-2">
                        {req.specifications?.messageOnProduct || req.specifications?.designDescription || "Custom requested creation"}
                      </p>
                    </div>

                    <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase font-bold">
                          {req.activeQuote ? "Official Quote" : "Estimated Total"}
                        </span>
                        <span className="text-base font-serif font-bold text-gray-900">
                          ₹{req.finalQuotedPrice || req.estimatedPrice}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[#a67c52] font-semibold text-xs group-hover:translate-x-0.5 transition-transform">
                        <span>Details & Quote</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* AI Customization Drawer Modal */}
      <AICustomizationDrawer
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        initialCategory={selectedCategory}
        onApplyBrief={handleApplyAIBrief}
      />

      {/* Request Details & Quotation Modal */}
      {selectedRequestModal && (
        <CustomizationRequestDetailModal
          request={selectedRequestModal}
          isOpen={Boolean(selectedRequestModal)}
          onClose={() => setSelectedRequestModal(null)}
          onRefresh={fetchUserRequests}
          onProceedToPay={handleProceedToPay}
        />
      )}

      <ProductsFooter />
    </div>
  );
};

export default Customization;
