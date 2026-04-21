import React from "react";
import Navbar from "../components/Navbar";

const recentOrders = [
  { id: "#1024", customer: "Sarah Jenkins", date: "Oct 12, 2026", amount: "$54.98", status: "Processing" },
  { id: "#1023", customer: "Michael Chen", date: "Oct 12, 2026", amount: "$34.99", status: "Shipped" },
  { id: "#1022", customer: "Emma Wallace", date: "Oct 11, 2026", amount: "$120.50", status: "Delivered" },
  { id: "#1021", customer: "David Smith", date: "Oct 10, 2026", amount: "$79.99", status: "Delivered" },
  { id: "#1020", customer: "Jessica Alba", date: "Oct 09, 2026", amount: "$22.50", status: "Cancelled" },
];

const allProducts = [
  { id: 1, name: "Rose Blush Bouquet", category: "Flowers", price: "$34.99", stock: 15, status: "Active" },
  { id: 2, name: "Garden Wildflowers", category: "Flowers", price: "$28.50", stock: 8, status: "Active" },
  { id: 3, name: "Lavender Dreams", category: "Flowers", price: "$26.00", stock: 2, status: "Low Stock" },
  { id: 4, name: "Cozy Comfort Hamper", category: "Hampers", price: "$79.99", stock: 10, status: "Active" },
  { id: 5, name: "The Art of Slow Living", category: "Books", price: "$19.99", stock: 24, status: "Active" },
];

