import React from "react";
import Navbar from "../components/Navbar";
import { io } from "socket.io-client";
import { API_URL, SOCKET_URL } from "../config";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";
import AdminCustomizationManagement from "../components/admin/AdminCustomizationManagement";

const AdminDashboard = () => {
  const [activeView, setActiveView] = React.useState("Overview");
  const [products, setProducts] = React.useState([]);
  const [orders, setOrders] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [cafeItems, setCafeItems] = React.useState([]);
  const [adminUser, setAdminUser] = React.useState(null);
  const [stats, setStats] = React.useState({
    revenue: 0,
    users: 0,
    orders: 0,
    pendingOrders: 0,
    inventory: 0,
    lowStockItems: [],
    trends: {
      revenue: "+0%",
      users: "+0%",
      orders: "+0%",
      inventory: "+0%"
    },
    trafficSource: []
  });
  const [loading, setLoading] = React.useState(true);
  const [showAddProductModal, setShowAddProductModal] = React.useState(false);
  const [showAddCafeModal, setShowAddCafeModal] = React.useState(false);
  const [editingCafeItem, setEditingCafeItem] = React.useState(null);
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [selectedOrderForModal, setSelectedOrderForModal] = React.useState(null);
  const [orderStatusFilter, setOrderStatusFilter] = React.useState("ALL");
  
  const [newProduct, setNewProduct] = React.useState({
    name: "", price: "", description: "", includes: "", category: "Pottery", productType: "Bouquet", imageUrl: "", stock: 10
  });

  const [newCafeItem, setNewCafeItem] = React.useState({
    item_name: "", category: "Breakfast", subCategory: "Paratha", item_type: "veg", includes: "", imageurl: "", item_price: 59,
    quantityOptions: [
      { label: "2 Parathas", quantity: 2, price: 59 },
      { label: "4 Parathas", quantity: 4, price: 109 }
    ]
  });

  const fetchAllData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login";
        return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [prodRes, orderRes, userRes, statsRes, profileRes, cafeRes] = await Promise.all([
        fetch(`${API_URL}/api/products`),
        fetch(`${API_URL}/api/orders`, { headers }),
        fetch(`${API_URL}/api/user`, { headers }),
        fetch(`${API_URL}/api/stats`, { headers }),
        fetch(`${API_URL}/api/user/profile`, { headers }),
        fetch(`${API_URL}/api/cafe`)
      ]);

      const prodData = await prodRes.json();
      const orderData = await orderRes.json();
      const userData = await userRes.json();
      const statsData = await statsRes.json();
      const profileData = await profileRes.json();
      const cafeData = await cafeRes.json();

      setProducts(Array.isArray(prodData) ? prodData : []);
      setOrders(Array.isArray(orderData) ? orderData : []);
      setUsers(Array.isArray(userData) ? userData : []);
      if (statsData && !statsData.message) setStats(statsData);
      setAdminUser(profileData.user);
      setCafeItems(Array.isArray(cafeData) ? cafeData : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setLoading(false);
    }
  };

  const [socketStatus, setSocketStatus] = React.useState("connecting");

  React.useEffect(() => {
    fetchAllData();

    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("Admin Dashboard connected to Socket server");
      setSocketStatus("connected");
    });

    socket.on("disconnect", () => {
      setSocketStatus("disconnected");
    });

    socket.on("newOrder", (order) => {
      setOrders(prev => [order, ...prev]);
      // Force refresh stats to be 100% sure
      const token = localStorage.getItem("token");
      fetch(`${API_URL}/api/stats`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => setStats(data));

      toast.success(`🎉 NEW ORDER! ID: #${order._id.slice(-8).toUpperCase()}`, {
        duration: 8000,
        position: 'top-right',
        icon: '📦',
        style: { 
          background: '#1a2e1a', 
          color: '#fff',
          border: '2px solid #2ecc71',
          padding: '16px'
        }
      });
    });

    socket.on("newSignup", (user) => {
      setUsers(prev => [user, ...prev]);
      setStats(prev => ({ ...prev, users: prev.users + 1 }));
      toast.success(`👤 New User Joined: ${user.name}`, {
        duration: 5000,
        icon: '✨',
        style: { background: '#a67c52', color: '#fff' }
      });
    });

    socket.on("orderUpdated", (updatedOrder) => {
      setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
      fetch(`${API_URL}/api/stats`, { 
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } 
      }).then(res => res.json()).then(data => setStats(data));
    });

    socket.on("deliveryVerified", (updatedOrder) => {
      setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
      toast.success(`✅ Delivery Verified for Order #${updatedOrder._id.slice(-8).toUpperCase()}`);
    });

    return () => socket.disconnect();
  }, []);

  const handleStartEditProduct = (p) => {
    setEditingProduct(p);
    setNewProduct({
      name: p.name || "",
      price: typeof p.price === 'object' && p.price !== null ? (p.price.value || 0) : (p.price || 0),
      description: p.description || "",
      includes: p.includes || "",
      category: p.category || "Pottery",
      productType: p.productType || "Bouquet",
      imageUrl: p.imageUrl || "",
      stock: p.stock !== undefined ? p.stock : 10
    });
    setShowAddProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setProducts(prev => prev.filter(p => p._id !== id));
        toast.success("Product deleted successfully!");
        const statsRes = await fetch(`${API_URL}/api/stats`, { 
          headers: token ? { Authorization: `Bearer ${token}` } : {} 
        });
        if (statsRes.ok) setStats(await statsRes.json());
      } else {
        toast.error(data.message || `Failed to delete product (${res.status})`);
      }
    } catch (err) {
      console.error("Delete product error:", err);
      toast.error("Failed to delete product");
    }
  };

  const handleStartEditCafeItem = (item) => {
    setEditingCafeItem(item);
    const existingPrice = item.item_price || item.price || (item.quantityOptions?.[0]?.price) || 0;
    const existingOptions = item.quantityOptions && item.quantityOptions.length > 0
      ? item.quantityOptions.map(opt => ({
          label: opt.label || "Standard",
          quantity: opt.quantity || 1,
          price: Number(opt.price || 0)
        }))
      : [
          { label: "Standard", quantity: 1, price: Number(existingPrice) }
        ];

    setNewCafeItem({
      item_name: item.item_name || "",
      category: item.category || "Meals",
      subCategory: item.subCategory || item.category || "General",
      item_type: item.item_type || "veg",
      includes: item.includes || "",
      imageurl: item.imageurl || "",
      item_price: Number(existingPrice),
      quantityOptions: existingOptions
    });
    setShowAddCafeModal(true);
  };

  const handleDeleteCafeItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/cafe/${id}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setCafeItems(prev => prev.filter(item => item._id !== id));
        toast.success("Cafe item removed successfully!");
      } else {
        toast.error(data.message || `Failed to delete cafe item (${res.status})`);
      }
    } catch (err) { 
      console.error("Delete cafe item error:", err);
      toast.error("Failed to delete cafe item"); 
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({ status })
      });
      const updated = await res.json().catch(() => ({}));
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === id ? updated : o));
        setSelectedOrderForModal(prev => (prev && prev._id === id ? updated : prev));
        toast.success(`Order marked as ${status}`);
        if (status === "DELIVERED" || status === "Delivered") {
          toast.info("A delivery OTP has been sent to the customer.", { duration: 5000 });
        }
      } else {
        toast.error(updated.message || "Failed to update order status");
      }
    } catch (err) { toast.error("Failed to update status"); }
  };

  const [showVerifyModal, setShowVerifyModal] = React.useState(null); // stores orderId
  const [otpInput, setOtpInput] = React.useState("");

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/orders/${showVerifyModal}/verify`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({ otp: otpInput })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Delivery verified successfully!");
        setShowVerifyModal(null);
        setOtpInput("");
        setOrders(prev => prev.map(o => o._id === data.order._id ? data.order : o));
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (err) { toast.error("Verification failed"); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    try {
      const res = await fetch(`${API_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updated = await res.json();
        setAdminUser(updated.user);
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) { toast.error("Failed to update profile"); }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct 
        ? `${API_URL}/api/products/${editingProduct._id}` 
        : `${API_URL}/api/products`;
      const method = editingProduct ? "PUT" : "POST";
      const token = localStorage.getItem("token");

      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(newProduct)
      });
      const saved = await res.json().catch(() => ({}));
      if (res.ok) {
        if (editingProduct) {
          setProducts(prev => prev.map(p => p._id === editingProduct._id ? (saved._id ? saved : { ...p, ...newProduct }) : p));
          toast.success("Product updated successfully!");
        } else {
          setProducts(prev => [saved, ...prev]);
          toast.success("Product added successfully!");
        }
        setShowAddProductModal(false);
        setEditingProduct(null);
        setNewProduct({
          name: "", price: "", description: "", includes: "", category: "Pottery", productType: "Bouquet", imageUrl: "", stock: 10
        });
        const statsRes = await fetch(`${API_URL}/api/stats`, { 
          headers: token ? { Authorization: `Bearer ${token}` } : {} 
        });
        if (statsRes.ok) setStats(await statsRes.json());
      } else {
        toast.error(saved.message || `Failed to save product (${res.status})`);
      }
    } catch (err) { 
      console.error("Save product error:", err);
      toast.error("Failed to save product"); 
    }
  };

  const handleAddCafeItem = async (e) => {
    e.preventDefault();
    try {
      const url = editingCafeItem 
        ? `${API_URL}/api/cafe/${editingCafeItem._id}` 
        : `${API_URL}/api/cafe`;
      const method = editingCafeItem ? "PUT" : "POST";
      const token = localStorage.getItem("token");

      const primaryPrice = newCafeItem.quantityOptions?.[0]?.price || newCafeItem.item_price || 0;
      const payload = {
        ...newCafeItem,
        item_price: Number(primaryPrice),
        price: Number(primaryPrice)
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      const saved = await res.json().catch(() => ({}));
      if (res.ok) {
        if (editingCafeItem) {
          setCafeItems(prev => prev.map(item => item._id === editingCafeItem._id ? (saved._id ? saved : { ...item, ...payload }) : item));
          toast.success("Cafe item updated successfully!");
        } else {
          setCafeItems(prev => [saved, ...prev]);
          toast.success("Cafe item added successfully!");
        }
        setShowAddCafeModal(false);
        setEditingCafeItem(null);
        setNewCafeItem({
          item_name: "", category: "Breakfast", subCategory: "Paratha", item_type: "veg", includes: "", imageurl: "", item_price: 59,
          quantityOptions: [
            { label: "2 Parathas", quantity: 2, price: 59 },
            { label: "4 Parathas", quantity: 4, price: 109 }
          ]
        });
      } else {
        toast.error(saved.message || `Error saving cafe item (${res.status})`);
      }
    } catch (err) { 
      console.error("Save cafe item error:", err);
      toast.error("Failed to save cafe item"); 
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5f2] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2] flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-[1400px] w-full mx-auto px-6 py-8 gap-8">
        
        {/* ── ADMIN SIDEBAR ───────────────────────── */}
        <aside className={`
          fixed lg:sticky top-0 lg:top-24 left-0 z-[60] lg:z-10
          flex flex-col w-64 bg-white rounded-r-3xl lg:rounded-3xl shadow-2xl lg:shadow-sm border-r lg:border border-[#e0d8ce] p-6 h-screen lg:h-[calc(100vh-8rem)]
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="mb-10 text-center relative">
             <button className="lg:hidden absolute -right-2 -top-2 w-8 h-8 flex items-center justify-center text-gray-400" onClick={() => setSidebarOpen(false)}>✕</button>
             <div className="w-16 h-16 mx-auto bg-green-900 rounded-full flex items-center justify-center text-white text-2xl font-serif mb-3 shadow-md overflow-hidden">
               {adminUser?.avatar ? (
                 <img src={adminUser.avatar} className="w-full h-full object-cover" alt="" />
               ) : (
                 adminUser?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "RH"
               )}
             </div>
             <h2 className="font-serif text-[#3e3e3e] font-semibold text-lg">{adminUser?.name || "Admin Portal"}</h2>
             <span className="text-xs uppercase tracking-widest text-[#a67c52] font-bold">{['admin', 'SUPER_ADMIN'].includes(adminUser?.role) ? 'System Administrator' : 'Store Manager'}</span>
          </div>

          <nav className="flex flex-col gap-2 flex-1">
            <button onClick={() => { setActiveView("Overview"); setSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeView === 'Overview' ? 'bg-[#a67c52] text-white shadow-md' : 'text-gray-600 hover:bg-[#f8f5f2]'}`}><span>📊</span> Dashboard</button>
            <button onClick={() => { setActiveView("Products"); setSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeView === 'Products' ? 'bg-[#a67c52] text-white shadow-md' : 'text-gray-600 hover:bg-[#f8f5f2]'}`}><span>🛍️</span> Products</button>
            <button onClick={() => { setActiveView("CafeMenu"); setSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeView === 'CafeMenu' ? 'bg-[#a67c52] text-white shadow-md' : 'text-gray-600 hover:bg-[#f8f5f2]'}`}><span>☕</span> Cafe Menu</button>
            <button onClick={() => { setActiveView("Users"); setSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeView === 'Users' ? 'bg-[#a67c52] text-white shadow-md' : 'text-gray-600 hover:bg-[#f8f5f2]'}`}><span>👥</span> Users</button>
            <button onClick={() => { setActiveView("Orders"); setSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium flex justify-between max-h-[48px] ${activeView === 'Orders' ? 'bg-[#a67c52] text-white shadow-md' : 'text-gray-600 hover:bg-[#f8f5f2]'}`}>
              <div className="flex items-center gap-3"><span>📦</span> Orders</div>
              {stats.pendingOrders > 0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">{stats.pendingOrders}</span>}
            </button>
            <button onClick={() => { setActiveView("Customizations"); setSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeView === 'Customizations' ? 'bg-[#a67c52] text-white shadow-md' : 'text-gray-600 hover:bg-[#f8f5f2]'}`}><span>✨</span> Custom Studio</button>
            <button onClick={() => { setActiveView("Settings"); setSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeView === 'Settings' ? 'bg-[#a67c52] text-white shadow-md' : 'text-gray-600 hover:bg-[#f8f5f2]'}`}><span>⚙️</span> Settings</button>
          </nav>
        </aside>

        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <main className="flex-1 flex flex-col gap-8 overflow-hidden">
          {activeView === "Overview" && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center bg-white border border-[#e0d8ce] rounded-xl shadow-sm text-[#a67c52]">☰</button>
                  <div><h1 className="text-3xl font-serif text-[#3e3e3e]">Overview</h1><p className="text-gray-500">Welcome back! Here's what's happening today.</p></div>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <button onClick={() => setShowAddCafeModal(true)} className="flex-1 sm:flex-none bg-[#a67c52] text-white px-5 py-2.5 rounded-full font-medium shadow-md hover:bg-[#8e6a45] transition-colors flex items-center justify-center gap-2 text-sm"><span>+</span> Cafe</button>
                    <button onClick={() => setShowAddProductModal(true)} className="flex-1 sm:flex-none bg-green-800 text-white px-5 py-2.5 rounded-full font-medium shadow-md hover:bg-green-900 transition-colors flex items-center justify-center gap-2 text-sm"><span>+</span> Product</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString('en-IN')}`, trend: stats.trends.revenue, color: "text-green-600" },
                  { label: "Active Users", value: stats.users.toString(), trend: stats.trends.users, color: "text-green-600" },
                  { label: "Pending Orders", value: stats.pendingOrders.toString(), trend: stats.trends.orders, color: stats.pendingOrders > 5 ? "text-red-500" : "text-green-600" },
                  { label: "Inventory Items", value: stats.inventory.toString(), trend: stats.trends.inventory, color: "text-green-600" },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-[#e0d8ce] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#f8f5f2] rounded-full group-hover:bg-[#eee8e0] transition-colors pointer-events-none z-0" />
                    <div className="relative z-10 flex flex-col">
                      <span className="text-xs uppercase tracking-widest text-[#8c8c73] font-bold mb-2">{stat.label}</span>
                      <div className="flex items-end justify-between"><span className="text-3xl font-serif text-[#3e3e3e]">{stat.value}</span><span className={`text-sm font-bold ${stat.color}`}>{stat.trend}</span></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-3xl border border-[#e0d8ce] shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-[#e0d8ce] flex justify-between items-center"><h2 className="text-xl font-serif text-[#3e3e3e] font-semibold">Recent Orders</h2><button onClick={() => setActiveView("Orders")} className="text-[#a67c52] text-sm font-medium hover:underline">View All</button></div>
                  <div className="overflow-x-auto p-6 flex-1">
                    <table className="w-full text-left border-collapse">
                      <thead><tr><th className="pb-4 text-xs uppercase tracking-widest text-[#8c8c73] font-bold border-b border-[#e0d8ce]">Order ID</th><th className="pb-4 text-xs uppercase tracking-widest text-[#8c8c73] font-bold border-b border-[#e0d8ce]">Customer</th><th className="pb-4 text-xs uppercase tracking-widest text-[#8c8c73] font-bold border-b border-[#e0d8ce]">Date</th><th className="pb-4 text-xs uppercase tracking-widest text-[#8c8c73] font-bold border-b border-[#e0d8ce]">Amount</th><th className="pb-4 text-xs uppercase tracking-widest text-[#8c8c73] font-bold border-b border-[#e0d8ce]">Status</th></tr></thead>
                      <tbody>
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order._id} className="hover:bg-[#f8f5f2] transition-colors">
                            <td className="py-4 font-medium text-[#3e3e3e] border-b border-[#f8f5f2]">#{order._id.slice(-8).toUpperCase()}</td>
                            <td className="py-4 text-gray-600 border-b border-[#f8f5f2]">{order.user?.name || "Guest User"}</td>
                            <td className="py-4 text-gray-500 text-sm border-b border-[#f8f5f2]">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="py-4 font-medium text-[#3e3e3e] border-b border-[#f8f5f2]">₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                            <td className="py-4 border-b border-[#f8f5f2]"><span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${order.status === 'Processing' ? 'bg-amber-100 text-amber-700' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{order.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="bg-[#eee8e0] rounded-3xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#c8a97e]/20 rounded-bl-full pointer-events-none" /><h3 className="text-xl font-serif text-[#3e3e3e] font-semibold mb-4 relative z-10">Low Inventory</h3>
                    {stats.lowStockItems.length > 0 ? stats.lowStockItems.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-4 flex gap-4 items-center mb-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden"><img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} /></div>
                        <div className="flex-1 min-w-0"><p className="font-semibold text-[#3e3e3e] text-sm truncate">{item.name}</p><p className="text-xs text-red-500 font-bold">Only {item.stock} left!</p></div>
                      </div>
                    )) : <p className="text-sm text-gray-500 italic mb-4">Inventory levels are healthy.</p>}
                    <button onClick={() => setActiveView("Products")} className="w-full text-center text-sm font-bold text-[#a67c52] hover:underline uppercase tracking-widest mt-2 block">Restock Items</button>
                  </div>
                  <div className="bg-white border border-[#e0d8ce] rounded-3xl p-6 shadow-sm flex-1"><h3 className="text-xl font-serif text-[#3e3e3e] font-semibold mb-4">Traffic Source</h3><div className="flex items-end gap-2 h-32 mt-6">{stats.trafficSource.map((source, idx) => (<div key={idx} className={`flex-1 rounded-t-lg group relative transition-all duration-500`} style={{ height: `${source.value}%`, backgroundColor: idx % 2 === 0 ? (idx === 0 ? '#bbf7d0' : '#fde68a') : (idx === 1 ? '#a67c52' : '#c8a97e') }}><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{source.name} ({source.value}%)</span></div>))}</div><div className="flex justify-between mt-3 text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{stats.trafficSource.map(s => <span key={s.name}>{s.name}</span>)}</div></div>
                </div>
              </div>
            </>
          )}

          {activeView === "Products" && (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center bg-white border border-[#e0d8ce] rounded-xl shadow-sm text-[#a67c52]">☰</button>
                  <h1 className="text-2xl font-serif text-[#3e3e3e]">Inventory</h1>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative flex-1">
                    <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2 rounded-full border border-[#e0d8ce] text-sm outline-none focus:ring-1 focus:ring-[#a67c52] bg-white shadow-sm" />
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
                  </div>
                  <button onClick={() => {
                    setEditingProduct(null);
                    setNewProduct({ name: "", price: "", description: "", includes: "", category: "Pottery", productType: "Bouquet", imageUrl: "", stock: 10 });
                    setShowAddProductModal(true);
                  }} className="bg-green-800 text-white px-6 py-2 rounded-full text-sm font-bold shadow-md hover:bg-green-900 transition-all cursor-pointer">+ Add New</button>
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-[#e0d8ce] shadow-sm overflow-hidden overflow-x-auto">
                <table className="min-w-[800px] lg:min-w-full text-left">
                  <thead><tr className="bg-[#f8f5f2]"><th className="p-6 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Product</th><th className="p-6 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Category</th><th className="p-6 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Price</th><th className="p-6 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Stock</th><th className="p-6 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Status</th><th className="p-6 text-xs uppercase tracking-widest text-[#8c8c73] font-bold text-right">Actions</th></tr></thead>
                  <tbody>{loading ? <tr><td colSpan="6" className="p-6 text-center text-gray-500 italic">Loading inventory...</td></tr> : products.length === 0 ? <tr><td colSpan="6" className="p-6 text-center text-gray-500">No products found.</td></tr> : products.map((p) => (<tr key={p._id} className="border-t border-[#f8f5f2] hover:bg-[#fcfaf8] transition-colors"><td className="p-6 font-medium text-[#3e3e3e] flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shadow-sm flex-shrink-0"><img src={p.imageUrl} className="w-full h-full object-cover" alt="" /></div><span className="truncate max-w-[150px]">{p.name}</span></td><td className="p-6 text-gray-600 text-sm">{p.category}</td><td className="p-6 font-bold text-[#3e3e3e]">₹{typeof p.price === 'object' && p.price !== null ? p.price.value?.toLocaleString('en-IN') : (p.price || '0')}</td><td className="p-6 text-gray-600 font-mono text-sm">{p.stock || "0"}</td><td className="p-6"><span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full ${p.stock > 0 ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>{p.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></td><td className="p-6 text-right"><div className="flex justify-end gap-3"><button onClick={() => handleStartEditProduct(p)} className="text-[#a67c52] hover:text-[#3e3e3e] font-black text-[10px] uppercase tracking-widest cursor-pointer hover:underline">Edit</button><button onClick={() => handleDeleteProduct(p._id)} className="text-red-400 hover:text-red-600 font-black text-[10px] uppercase tracking-widest cursor-pointer hover:underline">Del</button></div></td></tr>))}</tbody>
                </table>
              </div>
            </>
          )}

          {activeView === "CafeMenu" && (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center bg-white border border-[#e0d8ce] rounded-xl shadow-sm text-[#a67c52]">☰</button>
                  <h1 className="text-2xl font-serif text-[#3e3e3e]">Cafe Menu</h1>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative flex-1">
                    <input type="text" placeholder="Search menu..." className="w-full pl-10 pr-4 py-2 rounded-full border border-[#e0d8ce] text-sm outline-none focus:ring-1 focus:ring-[#a67c52] bg-white shadow-sm" />
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
                  </div>
                  <button onClick={() => {
                    setEditingCafeItem(null);
                    setNewCafeItem({
                      item_name: "", category: "Breakfast", subCategory: "Paratha", item_type: "veg", includes: "", imageurl: "", item_price: 59,
                      quantityOptions: [
                        { label: "2 Parathas", quantity: 2, price: 59 },
                        { label: "4 Parathas", quantity: 4, price: 109 }
                      ]
                    });
                    setShowAddCafeModal(true);
                  }} className="bg-[#a67c52] text-white px-6 py-2 rounded-full text-sm font-bold shadow-md hover:bg-[#8e6a45] transition-all cursor-pointer">+ Add Item</button>
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-[#e0d8ce] shadow-sm overflow-hidden overflow-x-auto">
                <table className="min-w-[800px] lg:min-w-full text-left">
                  <thead><tr className="bg-[#f8f5f2]"><th className="p-6 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Item</th><th className="p-6 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Category</th><th className="p-6 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Type</th><th className="p-6 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Price</th><th className="p-6 text-xs uppercase tracking-widest text-[#8c8c73] font-bold text-right">Actions</th></tr></thead>
                  <tbody>
                    {cafeItems.length === 0 ? <tr><td colSpan="5" className="p-6 text-center text-gray-500 italic">No menu items found.</td></tr> : cafeItems.map((item) => (
                      <tr key={item._id} className="border-t border-[#f8f5f2] hover:bg-[#fcfaf8] transition-colors">
                        <td className="p-6 font-medium text-[#3e3e3e] flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shadow-sm flex-shrink-0">
                            <img src={item.imageurl || "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=100"} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div>
                            <span className="font-bold block text-sm">{item.item_name}</span>
                            {item.includes && <span className="text-[11px] text-gray-400 block line-clamp-1 italic">{item.includes}</span>}
                          </div>
                        </td>
                        <td className="p-6 text-gray-600 text-sm">{item.category}</td>
                        <td className="p-6">
                          <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full ${item.item_type === 'veg' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {item.item_type}
                          </span>
                        </td>
                        <td className="p-6 text-sm">
                          {item.quantityOptions && item.quantityOptions.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {item.quantityOptions.map((opt, i) => (
                                <span key={i} className="inline-block bg-[#f8f5f2] border border-[#e0d8ce] text-[#3e3e3e] font-semibold text-xs px-2 py-0.5 rounded">
                                  {opt.label}: ₹{opt.price}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="font-bold text-[#3e3e3e]">₹{item.item_price || item.price || '0'}</span>
                          )}
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex justify-end gap-3">
                            <button 
                              onClick={() => handleStartEditCafeItem(item)} 
                              className="text-[#a67c52] hover:text-[#3e3e3e] font-black text-[10px] uppercase tracking-widest cursor-pointer hover:underline"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteCafeItem(item._id)} 
                              className="text-red-400 hover:text-red-600 font-black text-[10px] uppercase tracking-widest cursor-pointer hover:underline"
                            >
                              Del
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeView === "Users" && (
            <><div className="flex justify-between items-center"><h1 className="text-2xl font-serif text-[#3e3e3e]">User Directory</h1><div className="text-sm text-gray-500 font-medium">Total registered: {users.length}</div></div><div className="bg-white rounded-3xl border border-[#e0d8ce] shadow-sm overflow-hidden"><table className="w-full text-left"><thead><tr className="bg-[#f8f5f2]"><th className="p-6 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">User</th><th className="p-6 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Email</th><th className="p-6 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Role</th><th className="p-6 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Joined</th><th className="p-6 text-xs uppercase tracking-widest text-[#8c8c73] font-bold text-right">Actions</th></tr></thead><tbody>{users.map((u) => (<tr key={u._id} className="border-t border-[#f8f5f2] hover:bg-[#fcfaf8]"><td className="p-6 font-medium text-[#3e3e3e] flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#eee8e0] flex items-center justify-center text-[#a67c52] font-serif">{u.name?.charAt(0).toUpperCase()}</div>{u.name}</td><td className="p-6 text-gray-600">{u.email}</td><td className="p-6"><span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span></td><td className="p-6 text-gray-500 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td><td className="p-6 text-right"><button className="text-[#a67c52] hover:text-[#8e6a45] font-bold text-xs uppercase tracking-widest">Manage</button></td></tr>))}</tbody></table></div></>
          )}

          {activeView === "Orders" && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-serif text-[#3e3e3e]">Order Fulfillment & Logistics</h1>
                  <p className="text-xs text-gray-400 mt-0.5">Manage customer deliveries, verify addresses, and update preparation lifecycle.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Filter:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-4 py-2 rounded-full border border-[#e0d8ce] text-xs font-bold outline-none bg-white text-[#3e3e3e] shadow-sm cursor-pointer"
                  >
                    <option value="ALL">All Status ({orders.length})</option>
                    <option value="PLACED">Placed</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PREPARING">Preparing</option>
                    <option value="READY">Ready</option>
                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-[#e0d8ce] shadow-sm overflow-hidden overflow-x-auto">
                <table className="min-w-[900px] w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f8f5f2]">
                      <th className="p-5 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Order</th>
                      <th className="p-5 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Customer</th>
                      <th className="p-5 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Area</th>
                      <th className="p-5 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Amount</th>
                      <th className="p-5 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Payment</th>
                      <th className="p-5 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Status</th>
                      <th className="p-5 text-xs uppercase tracking-widest text-[#8c8c73] font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter((o) => {
                        if (orderStatusFilter === "ALL") return true;
                        const s = (o.orderStatus || o.status || "").toUpperCase();
                        if (orderStatusFilter === "PREPARING" && s === "PROCESSING") return true;
                        if (orderStatusFilter === "OUT_FOR_DELIVERY" && s === "SHIPPED") return true;
                        return s === orderStatusFilter;
                      })
                      .map((o) => {
                        const orderNum = o.orderId || o._id.slice(-8).toUpperCase();
                        const customerName = o.customer?.name || o.user?.name || "Customer";
                        const customerPhone = o.customer?.phone || "";
                        const areaName = o.deliveryAddress?.area || o.shippingAddress?.city || "—";
                        const totalAmt = o.totalAmount || o.totalPrice || 0;
                        const isPaid = o.isPaid || o.paymentStatus === "PAID";
                        const currentStatus = o.orderStatus || o.status || "PLACED";

                        return (
                          <tr key={o._id} className="border-t border-[#f8f5f2] hover:bg-[#fcfaf8] transition-colors">
                            {/* Order */}
                            <td className="p-5">
                              <div className="font-mono font-bold text-sm text-[#3e3e3e]">#{orderNum}</div>
                              <div className="text-[10px] text-gray-400 mt-0.5">
                                {new Date(o.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </td>

                            {/* Customer */}
                            <td className="p-5">
                              <div className="font-semibold text-sm text-[#3e3e3e]">{customerName}</div>
                              {customerPhone && (
                                <div className="text-[11px] text-gray-500 font-mono mt-0.5">{customerPhone}</div>
                              )}
                            </td>

                            {/* Area */}
                            <td className="p-5">
                              <div className="text-xs font-semibold text-[#3e3e3e] flex items-center gap-1">
                                <span>📍</span>
                                <span>{areaName}</span>
                              </div>
                              {o.location && (
                                <span className="inline-block mt-1 text-[9px] bg-green-100 text-green-800 font-bold px-1.5 py-0.5 rounded">
                                  GPS Saved
                                </span>
                              )}
                            </td>

                            {/* Amount */}
                            <td className="p-5 font-bold text-sm text-[#3e3e3e]">
                              ₹{totalAmt.toLocaleString("en-IN")}
                            </td>

                            {/* Payment */}
                            <td className="p-5">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                                  isPaid
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}
                              >
                                {isPaid ? "PAID" : o.paymentStatus || "COD"}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="p-5">
                              <select
                                value={currentStatus}
                                onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                                className={`text-[10px] uppercase font-bold px-3 py-1.5 rounded-full outline-none cursor-pointer border shadow-sm ${
                                  currentStatus === "CONFIRMED"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : currentStatus === "PREPARING" || currentStatus === "Processing"
                                    ? "bg-amber-100 text-amber-800 border-amber-300"
                                    : currentStatus === "READY"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : currentStatus === "OUT_FOR_DELIVERY" || currentStatus === "Shipped"
                                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                    : currentStatus === "DELIVERED" || currentStatus === "Delivered"
                                    ? "bg-green-100 text-green-800 border-green-300"
                                    : currentStatus === "CANCELLED" || currentStatus === "Cancelled"
                                    ? "bg-rose-100 text-rose-800 border-rose-300"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}
                              >
                                <option value="PLACED">Placed</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="PREPARING">Preparing</option>
                                <option value="READY">Ready</option>
                                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                              </select>
                            </td>

                            {/* Actions */}
                            <td className="p-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setSelectedOrderForModal(o)}
                                  className="px-3 py-1.5 bg-[#a67c52] hover:bg-[#3e3e3e] text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                                >
                                  Details
                                </button>
                                <button
                                  onClick={() => window.print()}
                                  className="text-gray-400 hover:text-gray-700 font-bold text-xs uppercase tracking-wider transition-colors px-2 py-1"
                                >
                                  Invoice
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeView === "Customizations" && (
            <AdminCustomizationManagement currentUser={adminUser} users={users} />
          )}

          {activeView === "Settings" && (
            <div className="max-w-2xl"><h1 className="text-3xl font-serif text-[#3e3e3e] mb-2">Account Settings</h1><p className="text-gray-500 mb-8">Update your personal information and profile picture.</p><div className="bg-white rounded-3xl border border-[#e0d8ce] shadow-sm p-8"><form onSubmit={handleUpdateProfile} className="flex flex-col gap-6"><div className="flex items-center gap-8 mb-4"><div className="w-24 h-24 bg-[#eee8e0] rounded-full flex items-center justify-center text-[#a67c52] text-3xl font-serif shadow-inner overflow-hidden">{adminUser?.avatar ? <img src={adminUser.avatar} className="w-full h-full object-cover" alt="" /> : adminUser?.name?.charAt(0).toUpperCase() || "A"}</div><div><label className="text-xs font-bold text-gray-500 uppercase block mb-2">Profile Avatar URL</label><input name="avatar" defaultValue={adminUser?.avatar} placeholder="https://..." className="px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#a67c52] w-64 text-sm" /><p className="text-[10px] text-gray-400 mt-1 italic">Enter a direct image link (Unsplash, etc.)</p></div></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-6"><div className="flex flex-col gap-1"><label className="text-xs font-bold text-gray-500 uppercase">Full Name</label><input name="name" required defaultValue={adminUser?.name} className="px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#a67c52]" /></div><div className="flex flex-col gap-1"><label className="text-xs font-bold text-gray-500 uppercase">Email Address</label><input name="email" required defaultValue={adminUser?.email} className="px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#a67c52]" /></div></div><div className="flex justify-end gap-4 mt-4"><button type="button" onClick={() => setActiveView("Overview")} className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button><button type="submit" className="px-8 py-2.5 rounded-xl font-bold bg-[#a67c52] text-white shadow-lg shadow-[#a67c52]/20 hover:bg-[#8e6a45] transition-colors">Save Changes</button></div></form></div></div>
          )}
        </main>
      </div>

      {/* ADD / EDIT CAFE ITEM MODAL */}
      {showAddCafeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowAddCafeModal(false); setEditingCafeItem(null); }} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-8 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-serif text-[#3e3e3e] mb-1">
              {editingCafeItem ? "Edit Cafe Menu Item" : "Add Cafe Menu Item"}
            </h2>
            <p className="text-xs text-gray-500 mb-6">Manage items, Zomato-style portion sizes and what's inside details.</p>

            <form className="flex flex-col gap-5" onSubmit={handleAddCafeItem}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Item Name</label>
                  <input required value={newCafeItem.item_name} onChange={e => setNewCafeItem({...newCafeItem, item_name: e.target.value})} placeholder="e.g. Aloo Paratha Meal with Raita" className="px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#a67c52] text-sm" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                  <input required value={newCafeItem.category} onChange={e => setNewCafeItem({...newCafeItem, category: e.target.value})} placeholder="e.g. Meals / Breakfast / Beverages" className="px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#a67c52] text-sm" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Sub-Category</label>
                  <input required value={newCafeItem.subCategory} onChange={e => setNewCafeItem({...newCafeItem, subCategory: e.target.value})} placeholder="e.g. Paratha / Munchies / Thali" className="px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#a67c52] text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Item Type</label>
                  <select value={newCafeItem.item_type} onChange={e => setNewCafeItem({...newCafeItem, item_type: e.target.value})} className="px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#a67c52] text-sm bg-white">
                    <option value="veg">🟢 Veg</option>
                    <option value="non-veg">🔴 Non-Veg</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Image URL</label>
                  <input required value={newCafeItem.imageurl} onChange={e => setNewCafeItem({...newCafeItem, imageurl: e.target.value})} placeholder="https://images.unsplash.com/..." className="px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#a67c52] text-sm" />
                </div>
              </div>

              {/* ZOMATO-STYLE QUANTITY / PORTION SIZES */}
              <div className="border border-[#e0d8ce] rounded-2xl p-4 bg-[#fdfaf7]">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <label className="text-xs font-bold text-[#3e3e3e] uppercase tracking-wider block">Quantity / Portions (Zomato-style)</label>
                    <span className="text-[11px] text-gray-500">Add options like 2 Parathas, 4 Parathas, 6 Pcs, Half Plate etc.</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      const nextCount = (newCafeItem.quantityOptions?.length || 0) + 1;
                      setNewCafeItem({
                        ...newCafeItem,
                        quantityOptions: [
                          ...(newCafeItem.quantityOptions || []),
                          { label: `${nextCount * 2} Parathas`, quantity: nextCount * 2, price: 99 }
                        ]
                      });
                    }}
                    className="text-xs font-bold bg-[#a67c52] text-white px-3 py-1.5 rounded-lg hover:bg-[#8e6a45] transition-colors"
                  >
                    + Add Variant
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="flex gap-2 flex-wrap mb-4">
                  <span className="text-[10px] text-gray-400 font-bold uppercase self-center">Presets:</span>
                  <button 
                    type="button" 
                    onClick={() => setNewCafeItem({
                      ...newCafeItem,
                      quantityOptions: [
                        { label: "2 Parathas", quantity: 2, price: 59 },
                        { label: "4 Parathas", quantity: 4, price: 109 }
                      ]
                    })}
                    className="text-[11px] bg-white border border-gray-300 hover:border-[#a67c52] px-2.5 py-1 rounded-md text-gray-700"
                  >
                    🥞 2 & 4 Parathas
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setNewCafeItem({
                      ...newCafeItem,
                      quantityOptions: [
                        { label: "6 pcs", quantity: 6, price: 149 },
                        { label: "12 pcs", quantity: 12, price: 269 }
                      ]
                    })}
                    className="text-[11px] bg-white border border-gray-300 hover:border-[#a67c52] px-2.5 py-1 rounded-md text-gray-700"
                  >
                    🥟 6 & 12 Pcs
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setNewCafeItem({
                      ...newCafeItem,
                      quantityOptions: [
                        { label: "Half Plate", quantity: 1, price: 99 },
                        { label: "Full Plate", quantity: 2, price: 179 }
                      ]
                    })}
                    className="text-[11px] bg-white border border-gray-300 hover:border-[#a67c52] px-2.5 py-1 rounded-md text-gray-700"
                  >
                    🍛 Half & Full Plate
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setNewCafeItem({
                      ...newCafeItem,
                      quantityOptions: [
                        { label: "Regular (250ml)", quantity: 1, price: 129 },
                        { label: "Large (350ml)", quantity: 1, price: 189 }
                      ]
                    })}
                    className="text-[11px] bg-white border border-gray-300 hover:border-[#a67c52] px-2.5 py-1 rounded-md text-gray-700"
                  >
                    🥤 Regular & Large
                  </button>
                </div>

                {/* Option Rows */}
                <div className="flex flex-col gap-2">
                  {newCafeItem.quantityOptions?.map((opt, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-white p-2 rounded-xl border border-gray-200">
                      <div className="flex-1">
                        <label className="text-[10px] text-gray-400 font-bold block mb-0.5">Label / Size</label>
                        <input 
                          type="text" 
                          required 
                          value={opt.label} 
                          onChange={(e) => {
                            const updated = [...newCafeItem.quantityOptions];
                            updated[idx].label = e.target.value;
                            setNewCafeItem({ ...newCafeItem, quantityOptions: updated });
                          }}
                          placeholder="e.g. 2 Parathas" 
                          className="w-full text-xs font-semibold px-2 py-1 border border-gray-200 rounded outline-none focus:border-[#a67c52]"
                        />
                      </div>
                      <div className="w-24">
                        <label className="text-[10px] text-gray-400 font-bold block mb-0.5">Price (₹)</label>
                        <input 
                          type="number" 
                          required 
                          value={opt.price} 
                          onChange={(e) => {
                            const updated = [...newCafeItem.quantityOptions];
                            updated[idx].price = Number(e.target.value);
                            setNewCafeItem({ ...newCafeItem, quantityOptions: updated });
                          }}
                          placeholder="59" 
                          className="w-full text-xs font-bold text-green-700 px-2 py-1 border border-gray-200 rounded outline-none focus:border-[#a67c52]"
                        />
                      </div>
                      {newCafeItem.quantityOptions.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => {
                            setNewCafeItem({
                              ...newCafeItem,
                              quantityOptions: newCafeItem.quantityOptions.filter((_, i) => i !== idx)
                            });
                          }}
                          className="text-red-400 hover:text-red-600 text-xs font-bold px-2 py-1 self-end mb-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* INCLUDES / WHAT'S INSIDE */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500 uppercase">What's Inside / Includes</label>
                <textarea 
                  rows={2}
                  value={newCafeItem.includes} 
                  onChange={e => setNewCafeItem({...newCafeItem, includes: e.target.value})} 
                  placeholder="e.g. Served with Boondi Raita (100ml), Mint Chutney, Pickle & Amul Butter Cube" 
                  className="px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#a67c52] text-xs resize-none" 
                />
              </div>

              <div className="flex gap-4 mt-2">
                <button 
                  type="button" 
                  onClick={() => { setShowAddCafeModal(false); setEditingCafeItem(null); }} 
                  className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 rounded-xl font-bold bg-[#a67c52] text-white shadow-lg shadow-[#a67c52]/20 hover:bg-[#8e6a45] transition-colors"
                >
                  {editingCafeItem ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowAddProductModal(false); setEditingProduct(null); }} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-serif text-[#3e3e3e] mb-6">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <form className="flex flex-col gap-4" onSubmit={handleSaveProduct}>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1"><label className="text-xs font-bold text-gray-500 uppercase">Product Name</label><input required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#a67c52]" /></div>
                <div className="flex flex-col gap-1"><label className="text-xs font-bold text-gray-500 uppercase">Price (₹)</label><input required type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} className="px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#a67c52]" /></div>
              </div>
              <div className="flex flex-col gap-1"><label className="text-xs font-bold text-gray-500 uppercase">Description</label><textarea required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#a67c52] h-20" /></div>
              <div className="flex flex-col gap-1"><label className="text-xs font-bold text-gray-500 uppercase">Includes (Comma separated)</label><input value={newProduct.includes} onChange={e => setNewProduct({...newProduct, includes: e.target.value})} placeholder="e.g. Cakes, Bouquet, Photos with Lighting" className="px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#a67c52]" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1"><label className="text-xs font-bold text-gray-500 uppercase">Category</label><input required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#a67c52]" /></div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Product Type</label>
                  <select value={newProduct.productType || "Bouquet"} onChange={e => setNewProduct({...newProduct, productType: e.target.value})} className="px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#a67c52] bg-white">
                    <option value="Bouquet">Bouquet</option>
                    <option value="Hamper">Hamper</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1"><label className="text-xs font-bold text-gray-500 uppercase">Stock</label><input required type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} className="px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#a67c52]" /></div>
              </div>
              <div className="flex flex-col gap-1"><label className="text-xs font-bold text-gray-500 uppercase">Image URL</label><input required value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} className="px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#a67c52]" /></div>
              <div className="flex gap-4 mt-4">
                <button type="button" onClick={() => { setShowAddProductModal(false); setEditingProduct(null); }} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-bold bg-[#a67c52] text-white shadow-lg shadow-[#a67c52]/20 hover:bg-[#8e6a45] transition-colors">
                  {editingProduct ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VERIFY OTP MODAL */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowVerifyModal(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 animate-in fade-in zoom-in-95 duration-200 border border-[#e0d8ce]">
            <h2 className="text-2xl font-serif text-[#3e3e3e] mb-2 text-center">Verify Delivery</h2>
            <p className="text-center text-gray-500 text-sm mb-6 px-4">Enter the 6-digit OTP sent to the customer's email to confirm successful delivery.</p>
            <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
              <input 
                required 
                maxLength="6"
                placeholder="000000"
                value={otpInput}
                onChange={e => setOtpInput(e.target.value)}
                className="w-full text-center text-4xl tracking-[0.5em] font-mono py-6 rounded-2xl bg-[#fdfaf7] border-2 border-[#f0e8dc] focus:border-[#a67c52] outline-none text-[#3e3e3e]" 
              />
              <div className="flex gap-4 mt-2">
                <button type="button" onClick={() => setShowVerifyModal(null)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-bold bg-[#a67c52] text-white shadow-lg hover:bg-[#8e6a45] transition-colors">Verify Now</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPLETE ORDER DETAILS & STATUS CONTROL MODAL (Requirements 9 & 10) */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedOrderForModal(null)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 border border-[#e0d8ce]">
            {/* Header */}
            <div className="flex items-start justify-between pb-6 border-b border-[#e0d8ce]/40 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a67c52] block mb-1">
                  Order Management
                </span>
                <h2 className="text-2xl font-serif text-[#3e3e3e] flex items-center gap-2">
                  <span>Order</span>
                  <span className="font-mono text-[#a67c52]">
                    #{selectedOrderForModal.orderId || selectedOrderForModal._id.slice(-8).toUpperCase()}
                  </span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Placed on {new Date(selectedOrderForModal.createdAt).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    selectedOrderForModal.orderStatus === "CONFIRMED"
                      ? "bg-blue-100 text-blue-800"
                      : selectedOrderForModal.orderStatus === "PREPARING" || selectedOrderForModal.status === "Processing"
                      ? "bg-amber-100 text-amber-800"
                      : selectedOrderForModal.orderStatus === "READY"
                      ? "bg-emerald-100 text-emerald-800"
                      : selectedOrderForModal.orderStatus === "OUT_FOR_DELIVERY" || selectedOrderForModal.status === "Shipped"
                      ? "bg-indigo-100 text-indigo-800"
                      : selectedOrderForModal.orderStatus === "DELIVERED" || selectedOrderForModal.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : selectedOrderForModal.orderStatus === "CANCELLED"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {selectedOrderForModal.orderStatus || selectedOrderForModal.status || "PLACED"}
                </span>
                <button
                  onClick={() => setSelectedOrderForModal(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm ml-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Quick Lifecycle Action Buttons (Requirement 10) */}
            <div className="bg-[#fdfaf7] rounded-2xl p-4 border border-[#e0d8ce]/40 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                Update Order Status:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "CONFIRM", status: "CONFIRMED", color: "bg-blue-600 hover:bg-blue-700 text-white" },
                  { label: "START PREPARING", status: "PREPARING", color: "bg-amber-600 hover:bg-amber-700 text-white" },
                  { label: "MARK READY", status: "READY", color: "bg-emerald-600 hover:bg-emerald-700 text-white" },
                  { label: "OUT FOR DELIVERY", status: "OUT_FOR_DELIVERY", color: "bg-indigo-600 hover:bg-indigo-700 text-white" },
                  { label: "MARK DELIVERED", status: "DELIVERED", color: "bg-green-600 hover:bg-green-700 text-white" },
                  { label: "CANCEL", status: "CANCELLED", color: "bg-rose-600 hover:bg-rose-700 text-white" },
                ].map((act) => {
                  const isCurrent =
                    (selectedOrderForModal.orderStatus || selectedOrderForModal.status) === act.status;
                  return (
                    <button
                      key={act.status}
                      type="button"
                      onClick={() => handleUpdateOrderStatus(selectedOrderForModal._id, act.status)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm ${
                        isCurrent
                          ? "ring-2 ring-offset-1 ring-gray-600 opacity-95 " + act.color
                          : act.color + " opacity-85 hover:opacity-100"
                      }`}
                    >
                      {act.label} {isCurrent && "✓"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2-Column Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Customer Info */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#a67c52] mb-3 flex items-center gap-1.5">
                  <span>👤</span> Customer Information
                </h4>
                <div className="space-y-1.5 text-xs">
                  <p className="font-bold text-sm text-[#3e3e3e]">
                    {selectedOrderForModal.customer?.name || selectedOrderForModal.user?.name || "Guest Customer"}
                  </p>
                  <p className="text-gray-600 font-mono">
                    <b>Phone:</b> {selectedOrderForModal.customer?.phone || "—"}
                  </p>
                  <p className="text-gray-600">
                    <b>Email:</b> {selectedOrderForModal.customer?.email || selectedOrderForModal.user?.email || "—"}
                  </p>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#a67c52] mb-3 flex items-center gap-1.5">
                  <span>📍</span> Delivery Address
                </h4>
                {selectedOrderForModal.deliveryAddress ? (
                  <div className="text-xs text-gray-700 space-y-1 leading-relaxed">
                    <p className="font-semibold text-[#3e3e3e]">
                      {selectedOrderForModal.deliveryAddress.house}
                      {selectedOrderForModal.deliveryAddress.street ? `, ${selectedOrderForModal.deliveryAddress.street}` : ""}
                    </p>
                    <p>
                      {selectedOrderForModal.deliveryAddress.area}, {selectedOrderForModal.deliveryAddress.city}
                    </p>
                    <p>
                      {selectedOrderForModal.deliveryAddress.state} - <b>{selectedOrderForModal.deliveryAddress.pincode}</b>
                    </p>
                    {selectedOrderForModal.deliveryAddress.landmark && (
                      <p className="text-gray-500 pt-1">
                        <b>Landmark:</b> Near {selectedOrderForModal.deliveryAddress.landmark}
                      </p>
                    )}
                    {selectedOrderForModal.deliveryAddress.instructions && (
                      <p className="text-gray-500 italic">
                        <b>Note:</b> "{selectedOrderForModal.deliveryAddress.instructions}"
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {selectedOrderForModal.shippingAddress?.address || "Address unavailable"}
                    <br />
                    {selectedOrderForModal.shippingAddress?.city}, {selectedOrderForModal.shippingAddress?.postalCode}
                  </p>
                )}

                {/* Exact Pinpoint / Location if available */}
                {selectedOrderForModal.location && (
                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-green-700 font-semibold bg-green-50 p-2.5 rounded-xl">
                    <div className="flex items-center gap-1.5">
                      <span>📍</span>
                      <span>
                        Exact Pinpoint:{" "}
                        <strong className="text-green-950 font-bold">
                          {selectedOrderForModal.location.exactLocation ||
                            [selectedOrderForModal.deliveryAddress?.area, selectedOrderForModal.deliveryAddress?.city].filter(Boolean).join(", ") ||
                            "GPS Confirmed"}
                        </strong>
                      </span>
                    </div>
                    {typeof selectedOrderForModal.location.latitude === "number" && (
                      <a
                        href={`https://www.google.com/maps?q=${selectedOrderForModal.location.latitude},${selectedOrderForModal.location.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-green-300 rounded-lg text-xs text-green-800 hover:bg-green-100 font-bold transition-all shadow-sm"
                      >
                        Open in Maps ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden mb-6">
              <div className="bg-[#f8f5f2] px-4 py-2.5 border-b border-gray-200">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  Ordered Items
                </span>
              </div>
              <div className="divide-y divide-gray-100 max-h-52 overflow-y-auto">
                {(selectedOrderForModal.items && selectedOrderForModal.items.length > 0
                  ? selectedOrderForModal.items
                  : selectedOrderForModal.orderItems || []
                ).map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">📦</div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-[#3e3e3e]">{item.name}</p>
                        <p className="text-gray-400 text-[11px]">
                          Qty: <b>{item.quantity || item.qty || 1}</b> × ₹{(item.price || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-[#3e3e3e]">
                      ₹{((item.price || 0) * (item.quantity || item.qty || 1)).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Breakdown & Payment Info */}
            <div className="bg-[#fcfaf8] p-4 rounded-2xl border border-[#e0d8ce]/40 flex flex-col sm:flex-row justify-between gap-4 text-xs mb-6">
              <div>
                <p className="font-bold text-gray-700 mb-1">Payment Details:</p>
                <p className="text-gray-600">Method: <b>{selectedOrderForModal.paymentMethod}</b></p>
                <p className="text-gray-600">
                  Status:{" "}
                  <b className={selectedOrderForModal.isPaid ? "text-green-600" : "text-amber-600"}>
                    {selectedOrderForModal.isPaid ? "PAID" : selectedOrderForModal.paymentStatus || "PENDING"}
                  </b>
                </p>
              </div>

              <div className="text-right space-y-1">
                <p className="text-gray-500">
                  Subtotal: ₹{(selectedOrderForModal.subtotal || selectedOrderForModal.totalPrice || 0).toLocaleString("en-IN")}
                </p>
                <p className="text-gray-500">
                  Delivery Fee: <span className="text-green-600 font-bold">FREE</span>
                </p>
                <p className="font-bold text-sm text-[#3e3e3e] pt-1 border-t border-gray-200">
                  Total Amount: ₹{(selectedOrderForModal.totalAmount || selectedOrderForModal.totalPrice || 0).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Delivery OTP verification if delivered */}
            {selectedOrderForModal.deliveryOTP && (
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-center justify-between text-xs mb-6">
                <div>
                  <span className="font-bold text-amber-900 block">Delivery OTP:</span>
                  <span className="font-mono text-lg font-bold text-amber-900 tracking-widest">
                    {selectedOrderForModal.deliveryOTP}
                  </span>
                </div>
                <div>
                  {selectedOrderForModal.isOTPVerified ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">
                      ✅ OTP Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setShowVerifyModal(selectedOrderForModal._id);
                        setOtpInput("");
                      }}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-sm cursor-pointer"
                    >
                      Verify OTP Now
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Print Invoice
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrderForModal(null)}
                className="px-6 py-2 bg-[#a67c52] hover:bg-[#3e3e3e] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
