import React, { useState, useEffect } from "react";
import {
  adminGetCustomizationRequests,
  adminUpdateCustomizationStatus,
  adminAssignCustomization,
  adminCreateCustomizationQuote,
  getCustomizationConfigs,
} from "../../services/api";
import { API_URL } from "../../config";
import toast from "react-hot-toast";
import {
  Sparkles,
  Filter,
  User,
  Clock,
  Calendar,
  CheckCircle,
  FileText,
  Package,
  Plus,
  Trash2,
  ExternalLink,
  RefreshCw,
  Send,
  Eye,
  X,
} from "lucide-react";

const STATUS_OPTIONS = [
  "ALL",
  "PENDING",
  "UNDER_REVIEW",
  "AI_SUGGESTIONS_READY",
  "QUOTATION_SENT",
  "REVISION_REQUESTED",
  "APPROVED",
  "PAYMENT_PENDING",
  "PAID",
  "IN_PRODUCTION",
  "READY_FOR_DELIVERY",
  "COMPLETED",
  "CANCELLED",
];

const AdminCustomizationManagement = ({ currentUser, users = [] }) => {
  const [requests, setRequests] = useState([]);
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [activeSubTab, setActiveSubTab] = useState("REQUESTS"); // 'REQUESTS' | 'CONFIGS'

  // Selected request modal
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Quotation Generator state
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteLineItems, setQuoteLineItems] = useState([
    { description: "Bespoke Creation Crafting", category: "Crafting", quantity: 1, unitPrice: 0, total: 0 },
  ]);
  const [quoteTaxes, setQuoteTaxes] = useState(0);
  const [quoteDelivery, setQuoteDelivery] = useState(60);
  const [quoteDiscount, setQuoteDiscount] = useState(0);
  const [quoteNotes, setQuoteNotes] = useState("");
  const [submittingQuote, setSubmittingQuote] = useState(false);

  // Status update state
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Assignment state
  const [selectedStaffId, setSelectedStaffId] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== "ALL") params.status = statusFilter;
      if (categoryFilter !== "ALL") params.category = categoryFilter;

      const [reqData, cfgData] = await Promise.all([
        adminGetCustomizationRequests(params),
        getCustomizationConfigs().catch(() => []),
      ]);

      setRequests(Array.isArray(reqData) ? reqData : []);
      setConfigs(Array.isArray(cfgData) ? cfgData : []);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, categoryFilter]);

  // Open Quote Modal & pre-fill line items from request breakdown
  const handleOpenQuoteModal = (req) => {
    setSelectedRequest(req);
    const initialLineItems = [];

    if (req.priceBreakdown) {
      if (req.priceBreakdown.basePrice) {
        initialLineItems.push({
          description: `Base Crafting (${req.category})`,
          category: "Base",
          quantity: 1,
          unitPrice: req.priceBreakdown.basePrice,
          total: req.priceBreakdown.basePrice,
        });
      }
      if (req.priceBreakdown.optionsTotal) {
        initialLineItems.push({
          description: "Custom Options & Ingredients",
          category: "Options",
          quantity: 1,
          unitPrice: req.priceBreakdown.optionsTotal,
          total: req.priceBreakdown.optionsTotal,
        });
      }
      if (req.priceBreakdown.packagingPrice) {
        initialLineItems.push({
          description: `Packaging (${req.packagingOption?.name || "Standard"})`,
          category: "Packaging",
          quantity: 1,
          unitPrice: req.priceBreakdown.packagingPrice,
          total: req.priceBreakdown.packagingPrice,
        });
      }
    }

    if (req.selectedProducts && req.selectedProducts.length > 0) {
      req.selectedProducts.forEach((p) => {
        initialLineItems.push({
          description: `Item: ${p.name}`,
          category: "Product",
          quantity: p.quantity || 1,
          unitPrice: p.price,
          total: (p.price || 0) * (p.quantity || 1),
        });
      });
    }

    if (initialLineItems.length === 0) {
      initialLineItems.push({
        description: `Bespoke ${req.category} Design`,
        category: "Crafting",
        quantity: 1,
        unitPrice: req.estimatedPrice || 500,
        total: req.estimatedPrice || 500,
      });
    }

    setQuoteLineItems(initialLineItems);
    setQuoteTaxes(req.priceBreakdown?.taxAmount || 0);
    setQuoteDelivery(req.priceBreakdown?.deliveryFee || 0);
    setQuoteDiscount(0);
    setQuoteNotes("Crafted with signature premium ingredients and customized finishes.");
    setShowQuoteModal(true);
  };

  // Add line item to quote
  const addLineItem = () => {
    setQuoteLineItems((prev) => [
      ...prev,
      { description: "", category: "Customization", quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const updateLineItem = (index, field, value) => {
    setQuoteLineItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      if (field === "quantity" || field === "unitPrice") {
        const qty = Number(field === "quantity" ? value : updated[index].quantity) || 1;
        const price = Number(field === "unitPrice" ? value : updated[index].unitPrice) || 0;
        updated[index].total = qty * price;
      }
      return updated;
    });
  };

  const removeLineItem = (index) => {
    setQuoteLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const calcSubtotal = quoteLineItems.reduce((acc, item) => acc + (item.total || 0), 0);
  const calcTotal = Math.max(0, Math.round(calcSubtotal + Number(quoteTaxes) + Number(quoteDelivery) - Number(quoteDiscount)));

  // Submit Official Quotation
  const handleSendQuote = async () => {
    if (!selectedRequest) return;
    setSubmittingQuote(true);
    try {
      await adminCreateCustomizationQuote(selectedRequest._id, {
        lineItems: quoteLineItems,
        subtotal: calcSubtotal,
        taxes: Number(quoteTaxes),
        deliveryCharge: Number(quoteDelivery),
        discount: Number(quoteDiscount),
        notes: quoteNotes,
      });

      toast.success("Official quotation generated & sent to customer!");
      setShowQuoteModal(false);
      fetchRequests();
    } catch (err) {
      toast.error(err.message || "Failed to create quote");
    } finally {
      setSubmittingQuote(false);
    }
  };

  // Submit Status Update
  const handleUpdateStatus = async () => {
    if (!selectedRequest || !newStatus) return;
    setUpdatingStatus(true);
    try {
      await adminUpdateCustomizationStatus(selectedRequest._id, {
        status: newStatus,
        note: statusNote,
      });

      toast.success(`Request status updated to ${newStatus}!`);
      setSelectedRequest((prev) => ({ ...prev, status: newStatus }));
      setStatusNote("");
      fetchRequests();
    } catch (err) {
      toast.error(err.message || "Status update failed");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Submit Staff Assignment
  const handleAssignStaff = async () => {
    if (!selectedRequest || !selectedStaffId) return;
    try {
      await adminAssignCustomization(selectedRequest._id, {
        staffUserId: selectedStaffId,
      });
      toast.success("Request assigned to artisan successfully!");
      fetchRequests();
    } catch (err) {
      toast.error(err.message || "Assignment failed");
    }
  };

  // Eligible staff members for assignment (bakers, chefs, florists, hamper designers, operations)
  const staffUsers = users.filter((u) =>
    ["BAKER", "CHEF", "FLORIST", "HAMPER_DESIGNER", "OPERATIONS_MANAGER", "SUPER_ADMIN", "admin"].includes(u.role)
  );

  return (
    <div className="space-y-6">
      {/* Sub-Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-[#e0d8ce] shadow-xs">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#3e3e3e] flex items-center gap-2">
            <Sparkles className="text-[#a67c52]" size={20} />
            <span>Customization Studio Management</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage bespoke orders, assign departmental artisans, configure dynamic options, and generate quotations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab("REQUESTS")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "REQUESTS"
                ? "bg-[#a67c52] text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Custom Requests ({requests.length})
          </button>
          <button
            onClick={() => setActiveSubTab("CONFIGS")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "CONFIGS"
                ? "bg-[#a67c52] text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Category Configs ({configs.length})
          </button>
          <button
            onClick={fetchRequests}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {activeSubTab === "REQUESTS" ? (
        <>
          {/* Filters Bar */}
          <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs text-xs">
            <span className="font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Filter size={14} /> Filter:
            </span>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 font-medium text-gray-700"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 font-medium text-gray-700"
            >
              <option value="ALL">All Categories</option>
              <option value="cakes">Cakes (Baker)</option>
              <option value="food">Food (Chef)</option>
              <option value="hampers">Hampers (Designer)</option>
              <option value="flowers">Flowers (Florist)</option>
              <option value="personalized_gifts">Personalized Gifts</option>
              <option value="other">Other Bespoke</option>
            </select>
          </div>

          {/* Requests Table */}
          <div className="bg-white rounded-3xl border border-[#e0d8ce] shadow-sm overflow-hidden">
            {requests.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <Package size={36} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm font-semibold">No custom requests found matching the current filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-gray-500 uppercase font-bold border-b border-[#e0d8ce]">
                    <tr>
                      <th className="py-3.5 px-4">Order ID & Date</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Artisan Assigned</th>
                      <th className="py-3.5 px-4">Pricing</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {requests.map((req) => (
                      <tr key={req._id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                          <div>{req.requestNumber}</div>
                          <span className="text-[10px] text-gray-400 font-sans">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-gray-800">{req.customer?.name || "Member"}</p>
                          <p className="text-[10px] text-gray-400">{req.customer?.phone || req.customer?.email}</p>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="capitalize px-2.5 py-0.5 rounded-md bg-[#a67c52]/10 text-[#a67c52] font-semibold text-[11px]">
                            {req.category}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {req.assignedTo ? (
                            <span className="font-semibold text-gray-800">{req.assignedTo.name}</span>
                          ) : (
                            <span className="text-gray-400 italic text-[11px]">Unassigned</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-serif font-bold text-gray-900 text-sm">
                            ₹{req.finalQuotedPrice || req.estimatedPrice}
                          </span>
                          <span className="text-[10px] block text-gray-400">
                            {req.activeQuote ? "Official Quote" : "Estimate"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 uppercase">
                            {req.status?.replace("_", " ")}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              setNewStatus(req.status);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                          >
                            Manage
                          </button>
                          <button
                            onClick={() => handleOpenQuoteModal(req)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#a67c52] hover:bg-[#8e6840] text-white font-semibold shadow-2xs"
                          >
                            Quote
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Category Configurations View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {configs.map((cfg) => (
            <div key={cfg.category} className="bg-white rounded-3xl p-6 border border-[#e0d8ce] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-serif font-bold text-base text-gray-900">{cfg.displayName}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                  {cfg.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Base Price</span>
                  <span className="font-bold text-gray-900">₹{cfg.basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Assigned Department</span>
                  <span className="font-bold text-[#a67c52]">{cfg.assignedRole}</span>
                </div>
                <div className="flex justify-between">
                  <span>Notice Period</span>
                  <span className="font-bold text-gray-900">{cfg.minNoticeHours} Hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Applicable GST</span>
                  <span className="font-bold text-gray-900">{(cfg.taxRate || 0.05) * 100}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Custom Fields</span>
                  <span className="font-bold text-gray-900">{cfg.fields?.length || 0} fields</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MANAGE REQUEST DETAIL MODAL */}
      {selectedRequest && !showQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <span className="text-xs font-bold text-[#a67c52] uppercase">{selectedRequest.requestNumber}</span>
                <h3 className="text-lg font-serif font-bold text-gray-900 capitalize">
                  {selectedRequest.category} Request Management
                </h3>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="p-1 text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            {/* Customer Details */}
            <div className="bg-gray-50 p-3.5 rounded-2xl text-xs space-y-1">
              <p className="font-semibold text-gray-800">Customer: {selectedRequest.customer?.name}</p>
              <p className="text-gray-500">Contact: {selectedRequest.customer?.phone} • {selectedRequest.customer?.email}</p>
              {selectedRequest.deliveryAddress?.house && (
                <p className="text-gray-500">
                  Delivery Address: {selectedRequest.deliveryAddress.house}, {selectedRequest.deliveryAddress.city}
                </p>
              )}
            </div>

            {/* Specifications */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-gray-700 uppercase tracking-wider block">Custom Specifications</span>
              {selectedRequest.specifications?.messageOnProduct && (
                <p className="italic text-gray-700">Message: "{selectedRequest.specifications.messageOnProduct}"</p>
              )}
              {selectedRequest.specifications?.specialInstructions && (
                <p className="text-gray-600">Instructions: {selectedRequest.specifications.specialInstructions}</p>
              )}
            </div>

            {/* Reference Images */}
            {selectedRequest.referenceImages && selectedRequest.referenceImages.length > 0 && (
              <div className="space-y-2">
                <span className="font-bold text-xs text-gray-700 uppercase tracking-wider block">
                  Reference Images ({selectedRequest.referenceImages.length})
                </span>
                <div className="flex gap-2 overflow-x-auto py-1">
                  {selectedRequest.referenceImages.map((img, i) => (
                    <a key={i} href={img.url} target="_blank" rel="noopener noreferrer" className="block w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                      <img src={img.url} alt={`Ref ${i}`} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Assign Artisan */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <span className="font-bold text-xs text-gray-700 uppercase tracking-wider block">Assign Artisan / Staff</span>
              <div className="flex gap-2">
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="flex-1 p-2 border border-gray-200 rounded-xl text-xs"
                >
                  <option value="">Select Team Member...</option>
                  {staffUsers.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAssignStaff}
                  disabled={!selectedStaffId}
                  className="px-4 py-2 bg-[#a67c52] text-white rounded-xl text-xs font-semibold disabled:opacity-50"
                >
                  Assign
                </button>
              </div>
            </div>

            {/* Status Update */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <span className="font-bold text-xs text-gray-700 uppercase tracking-wider block">Update Production Status</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="p-2 border border-gray-200 rounded-xl text-xs"
                >
                  {STATUS_OPTIONS.filter((s) => s !== "ALL").map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Internal note (optional)..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="p-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>
              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={updatingStatus}
                className="w-full py-2 bg-[#2d3a2d] text-white rounded-xl text-xs font-semibold"
              >
                {updatingStatus ? "Updating..." : "Save Status Change"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL QUOTATION BUILDER MODAL */}
      {showQuoteModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <span className="text-xs font-bold text-[#a67c52] uppercase">Official Quotation Builder</span>
                <h3 className="text-lg font-serif font-bold text-gray-900">
                  Quote for #{selectedRequest.requestNumber}
                </h3>
              </div>
              <button onClick={() => setShowQuoteModal(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            {/* Line Items Builder */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Quotation Line Items</span>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="text-xs font-semibold text-[#a67c52] hover:underline flex items-center gap-1"
                >
                  <Plus size={14} /> Add Line Item
                </button>
              </div>

              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {quoteLineItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center text-xs bg-gray-50 p-2 rounded-xl">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateLineItem(idx, "description", e.target.value)}
                      className="flex-1 p-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateLineItem(idx, "quantity", e.target.value)}
                      className="w-14 p-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Unit ₹"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(idx, "unitPrice", e.target.value)}
                      className="w-20 p-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                    <span className="w-16 font-bold text-gray-800 text-right">₹{item.total}</span>
                    <button
                      type="button"
                      onClick={() => removeLineItem(idx)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Taxes & Delivery Charges */}
            <div className="grid grid-cols-3 gap-3 text-xs bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#eee4d8]">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block">Taxes (₹)</label>
                <input
                  type="number"
                  value={quoteTaxes}
                  onChange={(e) => setQuoteTaxes(Number(e.target.value))}
                  className="w-full p-1.5 bg-white border border-gray-200 rounded-lg text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block">Delivery Fee (₹)</label>
                <input
                  type="number"
                  value={quoteDelivery}
                  onChange={(e) => setQuoteDelivery(Number(e.target.value))}
                  className="w-full p-1.5 bg-white border border-gray-200 rounded-lg text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block">Discount (₹)</label>
                <input
                  type="number"
                  value={quoteDiscount}
                  onChange={(e) => setQuoteDiscount(Number(e.target.value))}
                  className="w-full p-1.5 bg-white border border-gray-200 rounded-lg text-xs mt-1"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-gray-700 block">Artisan Note to Customer</label>
              <textarea
                rows={2}
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
                placeholder="Include special preparation instructions or timeline details..."
                className="w-full p-2 border border-gray-200 rounded-xl text-xs"
              />
            </div>

            {/* Total Summary & Send */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Final Quoted Total</span>
                <span className="text-2xl font-serif font-bold text-[#a67c52]">₹{calcTotal}</span>
              </div>
              <button
                type="button"
                onClick={handleSendQuote}
                disabled={submittingQuote}
                className="px-6 py-2.5 rounded-xl bg-[#a67c52] hover:bg-[#8e6840] text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send size={14} />
                <span>{submittingQuote ? "Sending..." : "Dispatch Official Quotation"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomizationManagement;

