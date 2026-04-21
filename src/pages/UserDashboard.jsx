import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const dummyActivities = [
  { id: 1, action: "Purchased", item: "Rose Blush Bouquet", date: "Oct 12, 2026", price: "$34.99", status: "Delivered" },
  { id: 2, action: "Added to Wishlist", item: "Haven Latte Kit", date: "Oct 10, 2026", price: "-", status: "-" },
  { id: 3, action: "Reviewed", item: "Cozy Comfort Hamper", date: "Sep 28, 2026", price: "-", status: "5 Stars" },
  { id: 4, action: "Purchased", item: "The Art of Slow Living", date: "Sep 15, 2026", price: "$19.99", status: "Delivered" },
];

const dummyOrders = [
  { id: "#ORD-1024", item: "Rose Blush Bouquet", date: "Oct 12, 2026", total: "$34.99", status: "Delivered", img: "https://images.unsplash.com/photo-1595351298020-038700609878?w=100&fit=crop" },
  { id: "#ORD-1012", item: "The Art of Slow Living", date: "Sep 15, 2026", total: "$19.99", status: "Delivered", img: "https://images.unsplash.com/photo-1544716278-e513176f20b5?w=100&fit=crop" },
  { id: "#ORD-0985", item: "Cozy Tea Set", date: "Aug 22, 2026", total: "$85.00", status: "Delivered", img: "https://images.unsplash.com/photo-1510265236892-329bfd7de7a1?w=100&fit=crop" },
];

const dummyWishlist = [
  { id: 1, name: "Haven Latte Kit", price: "$45.00", status: "In Stock", img: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=100&fit=crop" },
  { id: 2, name: "Sunset Floral Pot", price: "$28.00", status: "Limited Stock", img: "https://images.unsplash.com/photo-1510265236892-329bfd7de7a1?w=100&fit=crop" },
];

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("Activity");

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
              <h2 className="text-xl font-serif text-[#3e3e3e]">Sarah Jenkins</h2>
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
              <button className="text-red-500 font-medium text-sm flex items-center gap-2 hover:text-red-700 transition-colors px-5">
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
                Hello, Sarah ✨
              </h1>
              <p className="text-gray-600 max-w-lg leading-relaxed">
                We're glad to see you. You have <span className="font-bold text-[#a67c52]">2</span> items waiting in your wishlist and your recent order is on its way!
              </p>
              <button className="mt-6 bg-[#3e3e3e] text-white px-6 py-2 rounded-full font-medium shadow-md hover:bg-green-800 transition-colors">
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
                {dummyActivities.map((activity) => (
                  <div key={activity.id} className="flex flex-col md:flex-row items-center justify-between p-5 rounded-2xl border border-transparent hover:border-[#e0d8ce] hover:bg-[#f8f5f2] transition-colors gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-inner ${
                        activity.action === 'Purchased' ? 'bg-green-100 text-green-700' :
                        activity.action === 'Added to Wishlist' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {activity.action === 'Purchased' ? '🛍️' : activity.action === 'Added to Wishlist' ? '❤️' : '⭐'}
                      </div>
                      <div>
                        <p className="font-semibold text-[#3e3e3e]">{activity.action}: <span className="font-serif">{activity.item}</span></p>
                        <p className="text-xs text-[#8c8c73]">{activity.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between w-full md:w-auto gap-8 text-right md:text-left">
                      <div>
                        <p className="text-xs text-[#8c8c73] uppercase tracking-widest">Price</p>
                        <p className="font-medium text-[#3e3e3e]">{activity.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#8c8c73] uppercase tracking-widest">Status / Info</p>
                        <p className={`font-medium ${activity.status === 'Delivered' ? 'text-green-700' : 'text-[#a67c52]'}`}>
                          {activity.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Orders Tab */}
          {activeTab === "My Orders" && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e0d8ce]">
              <h3 className="text-2xl font-serif text-[#3e3e3e] mb-8">Purchase History</h3>
              <div className="flex flex-col gap-6">
                {dummyOrders.map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border border-[#f0e8dc] hover:shadow-md transition-shadow">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <img src={order.img} alt={order.item} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-serif text-lg text-[#3e3e3e]">{order.item}</h4>
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase tracking-tighter">{order.status}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">Order ID: {order.id} • Placed on {order.date}</p>
                      <div className="flex items-center justify-between">
                         <span className="font-bold text-[#a67c52]">{order.total}</span>
                         <button className="text-xs font-bold uppercase tracking-widest text-[#3e3e3e] border-b-2 border-transparent hover:border-[#a67c52] transition-all pb-1">Order Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Wishlist Tab */}
          {activeTab === "Wishlist" && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e0d8ce]">
              <h3 className="text-2xl font-serif text-[#3e3e3e] mb-8">Saved For Later</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {dummyWishlist.map((item) => (
                  <div key={item.id} className="group flex flex-col gap-4 p-4 rounded-2xl border border-[#f0e8dc] hover:scale-[1.02] transition-all">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm text-rose-500">❤️</button>
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-[#3e3e3e] mb-1">{item.name}</h4>
                      <div className="flex justify-between items-center">
                         <span className="font-bold text-[#a67c52]">{item.price}</span>
                         <span className="text-[10px] uppercase font-bold tracking-widest text-green-600">{item.status}</span>
                      </div>
                      <button className="w-full mt-4 bg-[#3e3e3e] text-white py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors">Add to Cart</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab === "Settings" && (
            <div className="bg-white rounded-3xl p-16 shadow-sm border border-[#e0d8ce] flex flex-col items-center justify-center text-center">
              <span className="text-6xl mb-4 opacity-50">⚙️</span>
              <h3 className="text-2xl font-serif text-[#3e3e3e] mb-2">Account Settings</h3>
              <p className="text-gray-500">Manage your profile, addresses, and payment methods here.</p>
              <button 
                className="mt-6 px-6 py-2 bg-[#f8f5f2] border border-[#d4c4b0] text-[#a67c52] text-sm font-medium rounded-full hover:bg-white transition-colors"
                onClick={() => setActiveTab("Activity")}
              >
                Go back to Activity
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
