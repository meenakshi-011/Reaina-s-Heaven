import React, { useState } from "react";
import { X, CheckCircle, Clock, AlertTriangle, FileText, Package, Sparkles, CreditCard, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { respondToQuotation } from "../../services/api";

const STATUS_CONFIGS = {
  PENDING: { label: "Under Initial Review", bg: "bg-amber-100 text-amber-800", icon: Clock },
  UNDER_REVIEW: { label: "Artisan Reviewing", bg: "bg-blue-100 text-blue-800", icon: Clock },
  AI_SUGGESTIONS_READY: { label: "AI Suggestions Ready", bg: "bg-purple-100 text-purple-800", icon: Sparkles },
  QUOTATION_SENT: { label: "Quotation Ready for Approval", bg: "bg-emerald-100 text-emerald-800", icon: FileText },
  REVISION_REQUESTED: { label: "Revision in Progress", bg: "bg-orange-100 text-orange-800", icon: RefreshCw },
  APPROVED: { label: "Approved by Customer", bg: "bg-green-100 text-green-800", icon: CheckCircle },
  PAYMENT_PENDING: { label: "Payment Pending", bg: "bg-yellow-100 text-yellow-800", icon: CreditCard },
  PAID: { label: "Paid & Confirmed", bg: "bg-green-100 text-green-800", icon: CheckCircle },
  IN_PRODUCTION: { label: "Being Handcrafted", bg: "bg-indigo-100 text-indigo-800", icon: Package },
  READY_FOR_DELIVERY: { label: "Dispatched / Ready", bg: "bg-teal-100 text-teal-800", icon: Package },
  COMPLETED: { label: "Delivered & Completed", bg: "bg-green-100 text-green-900", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", bg: "bg-gray-100 text-gray-700", icon: X },
  REJECTED: { label: "Declined", bg: "bg-red-100 text-red-800", icon: AlertTriangle },
};

const CustomizationRequestDetailModal = ({
  request,
  isOpen,
  onClose,
  onRefresh,
  onProceedToPay,
}) => {
  const [revisionNote, setRevisionNote] = useState("");
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!isOpen || !request) return null;

  const statusInfo = STATUS_CONFIGS[request.status] || STATUS_CONFIGS.PENDING;
  const quote = request.activeQuote;

  const handleRespond = async (action) => {
    if (action === "REVISE" && !revisionNote.trim()) {
      toast.error("Please explain what changes you would like in the quotation.");
      return;
    }

    setProcessing(true);
    try {
      await respondToQuotation(request._id, {
        action,
        revisionNote,
      });

      toast.success(
        action === "ACCEPT"
          ? "Quotation accepted! You can now proceed to payment."
          : action === "REVISE"
          ? "Revision requested from the artisan."
          : "Quotation rejected."
      );

      setShowRevisionInput(false);
      setRevisionNote("");
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || "Failed to update quotation response");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#ded5cb] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 bg-white border-b border-[#eee4d8] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">
                {request.requestNumber || "CUSTOM REQUEST"}
              </span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusInfo.bg}`}>
                {statusInfo.label}
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-gray-900 capitalize">
              {request.category} Customization
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Official Quotation Card (if available) */}
          {quote ? (
            <div className="bg-white rounded-2xl p-5 border-2 border-[#a67c52]/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-[#a67c52] uppercase tracking-wider">
                    Official Quotation • Version {quote.version}
                  </span>
                  <p className="text-sm font-serif font-bold text-gray-900">
                    Artisan Custom Quote: ₹{quote.total}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                  quote.status === "ACCEPTED" ? "bg-green-100 text-green-800" :
                  quote.status === "REVISED" ? "bg-orange-100 text-orange-800" :
                  "bg-blue-100 text-blue-800"
                }`}>
                  {quote.status}
                </span>
              </div>

              {/* Line Items */}
              {quote.lineItems && quote.lineItems.length > 0 && (
                <div className="space-y-2 border-b border-gray-100 pb-3">
                  {quote.lineItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-gray-700">
                      <div>
                        <span className="font-medium text-gray-900">{item.description}</span>
                        {item.quantity > 1 && (
                          <span className="text-gray-400 text-[10px] ml-1">x{item.quantity}</span>
                        )}
                      </div>
                      <span className="font-semibold text-gray-900">₹{item.total}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Totals Breakdown */}
              <div className="space-y-1 text-gray-600 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{quote.subtotal}</span>
                </div>
                {quote.taxes > 0 && (
                  <div className="flex justify-between">
                    <span>Applicable Taxes</span>
                    <span>₹{quote.taxes}</span>
                  </div>
                )}
                {quote.deliveryCharge > 0 && (
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span>₹{quote.deliveryCharge}</span>
                  </div>
                )}
                {quote.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Special Discount</span>
                    <span>-₹{quote.discount}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-1.5 flex justify-between font-bold text-sm text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-[#a67c52]">₹{quote.total}</span>
                </div>
              </div>

              {quote.notes && (
                <p className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-100 italic">
                  Note from artisan: "{quote.notes}"
                </p>
              )}

              {/* Customer Actions for Quotation */}
              {quote.status === "SENT" && request.status === "QUOTATION_SENT" && (
                <div className="pt-2 space-y-3">
                  {!showRevisionInput ? (
                    <div className="flex gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleRespond("ACCEPT")}
                        disabled={processing}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        Accept Quotation (₹{quote.total})
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowRevisionInput(true)}
                        disabled={processing}
                        className="py-2.5 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-xs transition-colors cursor-pointer"
                      >
                        Request Changes
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <label className="font-semibold text-gray-700 block">
                        What would you like us to adjust?
                      </label>
                      <textarea
                        rows={2}
                        value={revisionNote}
                        onChange={(e) => setRevisionNote(e.target.value)}
                        placeholder="e.g., Can we adjust the flower count or change the packaging to reduce the cost to ₹1200?"
                        className="w-full p-2 bg-white rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#a67c52]"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowRevisionInput(false)}
                          className="px-3 py-1.5 text-gray-500 hover:text-gray-700 text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRespond("REVISE")}
                          disabled={processing}
                          className="px-4 py-1.5 rounded-lg bg-[#a67c52] text-white text-xs font-semibold"
                        >
                          Send Revision Request
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Button if Approved */}
              {request.status === "APPROVED" && onProceedToPay && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onProceedToPay(request, quote)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#a67c52] to-[#8c653f] hover:from-[#956d45] hover:to-[#7c5633] text-white font-medium text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <CreditCard size={16} />
                    <span>Proceed to Pay ₹{quote.total} & Confirm Order</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#fcfaf7] rounded-2xl p-4 border border-[#eee4d8] flex items-center justify-between">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Estimated Total</span>
                <span className="text-base font-serif font-bold text-gray-900">₹{request.estimatedPrice}</span>
              </div>
              <span className="text-[11px] text-[#a67c52] bg-[#a67c52]/10 px-3 py-1 rounded-full font-semibold">
                Quotation Pending Review
              </span>
            </div>
          )}

          {/* Specifications & Options */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
              Order Specifications
            </h3>

            {request.specifications?.messageOnProduct && (
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Message on Creation</span>
                <p className="font-serif italic text-gray-800">"{request.specifications.messageOnProduct}"</p>
              </div>
            )}

            {request.specifications?.specialInstructions && (
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Special Instructions</span>
                <p className="text-gray-700">{request.specifications.specialInstructions}</p>
              </div>
            )}

            {request.deliveryDate && (
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Target Date</span>
                <p className="text-gray-800 font-medium">{new Date(request.deliveryDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          {/* Reference Images Gallery */}
          {request.referenceImages && request.referenceImages.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-3">
              <h3 className="font-serif font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
                Reference & Inspiration Images ({request.referenceImages.length})
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {request.referenceImages.map((img, i) => (
                  <a
                    key={i}
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-square rounded-xl overflow-hidden border border-gray-100 hover:opacity-90 transition-opacity relative group"
                  >
                    <img src={img.url} alt={`Reference ${i + 1}`} className="w-full h-full object-cover" />
                    {img.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white p-1 text-[9px] truncate">
                        {img.caption}
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomizationRequestDetailModal;

