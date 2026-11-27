import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  CreditCard,
  ShoppingBag,
  CheckCircle2,
  ArrowRight,
  Navigation,
  AlertCircle,
  Clock,
  Sparkles,
  Phone,
  User,
  Home,
  FileText,
  Check,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { createOrder, createPaymentOrder, verifyPayment } from "../services/api";
import { toast } from "react-hot-toast";
import ProductsFooter from "../components/ProductsFooter";
import { RAZORPAY_KEY_ID, API_URL } from "../config";
import DeliveryLocationMap, { parseNominatimAddress } from "../components/DeliveryLocationMap";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [coords, setCoords] = useState(null); // { latitude, longitude, exactLocation }
  const [exactLocationName, setExactLocationName] = useState("");

  // Customer Details
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
  });

  // Delivery Address
  const [deliveryAddress, setDeliveryAddress] = useState({
    house: "",
    street: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    instructions: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [validationErrors, setValidationErrors] = useState({});

  // Placed order state for confirmation screen
  const [placedOrder, setPlacedOrder] = useState(null);

  // Pre-fill user details if logged in & check for saved exact location
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.user) {
            setCustomer((prev) => ({
              name: prev.name || data.user.name || "",
              phone: prev.phone || data.user.phone || "",
            }));
          }
        })
        .catch(() => {});
    }

    // Check if user previously saved exact location from cafe menu or previous session
    try {
      const savedLoc = localStorage.getItem("userExactLocation");
      if (savedLoc) {
        const parsed = JSON.parse(savedLoc);
        if (parsed.exactLocation) {
          setExactLocationName(parsed.exactLocation);
        }
        if (parsed.coords) {
          setCoords(parsed.coords);
        }
        if (parsed.address) {
          setDeliveryAddress((prev) => ({
            ...prev,
            street: prev.street || parsed.address.street || "",
            area: prev.area || parsed.address.area || "",
            city: prev.city || parsed.address.city || "",
            state: prev.state || parsed.address.state || "",
            pincode: prev.pincode || parsed.address.pincode || "",
          }));
        }
      }
    } catch (e) {}
  }, []);

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLocationSelect = ({ coords: newCoords, exactLocation, title, address }) => {
    setCoords({
      latitude: newCoords.latitude,
      longitude: newCoords.longitude,
      exactLocation,
    });
    setExactLocationName(exactLocation);

    setDeliveryAddress((prev) => ({
      ...prev,
      street: address.street || prev.street,
      area: address.area || prev.area,
      city: address.city || prev.city,
      state: address.state || prev.state,
      pincode: address.pincode || prev.pincode,
      landmark: address.landmark || prev.landmark,
    }));

    setValidationErrors((prev) => {
      const next = { ...prev };
      if (address.area) delete next.area;
      if (address.city) delete next.city;
      if (address.state) delete next.state;
      if (address.pincode) delete next.pincode;
      return next;
    });

    localStorage.setItem(
      "userExactLocation",
      JSON.stringify({
        exactLocation,
        coords: { latitude: newCoords.latitude, longitude: newCoords.longitude },
        address: {
          street: address.street,
          area: address.area,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          landmark: address.landmark,
        },
      })
    );
  };

  // 📍 Geolocation API - ONLY runs when user clicks button
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      const msg = "Geolocation is not supported by your browser. Please enter your address manually.";
      setLocationError(msg);
      toast.error(msg);
      return;
    }

    setLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLocating(false);
        toast.success("📍 Exact delivery location detected!");

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );
          if (response.ok) {
            const data = await response.json();
            const parsed = parseNominatimAddress(data);

            if (parsed) {
              handleLocationSelect({
                coords: { latitude, longitude },
                exactLocation: parsed.fullAddress,
                title: parsed.title,
                address: {
                  street: parsed.street,
                  area: parsed.area,
                  city: parsed.city,
                  state: parsed.state,
                  pincode: parsed.pincode,
                  landmark: parsed.landmark,
                },
              });
              toast.success("✨ Exact address detected & auto-filled! Please enter House / Flat No.", {
                icon: "🏡",
                duration: 4500,
              });
            }
          }
        } catch (geoErr) {
          console.warn("Reverse geocode attempt completed:", geoErr.message);
          const fallbackLoc = "Exact Pinpoint Location (GPS Verified)";
          setExactLocationName(fallbackLoc);
          setCoords({ latitude, longitude, exactLocation: fallbackLoc });
        }
      },
      (error) => {
        setLocating(false);
        let errorMsg = "Unable to retrieve your location. You can enter your delivery address manually.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permission was denied. You can enter your delivery address manually.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = "Location information is unavailable on your device. You can enter your delivery address manually.";
        } else if (error.code === error.TIMEOUT) {
          errorMsg = "Location request timed out. You can enter your delivery address manually.";
        }
        setLocationError(errorMsg);
        toast.error(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Validation
  const validateForm = () => {
    const errors = {};

    if (!customer.name.trim()) {
      errors.name = "Full Name is required";
    }

    const cleanPhone = customer.phone.replace(/\D/g, "");
    if (!customer.phone.trim()) {
      errors.phone = "Mobile Number is required";
    } else if (cleanPhone.length !== 10) {
      errors.phone = "Please enter a valid 10-digit mobile number";
    }

    if (!deliveryAddress.house.trim()) {
      errors.house = "House/Flat/Building number is required";
    }

    if (!deliveryAddress.area.trim()) {
      errors.area = "Area/Locality is required";
    }

    if (!deliveryAddress.city.trim()) {
      errors.city = "City is required";
    }

    if (!deliveryAddress.state.trim()) {
      errors.state = "State is required";
    }

    const cleanPincode = deliveryAddress.pincode.replace(/\D/g, "");
    if (!deliveryAddress.pincode.trim()) {
      errors.pincode = "Pincode is required";
    } else if (cleanPincode.length !== 6) {
      errors.pincode = "Please enter a valid 6-digit postal pincode";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async (dbOrderId, orderIdDisplay) => {
    if (!RAZORPAY_KEY_ID) {
      toast.error("Razorpay Key ID is not configured. Falling back to COD.");
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
        description: `Order #${orderIdDisplay} - Botanical Sanctuary & Cafe`,
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
              setPlacedOrder(verifyRes.order);
            }
          } catch (err) {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: customer.name,
          contact: customer.phone,
        },
        theme: {
          color: "#a67c52",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error(`Payment Failed: ${response.error.description || "Transaction cancelled"}`);
      });
      rzp.open();
    } catch (error) {
      toast.error("Failed to initiate online payment. Please try again.");
    }
  };

  const placeOrderHandler = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      navigate("/cart");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill in all required delivery details properly.");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        customer: {
          name: customer.name.trim(),
          phone: customer.phone.trim(),
        },
        deliveryAddress: {
          house: deliveryAddress.house.trim(),
          street: deliveryAddress.street.trim(),
          area: deliveryAddress.area.trim(),
          city: deliveryAddress.city.trim(),
          state: deliveryAddress.state.trim(),
          pincode: deliveryAddress.pincode.trim(),
          landmark: deliveryAddress.landmark.trim(),
          instructions: deliveryAddress.instructions.trim(),
        },
        location: coords
          ? {
              latitude: coords.latitude,
              longitude: coords.longitude,
              exactLocation: exactLocationName || `${deliveryAddress.area}, ${deliveryAddress.city}`,
            }
          : undefined,
        items: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          quantity: item.qty || 1,
          price: item.price || 0,
          image: item.imageUrl || item.imageurl || item.image || "",
          includes: item.includes || "",
          selectedQty: item.selectedQty || undefined,
        })),
        paymentMethod,
      };

      const result = await createOrder(orderData);

      if (result && (result._id || result.orderId)) {
        if (paymentMethod === "Online Payment") {
          await handlePayment(result._id, result.orderId || result._id.slice(-8).toUpperCase());
        } else {
          toast.success("🎉 Order Placed Successfully!");
          clearCart();
          setPlacedOrder(result);
        }
      } else {
        toast.error(result.message || "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Place order error:", error);
      toast.error("Something went wrong while creating your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── ORDER CONFIRMATION VIEW (Requirement 15) ─────────────────────────
  if (placedOrder) {
    const orderNumber = placedOrder.orderId || placedOrder._id.slice(-8).toUpperCase();
    const areaCity = placedOrder.deliveryAddress
      ? `${placedOrder.deliveryAddress.area}, ${placedOrder.deliveryAddress.city}`
      : `${deliveryAddress.area}, ${deliveryAddress.city}`;

    return (
      <div className="min-h-screen bg-[#f8f5f2] flex flex-col justify-between">
        <Navbar />
        <div className="pt-32 pb-20 px-6 flex-1 flex items-center justify-center">
          <div className="max-w-xl w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-[#e0d8ce]/40 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-50 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100">
              <Check size={40} className="stroke-[2.5]" />
            </div>

            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#a67c52] block mb-2">
              Confirmation
            </span>
            <h1 className="text-3xl md:text-4xl font-serif text-[#3e3e3e] mb-3">
              🎉 Order Placed Successfully!
            </h1>

            <div className="bg-[#fdfaf7] rounded-2xl p-6 border border-[#e0d8ce]/40 my-6 text-left space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-[#e0d8ce]/30">
                <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Order ID</span>
                <span className="font-mono font-bold text-lg text-[#3e3e3e]">#{orderNumber}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#e0d8ce]/30">
                <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Status</span>
                <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {placedOrder.orderStatus || placedOrder.status || "PLACED"}
                </span>
              </div>
              <div className="flex items-start justify-between pt-1">
                <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Delivery To</span>
                <span className="text-sm font-semibold text-[#3e3e3e] text-right flex items-center gap-1">
                  <MapPin size={14} className="text-[#a67c52] shrink-0" />
                  {areaCity}
                </span>
              </div>
              {placedOrder.location && (
                <div className="pt-2 flex items-center justify-end text-[11px] text-green-700 font-semibold gap-1">
                  <span>📍 Exact pinpoint saved</span>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
              Your order has been received by our kitchen & botanical team. You can track preparation and status updates in real time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={`/orders/${placedOrder._id}`}
                className="flex-1 py-4 px-6 bg-[#a67c52] text-white rounded-2xl font-bold uppercase tracking-wider text-xs shadow-lg hover:bg-[#3e3e3e] transition-all flex items-center justify-center gap-2"
              >
                <span>View Order</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/products"
                className="flex-1 py-4 px-6 bg-white border border-[#e0d8ce] text-[#3e3e3e] rounded-2xl font-bold uppercase tracking-wider text-xs hover:bg-[#fdfaf7] transition-all flex items-center justify-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
        <ProductsFooter />
      </div>
    );
  }

  // ── EMPTY CART STATE ─────────────────────────
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f5f2] flex flex-col justify-between">
        <Navbar />
        <div className="pt-32 pb-20 px-6 flex-1 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-[2rem] p-12 text-center border border-[#e0d8ce]/40 shadow-sm">
            <div className="w-20 h-20 bg-[#fdfaf7] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={36} className="text-[#c8a97e]" />
            </div>
            <h2 className="text-2xl font-serif text-[#3e3e3e] mb-3">Your Cart is Empty</h2>
            <p className="text-sm text-gray-500 mb-8">
              Explore our fresh bakery items, comforting cafe menu, and artisanal botanical gifts before checking out.
            </p>
            <Link
              to="/products"
              className="inline-block w-full py-4 bg-[#a67c52] text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#3e3e3e] transition-all shadow-md"
            >
              Browse Collections
            </Link>
          </div>
        </div>
        <ProductsFooter />
      </div>
    );
  }

  // ── MAIN CHECKOUT FORM ─────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f5f2] flex flex-col justify-between">
      <Navbar />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 text-center">
            <span className="text-xs font-bold tracking-[0.25em] text-[#a67c52] uppercase mb-2 block">
              Step 2 of 2
            </span>
            <h1 className="text-3xl md:text-5xl font-serif text-[#3e3e3e]">
              Customer & <span className="text-green-800 italic">Delivery Checkout</span> 🌿
            </h1>
            <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
              Please enter your details and exact delivery address so our team can prepare your package promptly.
            </p>
          </header>

          <form onSubmit={placeOrderHandler} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              {/* 1. CUSTOMER DETAILS */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#e0d8ce]/30">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#e0d8ce]/30">
                  <div className="w-12 h-12 bg-[#fdfaf7] rounded-2xl flex items-center justify-center text-[#a67c52] border border-[#e0d8ce]/40">
                    <User size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif text-[#3e3e3e] font-semibold">1. Customer Details</h2>
                    <p className="text-xs text-gray-400">Who should we contact regarding this order?</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[#a67c52] uppercase tracking-wider mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={customer.name}
                      onChange={handleCustomerChange}
                      placeholder="e.g. Rahul Sharma"
                      className={`w-full bg-[#fdfaf7] border ${
                        validationErrors.name ? "border-red-400" : "border-[#e0d8ce]/60"
                      } rounded-xl px-4 py-3 outline-none focus:border-[#a67c52] text-[#3e3e3e] text-sm transition-colors`}
                    />
                    {validationErrors.name && (
                      <span className="text-xs text-red-500 mt-1 block font-medium">
                        {validationErrors.name}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#a67c52] uppercase tracking-wider mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        maxLength="10"
                        value={customer.phone}
                        onChange={handleCustomerChange}
                        placeholder="98XXXXXXXX"
                        className={`w-full bg-[#fdfaf7] border ${
                          validationErrors.phone ? "border-red-400" : "border-[#e0d8ce]/60"
                        } rounded-xl pl-12 pr-4 py-3 outline-none focus:border-[#a67c52] text-[#3e3e3e] text-sm transition-colors`}
                      />
                    </div>
                    {validationErrors.phone && (
                      <span className="text-xs text-red-500 mt-1 block font-medium">
                        {validationErrors.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. DELIVERY ADDRESS & GOOGLE MAPS / SWIGGY PINPOINT */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#e0d8ce]/30 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e0d8ce]/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#fdfaf7] rounded-2xl flex items-center justify-center text-[#a67c52] border border-[#e0d8ce]/40">
                      <MapPin size={22} />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif text-[#3e3e3e] font-semibold">2. Delivery Address</h2>
                      <p className="text-xs text-gray-400">Pinpoint your exact delivery destination on the map</p>
                    </div>
                  </div>

                  {coords && (
                    <button
                      type="button"
                      onClick={() => {
                        setCoords(null);
                        setExactLocationName("");
                        localStorage.removeItem("userExactLocation");
                        setDeliveryAddress((prev) => ({
                          ...prev,
                          street: "",
                          area: "",
                          city: "",
                          state: "",
                          pincode: "",
                        }));
                        toast("Location reset. You can search or place a new pin on the map.", { icon: "ℹ️" });
                      }}
                      className="text-xs text-gray-500 hover:text-red-600 font-semibold transition-colors flex items-center gap-1 self-start sm:self-center"
                    >
                      <span>Reset Map Pin</span>
                    </button>
                  )}
                </div>

                {/* Swiggy / Zomato / Google Maps Style Interactive Map Picker */}
                <DeliveryLocationMap
                  coords={coords}
                  exactLocationName={exactLocationName}
                  onLocationSelect={handleLocationSelect}
                  deliveryAddress={deliveryAddress}
                  onAddressChange={handleAddressChange}
                />

                {/* Location Error / Notice */}
                {locationError && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-800">
                    <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <p className="font-semibold">{locationError}</p>
                      <p className="opacity-80 mt-0.5">You can safely search or fill out the address fields manually below.</p>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <h3 className="text-sm font-bold text-[#3e3e3e] mb-1 flex items-center gap-2">
                    <span>Doorstep Address Details</span>
                    <span className="text-[11px] font-normal text-gray-400">(Auto-filled from map pin, enter House / Flat No.)</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[#a67c52] uppercase tracking-wider mb-2">
                      House / Flat / Building No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="house"
                      value={deliveryAddress.house}
                      onChange={handleAddressChange}
                      placeholder="e.g. Flat 302, Sunrise Apts or 123"
                      className={`w-full bg-[#fdfaf7] border ${
                        validationErrors.house ? "border-red-400" : "border-[#e0d8ce]/60"
                      } rounded-xl px-4 py-3 outline-none focus:border-[#a67c52] text-[#3e3e3e] text-sm transition-colors`}
                    />
                    {validationErrors.house && (
                      <span className="text-xs text-red-500 mt-1 block font-medium">
                        {validationErrors.house}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#a67c52] uppercase tracking-wider mb-2">
                      Street / Road
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={deliveryAddress.street}
                      onChange={handleAddressChange}
                      placeholder="e.g. Main Road / Temple Road"
                      className="w-full bg-[#fdfaf7] border border-[#e0d8ce]/60 rounded-xl px-4 py-3 outline-none focus:border-[#a67c52] text-[#3e3e3e] text-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#a67c52] uppercase tracking-wider mb-2">
                      Area / Locality <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={deliveryAddress.area}
                      onChange={handleAddressChange}
                      placeholder="e.g. Ranjhi"
                      className={`w-full bg-[#fdfaf7] border ${
                        validationErrors.area ? "border-red-400" : "border-[#e0d8ce]/60"
                      } rounded-xl px-4 py-3 outline-none focus:border-[#a67c52] text-[#3e3e3e] text-sm transition-colors`}
                    />
                    {validationErrors.area && (
                      <span className="text-xs text-red-500 mt-1 block font-medium">
                        {validationErrors.area}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#a67c52] uppercase tracking-wider mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={deliveryAddress.city}
                      onChange={handleAddressChange}
                      placeholder="e.g. Jabalpur"
                      className={`w-full bg-[#fdfaf7] border ${
                        validationErrors.city ? "border-red-400" : "border-[#e0d8ce]/60"
                      } rounded-xl px-4 py-3 outline-none focus:border-[#a67c52] text-[#3e3e3e] text-sm transition-colors`}
                    />
                    {validationErrors.city && (
                      <span className="text-xs text-red-500 mt-1 block font-medium">
                        {validationErrors.city}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#a67c52] uppercase tracking-wider mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={deliveryAddress.state}
                      onChange={handleAddressChange}
                      placeholder="e.g. Madhya Pradesh"
                      className={`w-full bg-[#fdfaf7] border ${
                        validationErrors.state ? "border-red-400" : "border-[#e0d8ce]/60"
                      } rounded-xl px-4 py-3 outline-none focus:border-[#a67c52] text-[#3e3e3e] text-sm transition-colors`}
                    />
                    {validationErrors.state && (
                      <span className="text-xs text-red-500 mt-1 block font-medium">
                        {validationErrors.state}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#a67c52] uppercase tracking-wider mb-2">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength="6"
                      name="pincode"
                      value={deliveryAddress.pincode}
                      onChange={handleAddressChange}
                      placeholder="e.g. 482005"
                      className={`w-full bg-[#fdfaf7] border ${
                        validationErrors.pincode ? "border-red-400" : "border-[#e0d8ce]/60"
                      } rounded-xl px-4 py-3 outline-none focus:border-[#a67c52] text-[#3e3e3e] text-sm transition-colors`}
                    />
                    {validationErrors.pincode && (
                      <span className="text-xs text-red-500 mt-1 block font-medium">
                        {validationErrors.pincode}
                      </span>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#a67c52] uppercase tracking-wider mb-2">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={deliveryAddress.landmark}
                      onChange={handleAddressChange}
                      placeholder="e.g. Near XYZ School / Behind City Hospital"
                      className="w-full bg-[#fdfaf7] border border-[#e0d8ce]/60 rounded-xl px-4 py-3 outline-none focus:border-[#a67c52] text-[#3e3e3e] text-sm transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#a67c52] uppercase tracking-wider mb-2">
                      Optional Delivery Instructions
                    </label>
                    <textarea
                      rows={2}
                      name="instructions"
                      value={deliveryAddress.instructions}
                      onChange={handleAddressChange}
                      placeholder="e.g. Please call before arriving or leave with security."
                      className="w-full bg-[#fdfaf7] border border-[#e0d8ce]/60 rounded-xl px-4 py-3 outline-none focus:border-[#a67c52] text-[#3e3e3e] text-sm resize-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* 3. PAYMENT METHOD */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#e0d8ce]/30">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#e0d8ce]/30">
                  <div className="w-12 h-12 bg-[#fdfaf7] rounded-2xl flex items-center justify-center text-[#a67c52] border border-[#e0d8ce]/40">
                    <CreditCard size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif text-[#3e3e3e] font-semibold">3. Payment Preference</h2>
                    <p className="text-xs text-gray-400">Choose how you'd like to pay for your haven items</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      id: "Cash on Delivery",
                      title: "Cash on Delivery (COD)",
                      desc: "Pay in cash or UPI directly when your package arrives at your door.",
                      badge: "Convenient",
                    },
                    {
                      id: "Online Payment",
                      title: "Instant Online Payment",
                      desc: "Pay securely with UPI, Credit/Debit Card, or Netbanking via Razorpay.",
                      badge: "Fast & Secure",
                    },
                  ].map((method) => {
                    const isSelected = paymentMethod === method.id;
                    return (
                      <label
                        key={method.id}
                        className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "border-[#a67c52] bg-[#fdfaf7] shadow-sm"
                            : "border-[#e0d8ce]/40 hover:border-[#a67c52]/30 bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                isSelected ? "border-[#a67c52]" : "border-gray-300"
                              }`}
                            >
                              {isSelected && <div className="w-2.5 h-2.5 bg-[#a67c52] rounded-full" />}
                            </div>
                            <span
                              className={`font-semibold text-sm ${
                                isSelected ? "text-[#a67c52]" : "text-[#3e3e3e]"
                              }`}
                            >
                              {method.title}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isSelected
                                ? "bg-[#a67c52] text-white"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {method.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed pl-8">{method.desc}</p>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={isSelected}
                          onChange={() => setPaymentMethod(method.id)}
                          className="hidden"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ORDER SUMMARY SIDEBAR */}
            <div className="lg:col-span-4">
              <div className="bg-[#3e3e3e] rounded-[2.5rem] p-8 text-white shadow-xl sticky top-28 border border-white/5">
                <h2 className="text-xl font-serif mb-6 pb-4 border-b border-white/10 flex items-center gap-3">
                  <ShoppingBag size={20} className="text-[#c8a97e]" />
                  <span>Order Summary</span>
                  <span className="text-xs font-mono font-normal ml-auto text-white/50">
                    ({cartItems.length} items)
                  </span>
                </h2>

                <div className="max-h-64 overflow-y-auto space-y-4 mb-6 pr-2 scrollbar-thin scrollbar-thumb-white/20">
                  {cartItems.map((item, idx) => (
                    <div key={item.cartItemId || idx} className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-white/5">
                        <img
                          src={item.imageUrl || item.imageurl || item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold truncate text-white/90">{item.name}</h4>
                        <p className="text-[11px] text-white/50 mt-0.5">
                          {item.qty} × ₹{(item.price || 0).toLocaleString("en-IN")}
                        </p>
                        {item.includes && (
                          <p className="text-[10px] text-white/40 truncate">
                            <span className="text-[#c8a97e]">Incl:</span> {item.includes}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-bold text-[#c8a97e]">
                        ₹{((item.price || 0) * (item.qty || 1)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-8 pt-4 border-t border-white/10 text-xs">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span className="font-semibold text-white">
                      ₹{(cartTotal || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Delivery Fee</span>
                    <span className="text-green-400 font-bold uppercase tracking-wider">FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-3 border-t border-white/10">
                    <span>Total Amount</span>
                    <span className="text-[#c8a97e] text-lg font-serif">
                      ₹{(cartTotal || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#a67c52] hover:bg-white hover:text-[#3e3e3e] py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        Confirm & {paymentMethod === "Online Payment" ? "Pay Now" : "Place Order"}
                      </span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-white/40 mt-4 leading-relaxed">
                  🔒 By placing this order, you agree to Reaina's Haven Terms of Service & Sanctuary Guidelines.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      <ProductsFooter />
    </div>
  );
};

export default Checkout;