import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { Trash2, ShoppingBag, Package, Activity as ActivityIcon, Settings } from "lucide-react";
import { API_URL, SOCKET_URL } from "../config";

// Dummy data removed. Real data should be fetched from the API.


const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("Activity");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const [profileRes, ordersRes, activityRes] = await Promise.all([
          fetch(`${API_URL}/api/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/orders/myorders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/user/activity`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        if (!profileRes.ok) throw new Error("Failed to fetch profile");
        
        const profileData = await profileRes.json();
        setUser(profileData.user);
        setWishlistItems(profileData.user.wishlist || []);

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
        }

        if (activityRes.ok) {
          const activityData = await activityRes.json();
          setActivities(activityData);
        }
      } catch (error) {
        console.error(error);
        toast.error("Session expired, please login again");
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Real-time Updates for User Dashboard
  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("orderUpdated", (updatedOrder) => {
      // Check if the update belongs to this user
      if (user && (updatedOrder.user === user._id || updatedOrder.user?._id === user._id)) {
        setOrders(prev => prev.map(order => 
          order._id === updatedOrder._id ? updatedOrder : order
        ));
        toast.info(`📦 Order Status Updated: ${updatedOrder.status}`);
      }
    });

    socket.on("newOrder", (newOrder) => {
      // Add to list if it's the current user's new order
      if (user && (newOrder.user === user._id || newOrder.user?._id === user._id)) {
        setOrders(prev => [newOrder, ...prev]);
      }
    });

    socket.on("activityUpdate", () => {
      // Refresh activities when something new happens
      const token = localStorage.getItem("token");
      fetch(`${API_URL}/api/user/activity`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setActivities(data));
    });

    socket.on("wishlistUpdated", (data) => {
      if (user && data.userId === user._id) {
        const token = localStorage.getItem("token");
        fetch(`${API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(profileData => {
          if (profileData.user) {
            setUser(profileData.user);
            setWishlistItems(profileData.user.wishlist || []);
          }
        });
      }
    });

    return () => socket.disconnect();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Successfully logged out.", {
      style: { background: '#f8f5f2', color: '#2d3a2d', border: '1px solid #c8a97e' },
      iconTheme: { primary: '#a67c52', secondary: '#f8f5f2' },
    });
    navigate("/login");
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
        setUser(updated.user);
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) { toast.error("Failed to update profile"); }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
        
        {/* ── SIDEBAR ───────────────────────── */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e0d8ce] sticky top-24">
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full bg-[#eee8e0] overflow-hidden border-4 border-[#c8a97e] mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop" 
                  alt="User Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-serif text-[#3e3e3e]">
                {loading ? "Loading..." : user?.name || "Guest"}
              </h2>
              <p className="text-sm text-[#8c8c73]">Member since 2025</p>
            </div>

            <nav className="flex flex-col gap-2">
              {["Activity", "My Orders", "Wishlist", "Settings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-left px-5 py-3 rounded-xl transition-all duration-300 font-medium ${
                    activeTab === tab
                      ? "bg-[#a67c52] text-white shadow-md transform scale-105"
                      : "text-gray-600 hover:bg-[#f8f5f2] hover:text-[#a67c52]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
            
            <div className="mt-8 pt-8 border-t border-[#e0d8ce]">
              <button onClick={handleLogout} className="text-red-500 font-medium text-sm flex items-center gap-2 hover:text-red-700 transition-colors px-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ──────────────────── */}
        <div className="w-full md:w-3/4 flex flex-col gap-8">
          
          {/* Welcome Banner */}
          <div className="bg-[#eee8e0] rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-sm">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#c8a97e]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <span className="text-sm font-semibold tracking-widest text-[#a67c52] uppercase mb-2 block">
                Welcome Back
              </span>
              <h1 className="text-4xl md:text-5xl font-serif text-[#3e3e3e] mb-4">
                Hello, {loading ? "..." : user?.name?.split(" ")[0] || "Friend"} ✨
              </h1>
              <p className="text-gray-600 max-w-lg leading-relaxed">
                We're glad to see you. You have <span className="font-bold text-[#a67c52]">{wishlistItems.length}</span> items waiting in your wishlist and <span className="font-bold text-[#a67c52]">{orders.length}</span> total orders placed with us!
              </p>
              <button 
                onClick={() => setActiveTab("My Orders")}
                className="mt-6 bg-[#3e3e3e] text-white px-6 py-2 rounded-full font-medium shadow-md hover:bg-green-800 transition-colors"
              >
                Track Order
              </button>
            </div>
          </div>

          {/* Activity Section */}
          {activeTab === "Activity" && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e0d8ce]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-serif text-[#3e3e3e]">Recent Activity</h3>
                <Link to="/products" className="text-sm font-bold text-[#a67c52] hover:underline uppercase tracking-widest">
                  Shop More
                </Link>
              </div>

              <div className="flex flex-col gap-4">
                {activities.length > 0 ? activities.map((activity) => (
                  <div key={activity._id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:bg-[#fdfaf7] transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                        {activity.type === 'order' ? '📦' : activity.type === 'wishlist' ? '❤️' : '👤'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#3e3e3e]">{activity.action}</h4>
                        <p className="text-xs text-gray-500">{new Date(activity.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#a67c52] bg-white px-3 py-1 rounded-full border border-[#f0e8dc]">
                      {activity.type}
                    </span>
                  </div>
                )) : (
                  <div className="text-center py-12 text-gray-500 italic">No recent activity found.</div>
                )}
              </div>
            </div>
          )}

          {/* New Orders Tab */}
          {activeTab === "My Orders" && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e0d8ce]">
              <h3 className="text-2xl font-serif text-[#3e3e3e] mb-8">Purchase History</h3>
              <div className="flex flex-col gap-6">
                {orders.length > 0 ? orders.map((order) => (
                  <div key={order._id} className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border border-[#f0e8dc] hover:shadow-md transition-shadow">
                    <div className="w-20 h-20 bg-[#f8f5f2] rounded-xl flex items-center justify-center shrink-0 border border-[#e0d8ce]">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-[#3e3e3e]">Order #{order._id.slice(-8).toUpperCase()}</h4>
                          <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">{order.orderItems.length} items</p>
                        <p className="font-bold text-[#a67c52]">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const orderIdShort = order._id.slice(-8).toUpperCase();
                          toast.success(`Generating Invoice for #${orderIdShort}...`, { icon: '📄' });
                          // In a production app, this would open a PDF or a printable route
                          // For now, we'll simulate the professional feel
                          setTimeout(() => {
                            window.print();
                          }, 1000);
                        }}
                        className="px-5 py-2 bg-white text-[#3e3e3e] text-xs font-bold rounded-full border border-[#f0e8dc] hover:border-[#a67c52] transition-all uppercase tracking-widest"
                      >
                        Invoice
                      </button>
                      <Link to="/orders" className="px-5 py-2 bg-[#f8f5f2] text-[#a67c52] text-xs font-bold rounded-full border border-[#d4c4b0] hover:bg-[#a67c52] hover:text-white transition-all uppercase tracking-widest">
                        Details
                      </Link>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12 text-gray-500 italic">You haven't placed any orders yet.</div>
                )}
              </div>
            </div>
          )}

          {/* New Wishlist Tab */}
          {activeTab === "Wishlist" && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e0d8ce]">
              <h3 className="text-2xl font-serif text-[#3e3e3e] mb-8">Saved For Later</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {wishlistItems.length > 0 ? wishlistItems.map((item) => (
                  <div key={item._id} className="group flex items-center gap-4 p-4 rounded-2xl border border-[#f0e8dc] hover:bg-[#fdfaf7] transition-all">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <img src={item.imageUrl || item.imageurl || item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-[#3e3e3e] truncate">{item.name || item.item_name}</h4>
                      <p className="text-xs text-[#a67c52] font-bold">₹{(item.price || item.item_price || item.quantityOptions?.[0]?.price || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <button 
                      onClick={() => {
                        // Toggle wishlist to remove
                        const token = localStorage.getItem("token");
                        fetch(`${API_URL}/api/user/wishlist`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ productId: item._id })
                        }).then(() => toast.success("Removed from Wishlist"));
                      }}
                      className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-12 text-gray-500 italic">Your wishlist is currently empty.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === "Settings" && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e0d8ce]">
              <h3 className="text-2xl font-serif text-[#3e3e3e] mb-2">Account Settings</h3>
              <p className="text-gray-500 mb-8">Update your personal information and profile picture.</p>
              <form onSubmit={handleUpdateProfile} className="flex flex-col gap-6 max-w-2xl">
                <div className="flex items-center gap-8 mb-4">
                  <div className="w-24 h-24 bg-[#eee8e0] rounded-full flex items-center justify-center text-[#a67c52] text-3xl font-serif shadow-inner overflow-hidden">
                    {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" /> : user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Profile Avatar URL</label>
                    <input name="avatar" defaultValue={user?.avatar} placeholder="https://..." className="px-4 py-2 rounded-xl border border-[#e0d8ce] outline-none focus:border-[#a67c52] w-full max-w-sm text-sm" />
                    <p className="text-[10px] text-gray-400 mt-1 italic">Enter a direct image link (Unsplash, etc.)</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                    <input name="name" required defaultValue={user?.name} className="px-4 py-2 rounded-xl border border-[#e0d8ce] outline-none focus:border-[#a67c52] text-[#3e3e3e]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                    <input name="email" required defaultValue={user?.email} className="px-4 py-2 rounded-xl border border-[#e0d8ce] outline-none focus:border-[#a67c52] text-[#3e3e3e]" />
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-4 border-t border-[#f0e8dc] pt-6">
                  <button type="button" onClick={() => setActiveTab("Activity")} className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-8 py-2.5 rounded-xl font-bold bg-[#a67c52] text-white shadow-lg shadow-[#a67c52]/20 hover:bg-[#8e6a45] transition-colors">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