const AdminDashboard = () => {
  const [activeView, setActiveView] = React.useState("Overview");
  return (
    <div className="min-h-screen bg-[#f8f5f2] flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-[1400px] w-full mx-auto px-6 py-8 gap-8">
        
        {/* ── ADMIN SIDEBAR ───────────────────────── */}
        <aside className="hidden lg:flex flex-col w-64 bg-white rounded-3xl shadow-sm border border-[#e0d8ce] p-6 sticky top-24 h-[calc(100vh-8rem)]">
          <div className="mb-10 text-center">
             <div className="w-16 h-16 mx-auto bg-green-900 rounded-full flex items-center justify-center text-white text-2xl font-serif mb-3 shadow-md">
               RH
             </div>
             <h2 className="font-serif text-[#3e3e3e] font-semibold text-lg">Admin Portal</h2>
             <span className="text-xs uppercase tracking-widest text-[#a67c52] font-bold">Store Manager</span>
          </div>

          <nav className="flex flex-col gap-2 flex-1">
            <button 
              onClick={() => setActiveView("Overview")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeView === 'Overview' ? 'bg-[#a67c52] text-white shadow-md' : 'text-gray-600 hover:bg-[#f8f5f2]'}`}
            >
              <span>📊</span> Dashboard
            </button>
            <button 
              onClick={() => setActiveView("Products")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeView === 'Products' ? 'bg-[#a67c52] text-white shadow-md' : 'text-gray-600 hover:bg-[#f8f5f2]'}`}
            >
              <span>🛍️</span> Products
            </button>
            <button 
              onClick={() => setActiveView("Users")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeView === 'Users' ? 'bg-[#a67c52] text-white shadow-md' : 'text-gray-600 hover:bg-[#f8f5f2]'}`}
            >
              <span>👥</span> Users
            </button>
            <button className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-[#f8f5f2] rounded-xl transition-all font-medium flex-1 justify-between max-h-[48px]">
              <div className="flex items-center gap-3"><span>📦</span> Orders</div>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">12</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-[#f8f5f2] rounded-xl transition-all font-medium">
              <span>⚙️</span> Settings
            </button>
          </nav>
        </aside>

        {/* ── MAIN ADMIN AREA ──────────────────── */}
        <main className="flex-1 flex flex-col gap-8 overflow-hidden">
          
          {activeView === "Overview" && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-serif text-[#3e3e3e]">Overview</h1>
                  <p className="text-gray-500">Welcome back! Here is what's happening today.</p>
                </div>
                <button 
                  onClick={() => setActiveView("Products")}
                  className="bg-green-800 text-white px-5 py-2.5 rounded-full font-medium shadow-md hover:bg-green-900 transition-colors flex items-center gap-2"
                >
                  <span>+</span> Add Product
                </button>
              </div>

              {/* STATS TICKERS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Total Revenue", value: "$12,450", trend: "+14%", color: "text-green-600" },
                  { label: "Active Users", value: "1,204", trend: "+5%", color: "text-green-600" },
                  { label: "Pending Orders", value: "12", trend: "-2%", color: "text-red-500" },
                  { label: "Conversion Rate", value: "3.4%", trend: "+1.2%", color: "text-green-600" },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-[#e0d8ce] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#f8f5f2] rounded-full group-hover:bg-[#eee8e0] transition-colors pointer-events-none z-0" />
                    <div className="relative z-10 flex flex-col">
                      <span className="text-xs uppercase tracking-widest text-[#8c8c73] font-bold mb-2">{stat.label}</span>
                      <div className="flex items-end justify-between">
                        <span className="text-3xl font-serif text-[#3e3e3e]">{stat.value}</span>
                        <span className={`text-sm font-bold ${stat.color}`}>{stat.trend}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* RECENT ORDERS TABLE */}
                <div className="bg-white rounded-3xl border border-[#e0d8ce] shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-[#e0d8ce] flex justify-between items-center">
                    <h2 className="text-xl font-serif text-[#3e3e3e] font-semibold">Recent Orders</h2>
                    <button className="text-[#a67c52] text-sm font-medium hover:underline">View All</button>
                  </div>
                  <div className="overflow-x-auto p-6 flex-1">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr>
                          <th className="pb-4 text-xs uppercase tracking-widest text-[#8c8c73] font-bold border-b border-[#e0d8ce]">Order ID</th>
                          <th className="pb-4 text-xs uppercase tracking-widest text-[#8c8c73] font-bold border-b border-[#e0d8ce]">Customer</th>
                          <th className="pb-4 text-xs uppercase tracking-widest text-[#8c8c73] font-bold border-b border-[#e0d8ce]">Date</th>
                          <th className="pb-4 text-xs uppercase tracking-widest text-[#8c8c73] font-bold border-b border-[#e0d8ce]">Amount</th>
                          <th className="pb-4 text-xs uppercase tracking-widest text-[#8c8c73] font-bold border-b border-[#e0d8ce]">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order, i) => (
                          <tr key={i} className="hover:bg-[#f8f5f2] transition-colors">
                            <td className="py-4 font-medium text-[#3e3e3e] border-b border-[#f8f5f2]">{order.id}</td>
                            <td className="py-4 text-gray-600 border-b border-[#f8f5f2]">{order.customer}</td>
                            <td className="py-4 text-gray-500 text-sm border-b border-[#f8f5f2]">{order.date}</td>
                            <td className="py-4 font-medium text-[#3e3e3e] border-b border-[#f8f5f2]">{order.amount}</td>
                            <td className="py-4 border-b border-[#f8f5f2]">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                                order.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* QUICK ACTIONS & NOTIFICATIONS */}
                <div className="flex flex-col gap-6">
                  <div className="bg-[#eee8e0] rounded-3xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#c8a97e]/20 rounded-bl-full pointer-events-none" />
                    <h3 className="text-xl font-serif text-[#3e3e3e] font-semibold mb-4 relative z-10">Low Inventory</h3>
                    <div className="bg-white rounded-2xl p-4 flex gap-4 items-center mb-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1595351298020-038700609878?w=100&fit=crop" className="w-full h-full object-cover" alt="Product" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#3e3e3e] text-sm text-ellipsis overflow-hidden whitespace-nowrap w-36">Lavender Dreams</p>
                        <p className="text-xs text-red-500 font-bold">Only 2 left!</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveView("Products")} className="w-full text-center text-sm font-bold text-[#a67c52] hover:underline uppercase tracking-widest mt-2 block">Restock Items</button>
                  </div>

                  <div className="bg-white border border-[#e0d8ce] rounded-3xl p-6 shadow-sm flex-1">
                    <h3 className="text-xl font-serif text-[#3e3e3e] font-semibold mb-4">Traffic Source</h3>
                    <div className="flex items-end gap-2 h-32 mt-6">
                      <div className="flex-1 bg-green-200 rounded-t-lg h-[40%] group relative"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">Social</span></div>
                      <div className="flex-1 bg-[#a67c52] rounded-t-lg h-[80%] group relative"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">Organic</span></div>
                      <div className="flex-1 bg-amber-200 rounded-t-lg h-[60%] group relative"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">Direct</span></div>
                      <div className="flex-1 bg-[#c8a97e] rounded-t-lg h-[30%] group relative"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">Referral</span></div>
                    </div>
                    <div className="flex justify-between mt-3 text-xs text-gray-500">
                      <span>Social</span>
                      <span>Search</span>
                      <span>Direct</span>
                      <span>Ref</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeView === "Products" && (
            <>
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-serif text-[#3e3e3e]">Inventory Management</h1>
                <div className="flex gap-4">
                   <input type="text" placeholder="Search products..." className="px-4 py-2 rounded-full border border-[#e0d8ce] text-sm outline-none focus:ring-1 focus:ring-[#a67c52]" />
                   <button className="bg-green-800 text-white px-5 py-2 rounded-full text-sm font-medium">+ Add New</button>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-[#e0d8ce] shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#f8f5f2]">
                      <th className="p-6 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Product</th>
                      <th className="p-6 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Category</th>
                      <th className="p-6 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Price</th>
                      <th className="p-6 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Stock</th>
                      <th className="p-6 text-xs uppercase tracking-widest text-[#8c8c73] font-bold">Status</th>
                      <th className="p-6 text-xs uppercase tracking-widest text-[#8c8c73] font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allProducts.map((p) => (
                      <tr key={p.id} className="border-t border-[#f8f5f2] hover:bg-[#fcfaf8]">
                        <td className="p-6 font-medium text-[#3e3e3e]">{p.name}</td>
                        <td className="p-6 text-gray-600">{p.category}</td>
                        <td className="p-6 font-medium text-[#3e3e3e]">{p.price}</td>
                        <td className="p-6 text-gray-600">{p.stock}</td>
                        <td className="p-6">
                           <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${p.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                             {p.status}
                           </span>
                        </td>
                        <td className="p-6 text-right">
                           <button className="text-[#a67c52] hover:text-[#8e6a45] mr-4">Edit</button>
                           <button className="text-red-400 hover:text-red-600">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeView === "Users" && (
            <div className="bg-white rounded-3xl p-20 shadow-sm border border-[#e0d8ce] flex flex-col items-center justify-center text-center">
              <span className="text-6xl mb-4">👥</span>
              <h1 className="text-2xl font-serif text-[#3e3e3e]">User Management</h1>
              <p className="text-gray-500 max-w-sm">View and manage all registered customers, their roles, and account statuses.</p>
              <button onClick={() => setActiveView("Overview")} className="mt-6 text-[#a67c52] font-bold uppercase tracking-widest text-xs hover:underline">Back to Overview</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
