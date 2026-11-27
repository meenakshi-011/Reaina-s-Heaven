import React from "react";
import { ShieldCheck, Info, Sparkles, ChevronRight, Bookmark } from "lucide-react";

const LivePriceSidebar = ({
  pricing,
  loading = false,
  submitting = false,
  onSubmit,
  onSaveDraft,
}) => {
  const breakdown = pricing?.breakdown || {
    basePrice: 0,
    optionsTotal: 0,
    selectedProductsTotal: 0,
    packagingPrice: 0,
    decorationPrice: 0,
    subtotal: 0,
    taxAmount: 0,
    deliveryFee: 0,
    estimatedTotal: 0,
  };

  const lineItems = pricing?.lineItems || [];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border border-[#eee4d8] sticky top-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#a67c52]">Pricing Breakdown</span>
          <h3 className="text-xl font-serif font-bold text-gray-900">Estimated Total</h3>
        </div>
        <div className="text-right">
          <span className="text-3xl font-serif font-extrabold text-[#2d3a2d]">
            ₹{breakdown.estimatedTotal}
          </span>
          <span className="text-[10px] block text-gray-400 font-medium">Incl. Taxes & Delivery</span>
        </div>
      </div>

      {/* Itemized Lines */}
      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 text-xs">
        <div className="flex justify-between text-gray-600">
          <span>Base Crafting Fee</span>
          <span className="font-medium text-gray-800">₹{breakdown.basePrice}</span>
        </div>

        {breakdown.optionsTotal > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Custom Options & Flavours</span>
            <span className="font-medium text-gray-800">+₹{breakdown.optionsTotal}</span>
          </div>
        )}

        {breakdown.selectedProductsTotal > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Catalogue Products</span>
            <span className="font-medium text-gray-800">+₹{breakdown.selectedProductsTotal}</span>
          </div>
        )}

        {breakdown.packagingPrice > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Luxury Packaging</span>
            <span className="font-medium text-gray-800">+₹{breakdown.packagingPrice}</span>
          </div>
        )}

        {breakdown.decorationPrice > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Decorations & Finishes</span>
            <span className="font-medium text-gray-800">+₹{breakdown.decorationPrice}</span>
          </div>
        )}

        <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between text-gray-800 font-semibold">
          <span>Subtotal</span>
          <span>₹{breakdown.subtotal}</span>
        </div>

        <div className="flex justify-between text-gray-500 text-[11px]">
          <span>Estimated GST (5-18%)</span>
          <span>₹{breakdown.taxAmount}</span>
        </div>

        <div className="flex justify-between text-gray-500 text-[11px]">
          <span>Delivery Charge</span>
          <span>{breakdown.deliveryFee === 0 ? <span className="text-green-600 font-semibold">FREE</span> : `₹${breakdown.deliveryFee}`}</span>
        </div>
      </div>

      {/* Trust Notice */}
      <div className="bg-[#fcfaf7] border border-[#f0e6dc] rounded-2xl p-3 flex items-start gap-2.5 text-xs text-gray-600">
        <Info size={16} className="text-[#a67c52] shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          This is an authoritative real-time estimate. Upon submission, our master artisan reviews your specifications and provides an official quotation for your approval.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={onSubmit}
          disabled={submitting || loading}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#a67c52] to-[#8c653f] hover:from-[#956d45] hover:to-[#7c5633] text-white font-medium text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Submitting Creation...
            </span>
          ) : (
            <>
              <span>Submit Custom Request</span>
              <ChevronRight size={16} />
            </>
          )}
        </button>

        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            className="w-full py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <Bookmark size={14} />
            <span>Save Draft to Continue Later</span>
          </button>
        )}
      </div>

      {/* Artisan Guarantee */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 pt-1">
        <ShieldCheck size={14} className="text-green-600" />
        <span>100% Satisfaction & Handcrafted Guarantee</span>
      </div>
    </div>
  );
};

export default LivePriceSidebar;

